import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { contactId } = req.query;

  try {
    const url = contactId
      ? `https://rest.gohighlevel.com/v1/tasks?contactId=${contactId}`
      : `https://rest.gohighlevel.com/v1/tasks`;

    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await result.json();
    res.status(200).json(data.tasks || []);
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}
