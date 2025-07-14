export default async function handler(req, res) {
  const { contactId } = req.query;

  const result = await fetch(`https://rest.gohighlevel.com/v1/tasks?contactId=${contactId}`, {
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await result.json();
  res.status(200).json({ tasks: data.tasks || [] });
}