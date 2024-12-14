// @ts-ignore
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainPage from '@/pages/main';

describe('MainPage', () => {
    test('Must be rendered with no errors and contains button "Add"', async () => {
        render(<MainPage />);

        await waitFor(() => {
            const addButton = screen.getByText(/Add/i);
            // Assert that the "Add" button contains in the document
            expect(addButton).toBeInTheDocument();
        });
    });

    test('Must adds new task', async () => {
        render(<MainPage />);

        // Get the input field and "Add" button
        const input = screen.getByPlaceholderText(/Add/i);
        const addButton = screen.getByText(/Add/i);

        // Simulate entering a new task into the input field
        fireEvent.change(input, { target: { value: 'New task' } });
        fireEvent.click(addButton);

        await waitFor(() => {
            const newTodo = screen.getByText(/New task/i);
            // Assert that the new task contains in the document
            expect(newTodo).toBeInTheDocument();
        });
    });

    test('Must toggles todo status', async () => {
        render(<MainPage />);

        // Get the input field and "Add" button
        const input = screen.getByPlaceholderText(/Add/i);
        const addButton = screen.getByText(/Add/i);

        // Simulate entering a new task into the input field
        fireEvent.change(input, { target: { value: 'toggle-test' } });
        fireEvent.click(addButton);

        await waitFor(() => {
            const newTodo = screen.getByText(/toggle-test/i);
            // Assert that the new task contains in the document
            expect(newTodo).toBeInTheDocument();
        });

        // Get the toggle button
        const toggleButton = screen.getByTestId('status-toggle-toggle-test');
        fireEvent.click(toggleButton);

        // Wait for the status-animator to reflect the toggled status
        await waitFor(() => {
            const toggleAnimator = screen.getByTestId('status-animator-toggle-test');
            // Assert that the task has the 'is_completed' class
            expect(toggleAnimator).toHaveClass('is_completed');
        });
    });

    test('Must edit an existing task', async () => {
        render(<MainPage />);

        // Add a new task to edit later
        const input = screen.getByPlaceholderText(/Add/i);
        const addButton = screen.getByText(/Add/i);

        // Simulate entering a new task into the input field
        fireEvent.change(input, { target: { value: 'task-to-edit' } });
        fireEvent.click(addButton);

        await waitFor(() => {
            const newTodo = screen.getByText(/task-to-edit/i);
            // Assert that the new task contains in the document
            expect(newTodo).toBeInTheDocument();
        });

        // Get the edit button for the new task
        const editButton = screen.getByTestId('edit-button-task-to-edit');
        fireEvent.click(editButton);

        // Get the input field and "Save" button in the edit modal
        const editInput = screen.getByPlaceholderText(/Save/i);
        const saveButton = screen.getByText(/Save/i);

        // Simulate changing the text of the task
        fireEvent.change(editInput, { target: { value: 'edited-task' } });
        fireEvent.click(saveButton);

        await waitFor(() => {
            const editedTodo = screen.getByText(/edited-task/i);
            // Assert that the edited task contains in the document
            expect(editedTodo).toBeInTheDocument();
        });
    });
});