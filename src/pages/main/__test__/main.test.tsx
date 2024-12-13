// @ts-ignore
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainPage from '@/pages/main';

describe('MainPage', () => {
    test('должен рендериться без ошибок и содержать кнопку "Add"', async () => {
        render(<MainPage />);

        await waitFor(() => {
            const addButton = screen.getByText(/Add/i);
            expect(addButton).toBeInTheDocument();
        });
    });

    test('должен добавлять новое задание', async () => {
        render(<MainPage />);

        const input = screen.getByPlaceholderText(/Add/i);
        const addButton = screen.getByText(/Add/i);

        fireEvent.change(input, { target: { value: 'Новое задание' } });
        fireEvent.click(addButton);

        await waitFor(() => {
            const newTodo = screen.getByText(/Новое задание/i);
            expect(newTodo).toBeInTheDocument();
        });
    });
});