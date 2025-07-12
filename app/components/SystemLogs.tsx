"use client";

import { useEffect, useState } from "react";

type LogEntry = {
  id: number;
  message: string;
  timestamp: string;
};

export default function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Mocked logs — replace with real-time Firestore logs if needed
    const mockLogs = [
      { id: 1, message: "User Jon logged in", timestamp: "2025-07-12 08:15" },
      { id: 2, message: "User updated settings", timestamp: "2025-07-12 09:00" },
      { id: 3, message: "Admin deleted record", timestamp: "2025-07-12 10:30" },
    ];
    setLogs(mockLogs);
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">System Logs</h2>
      <ul className="space-y-3">
        {logs.map((log) => (
          <li key={log.id} className="border-b border-gray-700 pb-2">
            <p className="text-sm">{log.message}</p>
            <p className="text-xs text-gray-400">{log.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
