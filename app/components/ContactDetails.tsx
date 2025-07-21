'use client';

import { useEffect, useState } from 'react';
import { updateContact } from '@/lib/ghl';

function linkify(text: string) {
  const urlRegex = /(https?:\/\/\S+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

function renderNoteBody(body: string) {
  const lines = body.split(/\n/);
  return lines.map((line, idx) => (
    <span key={idx}>
      {linkify(line)}
      {idx < lines.length - 1 && <br />}
    </span>
  ));
}

type Props = {
  contactId: string;
  apiKey: string;
};

export default function ContactDetails({ contactId, apiKey }: Props) {
  const [contact, setContact] = useState<any | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    type: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setForm({
          firstName: cData.contact.firstName || '',
          lastName: cData.contact.lastName || '',
          email: cData.contact.email || '',
          phone: cData.contact.phone || '',
          company: cData.contact.company || '',
          type: cData.contact.type || '',
        });
        setNotes(nData.notes || []);
        setTasks(tData.tasks || []);
      } catch (err) {
        console.error('Error loading contact details:', err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (contactId && apiKey) fetchData();
  }, [contactId, apiKey]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateContact(contactId, form, apiKey);
      await fetchData();
      setEditMode(false);
    } catch (err: any) {
      setError('Failed to update contact');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-400 text-sm">Loading contact details…</div>;

  if (!contact) return <div className="text-red-500">Failed to load contact</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold mb-2">
          👤 {contact.firstName} {contact.lastName}
        </h2>
        <button
          onClick={() => {
            setEditMode((e) => !e);
            setError(null);
          }}
          className="text-blue-400 underline"
        >
          {editMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {editMode ? (
        <div className="space-y-2 mb-4">
          <input
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <input
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <input
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <input
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Customer type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      ) : (
        <div className="space-y-1 mb-4">
          <p>
            <strong>Email:</strong> {contact.email}
          </p>
          <p>
            <strong>Phone:</strong> {contact.phone}
          </p>
          <p>
            <strong>Company:</strong> {contact.company}
          </p>
          {contact.type && (
            <p>
              <strong>Customer Type:</strong> {contact.type}
            </p>
          )}
          <p>
            <strong>Created At:</strong>{' '}
            {new Date(contact.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Notes */}
      <h3 className="mt-4 font-semibold">📝 Notes</h3>
      {notes.length ? (
        <ul className="list-disc list-inside space-y-1">
          {notes.map((n) => (
            <li key={n.id}>{renderNoteBody(n.body)}</li>
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