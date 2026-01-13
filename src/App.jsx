import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Search, StickyNote, Download } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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

  useEffect(() => {
    localStorage.setItem('@NoteKeeper:notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
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

  const deleteNote = (id) => setNotes(notes.filter(note => note.id !== id));

  const exportToTxt = () => {
    const text = notes.map(n => `[${n.category}] ${n.title}\n${n.content}\n---`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notas.txt';
    a.click();
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-12">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-2">
          <StickyNote className="text-neon" size={32} /> NOTE<span className="text-neon">KEEPER</span> PRO
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs outline-none focus:border-neon/50" />
          </div>
          <button onClick={exportToTxt} className="p-2.5 bg-white/5 border border-white/10 rounded-full hover:text-neon transition"><Download size={20} /></button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[350px_1fr] gap-12 items-start">
        <aside className="bg-white/2 border border-white/5 p-8 rounded-3xl sticky top-10">
          <form onSubmit={handleAddNote} className="space-y-4">
            <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-neon outline-none" />
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-neon outline-none">
              <option value="Geral">Geral</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Estudo">Estudo</option>
              <option value="Ideias">Ideias</option>
            </select>
            <textarea placeholder="Conteúdo..." rows="5" value={content} onChange={(e) => setContent(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-neon outline-none resize-none" />
            <button type="submit" className="w-full bg-neon text-black font-black py-4 rounded-xl hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all uppercase text-xs">Adicionar Nota</button>
          </form>
        </aside>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map(note => <NoteCard key={note.id} note={note} onDelete={deleteNote} />)}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}