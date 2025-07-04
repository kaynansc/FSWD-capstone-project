
import { WebSocketServer, WebSocket } from 'ws'
import { FastifyInstance } from 'fastify'
import { CommunityRepository } from '../community/community.repository'
import { UserRepository } from '../user/user.repository'
import { MessageRepository } from '../message/message.repository'

interface CustomWebSocket extends WebSocket {
  userId: string
  communityId: string
}

export function initializeChat(app: FastifyInstance) {
  const wss = new WebSocketServer({ server: app.server })
  const communityRepository = new CommunityRepository()
  const userRepository = new UserRepository()
  const messageRepository = new MessageRepository()

  const communityConnections = new Map<string, Set<CustomWebSocket>>()

  wss.on('connection', async (ws: CustomWebSocket, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`)
    const communityId = url.searchParams.get('communityId')
    const token = url.searchParams.get('token')

    if (!communityId || !token) {
      ws.close(1008, 'Missing communityId or token')
      return
    }

    try {
      const decoded = await app.jwt.verify<{ id: string }>(token)
      const userId = decoded.id

      const community = await communityRepository.findById(communityId)
      if (!community) {
        ws.close(1008, 'Community not found')
        return
      }

      const isMember = community.memberships.some(m => m.user.id === userId)
      if (!isMember) {
        ws.close(1003, 'Not a member of this community')
        return
      }

      ws.userId = userId
      ws.communityId = communityId

      if (!communityConnections.has(communityId)) {
        communityConnections.set(communityId, new Set())
      }
      communityConnections.get(communityId)!.add(ws)

      ws.on('message', async (message) => {
        const messageString = JSON.parse(message.toString()).message
        const connections = communityConnections.get(ws.communityId)
        if (connections) {
          const savedMessage = await messageRepository.create(messageString, ws.communityId, ws.userId)
          const chatMessage = {
            id: savedMessage.id,
            message: savedMessage.content,
            sender: {
              id: savedMessage.sender.id,
              name: savedMessage.sender.name,
            },
            timestamp: savedMessage.createdAt.toISOString(),
          }
          const fullMessage = JSON.stringify(chatMessage)
          connections.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(fullMessage)
            }
          })
        }
      })

      ws.on('close', () => {
        const connections = communityConnections.get(ws.communityId)
        if (connections) {
          connections.delete(ws)
          if (connections.size === 0) {
            communityConnections.delete(ws.communityId)
          }
        }
      })

      ws.on('error', (error) => {
        console.error('WebSocket error:', error)
      })
    } catch (error) {
      ws.close(1008, 'Invalid token')
    }
  })
}
