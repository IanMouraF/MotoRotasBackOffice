import { X } from "lucide-react";
import type { Delivery, Route, RouteStatus } from "../../types";
import DeliveryCard from "./DeliveryCard";

interface RouteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
}

const mockDeliveries: Delivery[] = [
  {
    customerName: "Ana Banana",
    address: "Rua das Flores, 123",
    status: "entregue",
    estimatedTime: "10:45",
  },
  {
    customerName: "Carlos Daniel",
    address: "Avenida Principal, 456",
    status: "aguardando",
    estimatedTime: "11:00",
  },
  {
    customerName: "Mariana Xavier",
    address: "Praça da Sé, 789",
    status: "cancelada",
    estimatedTime: "11:15",
    notes: "Cliente pediu para cancelar.",
  },
];

const RouteDetailsModal = ({
  isOpen,
  onClose,
  route,
}: RouteDetailsModalProps) => {
  if (!isOpen || !route) return null;

  const getStatusLabel = (status: RouteStatus) => {
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
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Detalhes da rota</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Main Info */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-gray-500">ID da Rota</p>
              <p className="font-semibold text-gray-800">{route.externalId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500">Status</p>
              <p className="font-semibold text-yellow-600">
                {getStatusLabel(route.status)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500">Motoboy</p>
              <p className="font-semibold text-gray-800">
                {route.deliveryPerson?.name || "Não atribuído"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500">Horário de Início</p>
              <p className="font-semibold text-gray-800">
                {formatTime(route.startTime)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500">Duração Estimada</p>
              <p className="font-semibold text-gray-800">
                {route.estimatedDuration} min
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500">Total de Entregas</p>
              <p className="font-semibold text-gray-800">
                {route.deliveryCount}
              </p>
            </div>
          </div>

          {/* Deliveries List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Entregas ({mockDeliveries.length})
            </h3>
            <div className="space-y-4">
              {mockDeliveries.map((delivery, index) => (
                <DeliveryCard key={index} {...delivery} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 mt-auto border-t border-gray-200 flex justify-end gap-4">
          <button className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 cursor-pointer">
            Encerrar Rota
          </button>
          <button className="px-6 py-2 bg-ifood-red text-white font-semibold rounded-lg hover:bg-red-700 cursor-pointer">
            Atualizar Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailsModal;
