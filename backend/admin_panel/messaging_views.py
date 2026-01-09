from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Max
from core.models import User
import json
import mysql.connector
from datetime import datetime
import hashlib


def get_mysql_connection():
    """Get a connection to the frontend MySQL database"""
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='talent_horizon'
    )


def generate_conversation_id(user1_id, user2_id):
    """Generate a consistent conversation ID for two users"""
    sorted_ids = sorted([user1_id, user2_id])
    return f"conv_{sorted_ids[0]}_{sorted_ids[1]}"


def jwt_or_session_required(view_func):
    """Decorator that accepts both JWT token and Django session authentication"""
    from rest_framework_simplejwt.authentication import JWTAuthentication
    from rest_framework.exceptions import AuthenticationFailed
    
    def wrapper(request, *args, **kwargs):
        # Try JWT authentication first
        if 'Authorization' in request.headers:
            try:
                jwt_auth = JWTAuthentication()
                validated_token = jwt_auth.get_validated_token(request.headers['Authorization'].split(' ')[1])
                request.user = jwt_auth.get_user(validated_token)
                return view_func(request, *args, **kwargs)
            except (AuthenticationFailed, IndexError, KeyError):
                pass
        
        # Fall back to session authentication
        if request.user.is_authenticated:
            return view_func(request, *args, **kwargs)
        
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    return wrapper


@jwt_or_session_required
@require_http_methods(["POST"])
def start_conversation(request):
    """Start a conversation with a user - writes directly to frontend MySQL"""
    try:
        data = json.loads(request.body)
        
        recipient_id = data.get('recipient_id') or data.get('applicant_id')
        content = data.get('content') or data.get('initial_message')
        
        if not recipient_id or not content:
            return JsonResponse({
                'success': False,
                'error': 'Missing required fields: recipient_id and content'
            }, status=400)
        
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        try:
            # Get the admin's frontend MySQL user ID by email
            cursor.execute("SELECT id, name FROM users WHERE email = %s", (request.user.email,))
            admin_user = cursor.fetchone()
            
            if not admin_user:
                # Create admin user in frontend DB
                cursor.execute("""
                    INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt)
                    VALUES (%s, %s, %s, 'local', 'admin', NOW(), NOW())
                """, (f'admin-{request.user.id}', request.user.get_full_name() or 'Admin User', request.user.email))
                conn.commit()
                admin_id = cursor.lastrowid
                admin_name = request.user.get_full_name() or 'Admin User'
            else:
                admin_id = admin_user['id']
                admin_name = admin_user['name']
            
            # Verify recipient exists
            cursor.execute("SELECT id, name FROM users WHERE id = %s", (recipient_id,))
            recipient = cursor.fetchone()
            
            if not recipient:
                return JsonResponse({
                    'success': False,
                    'error': 'Recipient user not found'
                }, status=404)
            
            # Generate conversation ID
            conversation_id = generate_conversation_id(admin_id, recipient_id)
            
            # Insert message
            cursor.execute("""
                INSERT INTO messages (conversationId, senderId, senderName, recipientId, content, messageType, status, createdAt)
                VALUES (%s, %s, %s, %s, %s, 'text', 'sent', NOW())
            """, (conversation_id, admin_id, admin_name, recipient_id, content))
            conn.commit()
            message_id = cursor.lastrowid
            
            return JsonResponse({
                'success': True,
                'message_id': message_id,
                'conversation_id': conversation_id
            })
            
        finally:
            cursor.close()
            conn.close()
        
    except Exception as e:
        print(f"Error in start_conversation: {e}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@jwt_or_session_required
@require_http_methods(["GET"])
def get_conversations(request):
    """Get all conversations for the current admin user"""
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get the admin's frontend MySQL user ID by email
        cursor.execute("SELECT id FROM users WHERE email = %s", (request.user.email,))
        admin_user = cursor.fetchone()
        
        if not admin_user:
            cursor.close()
            conn.close()
            return JsonResponse({'success': True, 'conversations': []})
        
        admin_id = admin_user['id']
        
        # Get all unique conversations where admin is sender or recipient
        cursor.execute("""
            SELECT DISTINCT conversationId FROM messages 
            WHERE senderId = %s OR recipientId = %s
        """, (admin_id, admin_id))
        
        conversation_ids = [row['conversationId'] for row in cursor.fetchall()]
        
        conversations = []
        for conv_id in conversation_ids:
            # Get the other user in this conversation
            cursor.execute("""
                SELECT DISTINCT 
                    CASE WHEN senderId = %s THEN recipientId ELSE senderId END as other_user_id
                FROM messages WHERE conversationId = %s
            """, (admin_id, conv_id))
            other_user_row = cursor.fetchone()
            
            if not other_user_row:
                continue
            
            other_user_id = other_user_row['other_user_id']
            
            # Get other user info
            cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (other_user_id,))
            other_user = cursor.fetchone()
            
            if not other_user:
                continue
            
            # Get latest message
            cursor.execute("""
                SELECT * FROM messages 
                WHERE conversationId = %s 
                ORDER BY createdAt DESC LIMIT 1
            """, (conv_id,))
            latest_msg = cursor.fetchone()
            
            # Get unread count
            cursor.execute("""
                SELECT COUNT(*) as count FROM messages 
                WHERE conversationId = %s AND recipientId = %s AND status != 'read'
            """, (conv_id, admin_id))
            unread = cursor.fetchone()
            
            conversations.append({
                'id': conv_id,
                'recipient_id': other_user_id,
                'display_name': other_user['name'],
                'email': other_user['email'],
                'last_message': latest_msg['content'] if latest_msg else None,
                'last_message_type': latest_msg['messageType'] if latest_msg else None,
                'last_message_time': latest_msg['createdAt'].isoformat() if latest_msg and latest_msg['createdAt'] else None,
                'unread_count': unread['count'] if unread else 0,
                'is_online': False
            })
        
        # Sort by last message time
        conversations.sort(key=lambda x: x['last_message_time'] or '', reverse=True)
        
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'success': True,
            'conversations': conversations
        })
        
    except Exception as e:
        print(f"Error in get_conversations: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@jwt_or_session_required
@require_http_methods(["GET"])
def get_conversation(request, conversation_id):
    """Get all messages in a conversation"""
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get admin user ID
        cursor.execute("SELECT id FROM users WHERE email = %s", (request.user.email,))
        admin_user = cursor.fetchone()
        admin_id = admin_user['id'] if admin_user else 0
        
        # Get all messages in this conversation
        cursor.execute("""
            SELECT m.*, u.name as sender_name_from_user
            FROM messages m
            LEFT JOIN users u ON m.senderId = u.id
            WHERE m.conversationId = %s
            ORDER BY m.createdAt ASC
        """, (conversation_id,))
        
        messages = cursor.fetchall()
        
        # Mark messages as read
        cursor.execute("""
            UPDATE messages SET status = 'read' 
            WHERE conversationId = %s AND recipientId = %s AND status != 'read'
        """, (conversation_id, admin_id))
        conn.commit()
        
        # Format messages
        formatted_messages = []
        for msg in messages:
            formatted_messages.append({
                'id': msg['id'],
                'conversation_id': msg['conversationId'],
                'sender_id': msg['senderId'],
                'sender_name': msg['senderName'] or msg['sender_name_from_user'] or 'User',
                'recipient_id': msg['recipientId'],
                'content': msg['content'],
                'message_type': msg['messageType'],
                'file_url': msg.get('fileUrl'),
                'file_name': msg.get('fileName'),
                'status': msg['status'],
                'created_at': msg['createdAt'].isoformat() if msg['createdAt'] else None,
                'is_from_admin': msg['senderId'] == admin_id
            })
        
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'success': True,
            'messages': formatted_messages
        })
        
    except Exception as e:
        print(f"Error in get_conversation: {e}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@csrf_exempt
@jwt_or_session_required
@require_http_methods(["POST"])
def send_message(request):
    """Send a message in a conversation"""
    try:
        data = json.loads(request.body)
        
        conversation_id = data.get('conversation_id')
        recipient_id = data.get('recipient_id')
        content = data.get('content')
        message_type = data.get('message_type', 'text')
        file_url = data.get('file_url')
        file_name = data.get('file_name')
        
        if not conversation_id or not recipient_id or not content:
            return JsonResponse({
                'success': False,
                'error': 'Missing required fields'
            }, status=400)
        
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        try:
            # Get admin user ID
            cursor.execute("SELECT id, name FROM users WHERE email = %s", (request.user.email,))
            admin_user = cursor.fetchone()
            
            if not admin_user:
                return JsonResponse({
                    'success': False,
                    'error': 'Admin user not found'
                }, status=404)
            
            admin_id = admin_user['id']
            admin_name = admin_user['name']
            
            # Insert message
            cursor.execute("""
                INSERT INTO messages (conversationId, senderId, senderName, recipientId, content, messageType, fileUrl, fileName, status, createdAt)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'sent', NOW())
            """, (conversation_id, admin_id, admin_name, recipient_id, content, message_type, file_url, file_name))
            conn.commit()
            message_id = cursor.lastrowid
            
            # Get the inserted message
            cursor.execute("SELECT * FROM messages WHERE id = %s", (message_id,))
            msg = cursor.fetchone()
            
            return JsonResponse({
                'success': True,
                'message': {
                    'id': msg['id'],
                    'conversation_id': msg['conversationId'],
                    'sender_id': msg['senderId'],
                    'sender_name': msg['senderName'],
                    'recipient_id': msg['recipientId'],
                    'content': msg['content'],
                    'message_type': msg['messageType'],
                    'file_url': msg.get('fileUrl'),
                    'file_name': msg.get('fileName'),
                    'status': msg['status'],
                    'created_at': msg['createdAt'].isoformat() if msg['createdAt'] else None,
                    'is_from_admin': True
                }
            })
            
        finally:
            cursor.close()
            conn.close()
        
    except Exception as e:
        print(f"Error in send_message: {e}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@jwt_or_session_required
@require_http_methods(["POST"])
def mark_read(request):
    """Mark all messages in a conversation as read"""
    try:
        data = json.loads(request.body)
        conversation_id = data.get('conversation_id')
        
        if not conversation_id:
            return JsonResponse({
                'success': False,
                'error': 'Missing conversation_id'
            }, status=400)
        
        conn = get_mysql_connection()
        cursor = conn.cursor()
        
        # Get admin user ID
        cursor.execute("SELECT id FROM users WHERE email = %s", (request.user.email,))
        admin_user = cursor.fetchone()
        admin_id = admin_user[0] if admin_user else 0
        
        # Mark messages as read
        cursor.execute("""
            UPDATE messages SET status = 'read' 
            WHERE conversationId = %s AND recipientId = %s AND status != 'read'
        """, (conversation_id, admin_id))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return JsonResponse({'success': True})
        
    except Exception as e:
        print(f"Error in mark_read: {e}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@jwt_or_session_required
@require_http_methods(["GET"])
def get_users(request):
    """Get all users that admin can message"""
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get all non-admin users
        cursor.execute("""
            SELECT id, name, email, role, createdAt 
            FROM users 
            WHERE role != 'admin' OR role IS NULL
            ORDER BY name ASC
        """)
        
        users = cursor.fetchall()
        
        formatted_users = []
        for user in users:
            formatted_users.append({
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'created_at': user['createdAt'].isoformat() if user['createdAt'] else None
            })
        
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'success': True,
            'users': formatted_users
        })
        
    except Exception as e:
        print(f"Error in get_users: {e}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@jwt_or_session_required
@require_http_methods(["GET"])
def get_users_for_firebase(request):
    """Get all users for Firebase messaging - returns users from frontend MySQL database"""
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get all users except the current admin
        cursor.execute("""
            SELECT id, name, email, role 
            FROM users 
            WHERE email != %s
            ORDER BY name ASC
        """, (request.user.email,))
        
        users = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Format users for Firebase
        formatted_users = []
        for user in users:
            formatted_users.append({
                'id': user['id'],
                'name': user['name'] or 'Unknown User',
                'email': user['email'] or '',
                'role': user['role'] or 'user'
            })
        
        return JsonResponse(formatted_users, safe=False)
        
    except Exception as e:
        print(f"Error in get_users_for_firebase: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)
