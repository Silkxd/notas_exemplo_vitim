import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import Auth from './components/Auth';

function App() {
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [session]);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      setNotes(data || []);
    }
    setLoading(false);
  };

  const handleCreateNote = async () => {
    if (!session) return;

    // Insert blank note with user_id
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        title: '',
        description: '',
        user_id: session.user.id
      }])
      .select();

    if (error) {
      console.error('Error creating note:', error);
    } else if (data && data.length > 0) {
      const newNote = data[0];
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote); // Open modal for editing
    }
  };

  const handleUpdateNote = async (updatedNote) => {
    // Optimistic update
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));

    const { error } = await supabase
      .from('notes')
      .update({ title: updatedNote.title, description: updatedNote.description })
      .eq('id', updatedNote.id);

    if (error) {
      console.error('Error updating note:', error);
      fetchNotes();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="app-container">
      <header>
        <h1>Minhas Notas</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="new-note-btn" onClick={handleCreateNote}>
            + Nova Nota
          </button>
          <button
            className="new-note-btn"
            style={{ backgroundColor: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)' }}
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', opacity: 0.5 }}>Carregando...</div>
      ) : (
        <div className="notes-grid">
          {notes.length === 0 ? (
            <div style={{
              gridColumn: '1/-1',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginTop: '2rem'
            }}>
              Nenhuma nota ainda. Crie sua primeira nota!
            </div>
          ) : (
            notes.map(note => (
              (note) && <NoteCard /* check for null just in case */
                key={note.id}
                note={note}
                onClick={() => setSelectedNote(note)}
              />
            ))
          )}
        </div>
      )}

      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdate={handleUpdateNote}
        />
      )}
    </div>
  );
}

export default App;
