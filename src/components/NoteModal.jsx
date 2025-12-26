import React, { useState, useEffect } from 'react';

export default function NoteModal({ note, onClose, onUpdate }) {
  const [title, setTitle] = useState(note.title || '');
  const [description, setDescription] = useState(note.description || '');

  // Update local state if note changes (though usually modal is for one note instance)
  useEffect(() => {
    setTitle(note.title);
    setDescription(note.description);
  }, [note]);

  const handleSave = () => {
    onUpdate({ ...note, title, description });
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
