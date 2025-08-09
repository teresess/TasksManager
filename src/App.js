import React from 'react';
import { observer } from 'mobx-react-lite';
import { TaskList } from './components/TaskList';
import { TaskDetails } from './components/TaskDetails';
import { SearchBar } from './components/SearchBar';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';
import {taskStore} from "./store";

export const App = observer(() => {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Менеджер задач</h1>
                <div className="controls">
                    <SearchBar />
                    <ThemeToggle />
                </div>
            </header>

            <div className="app-content">
                <div className="task-tree-container">
                    <TaskList />
                </div>

                <div className="task-details-container">
                    {taskStore.selectedTask ? (
                        <TaskDetails task={taskStore.selectedTask} />
                    ) : (
                        <div className="empty-state">
                            <p>Выберите задачу для просмотра</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

