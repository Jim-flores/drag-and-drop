"use client";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

interface Task {
  id: string;
  description: string;
  kanbanId: string;
  order: number;
}

interface Kanban {
  id: string;
  tasks: Task[];
}

interface KanbanContextProps {
  data: Kanban[];
  tasks: Task[];
  addKanban: () => void;
  deleteKanban: (id: string) => void;
  addTask: (kanbanId: string, order: number) => void;
  deleteTask: (id: string) => void;
  columnsId: string[];
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  // onDragOver: (event: DragOverEvent) => void;
  activeTask: Task | null;
  editTask: (id: string, description: string) => void;
}

const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<Kanban[]>([
    {
      id: "1asdv123cdf",
      tasks: [],
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const columnsId = useMemo(
    () => data.map(({ id }) => id),
    [data]
  );
  const addKanban = () => {
    setData([...data, { id: uuidv4(), tasks: [] }]);
  };

  const deleteKanban = (id: string) => {
    setData(data.filter((item) => item.id !== id));
  };

  const addTask = (kanbanId: string, order: number) => {
    const newTask = { id: uuidv4(), description: "", kanbanId, order };
    setTasks([...tasks, newTask]);

    setData((prevData) =>
      prevData.map((item) => {
        if (item.id === kanbanId) {
          return {
            ...item,
            tasks: [...item.tasks, newTask],
          };
        }
        return item;
      })
    );
  };
  const editTask = (id: string ,descripiton: string) => {
    setTasks(tasks.map(task => task.id === id ? {...task, description: descripiton} : task))
    setData((prevData) =>
      prevData.map((item) => {
        return {
          ...item,
          tasks: item.tasks.map(task => task.id === id ? {...task, description: descripiton} : task),
        };
      })
    );
  }
    const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };
  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isOverColumn = over.data.current?.type === 'Item';
    const isOverTask = over.data.current?.type === 'Task';
    setTasks(tasks => {
      const activeIndex = tasks.findIndex(task => task.id === activeId);
      let newTasks = [...tasks];
      if (isOverTask) {
        const overIndex = tasks.findIndex(task => task.id === overId);
        newTasks[activeIndex].kanbanId = tasks[overIndex].kanbanId;
        newTasks = arrayMove(newTasks, activeIndex, overIndex);
      } else if (isOverColumn) {
        newTasks[activeIndex].kanbanId = overId as string;
        newTasks.splice(activeIndex, 1);
        newTasks.push(tasks[activeIndex]);
      }

      return newTasks;
    });
  };
  // const onDragOver = (event: DragOverEvent) => {
  //   const { active, over } = event;
  //   if (!over) return;
  //   const activeId = active.id;
  //   const overId = over.id;
  //   if (activeId === overId) return;
  //   const isActiveTask = active.data.current?.type === 'Task';
  //   const isOverTask = over.data.current?.type === 'Task';
  //   if (!isActiveTask) return;

  //   if (isActiveTask && isOverTask) {
  //     setTasks(tasks => {
  //       const activeIndex = tasks.findIndex(task => task.id === activeId);
  //       const overIndex = tasks.findIndex(task => task.id === overId);
  //       tasks[activeIndex].kanbanId = tasks[overIndex].kanbanId;
  //       return arrayMove(tasks, activeIndex, overIndex);
  //     });
  //   }}
  return (
    <KanbanContext.Provider
      value={{ data, tasks, addKanban, deleteKanban, addTask, deleteTask, columnsId, onDragStart, activeTask, onDragEnd, editTask }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban debe ser usado dentro de un KanbanProvider");
  }
  return context;
};
