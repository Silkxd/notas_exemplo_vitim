import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';

function App() {
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
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
      fetchData();
    } else {
      setNotes([]);
      setFolders([]);
      setLoading(false);
    }
  }, [session, selectedFolder]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchFolders(), fetchNotes()]);
    setLoading(false);
  };

  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('name');
    if (error) console.error('Error fetching folders:', error);
    else setFolders(data || []);
  };

  const fetchNotes = async () => {
    let query = supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedFolder) {
      query = query.eq('folder_id', selectedFolder.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      setNotes(data || []);
    }
  };

  const handleCreateFolder = async (name) => {
    const { data, error } = await supabase
      .from('folders')
      .insert([{ name, user_id: session.user.id }])
      .select();

    if (error) {
      console.error('Error creating folder:', error);
    } else {
      setFolders([...folders, data[0]]);
    }
  };

  const handleCreateNote = async () => {
    if (!session) return;

    // Insert blank note (optionally with current folder if selected)
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        title: '',
        description: '',
        user_id: session.user.id,
        folder_id: selectedFolder ? selectedFolder.id : null
      }])
      .select();

    if (error) {
      console.error('Error creating note:', error);
    } else if (data && data.length > 0) {
      const newNote = data[0];
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
    }
  };

  const handleUpdateNote = async (updatedNote) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));

    const { error } = await supabase
      .from('notes')
      .update({
        title: updatedNote.title,
        description: updatedNote.description,
        folder_id: updatedNote.folder_id
      })
      .eq('id', updatedNote.id);

    if (error) {
      console.error('Error updating note:', error);
      fetchNotes();
    } else {
      // If folder changed and we are filtering, we might need to remove it from view
      if (selectedFolder && updatedNote.folder_id !== selectedFolder.id) {
        setNotes(notes.filter(n => n.id !== updatedNote.id));
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <>
      <Sidebar
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
        onCreateFolder={handleCreateFolder}
        onLogout={handleLogout}
      />

      <div className="app-container">
        <header>
          <h1>{selectedFolder ? selectedFolder.name : 'Todas as Notas'}</h1>
          <button className="new-note-btn" onClick={handleCreateNote}>
            + Nova Nota
          </button>
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
                {selectedFolder ? 'Nenhuma nota nesta pasta.' : 'Nenhuma nota ainda.'}
              </div>
            ) : (
              notes.map(note => (
                (note) && <NoteCard
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
            folders={folders}
            onClose={() => setSelectedNote(null)}
            onUpdate={handleUpdateNote}
          />
        )}
      </div>
    </>
  );
}

export default App;
