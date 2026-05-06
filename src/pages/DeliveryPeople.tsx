import React, { useState, useEffect } from 'react';

interface Motoboy {
  id?: number;
  name: string;
  username: string;
  store_code: string;
  status: string;
}

export default function DeliveryPeople() {
  const [motoboys, setMotoboys] = useState<Motoboy[]>([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMotoboys = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/motoboys');
      if (response.ok) {
        const data = await response.json();
        setMotoboys(data);
      }
    } catch (error) {
      console.error("Erro ao buscar motoboys:", error);
    }
  };

  useEffect(() => {
    fetchMotoboys();
  }, []);

  const handleAddMotoboy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/motoboys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password, store_code: storeCode }),
      });

      if (response.ok) {
        // Limpa os campos após salvar
        setName('');
        setUsername('');
        setPassword('');
        setStoreCode('');
        fetchMotoboys(); 
        alert("Motoboy cadastrado com sucesso!");
      } else {
        const errorData = await response.json();
        alert("Erro ao cadastrar: " + errorData.error);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>Gestão de Frota 🛵</h1>

      
      <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#e53935' }}>Cadastrar Novo Entregador</h2>
        
        <form onSubmit={handleAddMotoboy} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input
            type="text"
            placeholder="Nome Completo (Ex: João Silva)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Usuário de Login (Ex: joao.silva)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Senha de Acesso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Código da Loja (Ex: SABOR123)"
            value={storeCode}
            onChange={(e) => setStoreCode(e.target.value.toUpperCase())}
            style={styles.input}
            required
          />
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ ...styles.button, background: loading ? '#ccc' : '#e53935' }}
            >
              {loading ? 'Salvando...' : '+ Adicionar Motoboy'}
            </button>
          </div>
        </form>
      </div>

      
      <div>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Entregadores da Loja</h2>
        
        {motoboys.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
            Nenhum entregador cadastrado ainda.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
            {motoboys.map((motoboy) => (
              <div key={motoboy.id} style={styles.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    👤
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '16px' }}>{motoboy.name}</strong>
                    <span style={{ fontSize: '12px', color: '#666' }}>ID: {motoboy.id} • Loja: {motoboy.store_code}</span>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#888' }}>Login: {motoboy.username}</span>
                  <span style={{ ...styles.badge, background: motoboy.status === 'Disponível' || motoboy.status === 'available' ? '#e8f5e9' : '#ffebee', color: motoboy.status === 'Disponível' || motoboy.status === 'available' ? '#2e7d32' : '#c62828' }}>
                    {motoboy.status === 'available' ? 'Disponível' : motoboy.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  button: {
    padding: '12px 25px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  card: {
    background: 'white',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid #eee',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  }
};