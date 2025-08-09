import { observer } from "mobx-react-lite";
import { taskStore } from "../store";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import React from 'react';

export const AddTaskModal = observer(() => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [parentId, setParentId] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        taskStore.addTask(title, description, parentId);
        setTitle("");
        setDescription("");
        setParentId(null);
        setIsOpen(false);
    };

    const getAllTasks = (tasks) => {
        return tasks.reduce((acc, task) => {
            return [...acc, task, ...getAllTasks(task.subtasks)];
        }, []);
    };

    const getTaskPath = (tasks, taskId, path = []) => {
        for (const task of tasks) {
            if (task.id === taskId) {
                return [...path, task.title].join(" → ");
            }
            if (task.subtasks.length > 0) {
                const found = getTaskPath(task.subtasks, taskId, [...path, task.title]);
                if (found) return found;
            }
        }
        return "";
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <button className="add-task-btn">
                    <PlusIcon /> Добавить задачу
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="dialog-content">
                    <Dialog.Title className="dialog-title">Добавить новую задачу</Dialog.Title>

                    <form onSubmit={handleSubmit} className="add-task-form">
                        <div className="form-group">
                            <label htmlFor="title">Название</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Описание</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="parent">Родительская задача (необязательно)</label>
                            <select
                                id="parent"
                                value={parentId || ""}
                                onChange={(e) => setParentId(e.target.value || null)}
                            >
                                <option value="">Нет (верхний уровень)</option>
                                {getAllTasks(taskStore.tasks).map((task) => (
                                    <option key={task.id} value={task.id}>
                                        {getTaskPath(taskStore.tasks, task.id)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                Добавить
                            </button>
                            <Dialog.Close asChild>
                                <button type="button" className="cancel-btn">
                                    Отмена
                                </button>
                            </Dialog.Close>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
});