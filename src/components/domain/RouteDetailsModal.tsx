import { ChevronDown, MapPin, Trash2, User, UserX, X } from "lucide-react";
import { useState } from "react";
import {
  useAssignDeliveryPerson,
  useGetDeliveryPeople,
  useGetRoutes,
  useMoveOrder,
  useUnassignDeliveryPerson,
} from "../../hooks/useRoutesQuery";
import type { Route, RouteStatus } from "../../types";

interface RouteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
}

const RouteDetailsModal = ({
  isOpen,
  onClose,
  route: initialRoute,
}: RouteDetailsModalProps) => {
  const moveOrderMutation = useMoveOrder();
  const assignMutation = useAssignDeliveryPerson();
  const unassignMutation = useUnassignDeliveryPerson();
  const { data: allRoutes } = useGetRoutes();
  const { data: allMotoboys } = useGetDeliveryPeople();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen || !initialRoute) return null;

  // 1. Rota atualizada
  const liveRoute =
    allRoutes?.find((r) => r.id === initialRoute.id) || initialRoute;

  // 2. Filtra motoboys ocupados
  const busyMotoboyIds = new Set(
    allRoutes
      ?.filter(
        (r) =>
          r.deliveryPerson &&
          r.id !== liveRoute.id &&
          r.status !== "completed"
      )
      .map((r) => r.deliveryPerson!.id)
  );

  const availableMotoboys = allMotoboys?.filter(
    (m) => !busyMotoboyIds.has(m.id)
  );

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

  const handleSelectMotoboy = (motoboyId: string) => {
    assignMutation.mutate({
      routeId: liveRoute.id,
      deliveryPersonId: motoboyId,
    });
    setIsDropdownOpen(false);
  };

  const handleUnassign = () => {
    if (confirm("Tem certeza que deseja remover o motoboy desta rota?")) {
      unassignMutation.mutate(liveRoute.id);
      setIsDropdownOpen(false);
    }
  };

  const handleRemoveOrder = (orderId: string) => {
    if (confirm("Deseja remover este pedido da rota?")) {
      moveOrderMutation.mutate({
        order_id: orderId,
        old_route_id: liveRoute.id,
        new_route_id: null,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {liveRoute.externalId}
            </h2>
            <span className="text-sm text-gray-500 font-medium">
              ID Interno: {liveRoute.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1 bg-white">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex flex-col justify-center">
              <p className="text-blue-600 font-semibold mb-1 text-sm uppercase tracking-wide">
                Status Atual
              </p>
              <span className="text-3xl font-bold text-gray-900">
                {getStatusLabel(liveRoute.status)}
              </span>
            </div>

            {/* Dropdown Customizado */}
            <div className="relative">
              <p className="text-gray-600 font-semibold mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                <User size={16} /> Entregador Responsável
              </p>

              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-4 rounded-xl border border-gray-200 bg-white text-left flex items-center justify-between hover:border-red-300 hover:shadow-md transition-all focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      liveRoute.deliveryPerson
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {liveRoute.deliveryPerson?.name || "Nenhum entregador"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {liveRoute.deliveryPerson
                        ? "Atribuído"
                        : "Clique para selecionar"}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="max-h-60 overflow-y-auto p-2">
                    
                    {/* OPÇÃO DE DESATRIBUIR */}
                    {liveRoute.deliveryPerson && (
                      <>
                        <button
                          onClick={handleUnassign}
                          className="w-full flex items-center gap-3 p-3 mb-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left group border border-red-100"
                        >
                          <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center text-red-600">
                            <UserX size={16} />
                          </div>
                          <div>
                            <span className="font-bold text-red-700 block">
                              Desatribuir
                            </span>
                            <span className="text-xs text-red-500">
                              Remover {liveRoute.deliveryPerson.name}
                            </span>
                          </div>
                        </button>
                        <hr className="border-gray-100 my-2" />
                      </>
                    )}

                    <p className="text-xs font-semibold text-gray-400 px-3 py-2">
                      DISPONÍVEIS
                    </p>

                    {availableMotoboys?.length === 0 && (
                      <p className="text-sm text-gray-400 px-3 pb-2 italic">
                        Ninguém disponível
                      </p>
                    )}

                    {availableMotoboys?.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMotoboy(m.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                          <User size={16} />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-gray-900">
                          {m.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Lista de Pedidos */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              📦 Entregas na Rota{" "}
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm">
                {liveRoute.orders?.length || 0}
              </span>
            </h3>

            {!liveRoute.orders || liveRoute.orders.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">
                  Nenhum pedido nesta rota.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {liveRoute.orders.map((order, index) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:border-red-200 hover:shadow-md transition-all flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-900 text-white font-bold w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          Pedido #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {order.coords.lat.toFixed(4)},{" "}
                            {order.coords.lon.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveOrder(order.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Remover pedido"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailsModal;