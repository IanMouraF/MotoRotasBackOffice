// Status possíveis para as rotas
export type RouteStatus = "ready" | "in_progress" | "completed";

// Interface para representar um entregador/motoboy
export interface DeliveryPerson {
  id: string;
  name: string;
  avatarUrl?: string; // Opcional
}

// Interface para representar uma rota de entrega
export interface Route {
  id: string;
  externalId: string; // Ex: "Rota #541"
  status: RouteStatus;
  deliveryPerson?: DeliveryPerson;
  deliveryCount: number;
  startTime: string; // Formato ISO 8601
  estimatedDuration: number; // Em minutos
}

// Payload para atualização de rotas
export interface RouteUpdatePayload {
  status?: RouteStatus;
  deliveryPersonId?: string;
}

export type DeliveryStatus = "aguardando" | "entregue" | "cancelada";

export interface Delivery {
  customerName: string;
  address: string;
  status: DeliveryStatus;
  estimatedTime: string;
  notes?: string;
}
