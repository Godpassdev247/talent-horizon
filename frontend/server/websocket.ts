import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { getUserFromToken } from './auth';

interface ConnectedClient {
  ws: WebSocket;
  userId: number;
}

const clients: Map<number, ConnectedClient[]> = new Map();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', async (ws, req) => {
    // Extract token from query string
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(1008, 'No token provided');
      return;
    }

    // Verify token and get user
    const user = await getUserFromToken(token);
    if (!user) {
      ws.close(1008, 'Invalid token');
      return;
    }

    const userId = user.id;
    console.log(`WebSocket connected: User ${userId}`);

    // Add client to the map
    if (!clients.has(userId)) {
      clients.set(userId, []);
    }
    clients.get(userId)!.push({ ws, userId });

    // Handle incoming messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(`Received from user ${userId}:`, message);
        
        // Handle different message types
        if (message.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log(`WebSocket disconnected: User ${userId}`);
      const userClients = clients.get(userId);
      if (userClients) {
        const index = userClients.findIndex(c => c.ws === ws);
        if (index !== -1) {
          userClients.splice(index, 1);
        }
        if (userClients.length === 0) {
          clients.delete(userId);
        }
      }
    });

    // Send connection confirmation
    ws.send(JSON.stringify({ type: 'connected', userId }));
  });

  return wss;
}

// Function to send a message to a specific user
export function sendToUser(userId: number, message: any) {
  const userClients = clients.get(userId);
  if (userClients) {
    const messageStr = JSON.stringify(message);
    userClients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }
}

// Function to broadcast a new message notification
export function broadcastNewMessage(senderId: number, recipientId: number, messageData: any) {
  // Notify the recipient
  sendToUser(recipientId, {
    type: 'new_message',
    message: messageData
  });
  
  // Also notify the sender (for multi-device sync)
  sendToUser(senderId, {
    type: 'message_sent',
    message: messageData
  });
}

// Export clients map for debugging
export function getConnectedUsers(): number[] {
  return Array.from(clients.keys());
}
