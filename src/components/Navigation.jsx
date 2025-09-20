import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, BarChart3, Plus, CheckSquare } from "lucide-react";
import logo from "../assets/Sports_Authority_of_India_logo.svg"

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Add Athlete", icon: <Plus className="w-4 h-4 mr-2" /> },
    { path: "/dashboard", label: "Dashboard", icon: <User className="w-4 h-4 mr-2" /> },
    { path: "/attendance", label: "Attendance", icon: <CheckSquare className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Title */}
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-20 h-20 mr-3" />
            {/* <h1 className="text-xl font-bold text-gray-900">
              Athlete Performance Manager
            </h1> */}
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${location.pathname === item.path
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
