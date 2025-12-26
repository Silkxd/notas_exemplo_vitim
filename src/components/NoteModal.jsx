import React, { useState, useEffect } from 'react';

export default function NoteModal({ note, folders, onClose, onUpdate }) {
  const [title, setTitle] = useState(note.title || '');
  const [description, setDescription] = useState(note.description || '');
  const [folderId, setFolderId] = useState(note.folder_id || '');

  useEffect(() => {
    setTitle(note.title);
    setDescription(note.description);
    setFolderId(note.folder_id || '');
  }, [note]);

  const handleSave = () => {
    onUpdate({ ...note, title, description, folder_id: folderId || null });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Título da Nota"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          style={{ fontSize: '1.5rem', fontWeight: '600' }}
        />

        {folders && folders.length > 0 && (
          <select
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
          >
            <option value="">Sem Pasta</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        )}

        <textarea
          placeholder="Digite sua descrição aqui..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>Fechar</button>
          <button className="btn-save" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
