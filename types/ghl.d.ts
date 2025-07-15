export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add more if you're using them
}

export interface Opportunity {
  id: string;
  name: string;
  status: string;
  value: number;
  // Customize as needed
}

export interface Task {
  id: string;
  title: string;
  status: string;
  contactId?: string;
}

export interface Note {
  id: string;
  body: string;
  contactId: string;
  createdAt: string;
}