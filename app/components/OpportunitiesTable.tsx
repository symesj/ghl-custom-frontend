'use client';

import useOpportunities from '@/hooks/useOpportunities';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import ContactModal from '@/components/ContactModal';

// Lazy load contact details for modal
const ContactDetails = dynamic(() => import('@/components/ContactDetails'), {
  ssr: false,
});

type Props = {
  apiKey: string;
  pipelineId?: string;
};

export default function OpportunitiesTable({ apiKey, pipelineId }: Props) {
  const { opportunities, loading, error } = useOpportunities(apiKey, pipelineId);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  if (loading) return <p className="text-gray-400">Loading opportunities...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!opportunities.length) return <p>No opportunities found.</p>;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Value</th>
            <th className="px-4 py-2">Contact</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp) => (
            <tr key={opp.id} className="border-b border-gray-800">
              <td className="px-4 py-2">{opp.name || 'Unnamed'}</td>
              <td className="px-4 py-2">{opp.status}</td>
              <td className="px-4 py-2">£{opp.value ?? 0}</td>
              <td className="px-4 py-2">
                {opp.contactId ? (
                  <button
                    onClick={() => setSelectedContactId(opp.contactId || null)}
                    className="text-blue-400 underline"
                  >
                    View Contact
                  </button>
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <ContactModal
        isOpen={!!selectedContactId}
        onCloseAction={() => setSelectedContactId(null)}
        contactId={selectedContactId ?? ''}
        ContactDetailComponent={
          selectedContactId ? (
            <ContactDetails contactId={selectedContactId} apiKey={apiKey} />
          ) : null
        }
      />
    </>
  );
}
