import { useState, useEffect, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { Edit2, Trash2, Plus, ListTodo, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { AuthContext } from '../Providers/AuthProvider';


const TaskManagement = () => {
  const { user } = useContext(AuthContext); // Get the authenticated user
  console.log(user.email);
  const [tasks, setTasks] = useState({
    'to-do': [],
    'in-progress': [],
    'done': []
  });
  const [ws, setWs] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'to-do'
  });
  const [editingTask, setEditingTask] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket('wss://taskify-socket.onrender.com');
    
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateTasksFromServer();
    };

    setWs(websocket);
    return () => websocket.close();
  }, []);

  // Fetch tasks from server for the authenticated user
  const updateTasksFromServer = () => {
    if (!user || !user.email) return; // Ensure the user is authenticated

    axios.get(`https://taskify-socket.onrender.com/tasks?user=${user.email}`) // Pass user email as a query parameter
      .then(res => {
        const categorizedTasks = {
          'to-do': [],
          'in-progress': [],
          'done': []
        };
        
        res.data.forEach(task => {
          const category = task.category || 'to-do';
          if (categorizedTasks[category]) {
            categorizedTasks[category].push(task);
          }
        });
        
        setTasks(categorizedTasks);
      })
      .catch(err => console.error("Error fetching tasks:", err));
  };

  useEffect(() => {
    updateTasksFromServer();
  }, [user]); // Re-fetch tasks when the user changes

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
  
    if (!destination) return;
  
    const sourceCategory = source.droppableId;
    const destinationCategory = destination.droppableId;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;
  
    const task = tasks[sourceCategory][sourceIndex];
  
    if (!task) return;
  
    const newTasks = { ...tasks };
    newTasks[sourceCategory].splice(sourceIndex, 1);
    newTasks[destinationCategory].splice(destinationIndex, 0, task);
    
    newTasks[destinationCategory].forEach((task, index) => {
      task.order = index;
    });
  
    if (sourceCategory === destinationCategory) {
      newTasks[sourceCategory].forEach((task, index) => {
        task.order = index;
      });
    }
  
    setTasks(newTasks);
  
    const updatedTask = {
      category: destinationCategory,
      order: destinationIndex
    };
  
    axios.put(`https://taskify-socket.onrender.com/tasks/${task._id}`, updatedTask)
      .then(() => {
        const updatedTasks = newTasks[destinationCategory].map((task, index) => ({
          ...task,
          order: index
        }));
  
        axios.put("https://taskify-socket.onrender.com/tasks/bulk-update", {
          tasks: updatedTasks
        })
          .catch(err => {
            console.error("Error updating task order:", err);
          });
      })
      .catch(err => {
        console.error("Error updating task:", err);
        const revertedTasks = { ...tasks };
        revertedTasks[destinationCategory].splice(destinationIndex, 1);
        revertedTasks[sourceCategory].splice(sourceIndex, 0, task);
        setTasks(revertedTasks);
      });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    
    const taskData = {
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      timestamp: new Date().toISOString(),
      user: user.email // Add the authenticated user's email to the task
    };

    axios.post("https://taskify-socket.onrender.com/tasks", taskData)
      .then(() => {
        setIsAddingTask(false);
        setNewTask({ title: '', description: '', category: 'to-do' });
        updateTasksFromServer();
      })
      .catch(err => {
        console.error("Error adding task:", err);
      });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsEditingTask(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    
    const updatedTask = {
      title: editingTask.title,
      description: editingTask.description
    };

    axios.put(`https://taskify-socket.onrender.com/tasks/${editingTask._id}`, updatedTask)
      .then(() => {
        setIsEditingTask(false);
        updateTasksFromServer();
      })
      .catch(err => {
        console.error("Error updating task:", err);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`https://taskify-socket.onrender.com/tasks/${id}`)
      .then(() => {
        updateTasksFromServer();
      })
      .catch(err => {
        console.error("Error deleting task:", err);
      });
  };

  const columnConfigs = {
    'to-do': {
      icon: ListTodo,
      title: 'To Do',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    'in-progress': {
      icon: Clock,
      title: 'In Progress',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    'done': {
      icon: CheckCircle2,
      title: 'Done',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  };

  return (
    <div className="  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Task Management</h1>
          <p className="text-xl text-gray-600">Organize and track your tasks efficiently</p>
          <button
            onClick={() => setIsAddingTask(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add New Task
          </button>
        </div>

        {/* Task Columns */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(tasks).map(([category, categoryTasks]) => (
              <div key={category} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className={`p-6 ${columnConfigs[category].bgColor}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white ${columnConfigs[category].color}`}>
                      {/* <columnConfigs[category].icon className="w-6 h-6" /> */}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{columnConfigs[category].title}</h2>
                      <p className="text-sm text-gray-600">{categoryTasks.length} tasks</p>
                    </div>
                  </div>
                </div>

                <Droppable droppableId={category}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="p-4 min-h-[600px]"
                    >
                      {categoryTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-medium text-gray-900">{task.title}</h3>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEdit(task)}
                                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4 text-gray-500" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(task._id)}
                                    className="p-1 hover:bg-red-50 rounded-md transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </div>
                              {task.description && (
                                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                              )}
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-4 h-4" />
                                {new Date(task.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Add Task Modal */}
        {isAddingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold text-gray-900">Add New Task</h2>
              </div>
              <form onSubmit={handleAddTask} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="to-do">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {isEditingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold text-gray-900">Edit Task</h2>
              </div>
              <form onSubmit={handleSaveEdit} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingTask(false)}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;