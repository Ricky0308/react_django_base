import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-lightblue-500 text-white shadow-md">
        <nav className="container mx-auto p-4 bg-opacity-75">
          <ul className="flex space-x-4">
            <li><Link to="/login" className="hover:bg-lightblue-200">Login</Link></li>
            <li><Link to="/logout" className="hover:bg-lightblue-200">Logout</Link></li>
            <li><Link to="/signup" className="hover:bg-lightblue-200">Signup</Link></li>
            <li><Link to="/password-reset" className="hover:bg-lightblue-200">Password Reset</Link></li>
            <li><Link to="/user-delete" className="hover:bg-lightblue-200">User Deletion</Link></li>
            <li><Link to="/user-list" className="hover:bg-lightblue-200">User List</Link></li>
            <li><Link to="/sample" className="hover:bg-lightblue-200">Sample Page</Link></li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <footer className="bg-lightblue-500 text-white p-4 text-center">
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default Layout; 