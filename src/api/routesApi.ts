import axios from "axios";
import type { DeliveryPerson, Route, RouteStatus } from "../types";

// Configuração base do Axios para JSON Server
const api = axios.create({
  baseURL: "http://localhost:3001", // JSON Server configurado na porta 3001
  headers: {
    "Content-Type": "application/json",
  },
});

// GET /routes - Buscar todas as rotas
export const getRoutes = async (): Promise<Route[]> => {
  const { data } = await api.get<Route[]>("/routes");
  return data;
};

// GET /delivery-people - Buscar todos os entregadores
export const getDeliveryPeople = async (): Promise<DeliveryPerson[]> => {
  const { data } = await api.get<DeliveryPerson[]>("/delivery-people");
  return data;
};

// PATCH /routes/:id - Atualizar status da rota
export const updateRouteStatus = async (
  routeId: string,
  status: RouteStatus
): Promise<Route> => {
  const { data } = await api.patch<Route>(`/routes/${routeId}`, { status });
  return data;
};

// PATCH /routes/:id - Atribuir entregador à rota
export const assignDeliveryPerson = async (
  routeId: string,
  deliveryPersonId: string
): Promise<Route> => {
  const { data } = await api.patch<Route>(`/routes/${routeId}`, {
    deliveryPersonId,
  });
  return data;
};

// DELETE /routes/:id - Deletar uma rota
export const deleteRoute = async (routeId: string): Promise<void> => {
  await api.delete(`/routes/${routeId}`);
};

export default api;
