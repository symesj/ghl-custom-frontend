// Default to the agency API key when none is supplied via env
const GHL_API_KEY =
  process.env.GHL_API_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoicmFYaFczOUdsUURDeUJnM0dHeUgiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3NTMxNzk4MDg5ODMsInN1YiI6Imo4YUJsb2JzbUlqWE1HMzcwRlF2In0.7Ck8mnMlTmxMczHbeDyKkj0XLPMV2r-dlZ4msPq1NgE';

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

export async function fetchOpportunities(apiKey: string) {
  try {
    const res = await fetch('https://rest.gohighlevel.com/v1/opportunities/', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return data.opportunities || [];
  } catch (err) {
    console.error('❌ Failed to fetch opportunities:', err);
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

// ✅ New: Get ALL contacts (with pagination)
export async function getAllContacts(apiKey = GHL_API_KEY) {
  let allContacts: any[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const res = await fetch(`https://rest.gohighlevel.com/v1/contacts/?limit=100&page=${page}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.contacts?.length) {
        allContacts.push(...data.contacts);
        page++;
      } else {
        hasMore = false;
      }
    }

    return allContacts;
  } catch (err) {
    console.error('❌ Failed to fetch all contacts:', err);
    return [];
  }
}
