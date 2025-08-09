import React from 'react';
import { observer } from 'mobx-react-lite';
import { taskStore } from './store';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';

export const TaskItem = observer(({ task, depth = 0 }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleAddSubtask = (e) => {
        e.stopPropagation();
        const newTask = taskStore.addTask(task.id);
        taskStore.setSelectedTask(newTask.id);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Удалить задачу и все подзадачи?')) {
            taskStore.deleteTask(task.id);
        }
    };

    const toggleCollapse = (e) => {
        e.stopPropagation();
        taskStore.toggleCollapse(task.id);
    };

    return (
        <div className="task-item" style={{ marginLeft: `${depth * 30}px` }}>
            <div
                className={`task-header ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => taskStore.setSelectedTask(task.id)}
            >
                <div className="task-title">
                    <span>{task.title}</span>
                </div>

                <div className="task-actions">
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                className="hover-actions"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <button
                                    onClick={handleAddSubtask}
                                    className="action-btn add-btn"
                                    title="Добавить подзадачу"
                                >
                                    <Plus size={16} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="action-btn delete-btn"
                                    title="Удалить"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {task.subtasks.length > 0 && (
                        <button
                            onClick={toggleCollapse}
                            className="collapse-btn"
                            aria-label={task.collapsed ? "Развернуть" : "Свернуть"}
                        >
                            {task.collapsed ? (
                                <ChevronRight size={18} />
                            ) : (
                                <ChevronDown size={18} />
                            )}
                        </button>
                    )}

                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => taskStore.toggleTaskCompletion(task.id, e.target.checked)}
                        className="task-checkbox"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>

            {!task.collapsed && task.subtasks.length > 0 && (
                <div className="subtasks-container">
                    {task.subtasks.map(subtask => (
                        <TaskItem key={subtask.id} task={subtask} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
});