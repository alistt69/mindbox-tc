export interface ITodoItem {
    id: number;
    text: string;
    completed: boolean;
    dueDate?: string;
    completedAt?: string;
}

export type TodoArray = ITodoItem[]