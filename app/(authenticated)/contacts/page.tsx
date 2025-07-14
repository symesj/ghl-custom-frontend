'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/firebase';
import {
  fetchNotesForContact,
  fetchTasks,
  createNoteForContact,
  createTaskForContact,
} from '@/lib/ghlApi';

interface Task {
  id: string;
  title: string;
  status: string;
  contactId: string;
}

interface Note {
  id: string;
  body: string;
  createdAt: string;
}

export default function ContactDetailsPage() {
  const params = useParams();
  const contactId = params?.id as string;

  const auth = getAuth(app);
  const db = getFirestore(app);

  const [contact, setContact] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user || !contactId) {
        console.warn("⛔ No user or contact ID");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const data = userDoc.data();
      const apiKey = data?.ghlApiKey;

      if (!apiKey) {
        console.error("❌ Missing GHL API Key.");
        return;
      }

      setRole(data?.role || "user");

      const res = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("❌ Contact fetch failed:", res.status);
        return;
      }

      const contactData = await res.json();
      setContact(contactData.contact);
      setForm(contactData.contact);

      const notesData = await fetchNotesForContact(contactId, apiKey);
      const allTasks = await fetchTasks(apiKey);
      const filteredTasks = allTasks.filter((t: Task) => t.contactId === contactId);

      setNotes(notesData);
      setTasks(filteredTasks);
    };

    const unsubscribe = onAuthStateChanged(auth, () => fetchData());
    return () => unsubscribe();
  }, [contactId]);

  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const apiKey = userDoc.data()?.ghlApiKey;

    await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    alert('✅ Contact updated.');
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const user = auth.currentUser;
    const userDoc = await getDoc(doc(db, 'users', user!.uid));
    const apiKey = userDoc.data()?.ghlApiKey;

    await createNoteForContact(contactId, newNote, apiKey);
    const updatedNotes = await fetchNotesForContact(contactId, apiKey);
    setNotes(updatedNotes);
    setNewNote('');
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const user = auth.currentUser;
    const userDoc = await getDoc(doc(db, 'users', user!.uid));
    const apiKey = userDoc.data()?.ghlApiKey;

    await createTaskForContact(contactId, newTask, apiKey);
    const allTasks = await fetchTasks(apiKey);
    const filteredTasks = allTasks.filter((t: Task) => t.contactId === contactId);

    setTasks(filteredTasks);
    setNewTask('');
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8">
        <Link href="/contacts" className="text-blue-400 underline mb-6 inline-block">
          ← Back to Contacts
        </Link>

        <h1 className="text-3xl font-bold mb-6">👤 Contact Details</h1>

        {contact ? (
          <div className="space-y-4 max-w-xl">
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 text-black rounded"
              placeholder="Name"
            />
            <input
              type="email"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2 text-black rounded"
              placeholder="Email"
            />
            <input
              type="text"
              value={form.phone || ''}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2 text-black rounded"
              placeholder="Phone"
            />
            <button
              onClick={handleUpdate}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <p>Loading contact...</p>
        )}

        {/* 📝 Notes */}
        <h2 className="text-2xl font-bold mt-10 mb-4">📝 Notes</h2>
        <div className="space-y-3 mb-6">
          <textarea
            rows={3}
            className="w-full p-2 text-black rounded"
            placeholder="Add new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button
            onClick={handleAddNote}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Note
          </button>
        </div>

        {notes.length > 0 ? (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li key={note.id} className="bg-gray-800 p-3 rounded shadow">
                <p className="text-sm text-gray-300">{note.body}</p>
                <p className="text-xs text-gray-500 text-right">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No notes found.</p>
        )}

        {/* ✅ Tasks */}
        <h2 className="text-2xl font-bold mt-10 mb-4">✅ Tasks</h2>
        <div className="space-y-3 mb-6">
          <input
            type="text"
            className="w-full p-2 text-black rounded"
            placeholder="New task title..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            onClick={handleAddTask}
            className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700"
          >
            ➕ Add Task
          </button>
        </div>

        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="bg-gray-800 p-3 rounded shadow">
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-gray-400">{task.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No tasks found.</p>
        )}
      </main>
    </div>
  );
}
