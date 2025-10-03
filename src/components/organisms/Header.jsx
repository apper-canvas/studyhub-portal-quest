import { NavLink } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
const Header = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/courses", label: "Courses", icon: "BookOpen" },
    { path: "/assignments", label: "Assignments", icon: "CheckSquare" },
    { path: "/grades", label: "Grades", icon: "Award" },
  ];
return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">StudyHub</h1>
                <p className="text-xs text-gray-500">Fall 2024</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    )
                  }
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200">
              <ApperIcon name="Bell" size={20} />
            </button>
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200">
              <ApperIcon name="Settings" size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
            >
              <ApperIcon name="LogOut" size={20} />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                )
              }
            >
              <ApperIcon name={item.icon} size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;