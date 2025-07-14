'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const ContactDetailsPage = () => {
  const { id: contactId } = useParams();

  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  // Fetch Notes
  useEffect(() => {
    if (!contactId) return;
    const fetchNotes = async () => {
      const res = await fetch(`/api/ghl/notes?contactId=${contactId}`);
      const data = await res.json();
      setNotes(data.notes || []);
    };
    fetchNotes();
  }, [contactId]);

  // Fetch Tasks
  useEffect(() => {
    if (!contactId) return;
    const fetchTasks = async () => {
      const res = await fetch(`/api/ghl/tasks?contactId=${contactId}`);
      const data = await res.json();
      setTasks(data.tasks || []);
    };
    fetchTasks();
  }, [contactId]);

  // Add Note
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await fetch(`/api/ghl/notes/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, body: newNote }),
    });
    setNewNote('');
    const res = await fetch(`/api/ghl/notes?contactId=${contactId}`);
    const data = await res.json();
    setNotes(data.notes || []);
  };

  // Add Task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await fetch(`/api/ghl/tasks/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, title: newTask }),
    });
    setNewTask('');
    const res = await fetch(`/api/ghl/tasks?contactId=${contactId}`);
    const data = await res.json();
    setTasks(data.tasks || []);
  };

  return (
    <div className="p-6">
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
          {notes.map((note: any) => (
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
          {tasks.map((task: any) => (
            <li key={task.id} className="bg-gray-800 p-3 rounded shadow">
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-gray-400">{task.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No tasks found.</p>
      )}
    </div>
  );
};

export default ContactDetailsPage;