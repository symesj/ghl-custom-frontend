'use client';

import { useEffect, useState } from 'react';

type Props = {
  contactId: string;
  apiKey: string;
};

export default function ContactDetails({ contactId, apiKey }: Props) {
  const [contact, setContact] = useState<any | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cRes, nRes, tRes] = await Promise.all([
          fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}`, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`https://rest.gohighlevel.com/v1/tasks?contactId=${contactId}`, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        if (!cRes.ok) throw new Error('Failed to fetch contact');

        const cData = await cRes.json();
        const nData = nRes.ok ? await nRes.json() : { notes: [] };
        const tData = tRes.ok ? await tRes.json() : { tasks: [] };

        setContact(cData.contact);
        setNotes(nData.notes || []);
        setTasks(tData.tasks || []);
      } catch (err) {
        console.error('Error loading contact details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (contactId && apiKey) fetchData();
  }, [contactId, apiKey]);

  if (loading) return <div className="text-gray-400 text-sm">Loading contact details…</div>;

  if (!contact) return <div className="text-red-500">Failed to load contact</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">👤 {contact.firstName} {contact.lastName}</h2>
      <p><strong>Email:</strong> {contact.email}</p>
      <p><strong>Phone:</strong> {contact.phone}</p>
      <p><strong>Company:</strong> {contact.company}</p>
      {contact.type && <p><strong>Customer Type:</strong> {contact.type}</p>}
      <p><strong>Created At:</strong> {new Date(contact.createdAt).toLocaleDateString()}</p>

      {/* Notes */}
      <h3 className="mt-4 font-semibold">📝 Notes</h3>
      {notes.length ? (
        <ul className="list-disc list-inside space-y-1">
          {notes.map((n) => (
            <li key={n.id}>{n.body}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">No notes found.</p>
      )}

      {/* Tasks */}
      <h3 className="mt-4 font-semibold">✅ Tasks</h3>
      {tasks.length ? (
        <ul className="list-disc list-inside space-y-1">
          {tasks.map((t) => (
            <li key={t.id}>{t.title} – {t.status}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">No tasks found.</p>
      )}
    </div>
  );
}