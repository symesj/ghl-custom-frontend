import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { contactId, body } = req.body;

  try {
    await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body }),
    });

    res.status(200).json({ message: 'Note added' });
  } catch (err) {
    console.error("❌ Error adding note:", err);
    res.status(500).json({ error: 'Failed to add note' });
  }
}
