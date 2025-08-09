import { observer } from "mobx-react-lite";
import { taskStore } from "../store";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SunIcon, MoonIcon, DesktopIcon } from "@radix-ui/react-icons";
import React from 'react';

export const ThemeToggle = observer(() => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="theme-toggle">
                    {taskStore.theme === "light" ? (
                        <SunIcon />
                    ) : taskStore.theme === "dark" ? (
                        <MoonIcon />
                    ) : (
                        <DesktopIcon />
                    )}
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="dropdown-content">
                    <DropdownMenu.Item
                        className="dropdown-item"
                        onClick={() => taskStore.setTheme("light")}
                    >
                        <SunIcon /> Светлая
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                        className="dropdown-item"
                        onClick={() => taskStore.setTheme("dark")}
                    >
                        <MoonIcon /> Темная
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                        className="dropdown-item"
                        onClick={() => taskStore.setTheme("system")}
                    >
                        <DesktopIcon /> Системная
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
});