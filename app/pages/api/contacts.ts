// /pages/api/contacts.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ghlApiKey } = req.headers
  const { startAfter, startAfterId } = req.query

  const url = new URL('https://rest.gohighlevel.com/v1/contacts')
  url.searchParams.append('limit', '100')
  if (startAfter) url.searchParams.append('startAfter', String(startAfter))
  if (startAfterId) url.searchParams.append('startAfterId', String(startAfterId))

  try {
    const ghlRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${ghlApiKey}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await ghlRes.json()
    res.status(ghlRes.status).json(data)
  } catch (err) {
    console.error('[GHL Proxy Error]', err)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
}