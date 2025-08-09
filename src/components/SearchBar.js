import React from 'react';
import { observer } from 'mobx-react-lite';
import { taskStore } from '../store';

export const SearchBar = observer(() => {
    return (
        <input
            type="text"
            className="search-bar"
            placeholder="Поиск задач..."
            value={taskStore.searchQuery}
            onChange={(e) => taskStore.setSearchQuery(e.target.value)}
        />
    );
});