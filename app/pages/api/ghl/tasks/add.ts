export default async function handler(req, res) {
  const { contactId, title } = req.body;

  const result = await fetch(`https://rest.gohighlevel.com/v1/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contactId,
      title,
      status: 'open', // or "in progress", "completed", etc.
    }),
  });

  const data = await result.json();
  res.status(200).json(data);
}