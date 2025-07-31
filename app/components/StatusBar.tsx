'use client'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { app } from '@/firebase'

export default function StatusBar() {
  const [email, setEmail] = useState('')
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loadInfo = async () => {
    const auth = getAuth(app)
    setEmail(auth.currentUser?.email || '')
    const db = getFirestore(app)
    const snap = await getDoc(doc(db, 'meta', 'lastSync'))
    if (snap.exists()) setLastSync(snap.data().timestamp)
  }

  const handleSync = async () => {
    setLoading(true)
    await fetch('/api/sync-contacts')
    await loadInfo()
    setLoading(false)
  }

  useEffect(() => {
    loadInfo()
    const interval = setInterval(handleSync, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gray-800 px-4 py-2 flex justify-between items-center text-sm">
      <span className="text-gray-300">{email}</span>
      <span className="text-gray-400">Last Sync: {lastSync ? new Date(lastSync).toLocaleString() : 'never'}</span>
      <button onClick={handleSync} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
        {loading ? 'Syncing...' : 'Sync Now'}
      </button>
    </div>
  )
}
