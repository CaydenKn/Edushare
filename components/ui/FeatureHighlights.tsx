import React from 'react';
import { Upload, BookOpen, Users } from 'lucide-react';

export default function FeatureHighlights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Upload className="w-10 h-10 text-blue-500" />
        <div>
          <h3 className="text-xl font-semibold text-blue-500">Easy Uploads</h3>
          <p className="text-gray-600">Share your PDFs, docs, and other study materials with ease.</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 ">
        <BookOpen className="w-10 h-10 text-green-500" />
        <div>
          <h3 className="text-xl font-semibold text-blue-500">Learn from Peers</h3>
          <p className="text-gray-600">Access a wide range of student-created study resources.</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Users className="w-10 h-10 text-purple-500" />
        <div>
          <h3 className="text-xl font-semibold text-blue-500">Collaborative Learning</h3>
          <p className="text-gray-600">Connect with students from around the world.</p>
        </div>
      </div>
    </div>
  );
}