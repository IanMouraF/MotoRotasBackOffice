import RouteCard from "../components/domain/RouteCard";
import StatusColumn from "../components/domain/StatusColumn";
import { useGetRoutes } from "../hooks/useRoutesQuery";
import { useUIStore } from "../store/useUIStore";

const Dashboard = () => {
  const openRouteDetailsModal = useUIStore(
    (state) => state.openRouteDetailsModal
  );

  const { data: routes, isLoading, error } = useGetRoutes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Carregando rotas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600">
          Erro ao carregar rotas. Verifique se o JSON Server está rodando.
        </p>
      </div>
    );
  }

  const ready = routes?.filter((r) => r.status === "ready") || [];
  const inProgress = routes?.filter((r) => r.status === "in_progress") || [];
  const completed = routes?.filter((r) => r.status === "completed") || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
      <StatusColumn title="Pronto">
        {ready.map((route) => (
          <div
            key={route.id}
            onClick={() => openRouteDetailsModal(route)}
            className="cursor-pointer"
          >
            <RouteCard {...route} />
          </div>
        ))}
      </StatusColumn>
      <StatusColumn title="Em rota">
        {inProgress.map((route) => (
          <div
            key={route.id}
            onClick={() => openRouteDetailsModal(route)}
            className="cursor-pointer"
          >
            <RouteCard {...route} />
          </div>
        ))}
      </StatusColumn>
      <StatusColumn title="Concluído">
        {completed.map((route) => (
          <div
            key={route.id}
            onClick={() => openRouteDetailsModal(route)}
            className="cursor-pointer"
          >
            <RouteCard {...route} />
          </div>
        ))}
      </StatusColumn>
    </div>
  );
};

export default Dashboard;
