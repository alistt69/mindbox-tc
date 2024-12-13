import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MainPage from '@/pages/main';

describe('MainPage', () => {
    test('должен рендериться без ошибок и содержать кнопку "Add"', () => {
        render(<MainPage />);
        const addButton = screen.getByText(/Add/i);
        expect(addButton).toBeInTheDocument();
    });

    test('должен добавлять новое задание', () => {
        render(<MainPage />);
        const input = screen.getByPlaceholderText(/Введите задание/i);
        const addButton = screen.getByText(/Add/i);

        fireEvent.change(input, { target: { value: 'Новое задание' } });
        fireEvent.click(addButton);

        const newTodo = screen.getByText(/Новое задание/i);
        expect(newTodo).toBeInTheDocument();
    });
});