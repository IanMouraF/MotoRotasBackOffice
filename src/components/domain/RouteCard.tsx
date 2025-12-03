import { Clock, Package, User } from "lucide-react";
import type { Route, RouteStatus } from "../../types";

interface RouteCardProps extends Route {
  // Nova prop para lidar com o drop do motoboy
  onDropMotoboy?: (routeId: string, motoboyId: string) => void;
}

const RouteCard = ({
  id, // precisamos do ID
  externalId,
  deliveryPerson,
  deliveryCount,
  status,
  startTime,
  estimatedDuration,
  onDropMotoboy
}: RouteCardProps) => {
  
  const getStatusConfig = (status: RouteStatus) => {
    switch (status) {
      case "ready": return { color: "bg-blue-100 text-blue-800", label: "Pronto" };
      case "in_progress": return { color: "bg-yellow-100 text-yellow-800", label: "Em Rota" };
      case "completed": return { color: "bg-green-100 text-green-800", label: "Concluído" };
      default: return { color: "bg-gray-100 text-gray-800", label: status };
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } catch { return "--:--"; }
  };

  const statusConfig = getStatusConfig(status);

  // --- Lógica de Drop ---
  const handleDrop = (e: React.DragEvent) => {
    // Se estiver arrastando um motoboy (não uma rota)
    const motoboyId = e.dataTransfer.getData("motoboyId");
    if (motoboyId && onDropMotoboy) {
      e.preventDefault();
      e.stopPropagation(); // Impede que o evento suba para a coluna
      onDropMotoboy(id, motoboyId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    // Só permite soltar se tiver "motoboyId" sendo arrastado
    if (e.dataTransfer.types.includes("motoboyid")) { // lowercase é bug comum do browser
      e.preventDefault();
    }
  };

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`bg-white rounded-lg shadow-sm p-4 border transition-all duration-200 cursor-pointer 
        ${deliveryPerson ? 'border-l-4 border-l-blue-500' : 'border-gray-200'} 
        hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-gray-800">{externalId}</h3>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center">
          <Package className="h-4 w-4 mr-3 text-gray-400" />
          <span className="font-medium">{deliveryCount} entregas na rota</span>
        </div>
        <div className="flex items-center">
          <User className={`h-4 w-4 mr-3 ${deliveryPerson ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className={`font-medium ${deliveryPerson ? 'text-blue-700' : 'text-gray-500'}`}>
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