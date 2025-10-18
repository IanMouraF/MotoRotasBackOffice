import {
  Bike,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Map,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Map, label: "Rotas", path: "/rotas" },
  { icon: Bike, label: "Motoboys", path: "/motoboys" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`relative flex flex-col bg-sidebar-background transition-all duration-300 ease-in-out h-screen border-r border-gray-200 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
        {!isCollapsed && (
          <span className="text-2xl font-bold text-ifood-red">MotoRotas</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-gray-200"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="flex-1 mt-6">
        <ul>
          {navItems.map(({ icon: Icon, label, path }) => (
            <li key={label} className="px-4">
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 my-1 rounded-lg transition-colors duration-200 relative ${
                    isActive
                      ? "bg-red-50 text-ifood-red font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                {location.pathname === path && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-ifood-red rounded-r-full"></div>
                )}
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-4">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
