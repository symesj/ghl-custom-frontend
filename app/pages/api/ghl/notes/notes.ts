import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { contactId } = req.query;

  try {
    const result = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`, {
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await result.json();
    res.status(200).json(data.notes || []);
  } catch (err) {
    console.error("❌ Error fetching notes:", err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
}
