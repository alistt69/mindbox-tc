import React from "react";
import TodoItem from "@/pages/main/components/todos/item";
import classes from "./classes.module.scss";

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
        <>
            {todos.length ? (
                <ul className={classes.list_container}>
                    {todos.map(todo => (
                        <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} updateTodo={updateTodo} />
                    ))}
                </ul>
            ) : (
                <div className={classes.no_data_attribute}>nothing here yet!</div>
            )}
        </>
    );
};

export default TodoList;