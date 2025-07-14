'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/firebase';
import Sidebar from '@/components/Sidebar';
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
  const { id: contactId } = useParams();
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
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const data = userDoc.data();
      setRole(data?.role || 'user');

      // 🔁 Fetch Contact
      const res = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GHL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const contactData = await res.json();
      setContact(contactData.contact);
      setForm(contactData.contact);

      // 🔁 Notes & Tasks
      const notesData = await fetchNotesForContact(contactId as string);
      const allTasks = await fetchTasks();
      const filteredTasks = allTasks.filter((t: Task) => t.contactId === contactId);

      setNotes(notesData);
      setTasks(filteredTasks);
    };

    onAuthStateChanged(auth, fetchData);
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
    await createNoteForContact(contactId as string, newNote);
    const updatedNotes = await fetchNotesForContact(contactId as string);
    setNotes(updatedNotes);
    setNewNote('');
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await createTaskForContact(contactId as string, newTask);
    const allTasks = await fetchTasks();
    const filteredTasks = allTasks.filter((t: Task) => t.contactId === contactId);
    setTasks(filteredTasks);
    setNewTask('');
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar role={role} onLogoutAction={() => {}} />
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

        {/* 📝 Notes Section */}
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

        {/* ✅ Tasks Section */}
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
