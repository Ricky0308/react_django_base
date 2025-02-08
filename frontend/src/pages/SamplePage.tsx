import React from 'react';
import { Button } from '@/components/ui/button';
const SamplePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Tailwind CSS</h1>
      <p className="text-lg text-gray-700 mb-8">
        This is a sample page styled with Tailwind CSS.
      </p>
      <Button>
        Click Me
      </Button>
    </div>
  );
};

export default SamplePage; 