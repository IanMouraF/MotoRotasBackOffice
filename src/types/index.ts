export type RouteStatus = "ready" | "in_progress" | "completed";

export interface DeliveryPerson {
  id: string;
  name: string;
  avatarUrl?: string;
}

// Novo tipo para os pedidos que vêm do Python
export interface Order {
  id: string;
  sequence: number;
  coords: {
    lat: number;
    lon: number;
  };
}

export interface Route {
  id: string;
  externalId: string;
  status: RouteStatus;
  deliveryPerson?: DeliveryPerson;
  deliveryCount: number;
  startTime: string;
  estimatedDuration: number;
  orders: Order[]; // Adicionamos a lista de pedidos aqui
}

export interface MoveOrderPayload {
  order_id: string;
  old_route_id: string;
  new_route_id: string | null; // null se for apenas remover da rota
}