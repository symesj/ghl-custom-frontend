// Agency-level API key used when a user key is not provided
const GHL_API_KEY =
  process.env.NEXT_PUBLIC_GHL_API_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoicmFYaFczOUdsUURDeUJnM0dHeUgiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3NTMxNzk4MDg5ODMsInN1YiI6Imo4YUJsb2JzbUlqWE1HMzcwRlF2In0.7Ck8mnMlTmxMczHbeDyKkj0XLPMV2r-dlZ4msPq1NgE';

import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from '@/firebase';

export type Contact = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type Opportunity = {
  id: string;
  name: string;
  status: string;
  value: number;
};

export type Task = {
  id: string;
  title: string;
  status: string;
  contactId: string;
};

export type Note = {
  id: string;
  body: string;
  contactId: string;
};

// 🔁 SYNC CONTACTS TO FIRESTORE
export async function syncContactsToFirestore() {
  const db = getFirestore(app);
  const contacts = await getAllContacts();

  const syncPromises = contacts.map((contact: Contact) => {
    const contactRef = doc(db, "ghl_contacts", contact.id);
    return setDoc(contactRef, contact, { merge: true });
  });

  try {
    await Promise.all(syncPromises);
    console.log("✅ Synced GHL contacts to Firestore.");
  } catch (err) {
    console.error("❌ Error syncing contacts to Firestore:", err);
  }
}

// 📥 FETCH ALL CONTACTS
export async function getAllContacts(apiKey = GHL_API_KEY): Promise<Contact[]> {
  let allContacts: Contact[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const res = await fetch(`https://rest.gohighlevel.com/v1/contacts/?limit=100&page=${page}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
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
    console.error("❌ Failed to fetch all contacts:", err);
    return [];
  }
}

// 📓 FETCH NOTES FOR CONTACT
export async function fetchNotesForContact(contactId: string, apiKey = GHL_API_KEY): Promise<Note[]> {
  try {
    const res = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data.notes || [];
  } catch (err) {
    console.error("❌ Failed to fetch notes:", err);
    return [];
  }
}

// 💼 FETCH OPPORTUNITIES
export async function fetchOpportunities(apiKey = GHL_API_KEY): Promise<Opportunity[]> {
  try {
    const res = await fetch("https://rest.gohighlevel.com/v1/opportunities/", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data.opportunities || [];
  } catch (err) {
    console.error("❌ Failed to fetch opportunities:", err);
    return [];
  }
}

// ✅ FETCH TASKS
export async function fetchTasks(apiKey = GHL_API_KEY): Promise<Task[]> {
  try {
    const res = await fetch("https://rest.gohighlevel.com/v1/tasks", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data.tasks || [];
  } catch (err) {
    console.error("❌ Failed to fetch tasks:", err);
    return [];
  }
}

// 📝 CREATE NOTE
export async function createNoteForContact(contactId: string, body: string, apiKey = GHL_API_KEY): Promise<void> {
  try {
    await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    });
  } catch (err) {
    console.error("❌ Failed to create note:", err);
  }
}

// 🗒️ CREATE TASK
export async function createTaskForContact(contactId: string, title: string, apiKey = GHL_API_KEY): Promise<void> {
  try {
    await fetch("https://rest.gohighlevel.com/v1/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactId,
        title,
        status: "not started",
      }),
    });
  } catch (err) {
    console.error("❌ Failed to create task:", err);
  }
}

// ✏️ UPDATE CONTACT
export async function updateContact(
  contactId: string,
  data: Partial<Contact>,
  apiKey = GHL_API_KEY
): Promise<void> {
  try {
    const res = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to update contact: ${res.status}`);
    }
  } catch (err) {
    console.error("❌ Failed to update contact:", err);
    throw err;
  }
}