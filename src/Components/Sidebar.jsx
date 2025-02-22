// Sidebar.jsx
import { IoLogOutSharp } from "react-icons/io5";
import { 
  Home,
  CheckSquare,
  Calendar,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../Providers/AuthProvider';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: <Home size={20} />, text: 'Dashboard', path: '/home' },
    // { icon: <CheckSquare size={20} />, text: 'Tasks', path: '/tasks' },
    // { icon: <Calendar size={20} />, text: 'Calendar', path: '/calendar' },
    // { icon: <Settings size={20} />, text: 'Settings', path: '/settings' },
    
  ];

  const {user,logOut} = useContext(AuthContext);


  const handleLogout = async () => {
    try {
        await logOut();
        console.log("Logged out successfully");
        console.log(user);

    } catch (error) {
        console.error("Error logging out:", error);
    }
};

//   console.log(user);
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
          <h1 className="text-xl font-bold">Taskify</h1>
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


    <div 
  onClick={handleLogout} 
  className='px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors duration-200'
>
  <IoLogOutSharp className="text-lg" />
  Log out
</div>
        
       
    </div>
  );
};

export default Sidebar;