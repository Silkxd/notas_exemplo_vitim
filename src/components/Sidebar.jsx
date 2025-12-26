import React, { useState } from 'react';

export default function Sidebar({ folders, selectedFolder, onSelectFolder, onCreateFolder, onLogout }) {
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newFolderName.trim()) {
            onCreateFolder(newFolderName);
            setNewFolderName('');
            setIsCreating(false);
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Pastas</h2>
            </div>

            <button
                className="btn-create-folder"
                onClick={() => setIsCreating(!isCreating)}
            >
                {isCreating ? 'Cancelar' : 'Criar nova pasta'}
            </button>

            {isCreating && (
                <form onSubmit={handleSubmit} className="new-folder-form">
                    <input
                        type="text"
                        placeholder="Nome da pasta..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        autoFocus
                        onBlur={() => !newFolderName && setIsCreating(false)}
                    />
                </form>
            )}

            <ul className="folder-list">
                <li
                    className={!selectedFolder ? 'active' : ''}
                    onClick={() => onSelectFolder(null)}
                >
                    Todas as Notas
                </li>
                {folders.map(folder => (
                    <li
                        key={folder.id}
                        className={selectedFolder?.id === folder.id ? 'active' : ''}
                        onClick={() => onSelectFolder(folder)}
                    >
                        {folder.name}
                    </li>
                ))}
            </ul>

            <div className="sidebar-footer">
                <button onClick={onLogout} className="btn-logout">
                    Sair
                </button>
            </div>
        </aside>
    );
}
