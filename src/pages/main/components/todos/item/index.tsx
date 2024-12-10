import React, { useEffect, useState } from 'react';
import { format, parseISO, isPast, differenceInMinutes, differenceInHours } from 'date-fns';

interface TodoItemProps {
    todo: {
        id: number;
        text: string;
        completed: boolean;
        dueDate?: string;
    };
    toggleTodo: (id: number) => void;
    updateTodo: (id: number, text: string, dueDate?: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, updateTodo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [editDueDate, setEditDueDate] = useState(todo.dueDate ? format(parseISO(todo.dueDate), 'yyyy-MM-dd') : '');
    const [editDueTime, setEditDueTime] = useState(todo.dueDate ? format(parseISO(todo.dueDate), 'HH:mm') : '');
    const [hours, setHours] = useState<number | null>(null);
    const [minutes, setMinutes] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (todo.dueDate) {
                const now = new Date();
                const dueDate = parseISO(todo.dueDate);
                const diffHours = differenceInHours(dueDate, now);
                const diffMinutes = differenceInMinutes(dueDate, now) % 60;
                setHours(Math.abs(diffHours));
                setMinutes(Math.abs(diffMinutes));
            }
        }, 300);

        return () => clearInterval(interval);
    }, [todo.dueDate]);

    const handleSave = () => {
        const newDueDate = editDueDate && editDueTime ? `${editDueDate}T${editDueTime}` : undefined;
        updateTodo(todo.id, editText, newDueDate);
        setIsEditing(false);
    };

    return (
        <li style={{ color: isPast(parseISO(todo.dueDate || '')) && !todo.completed ? 'red' : 'black' }}>
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                    <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                    />
                    <input
                        type="time"
                        value={editDueTime}
                        onChange={(e) => setEditDueTime(e.target.value)}
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : (
                <>
                    <span>{todo.text}</span>
                    {
                        todo.dueDate &&
                        hours !== null &&
                        minutes !== null &&
                        <span>
                            {' '} | Due: {format(parseISO(todo.dueDate), 'yyyy-MM-dd HH:mm')} |

                            {isPast(parseISO(todo.dueDate)) ? (
                                <span>
                                    Overdue by <span className="hours">{hours.toString().padStart(2, '0')}h</span> : <span className="minutes">{minutes.toString().padStart(2, '0')}m</span>
                                </span>
                            ) : (
                                <span>
                                    Time left: <span className="hours">{hours.toString().padStart(2, '0')}h</span> : <span className="minutes">{minutes.toString().padStart(2, '0')}</span>m
                                </span>
                            )}
                        </span>
                    }
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={() => toggleTodo(todo.id)}>
                        {todo.completed ? 'Undo' : 'Complete'}
                    </button>
                </>
            )}
        </li>
    );
};

export default TodoItem;