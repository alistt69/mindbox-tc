import React, { useEffect, useState } from "react";
import Heading from "@/pages/main/components/heading";
import MainLayout from "@/layout-components/main-layout";
import { format, parseISO, isValid, isPast } from 'date-fns';
import TodoList from "@/pages/main/components/todos";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    dueDate?: string;
    completedAt?: string;
}

const MainPage = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [filter, setFilter] = useState<string>(() => {
        const savedFilter = localStorage.getItem('filter');
        return savedFilter ? savedFilter : 'all';
    });
    const [newTodo, setNewTodo] = useState<string>('');
    const [showDateTimeInputs, setShowDateTimeInputs] = useState<boolean>(false);
    const [dueDate, setDueDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [dueTime, setDueTime] = useState<string>('23:59');

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        localStorage.setItem('filter', filter);
    }, [filter]);

    const addTodo = () => {
        if (!newTodo.trim()) return;

        let dueDateTime: string | undefined = undefined;

        if (showDateTimeInputs) {
            const currentDate = new Date();
            const defaultDate = dueDate || format(currentDate, 'yyyy-MM-dd');
            const defaultTime = dueTime || '23:59';
            const parsedDateTime = parseISO(`${defaultDate}T${defaultTime}`);
            if (isValid(parsedDateTime) && !isPast(parsedDateTime)) {
                dueDateTime = format(parsedDateTime, "yyyy-MM-dd'T'HH:mm");
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
        setDueDate(format(new Date(), 'yyyy-MM-dd'));
        setDueTime('23:59');
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed, completedAt: !todo.completed ? new Date().toISOString() : undefined } : todo
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
        if (filter === 'all') return true;
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        if (filter === 'withTime') return !!todo.dueDate;
        return true;
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
            <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo"
            />
            <button onClick={() => setShowDateTimeInputs(!showDateTimeInputs)}>
                {showDateTimeInputs ? 'Hide Date/Time' : 'Add Date/Time'}
            </button>
            {showDateTimeInputs && (
                <>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    <input
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                    />
                </>
            )}
            <button onClick={addTodo}>Add Todo</button>
            <div>
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('active')}>Active</button>
                <button onClick={() => setFilter('completed')}>Completed</button>
                <button onClick={() => setFilter('withTime')}>With Time</button>
            </div>
            <TodoList todos={sortedTodos} toggleTodo={toggleTodo} updateTodo={updateTodo} />
            <button onClick={clearCompleted}>Clear Completed</button>
        </MainLayout>
    );
};

export default MainPage;