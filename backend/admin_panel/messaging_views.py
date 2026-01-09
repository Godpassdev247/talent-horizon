from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Max
from core.models import User
from jobs.models import Application
import json
import mysql.connector
from datetime import datetime


def get_mysql_connection():
    """Get a connection to the frontend MySQL database"""
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='talent_horizon'
    )


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
    """Start a conversation with an applicant - writes directly to frontend MySQL"""
    try:
        data = json.loads(request.body)
        
        applicant_id = data.get('applicant_id')
        sender_name = data.get('sender_name')
        sender_position = data.get('sender_position')
        sender_avatar_url = data.get('sender_avatar_url', '')
        initial_message = data.get('initial_message')
        application_id = data.get('application_id')
        job_title = data.get('job_title')
        company_name = data.get('company_name')
        
        # Validate required fields
        if not all([applicant_id, sender_name, sender_position, initial_message]):
            return JsonResponse({
                'success': False,
                'error': 'Missing required fields'
            }, status=400)
        
        # Get the applicant from Django to get their email
        applicant = get_object_or_404(User, id=applicant_id, role='applicant')
        
        # Get job and company IDs
        job_id = None
        company_id = None
        if application_id:
            app = Application.objects.filter(id=application_id).select_related('job__company').first()
            if app and app.job:
                job_id = app.job.id
                company_id = app.job.company.id if app.job.company else None
        
        # Write directly to frontend MySQL (single source of truth)
        conn = get_mysql_connection()
        cursor = conn.cursor()
        
        try:
            # Look up the frontend MySQL user ID by email
            cursor.execute("SELECT id FROM users WHERE email = %s", (applicant.email,))
            frontend_user = cursor.fetchone()
            
            if not frontend_user:
                return JsonResponse({
                    'success': False,
                    'error': 'Recipient user not found in system'
                }, status=404)
            
            frontend_recipient_id = frontend_user[0]
            
            # Get the admin user's ID in the frontend MySQL database
            cursor.execute("SELECT id FROM users WHERE email = %s", (request.user.email,))
            admin_frontend_user = cursor.fetchone()
            
            # If admin doesn't exist in frontend DB, create them
            if not admin_frontend_user:
                cursor.execute("""
                    INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt)
                    VALUES (%s, %s, %s, 'local', 'admin', NOW(), NOW())
                """, (f'admin-{request.user.id}', request.user.get_full_name() or 'Admin User', request.user.email))
                conn.commit()
                admin_sender_id = cursor.lastrowid
            else:
                admin_sender_id = admin_frontend_user[0]
            
            # Insert message directly into frontend MySQL
            cursor.execute("""
                INSERT INTO messages (senderId, senderName, senderTitle, senderAvatarUrl, recipientId, applicationId, jobId, companyId, subject, content, isRead, isArchived, createdAt)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            """, (
                admin_sender_id,
                sender_name,
                sender_position,
                sender_avatar_url if sender_avatar_url else None,
                frontend_recipient_id,
                application_id,
                job_id,
                company_id,
                f"Regarding: {job_title}" if job_title else "Message from Employer",
                initial_message,
                False,
                False
            ))
            conn.commit()
            message_id = cursor.lastrowid
            
            return JsonResponse({
                'success': True,
                'message_id': message_id,
                'recipient_id': frontend_recipient_id
            })
            
        finally:
            cursor.close()
            conn.close()
        
    except User.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Applicant not found'
        }, status=404)
    except Exception as e:
        print(f"Error in start_conversation: {e}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@jwt_or_session_required
@require_http_methods(["GET"])
def get_conversations(request):
    """Get all conversations for the current user from frontend MySQL"""
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get the admin's frontend MySQL user ID by email
        cursor.execute("SELECT id FROM users WHERE email = %s", (request.user.email,))
        admin_user = cursor.fetchone()
        admin_frontend_id = admin_user['id'] if admin_user else request.user.id
        
        # Get root messages (conversations) where admin is sender or recipient
        cursor.execute("""
            SELECT 
                m.*,
                j.title as job_title,
                c.name as company_name,
                c.verified as company_verified,
                u.name as recipient_name,
                u.email as recipient_email,
                sender_user.name as sender_user_name
            FROM messages m
            LEFT JOIN jobs j ON m.jobId = j.id
            LEFT JOIN companies c ON m.companyId = c.id
            LEFT JOIN users u ON m.recipientId = u.id
            LEFT JOIN users sender_user ON m.senderId = sender_user.id
            WHERE (m.senderId = %s OR m.recipientId = %s) AND m.parentId IS NULL
            ORDER BY m.createdAt DESC
        """, (admin_frontend_id, admin_frontend_id))
        
        root_messages = cursor.fetchall()
        
        # Build conversations array for polling
        conversations = []
        for msg in root_messages:
            # Get the latest message in this thread (including replies)
            cursor.execute("""
                SELECT content, senderId, createdAt FROM messages 
                WHERE id = %s OR parentId = %s 
                ORDER BY createdAt DESC LIMIT 1
            """, (msg['id'], msg['id']))
            latest = cursor.fetchone()
            
            # Get sender name for the latest message
            if latest:
                cursor.execute("SELECT name FROM users WHERE id = %s", (latest['senderId'],))
                latest_sender = cursor.fetchone()
                latest_sender_name = latest_sender['name'] if latest_sender else 'User'
            else:
                latest_sender_name = msg.get('senderName') or 'User'
                latest = msg
            
            # Determine the other user in the conversation
            if msg['senderId'] == admin_frontend_id:
                other_user_name = msg.get('recipient_name') or 'User'
                other_user_id = msg['recipientId']
            else:
                other_user_name = msg.get('sender_user_name') or msg.get('senderName') or 'User'
                other_user_id = msg['senderId']
            
            # Format last message preview
            last_message = latest['content'][:50] + '...' if len(latest['content']) > 50 else latest['content']
            if latest['senderId'] != admin_frontend_id:
                last_message = f"{latest_sender_name}: {last_message}"
            
            conversations.append({
                'id': msg['id'],
                'display_name': other_user_name,
                'last_message': last_message,
                'last_message_time': latest['createdAt'].isoformat() if latest.get('createdAt') else msg['createdAt'].isoformat() if msg.get('createdAt') else None,
                'unread_count': 0,
                'metadata': {
                    'company_name': msg.get('company_name'),
                    'job_title': msg.get('job_title'),
                }
            })
        
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'success': True,
            'conversations': conversations
        })
        
    except Exception as e:
        print(f"Error in get_conversations: {e}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@jwt_or_session_required
@require_http_methods(["GET"])
def get_conversation(request, conversation_id):
    """Get a specific conversation/message thread"""
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get the admin's frontend MySQL user ID by email
        cursor.execute("SELECT id FROM users WHERE email = %s", (request.user.email,))
        admin_user = cursor.fetchone()
        admin_frontend_id = admin_user['id'] if admin_user else request.user.id
        
        # Get the main message
        cursor.execute("""
            SELECT 
                m.*,
                j.title as job_title,
                c.name as company_name,
                c.verified as company_verified,
                u.name as recipient_name,
                u.email as recipient_email
            FROM messages m
            LEFT JOIN jobs j ON m.jobId = j.id
            LEFT JOIN companies c ON m.companyId = c.id
            LEFT JOIN users u ON m.recipientId = u.id
            WHERE m.id = %s
        """, (conversation_id,))
        
        message = cursor.fetchone()
        
        if not message:
            return JsonResponse({'success': False, 'error': 'Message not found'}, status=404)
        
        # Get replies
        cursor.execute("""
            SELECT m.*, u.name as sender_name_from_user
            FROM messages m
            LEFT JOIN users u ON m.senderId = u.id
            WHERE m.parentId = %s ORDER BY m.createdAt ASC
        """, (conversation_id,))
        
        replies = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Convert datetime objects
        if message.get('createdAt'):
            message['createdAt'] = message['createdAt'].isoformat()
        for reply in replies:
            if reply.get('createdAt'):
                reply['createdAt'] = reply['createdAt'].isoformat()
        
        # Determine the "other user" in the conversation (the one who is NOT the admin)
        if message['senderId'] == admin_frontend_id:
            other_user_name = message.get('recipient_name') or 'User'
            other_user_email = message.get('recipient_email')
            other_user_id = message['recipientId']
        else:
            other_user_name = message.get('senderName') or 'User'
            other_user_email = None
            other_user_id = message['senderId']
        
        # Build conversation object in the format expected by the frontend
        conversation = {
            'id': message['id'],
            'other_user': {
                'id': other_user_id,
                'name': other_user_name,
                'email': other_user_email,
                'role': 'applicant',
                'is_verified': False,
            },
            'display_name': other_user_name,
            'sender_position': message.get('senderTitle'),
            'metadata': {
                'company_name': message.get('company_name'),
                'job_title': message.get('job_title'),
            },
            'subject': message.get('subject'),
        }
        
        # Build messages array (original message + replies)
        all_messages = []
        
        # Add the original message
        all_messages.append({
            'id': message['id'],
            'sender_id': message['senderId'],
            'sender_name': message.get('senderName') or 'Admin',
            'content': message['content'],
            'created_at': message['createdAt'],
            'is_from_admin': message['senderId'] == admin_frontend_id,
            'is_sent_by_me': message['senderId'] == admin_frontend_id,
        })
        
        # Add replies
        for reply in replies:
            all_messages.append({
                'id': reply['id'],
                'sender_id': reply['senderId'],
                'sender_name': reply.get('senderName') or reply.get('sender_name_from_user') or 'User',
                'content': reply['content'],
                'created_at': reply['createdAt'],
                'is_from_admin': reply['senderId'] == admin_frontend_id,
                'is_sent_by_me': reply['senderId'] == admin_frontend_id,
            })
        
        return JsonResponse({
            'success': True,
            'conversation': conversation,
            'messages': all_messages,
            # Also include raw data for backward compatibility
            'message': message,
            'replies': replies
        })
        
    except Exception as e:
        print(f"Error in get_conversation: {e}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@jwt_or_session_required
@require_http_methods(["POST"])
def send_message(request):
    """Send a reply message"""
    try:
        data = json.loads(request.body)
        conversation_id = data.get('conversation_id')  # The root message ID
        parent_id = data.get('parent_id') or conversation_id  # Use conversation_id as parent_id
        content = data.get('content', '').strip()
        
        if not content:
            return JsonResponse({'success': False, 'error': 'Message content is required'}, status=400)
        
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        try:
            # Get the admin's frontend MySQL user ID by email
            cursor.execute("SELECT id FROM users WHERE email = %s", (request.user.email,))
            admin_user = cursor.fetchone()
            admin_frontend_id = admin_user['id'] if admin_user else request.user.id
            
            # Get parent message to determine recipient
            if parent_id:
                cursor.execute("SELECT * FROM messages WHERE id = %s", (parent_id,))
                parent = cursor.fetchone()
                
                if not parent:
                    return JsonResponse({'success': False, 'error': 'Parent message not found'}, status=404)
                
                # Determine recipient (the other person in the conversation)
                if parent['recipientId'] == admin_frontend_id:
                    recipient_id = parent['senderId']
                else:
                    recipient_id = parent['recipientId']
            else:
                return JsonResponse({'success': False, 'error': 'Conversation ID required'}, status=400)
            
            # Insert reply
            cursor.execute("""
                INSERT INTO messages (senderId, senderName, recipientId, parentId, jobId, companyId, subject, content, isRead, isArchived, createdAt)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            """, (
                admin_frontend_id,
                request.user.get_full_name() or 'Admin User',
                recipient_id,
                parent_id,
                parent.get('jobId'),
                parent.get('companyId'),
                f"Re: {parent.get('subject', 'Message')}",
                content,
                False,
                False
            ))
            conn.commit()
            message_id = cursor.lastrowid
            
            # Get the created timestamp
            cursor.execute("SELECT createdAt FROM messages WHERE id = %s", (message_id,))
            created_msg = cursor.fetchone()
            created_at = created_msg['createdAt'].isoformat() if created_msg else datetime.now().isoformat()
            
            return JsonResponse({
                'success': True,
                'message': {
                    'id': message_id,
                    'sender_id': admin_frontend_id,
                    'sender_name': request.user.get_full_name() or 'Admin User',
                    'content': content,
                    'created_at': created_at,
                    'is_from_admin': True
                },
                'message_id': message_id
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
def mark_read(request, message_id):
    """Mark a message as read"""
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor()
        
        cursor.execute("UPDATE messages SET isRead = TRUE WHERE id = %s", (message_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return JsonResponse({'success': True})
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@jwt_or_session_required
@require_http_methods(["GET"])
def search_users(request):
    """Search for users to message"""
    query = request.GET.get('q', '')
    
    if len(query) < 2:
        return JsonResponse({'success': True, 'users': []})
    
    try:
        users = User.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(email__icontains=query)
        ).exclude(id=request.user.id)[:10]
        
        users_data = [{
            'id': u.id,
            'name': u.get_full_name(),
            'email': u.email,
            'role': u.role,
            'avatar': u.avatar.url if u.avatar else None
        } for u in users]
        
        return JsonResponse({'success': True, 'users': users_data})
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)
