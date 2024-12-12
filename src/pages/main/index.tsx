import React, { useEffect, useState } from "react";
import { TodoArray } from "@/models/todo";
import { FilterType } from "@/pages/main/enums/filter/index.d";
import { DateTimeType } from "@/pages/main/enums/date-time/index.d";
import { format, isPast, isValid, parseISO } from 'date-fns';
import MainLayout from "@/layout-components/main-layout";
import Heading from "@/pages/main/components/heading";
import TodoList from "@/pages/main/components/todos";
import DateIcon from "./assets/DateIcon.svg";
import ClockIcon from "./assets/ClockIcon.svg"
import DateXTimeIcon from "./assets/DateXTimeIcon.svg";
import classes from "./classes.module.scss";
import { formatInTimeZone } from "date-fns-tz";


const MainPage = () => {
    const [todos, setTodos] = useState<TodoArray>(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [filter, setFilter] = useState<FilterType>(() => {
        const savedFilter = localStorage.getItem('filter');
        return savedFilter ? (savedFilter as FilterType) : FilterType.All;
    });
    const [newTodo, setNewTodo] = useState<string>('');
    const [showDateTimeInputs, setShowDateTimeInputs] = useState<boolean>(false);
    const [dueDate, setDueDate] = useState<string>(format(new Date(), DateTimeType.Date));
    const [dueTime, setDueTime] = useState<string>('23:59');
    const [menuSelectorClassName, setMenuSelectorClassName] = useState('');

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));

    }, [todos]);

    useEffect(() => {
        setMenuSelectorClassName(() => {
            switch (filter) {
                case FilterType.All: return classes.is_all_filter;
                case FilterType.Active: return classes.is_active_filter;
                case FilterType.Completed: return classes.is_completed_filter;
                case FilterType.WithTime: return classes.is_withTime_filter;
            }
        });

        localStorage.setItem('filter', filter);
    }, [filter]);

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newTodo.trim()) return;

        let dueDateTime: string | undefined = undefined;

        if (showDateTimeInputs) {
            const currentDate = new Date();
            const defaultDate = dueDate || format(currentDate, DateTimeType.Date);
            const defaultTime = dueTime || '23:59';
            const parsedDateTime = parseISO(`${defaultDate}T${defaultTime}`);
            if (isValid(parsedDateTime) && !isPast(parsedDateTime)) {
                dueDateTime = format(parsedDateTime, DateTimeType.DateTime);
            } else {
                alert('Invalid date and time');
                return;
            }
        }

        setTodos([
            ...todos,
            { id: Date.now(), text: newTodo, completed: false, dueDate: dueDateTime },
        ]);
        setNewTodo('');
        setShowDateTimeInputs(false);
        setDueDate(format(new Date(), DateTimeType.Date));
        setDueTime('23:59');
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed, completedAt: !todo.completed ?
                    formatInTimeZone(new Date(), Intl.DateTimeFormat().resolvedOptions().timeZone, `${DateTimeType.Date} ${DateTimeType.Time}`)
                    : undefined } : todo
        ));
    };

    const updateTodo = (id: number, text: string, dueDate?: string) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, text, dueDate } : todo
        ));
    };

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };

    const filteredTodos = todos.filter(todo => {
        switch (filter) {
            case FilterType.All:
                return true;
            case FilterType.Active:
                return !todo.completed;
            case FilterType.Completed:
                return todo.completed;
            case FilterType.WithTime:
                return !!todo.dueDate;
            default:
                return true;
        }
    });

    const sortedTodos = filteredTodos.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
    });


    return (
        <MainLayout>
            <Heading/>
            <form onSubmit={addTodo} className={classes.form}>
                <div className={classes.input_container}>
                    <button type="submit" className={classes.submit_btn}>Add</button>
                    <input
                        type="input"
                        id="add"
                        name="add"
                        value={newTodo}
                        className={classes.input_field}
                        maxLength={26}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new todo"
                        autoComplete="off"
                    />
                    <label htmlFor="add" className={classes.input_label}>What needs to be done?</label>
                </div>
                <div className={classes.dateXtime_panel}>
                    <button type="button"
                            onClick={() => setShowDateTimeInputs(!showDateTimeInputs)}
                            className={`${classes.visibility_toggle} ${!showDateTimeInputs && classes.is_dateXtime_hidden}`}>
                        <div>
                            <DateXTimeIcon className={classes.icon}/>
                        </div>
                    </button>
                    {showDateTimeInputs && (
                        <div className={classes.dateXtime_input_container}>
                            <div className={classes.date_layout}>
                                <DateIcon className={classes.date_icon}/>
                                <input
                                    type="date"
                                    value={dueDate}
                                    className={classes.date_field}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                            <div className={classes.time_layout}>
                                <ClockIcon className={classes.time_icon}/>
                                <input
                                    type="time"
                                    value={dueTime}
                                    className={classes.time_field}
                                    onChange={(e) => setDueTime(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </form>

            <div className={classes.filter_panel}>
                <button onClick={() => setFilter(FilterType.All)} className={classes.all_button}>All</button>
                <button onClick={() => setFilter(FilterType.Active)} className={classes.active_button}>Active</button>
                <button onClick={() => setFilter(FilterType.Completed)} className={classes.completed_button}>Completed</button>
                <button onClick={() => setFilter(FilterType.WithTime)} className={classes.withTime_button}>With Time</button>
                <span className={`${classes.dynamic_menu_selector} ${menuSelectorClassName}`}/>
            </div>
            <TodoList todos={sortedTodos} toggleTodo={toggleTodo} updateTodo={updateTodo}/>
            <button onClick={clearCompleted} className={classes.clear_bnt}>Clear Completed</button>
        </MainLayout>
    );
};

export default MainPage;