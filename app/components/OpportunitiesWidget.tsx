'use client'
import useOpportunities from '@/hooks/useOpportunities'

type Props = {
  apiKey: string
  pipelineId?: string
}

export default function OpportunitiesWidget({ apiKey, pipelineId }: Props) {
  const { opportunities, loading, error } = useOpportunities(apiKey, pipelineId)

  if (loading) return <p className="text-gray-400">Loading opportunities...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-lg font-semibold mb-2">Opportunities</h2>
      <ul className="space-y-1 text-sm max-h-48 overflow-y-auto text-gray-300">
        {opportunities.map(o => (
          <li key={o.id} className="flex justify-between">
            <span>{o.name || 'Unnamed'}</span>
            <span>{o.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
