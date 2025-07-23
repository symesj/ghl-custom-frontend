export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  type?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  status: string;
  value: number;
  contactId?: string;
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