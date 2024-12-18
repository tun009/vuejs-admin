import { io } from 'socket.io-client'

const createSocketConnection = (url: string) => {
  const socket = io(url, {
    path: '/eximbank-socket',
    transports: ['websocket'],
    query: { handshake: 'eximbank-socket' }
  })

  socket.on('connect', () => {
    console.log('Connected to WebSocket')
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket')
  })

  return socket
}

export default createSocketConnection
