import React from "react";
import TodoItem from "@/pages/main/components/todos/item";

interface TodoListProps {
    todos: {
        id: number;
        text: string;
        completed: boolean;
        dueDate?: string;
    }[];
    toggleTodo: (id: number) => void;
    updateTodo: (id: number, text: string, dueDate?: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo, updateTodo }) => {
    return (
        <ul>
            {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} updateTodo={updateTodo} />
            ))}
        </ul>
    );
};

export default TodoList;