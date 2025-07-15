// File: app/api/contacts/route.ts

import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const startAfter = searchParams.get('startAfter');
  const startAfterId = searchParams.get('startAfterId');
  const apiKey = req.headers.get('ghlapikey');

  if (!apiKey) {
    return new Response('Missing GHL API key', { status: 400 });
  }

  const url = new URL('https://rest.gohighlevel.com/v1/contacts');
  url.searchParams.append('limit', '100');
  if (startAfter) url.searchParams.append('startAfter', startAfter);
  if (startAfterId) url.searchParams.append('startAfterId', startAfterId);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error('❌ Failed to proxy contacts:', err);
    return new Response('Failed to fetch contacts', { status: 500 });
  }
}