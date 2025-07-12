"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { app } from "@/firebase";

export default function SystemLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const db = getFirestore(app);
    const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const logData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()?.toLocaleString(),
        id: doc.id,
      }));
      setLogs(logData);
    });

    return () => unsub();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-md mt-10 max-h-60 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-3">System Logs</h3>
      <ul className="text-sm space-y-2">
        {logs.map((log) => (
          <li key={log.id}>
            <span className="font-medium">{log.event}</span> –{" "}
            <em className="text-gray-500">{log.timestamp}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
