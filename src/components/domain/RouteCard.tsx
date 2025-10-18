import { Clock, Package, User } from "lucide-react";
import type { Route, RouteStatus } from "../../types";

const RouteCard = ({
  externalId,
  deliveryPerson,
  deliveryCount,
  status,
  startTime,
  estimatedDuration,
}: Route) => {
  const getStatusConfig = (status: RouteStatus) => {
    switch (status) {
      case "ready":
        return {
          color: "bg-blue-100 text-blue-800",
          label: "Pronto",
        };
      case "in_progress":
        return {
          color: "bg-yellow-100 text-yellow-800",
          label: "Em Rota",
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800",
          label: "Concluído",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          label: status,
        };
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-gray-800">{externalId}</h3>
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full ${statusConfig.color}`}
        >
          {statusConfig.label}
        </span>
      </div>
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center">
          <Package className="h-4 w-4 mr-3 text-gray-400" />
          <span className="font-medium">{deliveryCount} entregas na rota</span>
        </div>
        <div className="flex items-center">
          <User className="h-4 w-4 mr-3 text-gray-400" />
          <span className="font-medium">
            {deliveryPerson?.name || "Sem motoboy atribuído"}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-3 text-gray-400" />
          <span className="font-medium">
            Início: {formatTime(startTime)} (~{estimatedDuration} min)
          </span>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
