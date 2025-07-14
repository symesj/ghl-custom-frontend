import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { contactId, title } = req.body;

  try {
    await fetch(`https://rest.gohighlevel.com/v1/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactId,
        title,
        status: 'not started',
      }),
    });

    res.status(200).json({ message: 'Task created' });
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ error: 'Failed to create task' });
  }
}
