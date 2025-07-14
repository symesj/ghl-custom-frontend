const GHL_API_KEY = process.env.GHL_API_KEY as string;

export async function fetchNotesForContact(contactId: string, apiKey = GHL_API_KEY) {
  try {
    const res = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return data.notes || [];
  } catch (err) {
    console.error('❌ Failed to fetch notes:', err);
    return [];
  }
}

export async function fetchTasks(apiKey = GHL_API_KEY) {
  try {
    const res = await fetch(`https://rest.gohighlevel.com/v1/tasks`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return data.tasks || [];
  } catch (err) {
    console.error('❌ Failed to fetch tasks:', err);
    return [];
  }
}

export async function createNoteForContact(contactId: string, body: string, apiKey = GHL_API_KEY) {
  try {
    await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body }),
    });
  } catch (err) {
    console.error('❌ Failed to create note:', err);
  }
}

export async function createTaskForContact(contactId: string, title: string, apiKey = GHL_API_KEY) {
  try {
    await fetch(`https://rest.gohighlevel.com/v1/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactId,
        title,
        status: 'not started',
      }),
    });
  } catch (err) {
    console.error('❌ Failed to create task:', err);
  }
}
