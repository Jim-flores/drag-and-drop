import { useKanban } from "@/hooks/KanbanContext";
import React from "react";
import { MdDelete } from "react-icons/md";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
type TProps = {
  task: TasksProps;
};
const Tasks = ({ task }: TProps) => {
  const { deleteTask, editTask } = useKanban();
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-full h-[100px] bg-pink-900/20 flex-none relative rounded-md"
      />
    );
  }
  return (
    <div
      className="w-full h-[100px] bg-pink-900 box-appear relative cursor-default rounded-md p-2"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <textarea defaultValue={task.description} placeholder={task.description || '...'} className="w-full h-full bg-transparent text-white text-center focus:outline-none cursor-default text-sm scrollbar-none resize-none" onChange={(e) => editTask(task.id, e.target.value)}/>

      <MdDelete
        className="cursor-pointer absolute box-desappear top-0 right-0"
        onClick={() => deleteTask(task.id)}
      />
    </div>
  );
};

export default Tasks;
