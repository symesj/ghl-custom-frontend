"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { app } from "@/firebase";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function UserChart() {
  const [monthlyData, setMonthlyData] = useState<number[]>(new Array(6).fill(0));

  useEffect(() => {
    const db = getFirestore(app);

    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const monthCounts = new Array(6).fill(0);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const createdAt = (data.createdAt as Timestamp)?.toDate?.();

        if (createdAt) {
          const monthDiff = new Date().getMonth() - createdAt.getMonth();
          if (monthDiff >= 0 && monthDiff < 6) {
            monthCounts[monthDiff]++;
          }
        }
      });

      setMonthlyData(monthCounts);
    });

    return () => unsub();
  }, []);

  const labels = ["2mo ago", "1mo ago", "Last Month", "This Month", "", ""].slice(-6);
  const data = {
    labels,
    datasets: [
      {
        label: "New Users",
        data: monthlyData,
        backgroundColor: "rgba(99, 102, 241, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "User Growth (Realtime)" },
    },
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mt-10">
      <Bar data={data} options={options} />
    </div>
  );
}
