from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Max
from core.models import User, Conversation, ChatMessage
from jobs.models import Application
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
import json


def jwt_or_session_required(view_func):
    """Decorator that accepts both JWT token and Django session authentication"""
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
        
        # Neither authentication method worked
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    return wrapper


@jwt_or_session_required
@require_http_methods(["POST"])
def start_conversation(request):
    """Start a conversation with an applicant with custom sender context"""
    try:
        data = json.loads(request.body)
        
        applicant_id = data.get('applicant_id')
        sender_name = data.get('sender_name')
        sender_position = data.get('sender_position')
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
        
        # Get the applicant
        applicant = get_object_or_404(User, id=applicant_id, role='applicant')
        
        # Check if conversation already exists (bidirectional check)
        existing_conversation = Conversation.objects.filter(
            (Q(participant1=request.user) & Q(participant2=applicant)) |
            (Q(participant1=applicant) & Q(participant2=request.user))
        ).first()
        
        if existing_conversation:
            # Update metadata if it exists
            if not existing_conversation.metadata:
                existing_conversation.metadata = {}
            existing_conversation.metadata.update({
                'sender_name': sender_name,
                'sender_position': sender_position,
                'job_title': job_title,
                'company_name': company_name,
                'application_id': application_id,
            })
            existing_conversation.save()
            conversation = existing_conversation
        else:
            # Create new conversation with sender context
            conversation = Conversation.objects.create(
                participant1=request.user,
                participant2=applicant,
                metadata={
                    'sender_name': sender_name,
                    'sender_position': sender_position,
                    'job_title': job_title,
                    'company_name': company_name,
                    'application_id': application_id,
                }
            )
        
        # Send the initial message
        message = ChatMessage.objects.create(
            conversation=conversation,
            sender=request.user,
            content=initial_message
        )
        
        return JsonResponse({
            'success': True,
            'conversation_id': conversation.id,
            'message_id': message.id,
        })
        
    except User.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Applicant not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@jwt_or_session_required
@require_http_methods(["GET"])
def get_conversation(request, conversation_id):
    """Get messages from a specific conversation"""
    from jobs.models import Job
    
    conversation = get_object_or_404(
        Conversation,
        Q(participant1=request.user) | Q(participant2=request.user),
        id=conversation_id
    )
    
    # Get all messages in the conversation
    messages = conversation.chat_messages.select_related('sender').order_by('created_at')
    
    # Mark messages as read
    conversation.chat_messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)
    
    # Format messages for JSON response
    messages_data = []
    for msg in messages:
        messages_data.append({
            'id': msg.id,
            'sender_id': msg.sender.id,
            'sender_name': msg.sender.get_full_name(),
            'content': msg.content,
            'is_read': msg.is_read,
            'created_at': msg.created_at.isoformat(),
            'is_sent_by_me': msg.sender == request.user,
        })
    
    # Get other participant info
    other_user = conversation.get_other_participant(request.user)
    
    # Get custom display information
    display_name = conversation.get_display_name(request.user)
    sender_position = conversation.get_sender_position(request.user)
    
    # Check if the other user is verified (user level or company level)
    is_verified = other_user.is_verified
    if other_user.role == 'employer':
        # Check if employer's company is verified
        employer_company = Job.objects.filter(posted_by=other_user).select_related('company').first()
        if employer_company and employer_company.company.is_verified:
            is_verified = True
    
    return JsonResponse({
        'success': True,
        'conversation': {
            'id': conversation.id,
            'display_name': display_name,
            'sender_position': sender_position,
            'metadata': conversation.metadata or {},
            'other_user': {
                'id': other_user.id,
                'name': other_user.get_full_name(),
                'email': other_user.email,
                'avatar': other_user.avatar.url if other_user.avatar else None,
                'role': other_user.get_role_display(),
                'is_verified': is_verified,
            }
        },
        'messages': messages_data,
    })


@jwt_or_session_required
@require_http_methods(["POST"])
def send_message(request):
    """Send a new message"""
    try:
        data = json.loads(request.body)
        conversation_id = data.get('conversation_id')
        recipient_id = data.get('recipient_id')
        content = data.get('content', '').strip()
        
        if not content:
            return JsonResponse({'success': False, 'error': 'Message content is required'}, status=400)
        
        # Get or create conversation
        if conversation_id:
            conversation = get_object_or_404(
                Conversation,
                Q(participant1=request.user) | Q(participant2=request.user),
                id=conversation_id
            )
        elif recipient_id:
            recipient = get_object_or_404(User, id=recipient_id)
            
            # Try to find existing conversation
            conversation = Conversation.objects.filter(
                Q(participant1=request.user, participant2=recipient) |
                Q(participant1=recipient, participant2=request.user)
            ).first()
            
            # Create new conversation if doesn't exist
            if not conversation:
                # Ensure participant1 has lower ID (for uniqueness)
                if request.user.id < recipient.id:
                    conversation = Conversation.objects.create(
                        participant1=request.user,
                        participant2=recipient
                    )
                else:
                    conversation = Conversation.objects.create(
                        participant1=recipient,
                        participant2=request.user
                    )
        else:
            return JsonResponse({'success': False, 'error': 'conversation_id or recipient_id required'}, status=400)
        
        # Create the message
        message = ChatMessage.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content
        )
        
        # Update conversation timestamp
        conversation.save()  # This updates updated_at
        
        return JsonResponse({
            'success': True,
            'message': {
                'id': message.id,
                'sender_id': message.sender.id,
                'sender_name': message.sender.get_full_name(),
                'content': message.content,
                'is_read': message.is_read,
                'created_at': message.created_at.isoformat(),
                'is_sent_by_me': True,
            },
            'conversation_id': conversation.id,
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@jwt_or_session_required
@require_http_methods(["GET"])
def get_conversations(request):
    """Get all conversations for the current user"""
    conversations = Conversation.objects.filter(
        Q(participant1=request.user) | Q(participant2=request.user)
    ).annotate(
        last_message_time=Max('chat_messages__created_att')
    ).select_related('participant1', 'participant2').order_by('-last_message_time')
    
    conversations_data = []
    for conv in conversations:
        other_user = conv.get_other_participant(request.user)
        last_message = conv.get_last_message()
        unread_count = conv.get_unread_count(request.user)
        
        conversations_data.append({
            'id': conv.id,
            'other_user': {
                'id': other_user.id,
                'name': other_user.get_full_name(),
                'email': other_user.email,
                'avatar': other_user.avatar.url if other_user.avatar else None,
                'role': other_user.get_role_display(),
            },
            'last_message': {
                'content': last_message.content if last_message else '',
                'created_at': last_message.created_at.isoformat() if last_message else conv.created_at.isoformat(),
                'sender_is_me': last_message.sender == request.user if last_message else False,
            } if last_message else None,
            'unread_count': unread_count,
            'updated_at': conv.updated_at.isoformat(),
        })
    
    return JsonResponse({
        'success': True,
        'conversations': conversations_data,
    })


@jwt_or_session_required
@require_http_methods(["GET"])
def search_users(request):
    """Search for users to start a conversation with"""
    query = request.GET.get('q', '').strip()
    
    if not query or len(query) < 2:
        return JsonResponse({'success': False, 'error': 'Query must be at least 2 characters'}, status=400)
    
    # Search for users (excluding current user)
    users = User.objects.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query)
    ).exclude(id=request.user.id)[:10]
    
    users_data = []
    for user in users:
        users_data.append({
            'id': user.id,
            'name': user.get_full_name(),
            'email': user.email,
            'avatar': user.avatar.url if user.avatar else None,
            'role': user.get_role_display(),
            'headline': user.headline or '',
        })
    
    return JsonResponse({
        'success': True,
        'users': users_data,
    })


@jwt_or_session_required
@require_http_methods(["POST"])
def mark_as_read(request, conversation_id):
    """Mark all messages in a conversation as read"""
    conversation = get_object_or_404(
        Conversation,
        Q(participant1=request.user) | Q(participant2=request.user),
        id=conversation_id
    )
    
    # Mark all unread messages from the other user as read
    updated_count = conversation.chat_messages.filter(
        is_read=False
    ).exclude(sender=request.user).update(is_read=True)
    
    return JsonResponse({
        'success': True,
        'marked_count': updated_count,
    })
