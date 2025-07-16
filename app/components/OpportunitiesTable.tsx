'use client';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import useOpportunities, { stageMap } from '@/hooks/useOpportunities';

export default function OpportunitiesTable() {
  const { grouped, loading, onDragEnd } = useOpportunities();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
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
                  {stageMap[stageId] || 'Unknown'}
                </h2>
                {items.map((opp, index) => (
                  <Draggable key={opp.id} draggableId={opp.id} index={index}>
                    {(dragProps) => (
                      <div
                        ref={dragProps.innerRef}
                        {...dragProps.draggableProps}
                        {...dragProps.dragHandleProps}
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
  );
}

