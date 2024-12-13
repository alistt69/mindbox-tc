import React, { useEffect, useState } from 'react';
import { format, parseISO, isPast, differenceInMinutes, differenceInHours } from 'date-fns';
import { DateTimeType } from "@/pages/main/enums/date-time/index.d";
import { ITodoItem } from "@/models/todo";
import classes from "./classes.module.scss";
import { Modal } from 'antd';
import Form from "@/components/form";
import StatusToggle from "@/pages/main/components/todos/item/components/status-toggle";
import InfoField from "@/pages/main/components/todos/item/components/info-field";
import EditButton from "@/pages/main/components/todos/item/components/edit-button";

interface TodoItemProps {
    todo: ITodoItem;
    toggleTodo: (id: number) => void;
    updateTodo: (id: number, text: string, dueDate?: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, updateTodo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [editDueDate, setEditDueDate] = useState(todo.dueDate ? format(parseISO(todo.dueDate), DateTimeType.Date) : '');
    const [editDueTime, setEditDueTime] = useState(todo.dueDate ? format(parseISO(todo.dueDate), DateTimeType.Time) : '');
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const isOverdue = todo.dueDate && isPast(parseISO(todo.dueDate));
    const timeLabel = isOverdue ? "Overdue by" : "Remains";
    const timeValue = `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m`;

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
        });

        return () => clearInterval(interval);
    }, [todo.dueDate]);

    const handleSave = (e: React.FormEvent) => {
        e.stopPropagation();
        const newDueDate = editDueDate && editDueTime ? `${editDueDate}T${editDueTime}` : undefined;
        updateTodo(todo.id, editText, newDueDate);
        setIsEditing(false);
    };

    return (
        <>
            <Modal
                title="Edit Your ToDo"
                centered
                open={isEditing}
                onOk={handleSave}
                onCancel={() => setIsEditing(false)}>
                <Form formType="Save"
                      onSubmit={handleSave}
                      textValue={editText}
                      dateValue={editDueDate}
                      timeValue={editDueTime}
                      textValueOnChange={setEditText}
                      dateValueOnChange={setEditDueDate}
                      timeValueOnChange={setEditDueTime}
                />
            </Modal>
            <div className={`${classes.item_container} ${todo.completed && classes.is_completed} ${isPast(parseISO(todo.dueDate || '')) && !todo.completed && classes.is_overdue}`}>
                <StatusToggle todo={todo} toggleTodo={toggleTodo} />
                <div className={classes.card_text_container}>
                    <span className={classes.card_title}>{todo.text}</span><br/>
                    {todo.dueDate && (
                        <div className={classes.card_info}>
                            <InfoField
                                label="Due"
                                value={format(parseISO(todo.dueDate), `${DateTimeType.Date} ${DateTimeType.Time}`)}
                            />
                            <br/>
                            <InfoField
                                label={todo.completed && todo.completedAt ? "Done at" : timeLabel}
                                value={todo.completed && todo.completedAt ? todo.completedAt.toLocaleString() : timeValue}
                            />
                        </div>
                    )}
                </div>
                <EditButton todo={todo} setIsEditing={setIsEditing} />
            </div>
        </>
    );
};

export default TodoItem;
