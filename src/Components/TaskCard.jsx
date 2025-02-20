import { MoreVertical, Edit2, Trash2, Calendar } from 'lucide-react';
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

import { motion } from 'framer-motion';

export function TaskCard({ task, onEdit, onDelete, isDragging }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`mb-3 p-4 bg-white rounded-lg border shadow-sm ${
        isDragging ? 'shadow-md ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
     
      </div>

      
      {task.description && (
        <p className="mt-2 text-sm text-gray-600">{task.description}</p>
      )}

<div className='flex gap-2 mt-4'>
        <button onClick={onEdit}  className='btn '><CiEdit className='text-lg'></CiEdit>Edit</button>
        <button onClick={onDelete} className='btn '><MdDeleteForever className='text-lg text-red-500'></MdDeleteForever>Delete</button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <Calendar className="w-4 h-4" />
        {new Date(task.timestamp).toLocaleDateString()}
      </div>
    </motion.div>
  );
}