import { observer } from "mobx-react-lite";
import { taskStore } from "../store";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SunIcon, MoonIcon, DesktopIcon } from "@radix-ui/react-icons";
import React from 'react';

export const ThemeToggle = observer(() => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="theme-toggle" aria-label="Сменить тему">
                    {taskStore.theme === "light" ? (
                        <SunIcon size={20} />
                    ) : taskStore.theme === "dark" ? (
                        <MoonIcon size={20} />
                    ) : (
                        <DesktopIcon size={20} />
                    )}
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="dropdown-content" sideOffset={5}>
                    <DropdownMenu.Item
                        className="dropdown-item"
                        onClick={() => taskStore.setTheme("light")}
                    >
                        <SunIcon size={16} /> Светлая
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                        className="dropdown-item"
                        onClick={() => taskStore.setTheme("dark")}
                    >
                        <MoonIcon size={16} /> Темная
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                        className="dropdown-item"
                        onClick={() => taskStore.setTheme("system")}
                    >
                        <DesktopIcon size={16} /> Системная
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
});