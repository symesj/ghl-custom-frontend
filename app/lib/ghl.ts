const GHL_API_KEY = process.env.NEXT_PUBLIC_GHL_API_KEY as string;

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type Opportunity = {
  id: string;
  name: string;
  status: string;
  value: number;
};

type Task = {
  id: string;
  title: string;
  status: string;
  contactId: string;
};

type Note = {
  id: string;
  body: string;
  contactId: string;
};

import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "@/firebase";
// import { getAllContacts } from "./ghl"; // Removed to avoid conflict with local declaration

export async function syncContactsToFirestore() {
  const db = getFirestore(app);
  const contacts = await getAllContacts();

  const syncPromises = contacts.map((contact: any) => {
    const contactRef = doc(db, "ghl_contacts", contact.id); // use contact ID as doc ID
    return setDoc(contactRef, contact, { merge: true }); // merge prevents overwriting
  });

  try {
    await Promise.all(syncPromises);
    console.log("✅ Synced GHL contacts to Firestore.");
  } catch (err) {
    console.error("❌ Error syncing contacts to Firestore:", err);
  }
}

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