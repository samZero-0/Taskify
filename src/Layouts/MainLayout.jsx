// Layout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100 ml-16 lg:ml-0">
        <div className=" mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;