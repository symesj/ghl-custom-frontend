'use client';

import { useEffect, useState } from 'react';

type Props = {
  contactId: string;
  apiKey: string;
};

export default function ContactDetails({ contactId, apiKey }: Props) {
  const [contact, setContact] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch contact');

        const data = await res.json();
        setContact(data.contact);
      } catch (err) {
        console.error('Error loading contact details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (contactId && apiKey) fetchContact();
  }, [contactId, apiKey]);

  if (loading) return <div className="text-gray-400 text-sm">Loading contact details…</div>;

  if (!contact) return <div className="text-red-500">Failed to load contact</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">👤 {contact.firstName} {contact.lastName}</h2>
      <p><strong>Email:</strong> {contact.email}</p>
      <p><strong>Phone:</strong> {contact.phone}</p>
      <p><strong>Company:</strong> {contact.company}</p>
      <p><strong>Created At:</strong> {new Date(contact.createdAt).toLocaleDateString()}</p>
      {/* Add any other fields you care about here */}
    </div>
  );
}