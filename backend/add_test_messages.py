"""
Create test messaging data for the Talent Horizon platform
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'talent_horizon.settings')
django.setup()

from core.models import User, Conversation, ChatMessage
from datetime import timedelta
from django.utils import timezone

print('🔥 CREATING TEST MESSAGING DATA')
print('=' * 70)

# Get users
admin = User.objects.filter(role='admin').first()
job_seekers = User.objects.filter(role='job_seeker')[:3]
employers = User.objects.filter(role='employer')[:2]

if not admin:
    print('❌ No admin user found. Please create one first.')
    exit()

if not job_seekers.exists():
    print('❌ No job seekers found. Please create some first.')
    exit()

if not employers.exists():
    print('❌ No employers found. Please create some first.')
    exit()

print(f'\n👤 Admin: {admin.get_full_name()} ({admin.email})')
print(f'👥 Job Seekers: {job_seekers.count()}')
print(f'💼 Employers: {employers.count()}')

# Clear existing test conversations
ChatMessage.objects.all().delete()
Conversation.objects.all().delete()
print('\n🧹 Cleared existing test conversations')

# Create conversations
conversations_created = 0
messages_created = 0

# 1. Admin conversation with first job seeker
if job_seekers:
    seeker1 = job_seekers[0]
    if admin.id < seeker1.id:
        conv1 = Conversation.objects.create(participant1=admin, participant2=seeker1)
    else:
        conv1 = Conversation.objects.create(participant1=seeker1, participant2=admin)
    conversations_created += 1
    
    # Messages
    ChatMessage.objects.create(
        conversation=conv1,
        sender=seeker1,
        content=f"Hi {admin.first_name}! I applied for the Senior Software Engineer position. Could you please review my application?",
        created_at=timezone.now() - timedelta(hours=3)
    )
    ChatMessage.objects.create(
        conversation=conv1,
        sender=admin,
        content=f"Hello {seeker1.first_name}! I've reviewed your application and it looks great. We'd like to schedule an interview.",
        is_read=True,
        created_at=timezone.now() - timedelta(hours=2, minutes=30)
    )
    ChatMessage.objects.create(
        conversation=conv1,
        sender=seeker1,
        content="That's wonderful! What time works best for you?",
        is_read=True,
        created_at=timezone.now() - timedelta(hours=2)
    )
    ChatMessage.objects.create(
        conversation=conv1,
        sender=admin,
        content="How about Thursday at 2 PM? We can do a video call.",
        is_read=False,
        created_at=timezone.now() - timedelta(minutes=30)
    )
    messages_created += 4
    print(f'✅ Created conversation between {admin.get_full_name()} and {seeker1.get_full_name()} (4 messages)')

# 2. Admin conversation with first employer
if employers:
    employer1 = employers[0]
    if admin.id < employer1.id:
        conv2 = Conversation.objects.create(participant1=admin, participant2=employer1)
    else:
        conv2 = Conversation.objects.create(participant1=employer1, participant2=admin)
    conversations_created += 1
    
    # Messages
    ChatMessage.objects.create(
        conversation=conv2,
        sender=employer1,
        content="Hello! I need help posting a job for a Data Scientist position. Can you assist?",
        created_at=timezone.now() - timedelta(days=1, hours=5)
    )
    ChatMessage.objects.create(
        conversation=conv2,
        sender=admin,
        content="Of course! I can help you with that. Have you prepared the job description?",
        is_read=True,
        created_at=timezone.now() - timedelta(days=1, hours=4)
    )
    ChatMessage.objects.create(
        conversation=conv2,
        sender=employer1,
        content="Yes, I have. Should I email it to you or post it directly?",
        is_read=True,
        created_at=timezone.now() - timedelta(days=1, hours=3)
    )
    ChatMessage.objects.create(
        conversation=conv2,
        sender=admin,
        content="You can post it directly through the dashboard. Let me know if you need any help!",
        is_read=False,
        created_at=timezone.now() - timedelta(hours=18)
    )
    messages_created += 4
    print(f'✅ Created conversation between {admin.get_full_name()} and {employer1.get_full_name()} (4 messages)')

# 3. Conversation between second job seeker and admin
if len(job_seekers) > 1:
    seeker2 = job_seekers[1]
    if admin.id < seeker2.id:
        conv3 = Conversation.objects.create(participant1=admin, participant2=seeker2)
    else:
        conv3 = Conversation.objects.create(participant1=seeker2, participant2=admin)
    conversations_created += 1
    
    # Messages
    ChatMessage.objects.create(
        conversation=conv3,
        sender=seeker2,
        content="Hi! I'm interested in the Product Manager role. Is it still available?",
        created_at=timezone.now() - timedelta(hours=6)
    )
    ChatMessage.objects.create(
        conversation=conv3,
        sender=admin,
        content="Yes, it is! Would you like to apply?",
        is_read=True,
        created_at=timezone.now() - timedelta(hours=5)
    )
    ChatMessage.objects.create(
        conversation=conv3,
        sender=seeker2,
        content="Absolutely! I'll submit my application today.",
        is_read=False,
        created_at=timezone.now() - timedelta(minutes=45)
    )
    messages_created += 3
    print(f'✅ Created conversation between {admin.get_full_name()} and {seeker2.get_full_name()} (3 messages)')

# 4. Conversation between employer and job seeker
if employers and len(job_seekers) > 2:
    employer2 = employers[0]
    seeker3 = job_seekers[2]
    if employer2.id < seeker3.id:
        conv4 = Conversation.objects.create(participant1=employer2, participant2=seeker3)
    else:
        conv4 = Conversation.objects.create(participant1=seeker3, participant2=employer2)
    conversations_created += 1
    
    # Messages
    ChatMessage.objects.create(
        conversation=conv4,
        sender=employer2,
        content=f"Hi {seeker3.first_name}, I reviewed your profile and I'm impressed! Are you available for an interview next week?",
        created_at=timezone.now() - timedelta(hours=8)
    )
    ChatMessage.objects.create(
        conversation=conv4,
        sender=seeker3,
        content=f"Thank you so much! Yes, I'm available. What position is this regarding?",
        is_read=True,
        created_at=timezone.now() - timedelta(hours=7)
    )
    ChatMessage.objects.create(
        conversation=conv4,
        sender=employer2,
        content="It's for our UX Designer opening. I think you'd be a great fit!",
        is_read=True,
        created_at=timezone.now() - timedelta(hours=6, minutes=30)
    )
    ChatMessage.objects.create(
        conversation=conv4,
        sender=seeker3,
        content="That sounds perfect! I'd love to learn more about the role.",
        is_read=False,
        created_at=timezone.now() - timedelta(hours=6)
    )
    ChatMessage.objects.create(
        conversation=conv4,
        sender=employer2,
        content="Great! I'll send you the job details and we can schedule a call.",
        is_read=False,
        created_at=timezone.now() - timedelta(minutes=15)
    )
    messages_created += 5
    print(f'✅ Created conversation between {employer2.get_full_name()} and {seeker3.get_full_name()} (5 messages)')

print(f'\n📊 SUMMARY:')
print(f'  ✅ Total Conversations: {conversations_created}')
print(f'  ✅ Total Messages: {messages_created}')
print(f'  ✅ Unread Messages: {ChatMessage.objects.filter(is_read=False).count()}')

print('\n🎉 TEST MESSAGING DATA CREATED!')
print('=' * 70)
print('\n🌐 ACCESS THE MESSAGING SYSTEM:')
print('  1. Login at: http://127.0.0.1:8000/admin-panel/login/')
print('  2. Click "Messages" in the sidebar')
print('  3. Start chatting!')
print('\n✅ WhatsApp/Telegram-style messaging ready to test!')
