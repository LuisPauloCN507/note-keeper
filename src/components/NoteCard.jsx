import { Trash2, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NoteCard({ note, onDelete }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-neon/50 transition-all group shadow-xl"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neon bg-neon/10 px-2 py-1 rounded">
          {note.category}
        </span>
        <button 
          onClick={() => onDelete(note.id)}
          className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon transition-colors">
        {note.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-4">
        {note.content}
      </p>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-gray-500 text-[10px] font-mono uppercase">
        <div className="flex items-center gap-1">
          <Calendar size={12} /> {note.createdAt}
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-neon shadow-[0_0_8px_#00f3ff]"></div>
      </div>
    </motion.div>
  );
}