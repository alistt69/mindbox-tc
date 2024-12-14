import React from "react";
import { isPast, parseISO } from "date-fns";
import { ITodoItem } from "@/models/todo";
import classes from "./classes.module.scss";

const StatusToggle: React.FC<{ todo: ITodoItem, toggleTodo: (id: number) => void }> = ({ todo, toggleTodo }) => {
    return (
        <div className={classes.status_toggle_container}>
            <button onClick={() => toggleTodo(todo.id)} className={classes.status_toggle} data-testid={`status-toggle-${todo.text}`}>
                <div data-testid={`status-animator-${todo.text}`} className={
                    `${classes.toggle_animator}
                     ${isPast(parseISO(todo.dueDate || '')) && !todo.completed && classes.is_overdue} 
                     ${todo.completed && classes.is_completed}`
                }/>
            </button>
        </div>
    );
};

export default StatusToggle;
