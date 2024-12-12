import React, { useEffect, useState } from 'react';
import { format, parseISO, isPast, differenceInMinutes, differenceInHours } from 'date-fns';
import { DateTimeType } from "@/pages/main/enums/date-time/index.d";
import { ITodoItem } from "@/models/todo";
import classes from "./classes.module.scss";
import EditIcon from "@/pages/main/assets/EditIcon.svg";
import { Button, Modal } from 'antd';
import DateIcon from "@/pages/main/assets/DateIcon.svg";
import ClockIcon from "@/pages/main/assets/ClockIcon.svg";

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

    const handleSave = () => {
        const newDueDate = editDueDate && editDueTime ? `${editDueDate}T${editDueTime}` : undefined;
        updateTodo(todo.id, editText, newDueDate);
        setIsEditing(false);
    };

    return (
        <>
            <Modal
                title={"Edit Your ToDo"}
                centered
                open={isEditing}
                onOk={() => {
                    setIsEditing(false)
                    handleSave()
                }}
                onCancel={() => setIsEditing(false)}>
                <form onSubmit={handleSave}>
                    <div className={classes.input_container}>
                        <button type="submit" className={classes.submit_btn}>Save</button>
                        <input
                            type="input"
                            id="add"
                            name="add"
                            maxLength={26}
                            value={editText}
                            className={classes.input_field}
                            onChange={(e) => setEditText(e.target.value)}
                            placeholder="Add a new todo"
                            autoComplete="off"
                        />
                        <label htmlFor="add" className={classes.input_label}>What needs to be done?</label>
                    </div>
                    <div className={classes.dateXtime_input_container}>

                        <div className={classes.date_layout}>
                            <DateIcon className={classes.date_icon}/>
                            <input
                                type="date"
                                value={editDueDate}
                                className={classes.date_field}
                                onChange={(e) => setEditDueDate(e.target.value)}
                            />
                        </div>
                        <div className={classes.time_layout}>
                            <ClockIcon className={classes.time_icon}/>
                            <input
                                type="time"
                                value={editDueTime}
                                className={classes.time_field}
                                onChange={(e) => setEditDueTime(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </Modal>
            <div
                className={`${classes.item_container} ${todo.completed && classes.is_completed} ${isPast(parseISO(todo.dueDate || '')) && !todo.completed && classes.is_overdue}`}>
                <div className={classes.status_toggle_container}>
                    <button onClick={() => toggleTodo(todo.id)} className={classes.status_toggle}>
                        <div className={classes.toggle_animator}/>
                    </button>
                </div>
                <div className={classes.text_container}>
                    <span className={classes.text}>{todo.text}</span>
                    {todo.dueDate && (
                        <div className={classes.info_container}>
                            <span className={classes.info_field}>
                                Due:
                                <span>{format(parseISO(todo.dueDate), `${DateTimeType.Date} ${DateTimeType.Time}`)}</span>
                            </span>
                            <span className={classes.timeleftXedirbtn_container}>
                                {todo.completed && todo.completedAt ? (
                                    <span
                                        className={classes.info_field}>Done at: {todo.completedAt.toLocaleString()}</span>
                                ) : (
                                    <>
                                        {todo.dueDate && isPast(parseISO(todo.dueDate)) ? (
                                            <span className={classes.info_field}>
                                                Overdue by: {" "}
                                                <span
                                                    className="hours">{hours.toString().padStart(2, '0')}h</span> :
                                                <span
                                                    className="minutes">{minutes.toString().padStart(2, '0')}m</span>
                                            </span>
                                        ) : (
                                            <span className={classes.info_field}>
                                                Remains: {" "}
                                                <span
                                                    className={classes.time_left_hours}>{hours.toString().padStart(2, '0')}h</span> :
                                                <span
                                                    className={classes.time_left_minutes}>{minutes.toString().padStart(2, '0')}m</span>
                                            </span>
                                        )}
                                    </>
                                )}
                            </span>
                        </div>
                    )}
                </div>
                {!todo.completed &&
                    <button onClick={() => setIsEditing(true)} className={classes.edit_button}>
                        <EditIcon/>
                    </button>
                }
            </div>
        </>
    );
};

export default TodoItem;
