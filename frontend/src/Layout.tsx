import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/logout">Logout</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/password-reset">Password Reset</Link></li>
            <li><Link to="/user-delete">User Deletion</Link></li>
            <li><Link to="/user-list">User List</Link></li>
            <li><Link to="/sample">Sample</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default Layout; 