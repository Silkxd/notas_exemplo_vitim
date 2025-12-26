import React from 'react';

export default function NoteCard({ note, onClick }) {
    return (
        <div className="note-card" onClick={onClick}>
            <h3>{note.title || 'Sem Título'}</h3>
            <div className="click-hint">Clique para ver mais</div>
        </div>
    );
}
