import { useParams } from "react-router-dom";
import { useGetRoutes } from "../hooks/useRoutesQuery";

const RouteDetailsPage = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const { data: routes, isLoading, error } = useGetRoutes();

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Erro ao carregar dados.</p>
      </div>
    );
  }

  const route = routes?.find((r) => r.id === routeId);

  if (!route) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Rota não encontrada
        </h1>
        <p className="mt-4 text-gray-600">
          A rota com ID <strong>{routeId}</strong> não foi encontrada.
        </p>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ready":
        return "Pronto";
      case "in_progress":
        return "Em Rota";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR");
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {route.externalId}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-lg font-semibold text-gray-800">
              {getStatusLabel(route.status)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Motoboy</p>
            <p className="text-lg font-semibold text-gray-800">
              {route.deliveryPerson?.name || "Não atribuído"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Número de Entregas</p>
            <p className="text-lg font-semibold text-gray-800">
              {route.deliveryCount}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Duração Estimada</p>
            <p className="text-lg font-semibold text-gray-800">
              {route.estimatedDuration} minutos
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Horário de Início</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatTime(route.startTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailsPage;
