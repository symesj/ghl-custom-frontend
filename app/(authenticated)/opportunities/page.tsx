'use client';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/firebase';
import OpportunitiesTable from '@/components/OpportunitiesTable';

export default function OpportunitiesPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const load = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, 'users', user.uid));
      const key = snap.data()?.ghlApiKey;
      if (key) setApiKey(key);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!apiKey) return <p className="text-red-500">Missing API key.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Opportunities</h1>
      <OpportunitiesTable apiKey={apiKey} />
    </div>
  );
}
