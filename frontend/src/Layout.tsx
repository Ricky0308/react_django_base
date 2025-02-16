import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Header } from '@/components/Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow px-0">
        <Outlet />
      </main>
      <footer className="bg-lightblue-500 text-white p-4 text-center">
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default Layout;