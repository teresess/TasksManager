import React from 'react';
import { observer } from 'mobx-react-lite';
import { TaskItem } from '../TaskItem';
import { taskStore } from '../store';
import { Plus } from 'react-feather';
import { motion } from 'framer-motion';

export const TaskList = observer(() => {
    return (
        <div className="task-list-container">
            {taskStore.filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} />
            ))}

            <motion.button
                onClick={() => taskStore.addTask()}
                className="add-main-task-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Plus size={18} /> Добавить новую задачу
            </motion.button>
        </div>
    );
});