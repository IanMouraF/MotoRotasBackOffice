import { Bell, Plus, RefreshCw, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useUIStore } from "../../store/useUIStore";

const getTitle = (pathname: string) => {
  switch (pathname) {
    case "/":
    case "/dashboard":
      return "Dashboard";
    case "/rotas":
      return "Rotas de Entrega";
    case "/motoboys":
      return "Motoboys";
    case "/configuracoes":
      return "Configurações";
    default:
      if (pathname.startsWith("/rotas/")) {
        return "Detalhes da Rota";
      }
      return "Dashboard";
  }
};

const Header = () => {
  const location = useLocation();
  const { openCreateRouteModal } = useUIStore();
  const title = getTitle(location.pathname);

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">
          <RefreshCw className="h-5 w-5" />
        </button>
        <button
          onClick={openCreateRouteModal}
          className="flex items-center bg-ifood-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md cursor-pointer"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span className="font-semibold">Adicionar Rota</span>
        </button>
        <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
          <User className="h-6 w-6 text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;
