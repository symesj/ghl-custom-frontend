export default async function handler(req, res) {
  const { contactId } = req.query;

  const result = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`, {
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await result.json();
  res.status(200).json({ notes: data.notes || [] });
}