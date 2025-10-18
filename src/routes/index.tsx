import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import DeliveryPeople from "../pages/DeliveryPeople";
import RouteDetailsPage from "../pages/RouteDetailsPage";
import RoutesPage from "../pages/Routes";
import Settings from "../pages/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rotas" element={<RoutesPage />} />
      <Route path="/rotas/:routeId" element={<RouteDetailsPage />} />
      <Route path="/motoboys" element={<DeliveryPeople />} />
      <Route path="/configuracoes" element={<Settings />} />
    </Routes>
  );
};

export default AppRoutes;
