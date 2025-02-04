import React from 'react';

const SamplePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Tailwind CSS</h1>
      <p className="text-lg text-gray-700 mb-8">
        This is a sample page styled with Tailwind CSS.
      </p>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Click Me
      </button>
    </div>
  );
};

export default SamplePage; 