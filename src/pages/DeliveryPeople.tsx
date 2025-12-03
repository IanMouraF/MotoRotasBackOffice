import { Plus, User } from "lucide-react"; // Removemos o ícone Phone
import React, { useState } from "react";
import { Button } from "../components/core";
import { useCreateDeliveryPerson, useGetDeliveryPeople } from "../hooks/useRoutesQuery";

const DeliveryPeople = () => {
  const { data: motoboys, isLoading } = useGetDeliveryPeople();
  const createMotoboyMutation = useCreateDeliveryPerson();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  // Estado 'phone' removido

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      // Envia apenas o nome
      createMotoboyMutation.mutate({ name }, {
        onSuccess: () => {
          setIsFormOpen(false);
          setName("");
        }
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Motoboys</h1>
          <p className="text-gray-500">Gerencie sua frota de entregadores</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)}>
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Motoboy
        </Button>
      </div>

      {/* Formulário de Cadastro */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4">Novo Cadastro</h3>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Ex: João Silva"
              />
            </div>
            {/* Input de Telefone REMOVIDO */}
            <Button type="submit" disabled={createMotoboyMutation.isPending}>
              {createMotoboyMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </div>
      )}

      {/* Lista de Motoboys */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Carregando...</p>
        ) : motoboys?.map((motoboy) => (
          <div key={motoboy.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{motoboy.name}</h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                {/* Exibição de telefone REMOVIDA */}
                <span className="text-xs text-gray-400">ID: {motoboy.id}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block bg-green-100 text-green-700`}>
                Disponível
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPeople;