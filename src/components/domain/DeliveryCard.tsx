import { CheckCircle, Circle, XCircle } from "lucide-react";

interface DeliveryCardProps {
  customerName: string;
  address: string;
  status: "aguardando" | "entregue" | "cancelada";
  estimatedTime: string;
  notes?: string;
}

const statusConfig = {
  aguardando: {
    icon: Circle,
    color: "text-yellow-500",
    label: "Aguardando",
  },
  entregue: {
    icon: CheckCircle,
    color: "text-green-500",
    label: "Entregue",
  },
  cancelada: {
    icon: XCircle,
    color: "text-red-500",
    label: "Cancelada",
  },
};

const DeliveryCard = ({
  customerName,
  address,
  status,
  estimatedTime,
  notes,
}: DeliveryCardProps) => {
  const { icon: Icon, color, label } = statusConfig[status];

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-gray-800">{customerName}</p>
          <p className="text-sm text-gray-600">{address}</p>
        </div>
        <div
          className={`flex items-center gap-2 text-sm font-semibold ${color}`}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-500">
        <p>
          Horário estimado:{" "}
          <span className="font-medium text-gray-700">{estimatedTime}</span>
        </p>
        {notes && <p className="mt-1">Obs: {notes}</p>}
      </div>
    </div>
  );
};

export default DeliveryCard;
