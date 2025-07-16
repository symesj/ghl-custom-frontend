'use client';

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const stageMap: Record<string, string> = {
  "VBLlssS1ZJKLCVG9nDkY": "1. Leads",
  "J1xtrshb0WvfQ6bU5S9r": "2. Customer Items update",
  "NWddjhqkylOnKDydEipD": "3. Shipping Quote",
  "bQ48XnOIkMH69oKcA2oL": "4. Shipping Quote Complete",
  "xG4nNgZfDnLMcHv2P3MH": "5. Quote Approval Pending",
  "SCkJrA3SmLTYYR2ELQ7S": "6. Quote Approved",
  "0YFVvXZhlW7pJQQbHj8m": "7. Currency Quote Required",
  "EY5ZBS2zJ2QuBTIF3MT4": "7.1 Irregularities",
  "c5WjCyBe9Z5lDBovp3r3": "8. Quote",
  "UFLUZVhJDzRxrmcRjQBg": "9. Follow up",
  "2qZXtyCBYTRTSJAMaRIp": "9.1 Multi Opportunities",
  "whAnUNijYbkzQlQYi1qs": "9.2 CHASE by phone",
  "Z4X8FbovUnxU5dAE9qMr": "10. Money Transfer",
  "8xmdpOdKJ7a7abY7xSGz": "11. Order for Dispatch",
  "SyoGg6c71k2ErPGpFex6": "12. Dispatched",
  "9mXSwFoF6aEBSByYjMOn": "13. In Transit",
  "CFVhMEFVmXilG8nIpZKu": "14. Exceptions",
  "5SBqtXfpw1TXttEv4gdv": "15. Delivered",
};

export default function OpportunitiesPage() {
  const [grouped, setGrouped] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);
        const apiKey = userDoc.data()?.ghlApiKey;
        if (apiKey) fetchOpportunities(apiKey);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const user = auth.currentUser;
      if (!user) return;
      getDoc(doc(db, "users", user.uid)).then((userDoc) => {
        const apiKey = userDoc.data()?.ghlApiKey;
        if (apiKey) fetchOpportunities(apiKey);
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchOpportunities = async (apiKey: string) => {
    try {
      const res = await fetch(
        "https://genie.entrepreneurscircle.org/v2/location/KJN4DBbti7aORk3MpgnU/opportunities/list",
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      const allOpportunities = data.opportunities || [];

      const groupedData: Record<string, any[]> = {};
      for (const stageId of Object.keys(stageMap)) {
        groupedData[stageId] = [];
      }

      allOpportunities.forEach((opp: any) => {
        const stage = opp.stageId;
        if (!groupedData[stage]) groupedData[stage] = [];
        groupedData[stage].push(opp);
      });

      setGrouped(groupedData);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    if (sourceStage === destStage && source.index === destination.index) return;

    const sourceItems = Array.from(grouped[sourceStage]);
    const [moved] = sourceItems.splice(source.index, 1);
    const destItems = Array.from(grouped[destStage]);
    destItems.splice(destination.index, 0, moved);

    setGrouped({
      ...grouped,
      [sourceStage]: sourceItems,
      [destStage]: destItems,
    });

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const apiKey = userDoc.data()?.ghlApiKey;

      await fetch(`https://rest.gohighlevel.com/v1/opportunities/${moved.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stageId: destStage }),
      });

      console.log("✅ Opportunity pipeline stage updated in GoHighLevel");
    } catch (err) {
      console.error("❌ Failed to update stage in GHL:", err);
      alert("Failed to update opportunity stage in GoHighLevel.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 overflow-x-auto">
      <h1 className="text-3xl font-bold mb-6">🧲 Opportunities Pipeline</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 min-w-max">
            {Object.entries(grouped).map(([stageId, items]) => (
              <Droppable droppableId={stageId} key={stageId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-800 p-4 rounded w-64 flex-shrink-0"
                  >
                    <h2 className="text-lg font-semibold mb-3">
                      {stageMap[stageId] || "Unknown"}
                    </h2>
                    {items.map((opp, index) => (
                      <Draggable
                        key={opp.id}
                        draggableId={opp.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-700 p-3 rounded mb-3 shadow"
                          >
                            <div className="font-semibold">{opp.name}</div>
                            <div className="text-sm text-gray-400">
                              Value: £{opp.value}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}

