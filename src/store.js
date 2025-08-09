import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from "uuid";

class TaskStore {
    tasks = [];
    selectedTaskId = null;
    searchQuery = "";
    theme = "system";

    constructor() {
        makeAutoObservable(this);
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        } else {
            this.tasks = this.createInitialTasks();
        }

        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            this.theme = savedTheme;
        }
    }

    saveToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        localStorage.setItem("theme", this.theme);
    }

    createInitialTasks() {
        return [
            {
                id: uuidv4(),
                title: "Главная задача 1",
                description: "Это первая главная задача",
                completed: false,
                collapsed: false,
                subtasks: [
                    {
                        id: uuidv4(),
                        title: "Подзадача 1.1",
                        description: "Первая подзадача главной задачи 1",
                        completed: false,
                        collapsed: false,
                        subtasks: [],
                    },
                ],
            },
        ];
    }

    toggleTaskCompletion(taskId, completed) {
        const toggleSubtasks = (tasks) => {
            tasks.forEach((task) => {
                task.completed = completed;
                if (task.subtasks.length > 0) {
                    toggleSubtasks(task.subtasks);
                }
            });
        };

        const findAndToggleTask = (tasks) => {
            return tasks.some((task) => {
                if (task.id === taskId) {
                    task.completed = completed;
                    toggleSubtasks(task.subtasks);
                    return true;
                }
                if (task.subtasks.length > 0) {
                    return findAndToggleTask(task.subtasks);
                }
                return false;
            });
        };

        findAndToggleTask(this.tasks);
        this.updateParentTasks();
        this.saveToLocalStorage();
    }

    updateParentTasks() {
        const updateCompletion = (tasks) => {
            tasks.forEach((task) => {
                if (task.subtasks.length > 0) {
                    updateCompletion(task.subtasks);
                    task.completed = task.subtasks.every((subtask) => subtask.completed);
                }
            });
        };

        updateCompletion(this.tasks);
    }
    generateTaskName(parentTask = null) {
        if (!parentTask) {
            const mainTaskCount = this.tasks.filter(t => !t.parentId).length;
            return `Задача ${mainTaskCount + 1}`;
        }

        const siblings = parentTask.subtasks;
        return `${parentTask.title}.${siblings.length + 1}`;
    }

    addTask(parentId = null) {
        const parentTask = parentId ? this.findTask(parentId) : null;
        const newTask = {
            id: uuidv4(),
            title: this.generateTaskName(parentTask),
            description: "",
            completed: false,
            collapsed: true,
            subtasks: [],
            parentId
        };

        if (parentTask) {
            parentTask.subtasks.push(newTask);
        } else {
            this.tasks.push(newTask);
        }

        this.saveToLocalStorage();
        return newTask;
    }

    deleteTask(taskId) {
        const deleteFromParent = (tasks) => {
            const index = tasks.findIndex((task) => task.id === taskId);
            if (index !== -1) {
                tasks.splice(index, 1);
                return true;
            }

            return tasks.some((task) => {
                if (task.subtasks.length > 0) {
                    return deleteFromParent(task.subtasks);
                }
                return false;
            });
        };

        deleteFromParent(this.tasks);

        if (this.selectedTaskId === taskId) {
            this.selectedTaskId = null;
        }

        this.saveToLocalStorage();
    }

    updateTask(taskId, updates) {
        const updateTaskDetails = (tasks) => {
            return tasks.some((task) => {
                if (task.id === taskId) {
                    Object.assign(task, updates);
                    return true;
                }
                if (task.subtasks.length > 0) {
                    return updateTaskDetails(task.subtasks);
                }
                return false;
            });
        };

        updateTaskDetails(this.tasks);
        this.saveToLocalStorage();
    }

    toggleCollapse(taskId) {
        const toggle = (tasks) => {
            return tasks.some((task) => {
                if (task.id === taskId) {
                    task.collapsed = !task.collapsed;
                    return true;
                }
                if (task.subtasks.length > 0) {
                    return toggle(task.subtasks);
                }
                return false;
            });
        };

        toggle(this.tasks);
        this.saveToLocalStorage();
    }

    setSelectedTask(taskId) {
        this.selectedTaskId = taskId;
    }

    get selectedTask() {
        if (!this.selectedTaskId) return null;

        const findTask = (tasks) => {
            for (const task of tasks) {
                if (task.id === this.selectedTaskId) return task;
                if (task.subtasks.length > 0) {
                    const found = findTask(task.subtasks);
                    if (found) return found;
                }
            }
            return null;
        };

        return findTask(this.tasks);
    }

    setSearchQuery(query) {
        this.searchQuery = query;
    }

    get filteredTasks() {
        if (!this.searchQuery) return this.tasks;

        const filterTasks = (tasks) => {
            return tasks
                .map((task) => ({ ...task }))
                .filter((task) => {
                    const matches =
                        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                        task.description.toLowerCase().includes(this.searchQuery.toLowerCase());

                    if (task.subtasks.length > 0) {
                        task.subtasks = filterTasks(task.subtasks);
                        return matches || task.subtasks.length > 0;
                    }

                    return matches;
                });
        };

        return filterTasks(this.tasks);
    }

    setTheme(theme) {
        this.theme = theme;
        this.saveToLocalStorage();
        this.applySystemTheme();
    }
    findTask(taskId, tasks = this.tasks) {
        for (const task of tasks) {
            if (task.id === taskId) return task;
            if (task.subtasks.length > 0) {
                const found = this.findTask(taskId, task.subtasks);
                if (found) return found;
            }
        }
        return null;
    }
    applySystemTheme() {
        if (this.theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.classList.toggle("dark", prefersDark);
        } else {
            document.documentElement.classList.toggle("dark", this.theme === "dark");
        }
    }
}

export const taskStore = new TaskStore();