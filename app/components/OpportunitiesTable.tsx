'use client';

import { useEffect, useState } from 'react';
import { fetchOpportunities, type Opportunity } from '@/lib/ghl';

export default function OpportunitiesTable() {
  const [data, setData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GHL_API_KEY || '';
    if (!apiKey) return;

    fetchOpportunities(apiKey)
      .then((opps) => setData(opps))
      .catch((err) => console.error('Failed to load opportunities:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading opportunities...</div>;

  return (
    <table className="min-w-full text-left text-sm text-white">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b border-gray-700">Name</th>
          <th className="px-4 py-2 border-b border-gray-700">Status</th>
          <th className="px-4 py-2 border-b border-gray-700">Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((opp) => (
          <tr key={opp.id} className="even:bg-gray-800">
            <td className="px-4 py-2 border-b border-gray-700">{opp.name}</td>
            <td className="px-4 py-2 border-b border-gray-700">{opp.status}</td>
            <td className="px-4 py-2 border-b border-gray-700">£{opp.value ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
