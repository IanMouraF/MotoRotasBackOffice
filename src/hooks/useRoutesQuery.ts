import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignDeliveryPerson,
  deleteRoute,
  getDeliveryPeople,
  getRoutes,
  updateRouteStatus,
} from "../api/routesApi";
import type { Route, RouteStatus } from "../types";

// Hook para buscar todas as rotas
export const useGetRoutes = () => {
  return useQuery({
    queryKey: ["routes"],
    queryFn: getRoutes,
  });
};

// Hook para buscar todos os entregadores
export const useGetDeliveryPeople = () => {
  return useQuery({
    queryKey: ["deliveryPeople"],
    queryFn: getDeliveryPeople,
  });
};

// Hook para atualizar o status de uma rota
export const useUpdateRouteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      routeId,
      status,
    }: {
      routeId: string;
      status: RouteStatus;
    }) => updateRouteStatus(routeId, status),
    // Optimistic update
    onMutate: async ({ routeId, status }) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ["routes"] });

      // Salvar o estado anterior
      const previousRoutes = queryClient.getQueryData<Route[]>(["routes"]);

      // Atualizar otimisticamente
      if (previousRoutes) {
        queryClient.setQueryData<Route[]>(
          ["routes"],
          previousRoutes.map((route) =>
            route.id === routeId ? { ...route, status } : route
          )
        );
      }

      return { previousRoutes };
    },
    // Se a mutação falhar, reverter para o estado anterior
    onError: (_err, _variables, context) => {
      if (context?.previousRoutes) {
        queryClient.setQueryData(["routes"], context.previousRoutes);
      }
    },
    // Sempre refetch após sucesso ou erro
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};

// Hook para atribuir um entregador a uma rota
export const useAssignDeliveryPerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      routeId,
      deliveryPersonId,
    }: {
      routeId: string;
      deliveryPersonId: string;
    }) => assignDeliveryPerson(routeId, deliveryPersonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};

// Hook para deletar uma rota
export const useDeleteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routeId: string) => deleteRoute(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};
