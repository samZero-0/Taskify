// Sidebar.jsx

import { 
  Home,
  CheckSquare,
  Calendar,
  Settings,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: <Home size={20} />, text: 'Dashboard', path: '/' },
    { icon: <CheckSquare size={20} />, text: 'Tasks', path: '/tasks' },
    { icon: <Calendar size={20} />, text: 'Calendar', path: '/calendar' },
    { icon: <Settings size={20} />, text: 'Settings', path: '/settings' },
  ];

  return (
    <div 
      className={`
        fixed lg:static
        h-full bg-gray-800 text-white
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
      `}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-0 top-4 translate-x-1/2 bg-gray-800 p-2 rounded-full lg:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Logo Area */}
      <div className="p-4 h-16 flex items-center border-b border-gray-700">
        {isOpen ? (
          <h1 className="text-xl font-bold">Todo App</h1>
        ) : (
          <h1 className="text-xl font-bold">T</h1>
        )}
      </div>

      {/* Menu Items */}
      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
          >
            <span className="flex items-center justify-center">{item.icon}</span>
            {isOpen && <span className="ml-4">{item.text}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;