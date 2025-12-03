import { User } from "lucide-react";
import React, { useState } from "react";
import RouteCard from "../components/domain/RouteCard";
import StatusColumn from "../components/domain/StatusColumn";
import {
  useAssignDeliveryPerson,
  useGetDeliveryPeople,
  useGetRoutes,
  useUpdateRouteStatus,
} from "../hooks/useRoutesQuery";
import { useUIStore } from "../store/useUIStore";
import type { RouteStatus } from "../types";

const Dashboard = () => {
  const openRouteDetailsModal = useUIStore(
    (state) => state.openRouteDetailsModal
  );
  const { data: routes, isLoading } = useGetRoutes();
  const { data: allMotoboys } = useGetDeliveryPeople();

  const updateStatusMutation = useUpdateRouteStatus();
  const assignMotoboyMutation = useAssignDeliveryPerson();

  const [draggedRouteId, setDraggedRouteId] = useState<string | null>(null);

  // --- LÓGICA DE FILTRAGEM ---
  const busyMotoboyIds = new Set(
    routes
      ?.filter((r) => r.deliveryPerson && r.status !== "completed")
      .map((r) => r.deliveryPerson!.id)
  );

  const availableMotoboys = allMotoboys?.filter(
    (m) => !busyMotoboyIds.has(m.id)
  );

  // --- Drag handlers ---
  const handleMotoboyDragStart = (e: React.DragEvent, motoboyId: string) => {
    e.dataTransfer.setData("motoboyId", motoboyId);
    e.dataTransfer.setData("type", "motoboy");
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleMotoboyDropOnRoute = (routeId: string, motoboyId: string) => {
    assignMotoboyMutation.mutate({ routeId, deliveryPersonId: motoboyId });
  };

  const handleRouteDragStart = (e: React.DragEvent, routeId: string) => {
    setDraggedRouteId(routeId);
    e.dataTransfer.setData("type", "route");
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleColumnDrop = (
    e: React.DragEvent,
    targetStatus: RouteStatus
  ) => {
    e.preventDefault();

    if (!draggedRouteId) return;

    const route = routes?.find((r) => r.id === draggedRouteId);
    if (!route) return;

    // --- CORREÇÃO: REMOVIDA A LÓGICA DE UNASSIGN AO VOLTAR PARA PRONTO ---
    // Agora ele apenas atualiza o status, mantendo o motoboy na rota.

    // LÓGICA DE BLOQUEIO (Só impede avançar se não tiver motoboy)
    const isMovingForward =
      (targetStatus === "in_progress" || targetStatus === "completed") &&
      route.status === "ready";
      
    const hasMotoboy = !!route.deliveryPerson;

    if (isMovingForward && !hasMotoboy) {
      alert("⚠️ Você precisa atribuir um motoboy antes de iniciar a rota!");
      setDraggedRouteId(null);
      return;
    }

    // Atualiza o status (seja avançando ou voltando)
    updateStatusMutation.mutate({
      routeId: draggedRouteId,
      status: targetStatus,
    });
    setDraggedRouteId(null);
  };

  if (isLoading) return <div className="p-6">Carregando kanban...</div>;

  const ready = routes?.filter((r) => r.status === "ready") || [];
  const inProgress = routes?.filter((r) => r.status === "in_progress") || [];
  const completed = routes?.filter((r) => r.status === "completed") || [];

  return (
    <div className="flex flex-col h-full gap-6">
      {/* BARRA DE MOTOBOYS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center justify-between">
          <span>
            Entregadores Disponíveis ({availableMotoboys?.length || 0})
          </span>
          <span className="text-xs font-normal normal-case text-gray-400">
            Arraste para atribuir
          </span>
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 min-h-[50px]">
          {availableMotoboys?.map((motoboy) => (
            <div
              key={motoboy.id}
              draggable
              onDragStart={(e) => handleMotoboyDragStart(e, motoboy.id)}
              className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 cursor-grab active:cursor-grabbing hover:bg-green-100 transition-colors shadow-sm"
            >
              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-700">
                <User size={14} />
              </div>
              <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">
                {motoboy.name}
              </span>
            </div>
          ))}
          {(!availableMotoboys || availableMotoboys.length === 0) && (
            <div className="text-sm text-gray-400 italic flex items-center justify-center w-full">
              Todos os motoboys estão ocupados ou não há cadastros.
            </div>
          )}
        </div>
      </div>

      {/* COLUNAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div
          onDragOver={handleColumnDragOver}
          onDrop={(e) => handleColumnDrop(e, "ready")}
        >
          <StatusColumn title="Pronto (Aguardando)">
            {ready.map((route) => (
              <div
                key={route.id}
                draggable
                onDragStart={(e) => handleRouteDragStart(e, route.id)}
                onClick={() => openRouteDetailsModal(route)}
              >
                <RouteCard
                  {...route}
                  onDropMotoboy={handleMotoboyDropOnRoute}
                />
              </div>
            ))}
          </StatusColumn>
        </div>

        <div
          onDragOver={handleColumnDragOver}
          onDrop={(e) => handleColumnDrop(e, "in_progress")}
        >
          <StatusColumn title="Em Rota 🏍️">
            {inProgress.map((route) => (
              <div
                key={route.id}
                draggable
                onDragStart={(e) => handleRouteDragStart(e, route.id)}
                onClick={() => openRouteDetailsModal(route)}
              >
                <RouteCard
                  {...route}
                  onDropMotoboy={handleMotoboyDropOnRoute}
                />
              </div>
            ))}
          </StatusColumn>
        </div>

        <div
          onDragOver={handleColumnDragOver}
          onDrop={(e) => handleColumnDrop(e, "completed")}
        >
          <StatusColumn title="Concluído ✅">
            {completed.map((route) => (
              <div
                key={route.id}
                draggable
                onDragStart={(e) => handleRouteDragStart(e, route.id)}
                onClick={() => openRouteDetailsModal(route)}
              >
                <RouteCard
                  {...route}
                  onDropMotoboy={handleMotoboyDropOnRoute}
                />
              </div>
            ))}
          </StatusColumn>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;