import { useContext, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, MoreVertical, Edit2, Trash2, X, Calendar, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SortableItem } from '../Components/Sortableitem';
import { TaskCard } from '../Components/TaskCard';
import axios from 'axios';
import { AuthContext } from '../Providers/AuthProvider';

const TaskManagement = () => {
    const {user} = useContext(AuthContext)
    console.log(user);
  const [columns, setColumns] = useState({
    'to-do': {
      id: 'to-do',
      title: 'To-Do',
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tasks: [
        {
          id: '1',
          title: 'Design new landing page',
          description: 'Create a modern and responsive landing page design',
          timestamp: new Date().toISOString(),
          category: 'to-do'
        }
      ]
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      tasks: [
        {
          id: '2',
          title: 'Implement authentication',
          description: 'Add user authentication using Firebase',
          timestamp: new Date().toISOString(),
          category: 'in-progress'
        }
      ]
    },
    'done': {
      id: 'done',
      title: 'Done',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      tasks: [
        {
          id: '3',
          title: 'Setup project structure',
          description: 'Initialize project and configure basic settings',
          timestamp: new Date().toISOString(),
          category: 'done'
        }
      ]
    }
  });

  const [activeId, setActiveId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'to-do'
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Add a small threshold to prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const DroppableContainer = ({ id, children, className }) => {
    const { setNodeRef } = useDroppable({
      id
    });
  
    return (
      <div ref={setNodeRef} className={className}>
        {children}
      </div>
    );
  };

  const findContainer = (id) => {
    if (id in columns) return id;

    const container = Object.keys(columns).find(key => 
      columns[key].tasks.some(task => task.id === id)
    );
    return container;
  };

    const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setColumns(prev => {
      const activeItems = prev[activeContainer].tasks;
      const overItems = prev[overContainer].tasks;

      const activeIndex = activeItems.findIndex(item => item.id === activeId);
      const task = activeItems[activeIndex];

      return {
        ...prev,
        [activeContainer]: {
          ...prev[activeContainer],
          tasks: prev[activeContainer].tasks.filter((_, index) => index !== activeIndex)
        },
        [overContainer]: {
          ...prev[overContainer],
          tasks: [...prev[overContainer].tasks, { ...task, category: overContainer }]
        }
      };
    });
  };


  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (activeContainer && overContainer) {
      const activeIndex = columns[activeContainer].tasks.findIndex(
        task => task.id === active.id
      );
      const overIndex = columns[overContainer].tasks.findIndex(
        task => task.id === over.id
      );

      if (activeContainer === overContainer) {
        // Reordering within the same container
        setColumns(prev => ({
          ...prev,
          [activeContainer]: {
            ...prev[activeContainer],
            tasks: arrayMove(prev[activeContainer].tasks, activeIndex, overIndex)
          }
        }));
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (newTask.title.length > 50) {
      toast.error('Title must be less than 50 characters');
      return;
    }
  
    if (newTask.description.length > 200) {
      toast.error('Description must be less than 200 characters');
      return;
    }
  
    const task = {
      id: Date.now().toString(),
      ...newTask,
      timestamp: new Date().toISOString(),
      user:user.email
      
    };
  
    try {
      const response = await axios.post('https://taskify-server-woad.vercel.app/tasks', task);
      
      if (response.status === 200 || response.status === 201) {
        setColumns(prevColumns => ({
          ...prevColumns,
          [newTask.category]: {
            ...prevColumns[newTask.category],
            tasks: [...prevColumns[newTask.category].tasks, response.data]
          }
        }));
  
        setNewTask({ title: '', description: '', category: 'to-do' });
        setIsModalOpen(false);
        toast.success('Task added successfully!');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task. Please try again.');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      category: task.category
    });
    setIsModalOpen(true);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();

    if (newTask.title.length > 50) {
      toast.error('Title must be less than 50 characters');
      return;
    }

    if (newTask.description.length > 200) {
      toast.error('Description must be less than 200 characters');
      return;
    }

    const updatedColumns = {
      ...columns,
      [editingTask.category]: {
        ...columns[editingTask.category],
        tasks: columns[editingTask.category].tasks.map(task =>
          task.id === editingTask.id
            ? { ...task, ...newTask }
            : task
        )
      }
    };

    setColumns(updatedColumns);
    setIsModalOpen(false);
    setEditingTask(null);
    setNewTask({ title: '', description: '', category: 'to-do' });
    toast.success('Task updated successfully!');
  };

  const handleDeleteTask = (taskId, category) => {
    setColumns({
      ...columns,
      [category]: {
        ...columns[category],
        tasks: columns[category].tasks.filter(task => task.id !== taskId)
      }
    });
    toast.success('Task deleted successfully!');
  };

  return (
    <div className=" bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="mt-1 text-gray-600">Organize and track your tasks efficiently</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setNewTask({ title: '', description: '', category: 'to-do' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {/* Task Columns */}
        <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(columns).map(column => (
            <div key={column.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className={`p-4 ${column.bgColor}`}>
                <div className="flex items-center gap-2">
                  <column.icon className={`w-5 h-5 ${column.color}`} />
                  <h2 className="font-semibold">{column.title}</h2>
                  <span className="ml-auto bg-white px-2 py-0.5 rounded text-sm">
                    {column.tasks.length}
                  </span>
                </div>
              </div>

              <DroppableContainer 
                id={column.id} 
                className="p-4 min-h-[200px]"
              >
                <SortableContext
                  items={column.tasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {column.tasks.map((task) => (
                    <SortableItem 
                      key={task.id} 
                      id={task.id}
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <TaskCard
                          task={task}
                          onEdit={() => handleEditTask(task)}
                          onDelete={() => handleDeleteTask(task.id, task.category)}
                        />
                      </div>
                    </SortableItem>
                  ))}
                  {column.tasks.length === 0 && (
                    <div className="text-gray-400 text-center py-4">
                      Drop tasks here
                    </div>
                  )}
                </SortableContext>
              </DroppableContainer>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="transform-none">
              <TaskCard
                task={Object.values(columns)
                  .flatMap(col => col.tasks)
                  .find(task => task.id === activeId)}
                isDragging
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl max-w-md w-full"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">
                  {editingTask ? 'Edit Task' : 'Add New Task'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                    setNewTask({ title: '', description: '', category: 'to-do' });
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter task title"
                      maxLength={50}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {newTask.title.length}/50 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter task description"
                      rows="3"
                      maxLength={200}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {newTask.description.length}/200 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="to-do">To-Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingTask(null);
                      setNewTask({ title: '', description: '', category: 'to-do' });
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTask ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskManagement;