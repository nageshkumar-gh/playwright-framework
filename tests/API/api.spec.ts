import { test, expect } from '@playwright/test'
import http from 'node:http'

let server: http.Server
let apiBaseUrl: string

test.describe('API testing', () => {
  test.beforeAll(async () => {
    server = http.createServer((req, res) => {
      if (req.url === '/posts/1' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            userId: 1,
            id: 1,
            title: 'sample title',
            body: 'sample body',
          }),
        )
        return
      }

      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Not Found' }))
    })

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const address = server.address()
        if (address && typeof address !== 'string') {
          apiBaseUrl = `http://127.0.0.1:${address.port}`
        }
        resolve()
      })
    })
  })

  test.afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error)
          return
        }
        resolve()
      })
    })
  })

  test('GET /posts/1 returns a valid post payload', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/posts/1`)

    expect(response.ok()).toBeTruthy()

    const body = await response.json()

    expect(body).toMatchObject({
      userId: expect.any(Number),
      id: 1,
      title: expect.any(String),
      body: expect.any(String),
    })
  })
})
