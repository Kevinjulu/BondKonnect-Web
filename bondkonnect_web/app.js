#!/usr/bin/env node

// cPanel-compatible startup script
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

// cPanel typically uses different port configurations
const port = parseInt(process.env.PORT || process.env.NODEJS_PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'

// Initialize Next.js
const app = next({ dev, dir: __dirname })
const handle = app.getRequestHandler()

console.log('Starting Next.js application...')
console.log(`Environment: ${dev ? 'development' : 'production'}`)
console.log(`Port: ${port}`)

app.prepare()
  .then(() => {
    const server = createServer((req, res) => {
      try {
        // Parse the URL
        const parsedUrl = parse(req.url, true)
        
        // Handle the request
        handle(req, res, parsedUrl)
      } catch (err) {
        console.error('Error handling request:', err)
        res.statusCode = 500
        res.end('Internal Server Error')
      }
    })
    
    // Handle server errors
    server.on('error', (err) => {
      console.error('Server error:', err)
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`)
        process.exit(1)
      }
    })
    
    // Start the server
    server.listen(port, (err) => {
      if (err) {
        console.error('Failed to start server:', err)
        process.exit(1)
      }
      
      console.log(`> Server ready on http://localhost:${port}`)
      console.log(`> Environment: ${dev ? 'development' : 'production'}`)
    })
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM, shutting down gracefully...')
      server.close(() => {
        console.log('Server closed')
        process.exit(0)
      })
    })
    
    process.on('SIGINT', () => {
      console.log('Received SIGINT, shutting down gracefully...')
      server.close(() => {
        console.log('Server closed')
        process.exit(0)
      })
    })
  })
  .catch((ex) => {
    console.error('Error starting application:', ex.stack)
    process.exit(1)
  }) 