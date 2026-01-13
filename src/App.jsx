import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Search, StickyNote } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import NoteCard from './components/NoteCard';

export default function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('@NoteKeeper:notes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Geral');
  const [search, setSearch] = useState('');

  // Salva no JSON (localStorage) sempre que as notas mudarem
  useEffect(() => {
    localStorage.setItem('@NoteKeeper:notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newNote = {
      id: uuidv4(),
      title,
      content,
      category,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    setNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-2">
            <StickyNote className="text-neon" size={32} /> NOTE<span className="text-neon">KEEPER</span> PRO
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Sua mente organizada em JSON</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text"
            placeholder="Buscar notas ou categorias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:border-neon/50 outline-none transition"
          />
        </div>
      </header>

      <div className="grid lg:grid-cols-[350px_1fr] gap-12">
        {/* Formulario */}
        <aside>
          <form onSubmit={handleAddNote} className="bg-white/2 border border-white/5 p-8 rounded-3xl sticky top-28">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 underline decoration-neon underline-offset-4">NOVA_NOTA</h2>
            
            <div className="space-y-4">
              <input 
                type="text" placeholder="Título da nota" value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-neon outline-none"
              />
              <select 
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-neon outline-none"
              >
                <option value="Geral">Geral</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Estudo">Estudo</option>
                <option value="Ideias">Ideias</option>
              </select>
              <textarea 
                placeholder="Conteúdo..." rows="5" value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-neon outline-none resize-none"
              ></textarea>
              <button 
                type="submit"
                className="w-full bg-neon text-black font-bold py-3 rounded-xl hover:shadow-[0_0_15px_#00f3ff] transition flex items-center justify-center gap-2"
              >
                <Plus size={20} /> CRIAR NOTA
              </button>
            </div>
          </form>
        </aside>

        {/* Grid de Notas */}
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredNotes.map(note => (
                <NoteCard key={note.id} note={note} onDelete={deleteNote} />
              ))}
            </AnimatePresence>
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-gray-600 uppercase text-xs font-bold tracking-widest">Nenhuma nota encontrada</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}