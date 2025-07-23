'use client';

import { useEffect, useState } from 'react';

export type Opportunity = {
  id: string;
  contactId?: string;
  name?: string;
  status?: string;
  value?: number;
};

export default function useOpportunities(apiKey?: string, pipelineId?: string) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!apiKey) {
        setOpportunities([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (pipelineId) params.set('pipelineId', pipelineId);

        const res = await fetch(`/api/opportunities?${params.toString()}`, {
          headers: {
            ghlapikey: apiKey,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch opportunities');

        const data = await res.json();
        setOpportunities(data.opportunities || []);
      } catch (err: any) {
        console.error('Failed to load opportunities', err);
        setError(err.message || 'Failed to load opportunities');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [apiKey, pipelineId]);

  return { opportunities, loading, error };
}
