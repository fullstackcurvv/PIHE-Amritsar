import * as React from "react";
import { Button } from "../ui/button";

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">ISKCON</h1>
              <p className="text-xs text-gray-600 -mt-0.5">COURSE PORTAL</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">
              Home
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">
              About Us
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">
              Courses
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">
              How It Works
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">
              Exam Guidelines
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">
              Contact Us
            </a>
            <a href="#" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              Temple Registration
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              Login
            </Button>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
