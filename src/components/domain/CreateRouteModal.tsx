import { X } from "lucide-react";
import { useState } from "react";

interface CreateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRouteModal = ({ isOpen, onClose }: CreateRouteModalProps) => {
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const [addresses, setAddresses] = useState<string[]>([]);
  const [currentAddress, setCurrentAddress] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleAddAddress = () => {
    if (currentAddress.trim()) {
      setAddresses([...addresses, currentAddress.trim()]);
      setCurrentAddress("");
    }
  };

  const handleSave = () => {
    // Mock save logic
    console.log({ deliveryPerson, addresses, notes });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Criar nova rota
        </h2>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="deliveryPerson"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome do motoboy
              </label>
              <input
                type="text"
                id="deliveryPerson"
                value={deliveryPerson}
                onChange={(e) => setDeliveryPerson(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-ifood-red focus:border-ifood-red"
                placeholder="Ex: João da Silva"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Endereços de entrega
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="address"
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-ifood-red focus:border-ifood-red"
                  placeholder="Digite um endereço"
                />
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 cursor-pointer"
                >
                  Adicionar
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-2 rounded-md text-sm"
                  >
                    {addr}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Observações (opcional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-ifood-red focus:border-ifood-red"
                placeholder="Alguma instrução especial para a rota?"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-ifood-red text-white font-semibold rounded-lg hover:bg-red-700 cursor-pointer"
            >
              Criar rota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRouteModal;
