type KanbanProps = {
    id: string,
    tasks: TasksProps[] | [],
}
type TasksProps = {
    id: string,
    description: string
    kanbanId: string
    order: number
}