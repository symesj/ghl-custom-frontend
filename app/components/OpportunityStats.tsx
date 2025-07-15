'use client';

import { useEffect, useState } from 'react';
import { fetchOpportunities } from '@/lib/ghl';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/firebase';

export default function OpportunityStats() {
  const [opps, setOpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const apiKey = userDoc.data()?.ghlApiKey;
      if (!apiKey) return;

      const data = await fetchOpportunities(apiKey);
      setOpps(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <p>Loading opportunities...</p>;

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl font-bold mb-2">🎯 Opportunities</h2>
      <p className="text-sm text-gray-300">Total: {opps.length}</p>
      <ul className="mt-2 space-y-1 text-sm text-gray-400 max-h-[200px] overflow-y-auto">
        {opps.slice(0, 10).map((o) => (
          <li key={o.id}>
            {o.name} — <span className="text-green-400">{o.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}