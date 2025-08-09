import { observer } from "mobx-react-lite";
import { useState } from "react";
import {taskStore} from "../store";
import React from 'react';

export const TaskDetails = observer(({ task }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editDescription, setEditDescription] = useState(task.description);

    const handleEditSubmit = (e) => {
        e.preventDefault();
        taskStore.updateTask(task.id, { description: editDescription });
        setIsEditing(false);
    };

    return (
        <div className="task-details">
            <h2>{task.title}</h2>

            {isEditing ? (
                <form onSubmit={handleEditSubmit} className="description-edit-form">
          <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="description-edit-input"
          />
                    <div className="description-edit-actions">
                        <button type="submit" className="save-btn">
                            Сохранить
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="cancel-btn"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            ) : (
                <div className="description-view">
                    <p>{task.description || "Нет описания"}</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="edit-btn"
                    >
                        Редактировать описание
                    </button>
                </div>
            )}
        </div>
    );
});