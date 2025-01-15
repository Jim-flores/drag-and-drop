"use client";
import KanbanTasks from "@/components/KanbanTasks";
import Tasks from "@/components/Tasks";
import { useKanban } from "@/hooks/KanbanContext";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
export default function Home() {
  // console.log('page')
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const {
    data,
    tasks,
    addKanban,
    deleteKanban,
    addTask,
    columnsId,
    activeTask,
    onDragStart,
    onDragEnd,
    // onDragOver
  } = useKanban();
  const sensor = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <div className="w-full flex items-center justify-center gap-4 z-10">
        <h1 className="t-color text-4xl font-bold">Drag and Drop</h1>
        <button
          onClick={addKanban}
          className="border-2 border-pink-500/25 rounded-md p-2"
        >
          <h1 className="t-color">Add Column</h1>
        </button>
      </div>
      <div className="w-2/3 flex gap-2 overflow-x-auto items-center scrollbar scrollbar-thumb-pink-500">
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          sensors={sensor}
        >
          <SortableContext items={columnsId}>
            {data.map((item) => (
              <KanbanTasks
                key={item.id}
                item={item}
                addTask={addTask}
                deleteKanban={deleteKanban}
                tasks={tasks.filter((task) => task.kanbanId === item.id)}
              />
            ))}
          </SortableContext>
          {isMounted &&
            createPortal(
              <DragOverlay>
                {activeTask && <Tasks task={activeTask} />}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      </div>
    </div>
  );
}
