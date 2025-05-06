"use client";

import React, { useState, useEffect } from 'react';

interface AvailabilityData {
  [date: string]: string[];
}

const AdminPage: React.FC = () => {
  const [availability, setAvailability] = useState<AvailabilityData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("");
  const [newDate, setNewDate] = useState<string>("");

  const fetchAvailability = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/availability");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setAvailability(data);
    } catch (e: any) {
      console.error("Failed to fetch availability:", e);
      setError("Falha ao carregar a disponibilidade. Usando dados mock.");
      setAvailability({
        "2025-05-20": ["09:00", "10:00", "11:00", "14:00", "15:00"],
        "2025-05-21": ["09:30", "10:30", "14:30", "15:30", "16:30"],
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const saveAvailability = async (newAvailability: AvailabilityData) => {
    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAvailability),
      });
      if (!response.ok) {
        throw new Error("Falha ao guardar disponibilidade");
      }
      setAvailability(newAvailability);
      alert("Disponibilidade guardada com sucesso!");
    } catch (e: any) {
      console.error("Failed to save availability:", e);
      setError("Falha ao guardar a disponibilidade: " + e.message);
      alert("Erro ao guardar disponibilidade: " + e.message);
    }
  };

  const handleAddTime = (date: string) => {
    if (!newTime) {
      alert("Por favor, insira um horário válido (HH:MM).");
      return;
    }
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newTime)) {
        alert("Formato de hora inválido. Use HH:MM.");
        return;
    }
    const updatedAvailability = { ...availability };
    if (!updatedAvailability[date]) {
      updatedAvailability[date] = [];
    }
    if (updatedAvailability[date].includes(newTime)) {
        alert("Este horário já existe para esta data.");
        return;
    }
    updatedAvailability[date].push(newTime);
    updatedAvailability[date].sort();
    saveAvailability(updatedAvailability);
    setNewTime("");
  };

  const handleRemoveTime = (date: string, timeToRemove: string) => {
    const updatedAvailability = { ...availability };
    updatedAvailability[date] = updatedAvailability[date].filter(time => time !== timeToRemove);
    if (updatedAvailability[date].length === 0) {
      delete updatedAvailability[date];
    }
    saveAvailability(updatedAvailability);
  };

  const handleAddDate = () => {
    if (!newDate) {
      alert("Por favor, selecione uma data.");
      return;
    }
    if (availability[newDate]) {
      alert("Esta data já existe. Edite os horários diretamente nela.");
      return;
    }
    const updatedAvailability = { ...availability, [newDate]: [] };
    saveAvailability(updatedAvailability);
    setNewDate("");
  };

  const handleRemoveDate = (dateToRemove: string) => {
    const confirmed = confirm(`Tem a certeza que quer remover a data ${dateToRemove} e todos os seus horários?`);
    if (confirmed) {
        const updatedAvailability = { ...availability };
        delete updatedAvailability[dateToRemove];
        saveAvailability(updatedAvailability);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-white">A carregar disponibilidade...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-slate-800 p-6 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-sky-400 mb-8 text-center">Painel de Administração - Gerir Disponibilidade</h1>
        
        {error && <p className="text-red-400 bg-red-900 p-3 rounded-md mb-6 text-center">{error}</p>}

        <div className="mb-8 p-4 border border-slate-700 rounded-lg bg-slate-850">
          <h2 className="text-xl font-semibold text-sky-500 mb-3">Adicionar Nova Data Disponível</h2>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-grow">
              <label htmlFor="newDate" className="block text-sm font-medium text-slate-300 mb-1">Nova Data:</label>
              <input 
                type="date" 
                id="newDate"
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)} 
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <button 
              onClick={handleAddDate}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              Adicionar Data
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-sky-500 mb-6">Datas e Horários Disponíveis:</h2>
        {Object.keys(availability).length === 0 && !isLoading && (
          <p className="text-slate-400 text-center py-4">Nenhuma data disponível configurada.</p>
        )}
        <div className="space-y-6">
          {Object.entries(availability).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()).map(([date, times]) => (
            <div key={date} className="p-4 bg-slate-850 border border-slate-700 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-emerald-400">
                  {new Date(date + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </h3>
                <button 
                    onClick={() => handleRemoveDate(date)}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-2 rounded-md transition-colors duration-150"
                >
                    Remover Data
                </button>
              </div>
              <ul className="list-disc list-inside pl-2 space-y-1 mb-4">
                {times.map(time => (
                  <li key={time} className="text-slate-300 flex justify-between items-center">
                    <span>{time}</span>
                    <button 
                      onClick={() => handleRemoveTime(date, time)}
                      className="text-xs text-red-400 hover:text-red-300 font-medium"
                    >
                      Remover
                    </button>
                  </li>
                ))}
                 {times.length === 0 && <p className="text-slate-500 italic">Nenhum horário adicionado para esta data.</p>}
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-700">
                <label htmlFor={`newTime-${date}`} className="block text-sm font-medium text-slate-300 mb-1">Adicionar Horário para {new Date(date + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} (HH:MM):</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="time" 
                    id={`newTime-${date}`} 
                    onFocus={() => setEditDate(date)} // Track which date is being edited
                    onChange={(e) => setNewTime(e.target.value)} 
                    className="p-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-sky-500 focus:border-sky-500 w-full sm:w-auto"
                  />
                  <button 
                    onClick={() => handleAddTime(date)} 
                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Adicionar Horário
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-8 text-center">
          Nota: Este é um painel de administração simplificado. Para um ambiente de produção, seria necessário implementar autenticação e um backend robusto.
        </p>
      </div>
    </div>
  );
};

export default AdminPage;
