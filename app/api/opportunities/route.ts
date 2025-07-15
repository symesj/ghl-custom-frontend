import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('ghlapikey');
  const pipelineId = req.nextUrl.searchParams.get('pipelineId');

  if (!apiKey) return new Response('Missing GHL API key', { status: 400 });

  const url = new URL('https://rest.gohighlevel.com/v1/opportunities');
  if (pipelineId) url.searchParams.set('pipelineId', pipelineId);
  url.searchParams.set('limit', '100');

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
    console.error('❌ Error fetching opportunities:', err);
    return new Response('Failed to fetch opportunities', { status: 500 });
  }
}