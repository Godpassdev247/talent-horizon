import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const JWT_SECRET = process.env.JWT_SECRET || 'talent-horizon-secret-key-2024';

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'talent_horizon',
  waitForConnections: true,
  connectionLimit: 10,
});

// Store connected users: Map<userId, Set<socketId>>
const connectedUsers = new Map<number, Set<string>>();

// Generate conversation ID (always sorted to ensure consistency)
function getConversationId(userId1: number, userId2: number): string {
  const sorted = [userId1, userId2].sort((a, b) => a - b);
  return `conv_${sorted[0]}_${sorted[1]}`;
}

export function initializeWebSocket(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
      socket.data.userId = decoded.userId;
      socket.data.email = decoded.email;
      
      // Get user info from database
      const [users] = await pool.execute(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [decoded.userId]
      );
      
      if ((users as any[]).length === 0) {
        return next(new Error('User not found'));
      }
      
      socket.data.user = (users as any[])[0];
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`User ${userId} connected via WebSocket`);

    // Track connected user
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId)!.add(socket.id);

    // Join user's personal room
    socket.join(`user_${userId}`);

    // Send online status to all contacts
    socket.broadcast.emit('user_online', { userId });

    // Handle getting conversations list
    socket.on('get_conversations', async () => {
      try {
        const [conversations] = await pool.execute(`
          SELECT 
            c.*,
            u1.name as participant1Name,
            u1.email as participant1Email,
            u2.name as participant2Name,
            u2.email as participant2Email,
            m.content as lastMessageContent,
            m.messageType as lastMessageType,
            m.senderId as lastMessageSenderId,
            m.createdAt as lastMessageCreatedAt
          FROM conversations c
          LEFT JOIN users u1 ON c.participant1Id = u1.id
          LEFT JOIN users u2 ON c.participant2Id = u2.id
          LEFT JOIN messages m ON c.lastMessageId = m.id
          WHERE c.participant1Id = ? OR c.participant2Id = ?
          ORDER BY c.lastMessageAt DESC
        `, [userId, userId]);

        const formattedConversations = (conversations as any[]).map(conv => {
          const isParticipant1 = conv.participant1Id === userId;
          const otherUserId = isParticipant1 ? conv.participant2Id : conv.participant1Id;
          const otherUserName = isParticipant1 ? conv.participant2Name : conv.participant1Name;
          const otherUserEmail = isParticipant1 ? conv.participant2Email : conv.participant1Email;
          const unreadCount = isParticipant1 ? conv.participant1Unread : conv.participant2Unread;
          const isOnline = connectedUsers.has(otherUserId);

          return {
            id: conv.id,
            otherUserId,
            otherUserName,
            otherUserEmail,
            lastMessage: conv.lastMessageContent,
            lastMessageType: conv.lastMessageType,
            lastMessageSenderId: conv.lastMessageSenderId,
            lastMessageAt: conv.lastMessageCreatedAt,
            unreadCount,
            isOnline,
          };
        });

        socket.emit('conversations_list', formattedConversations);
      } catch (error) {
        console.error('Error getting conversations:', error);
        socket.emit('error', { message: 'Failed to get conversations' });
      }
    });

    // Handle getting messages for a conversation
    socket.on('get_messages', async ({ conversationId, limit = 50, offset = 0 }) => {
      try {
        const [messages] = await pool.execute(`
          SELECT * FROM messages 
          WHERE conversationId = ? AND isDeleted = 0
          ORDER BY createdAt ASC
          LIMIT ? OFFSET ?
        `, [conversationId, limit, offset]);

        socket.emit('messages_list', { conversationId, messages });

        // Mark messages as read
        await pool.execute(`
          UPDATE messages 
          SET status = 'read' 
          WHERE conversationId = ? AND recipientId = ? AND status != 'read'
        `, [conversationId, userId]);

        // Update unread count in conversation
        const [convRows] = await pool.execute(
          'SELECT participant1Id, participant2Id FROM conversations WHERE id = ?',
          [conversationId]
        );
        
        if ((convRows as any[]).length > 0) {
          const conv = (convRows as any[])[0];
          const unreadColumn = conv.participant1Id === userId ? 'participant1Unread' : 'participant2Unread';
          await pool.execute(
            `UPDATE conversations SET ${unreadColumn} = 0 WHERE id = ?`,
            [conversationId]
          );
        }

        // Notify sender that messages were read
        const otherUserIdMatch = conversationId.match(/conv_(\d+)_(\d+)/);
        if (otherUserIdMatch) {
          const [id1, id2] = [parseInt(otherUserIdMatch[1]), parseInt(otherUserIdMatch[2])];
          const otherUserId = id1 === userId ? id2 : id1;
          io.to(`user_${otherUserId}`).emit('messages_read', { conversationId, readBy: userId });
        }
      } catch (error) {
        console.error('Error getting messages:', error);
        socket.emit('error', { message: 'Failed to get messages' });
      }
    });

    // Handle sending a message
    socket.on('send_message', async ({ recipientId, content, messageType = 'text', fileUrl, fileName, fileSize }) => {
      try {
        const conversationId = getConversationId(userId, recipientId);
        const senderName = socket.data.user.name;
        const senderAvatarUrl = socket.data.user.avatarUrl || null;

        // Insert message
        const [result] = await pool.execute(`
          INSERT INTO messages (conversationId, senderId, senderName, senderAvatarUrl, recipientId, content, messageType, fileUrl, fileName, fileSize, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent')
        `, [conversationId, userId, senderName, senderAvatarUrl, recipientId, content, messageType, fileUrl || null, fileName || null, fileSize || null]);

        const messageId = (result as any).insertId;

        // Get the inserted message
        const [messages] = await pool.execute('SELECT * FROM messages WHERE id = ?', [messageId]);
        const message = (messages as any[])[0];

        // Update or create conversation
        const [existingConv] = await pool.execute(
          'SELECT id FROM conversations WHERE id = ?',
          [conversationId]
        );

        if ((existingConv as any[]).length === 0) {
          // Create new conversation
          const [p1, p2] = [Math.min(userId, recipientId), Math.max(userId, recipientId)];
          await pool.execute(`
            INSERT INTO conversations (id, participant1Id, participant2Id, lastMessageId, lastMessageAt, participant1Unread, participant2Unread)
            VALUES (?, ?, ?, ?, NOW(), ?, ?)
          `, [conversationId, p1, p2, messageId, p1 === recipientId ? 1 : 0, p2 === recipientId ? 1 : 0]);
        } else {
          // Update existing conversation
          const [convRows] = await pool.execute(
            'SELECT participant1Id, participant2Id FROM conversations WHERE id = ?',
            [conversationId]
          );
          const conv = (convRows as any[])[0];
          const unreadColumn = conv.participant1Id === recipientId ? 'participant1Unread' : 'participant2Unread';
          
          await pool.execute(`
            UPDATE conversations 
            SET lastMessageId = ?, lastMessageAt = NOW(), ${unreadColumn} = ${unreadColumn} + 1
            WHERE id = ?
          `, [messageId, conversationId]);
        }

        // Send message to sender (confirmation)
        socket.emit('message_sent', message);

        // Send message to recipient if online
        if (connectedUsers.has(recipientId)) {
          io.to(`user_${recipientId}`).emit('new_message', message);
          
          // Update message status to delivered
          await pool.execute('UPDATE messages SET status = ? WHERE id = ?', ['delivered', messageId]);
          socket.emit('message_delivered', { messageId });
        }

        // Send updated conversation to both users
        const conversationUpdate = {
          id: conversationId,
          lastMessage: content,
          lastMessageType: messageType,
          lastMessageSenderId: userId,
          lastMessageAt: message.createdAt,
        };
        
        socket.emit('conversation_updated', conversationUpdate);
        if (connectedUsers.has(recipientId)) {
          io.to(`user_${recipientId}`).emit('conversation_updated', conversationUpdate);
        }

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing_start', ({ conversationId, recipientId }) => {
      io.to(`user_${recipientId}`).emit('user_typing', { conversationId, userId });
    });

    socket.on('typing_stop', ({ conversationId, recipientId }) => {
      io.to(`user_${recipientId}`).emit('user_stopped_typing', { conversationId, userId });
    });

    // Handle marking messages as read
    socket.on('mark_read', async ({ conversationId }) => {
      try {
        await pool.execute(`
          UPDATE messages 
          SET status = 'read' 
          WHERE conversationId = ? AND recipientId = ? AND status != 'read'
        `, [conversationId, userId]);

        // Update unread count
        const [convRows] = await pool.execute(
          'SELECT participant1Id, participant2Id FROM conversations WHERE id = ?',
          [conversationId]
        );
        
        if ((convRows as any[]).length > 0) {
          const conv = (convRows as any[])[0];
          const unreadColumn = conv.participant1Id === userId ? 'participant1Unread' : 'participant2Unread';
          await pool.execute(
            `UPDATE conversations SET ${unreadColumn} = 0 WHERE id = ?`,
            [conversationId]
          );
        }

        // Notify the other user
        const otherUserIdMatch = conversationId.match(/conv_(\d+)_(\d+)/);
        if (otherUserIdMatch) {
          const [id1, id2] = [parseInt(otherUserIdMatch[1]), parseInt(otherUserIdMatch[2])];
          const otherUserId = id1 === userId ? id2 : id1;
          io.to(`user_${otherUserId}`).emit('messages_read', { conversationId, readBy: userId });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
      
      const userSockets = connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          connectedUsers.delete(userId);
          // Notify all users that this user is offline
          socket.broadcast.emit('user_offline', { userId });
        }
      }
    });
  });

  return io;
}

// Export for use in REST API
export { pool, connectedUsers, getConversationId };

// Legacy exports for backward compatibility
export function sendToUser(userId: number, message: any) {
  // This will be handled by Socket.IO now
}

export function broadcastNewMessage(senderId: number, recipientId: number, messageData: any) {
  // This will be handled by Socket.IO now
}

export function getConnectedUsers(): number[] {
  return Array.from(connectedUsers.keys());
}
