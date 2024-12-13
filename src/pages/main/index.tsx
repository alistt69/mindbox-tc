import React, { useEffect, useState } from "react";
import { format, isPast, isValid, parseISO } from 'date-fns';
import { formatInTimeZone } from "date-fns-tz";
import { TodoArray } from "@/models/todo";
import { FilterType } from "@/pages/main/enums/filter/index.d";
import { DateTimeType } from "@/pages/main/enums/date-time/index.d";
import MainLayout from "@/layout-components/main-layout";
import Heading from "@/pages/main/components/heading";
import Form from "@/components/form";
import TodoList from "@/pages/main/components/todos";
import FilterPanel from "@/pages/main/components/filter-panel";
import ClearButton from "@/pages/main/components/clear-button";
import classes from "@/pages/main/components/filter-panel/classes.module.scss";


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
            <Form formType="Add"
                  onSubmit={addTodo}
                  textValue={newTodo}
                  dateValue={dueDate}
                  timeValue={dueTime}
                  textValueOnChange={setNewTodo}
                  dateValueOnChange={setDueDate}
                  timeValueOnChange={setDueTime}
                  showDateTimeInputs={showDateTimeInputs}
                  setShowDateTimeInputs={setShowDateTimeInputs}
            />
            <FilterPanel setFilter={setFilter} menuSelectorClassName={menuSelectorClassName} />
            <TodoList todos={sortedTodos} toggleTodo={toggleTodo} updateTodo={updateTodo}/>
            <ClearButton clearCompleted={clearCompleted} />
        </MainLayout>
    );
};

export default MainPage;