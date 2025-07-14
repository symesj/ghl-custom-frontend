export default async function handler(req, res) {
  const { contactId, body } = req.body;

  const result = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body }),
  });

  const data = await result.json();
  res.status(200).json(data);
}