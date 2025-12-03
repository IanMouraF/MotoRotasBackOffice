import axios from "axios";
import type { DeliveryPerson, Route, RouteStatus, MoveOrderPayload } from "../types";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- ADAPTER (Tradução da VOLTA: Python -> React) ---
const mapPythonRouteToReact = (pyRoute: any): Route => {
  let status: RouteStatus = 'ready';
  if (pyRoute.status === 'assigned' || pyRoute.status === 'in_progress') {
    status = 'in_progress';
  }
  if (pyRoute.status === 'completed' || pyRoute.status === 'finished') {
    status = 'completed';
  }

  return {
    id: String(pyRoute.id),
    externalId: `Rota #${pyRoute.id}`,
    status: status,
    // AGORA USAMOS O NOME REAL QUE VEM DO JOIN DO BANCO
    deliveryPerson: pyRoute.motoboy_id ? { 
      id: String(pyRoute.motoboy_id), 
      name: pyRoute.motoboy_name || "Motoboy (Sem nome)" 
    } : undefined,
    deliveryCount: pyRoute.orders ? pyRoute.orders.length : 0,
    startTime: pyRoute.created_at || new Date().toISOString(),
    estimatedDuration: 0,
    orders: pyRoute.orders ? pyRoute.orders.map((o: any) => ({
      id: o.id,
      sequence: o.sequence,
      coords: o.coords
    })) : []
  };
};

// --- ENDPOINTS ---

export const getRoutes = async (): Promise<Route[]> => {
  const { data } = await api.get("/routes");
  return data.map(mapPythonRouteToReact);
};

export const getDeliveryPeople = async (): Promise<DeliveryPerson[]> => {
  const { data } = await api.get("/motoboys");
  return data.map((d: any) => ({
    id: String(d.id),
    name: d.name,
    avatarUrl: undefined
  }));
};

export const assignDeliveryPerson = async (routeId: string, deliveryPersonId: string): Promise<void> => {
  await api.post(`/routes/${routeId}/assign`, { motoboy_id: deliveryPersonId });
};

export const moveOrder = async (payload: MoveOrderPayload): Promise<void> => {
  await api.post("/orders/move", payload);
};

export const createDeliveryPerson = async (data: { name: string }): Promise<void> => {
  await api.post("/motoboys", data);
};

// --- TRADUÇÃO DA IDA (React -> Python) ---
export const updateRouteStatus = async (routeId: string, status: RouteStatus): Promise<void> => {
  let backendStatus = 'created'; // padrão

  // Traduz o status do React para o que o Banco espera
  if (status === 'ready') backendStatus = 'created';
  if (status === 'in_progress') backendStatus = 'assigned';
  if (status === 'completed') backendStatus = 'completed';

  await api.patch(`/routes/${routeId}`, { status: backendStatus });
};

export const unassignDeliveryPerson = async (routeId: string): Promise<void> => {
  await api.post(`/routes/${routeId}/unassign`);
};

export const deleteRoute = async (routeId: string): Promise<void> => console.warn("Delete não implementado");

export default api;