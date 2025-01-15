import React, { useMemo } from "react";
import { BiPlus } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Tasks from "./Tasks";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
type KanbanTasksProps = {
  item: KanbanProps;
  addTask: (kanbanId: string, order: number) => void;
  deleteKanban: (id: string) => void;
  tasks: TasksProps[];
};
const KanbanTasks = ({
  item,
  addTask,
  deleteKanban,
  tasks,
}: KanbanTasksProps) => {
  const taskId = useMemo(() => tasks?.map(({ id }) => id), [tasks]);
  const {
    setNodeRef,
    attributes,
    listeners,
    // transform,
    // transition,
    // isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'Item',
      item,
    },
    disabled: true,
  });
  // console.log('kanban')
  return (
    <div className="w-[200px] h-[500px] flex flex-col rounded-md border-pink-500/25 border-2 flex-none">
      <div className="flex w-full h-[30px] rounded-t-md bg-black/15">
        <span
          className="flex justify-center items-center w-1/2 hover:text-black hover:bg-pink-500 cursor-pointer hover:rounded-tl-md text-pink-500 font-bold text-xs"
          onClick={() => addTask(item.id, item.tasks.length + 1)}
        >
          Add Task
          <BiPlus />
        </span>
        <span
          className="flex justify-center items-center w-1/2 hover:text-black hover:bg-pink-500 cursor-pointer hover:rounded-tr-md text-pink-500 font-bold text-xs"
          onClick={() => deleteKanban(item.id)}
        >
          Delete
          <MdDelete className="cursor-pointer" />
        </span>
      </div>
      <div className="bg-black/15 h-[470px] flex flex-col gap-2 p-2 overflow-y-auto scrollbar-none rounded-b-md cursor-default"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      >
      <SortableContext items={taskId}>
        {tasks.map((task) => (
          <Tasks key={task.id} task={task} />
        ))}
      </SortableContext>
      </div>
    </div>
  );
};

export default KanbanTasks;
