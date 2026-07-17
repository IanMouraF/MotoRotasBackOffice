import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignDeliveryPerson,
  createDeliveryPerson,
  getDeliveryPeople,
  getRoutes,
  moveOrder,
  updateRouteStatus,
  unassignDeliveryPerson,
} from "../api/routesApi";
import type { MoveOrderPayload, RouteStatus } from "../types";

export const useGetRoutes = () => {
  return useQuery({
    queryKey: ["routes"],
    queryFn: getRoutes,
    refetchInterval: 5000, // Atualiza a cada 5s para ver novos pedidos do Python
  });
};

export const useGetDeliveryPeople = () => {
  return useQuery({
    queryKey: ["deliveryPeople"],
    queryFn: getDeliveryPeople,
  });
};

export const useAssignDeliveryPerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, deliveryPersonId }: { routeId: string; deliveryPersonId: string }) => 
      assignDeliveryPerson(routeId, deliveryPersonId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routes"] }),
  });
};

export const useMoveOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MoveOrderPayload) => moveOrder(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routes"] }),
  });
};

// --- NOVOS HOOKS ---

export const useCreateDeliveryPerson = () => {
  const queryClient = useQueryClient();
  // Removemos 'phone' da definição do tipo aqui
  return useMutation({
    mutationFn: (data: { name: string }) => createDeliveryPerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveryPeople"] });
    },
  });
};

// Hook para atualizar status (Drag & Drop)
export const useUpdateRouteStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, status }: { routeId: string; status: RouteStatus }) => 
      updateRouteStatus(routeId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routes"] }),
  });
};

export const useDeleteRoute = () => { return useMutation({ mutationFn: async () => {} }) };

export const useUnassignDeliveryPerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (routeId: string) => unassignDeliveryPerson(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["deliveryPeople"] }); // Atualiza status dos motoboys
    },
  });
};