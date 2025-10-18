import { User } from "lucide-react";
import React, { useState } from "react";
import {
  useAssignDeliveryPerson,
  useGetDeliveryPeople,
} from "../../hooks/useRoutesQuery";
import { useUIStore } from "../../store/useUIStore";
import { Button, Modal } from "../core";

export const AssignDeliveryPersonModal: React.FC = () => {
  const { isAssignModalOpen, selectedRouteId, closeAssignModal } = useUIStore();
  const [selectedDeliveryPersonId, setSelectedDeliveryPersonId] = useState<
    string | null
  >(null);

  const { data: deliveryPeople, isLoading } = useGetDeliveryPeople();
  const assignMutation = useAssignDeliveryPerson();

  const handleAssign = () => {
    if (selectedRouteId && selectedDeliveryPersonId) {
      assignMutation.mutate(
        {
          routeId: selectedRouteId,
          deliveryPersonId: selectedDeliveryPersonId,
        },
        {
          onSuccess: () => {
            closeAssignModal();
            setSelectedDeliveryPersonId(null);
          },
        }
      );
    }
  };

  const handleClose = () => {
    closeAssignModal();
    setSelectedDeliveryPersonId(null);
  };

  return (
    <Modal
      isOpen={isAssignModalOpen}
      onClose={handleClose}
      title={
        selectedRouteId
          ? `Atribuir Rota #${selectedRouteId}`
          : "Atribuir Motoboy"
      }
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-600">
            Carregando motoboys...
          </div>
        ) : deliveryPeople && deliveryPeople.length > 0 ? (
          <>
            <p className="text-sm text-gray-600">
              Selecione um motoboy para atribuir à rota:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {deliveryPeople.map((person) => (
                <button
                  key={person.id}
                  onClick={() => setSelectedDeliveryPersonId(person.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedDeliveryPersonId === person.id
                      ? "border-[#EA1D2C] bg-gradient-to-r from-red-50 to-red-100 shadow-lg scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
                  }`}
                >
                  {person.avatarUrl ? (
                    <img
                      src={person.avatarUrl}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <span className="font-bold text-gray-900 text-lg">
                    {person.name}
                  </span>
                  {selectedDeliveryPersonId === person.id && (
                    <div className="ml-auto w-6 h-6 bg-[#EA1D2C] rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t-2 border-gray-100">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="flex-1 font-bold py-3 hover:bg-gray-200"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleAssign}
                disabled={!selectedDeliveryPersonId || assignMutation.isPending}
                className="flex-1 font-bold py-3 shadow-lg hover:shadow-xl"
              >
                {assignMutation.isPending
                  ? "Atribuindo..."
                  : "Confirmar Atribuição"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-600">
            Nenhum motoboy disponível
          </div>
        )}
      </div>
    </Modal>
  );
};
