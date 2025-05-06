import React, { useState, useEffect } from 'react';

interface SchedulingStepProps {
  budget: number;
  estimatedDurationHours: number; // Em horas, ex: 2.5 para 2h30min
  needsDisassembly?: boolean; // Adicionado para informar sobre a desmontagem
  onConfirmSchedule: (details: { date: string; time: string; name: string; phone: string; email?: string; address: string }) => void;
  onBack: () => void;
}

interface ApiAvailabilityData {
  [date: string]: string[];
}

// Não usaremos mais MOCK_BLOCKED_SLOTS diretamente aqui, 
// assumindo que a API de disponibilidade já considera os bloqueios 
// ou que o sistema de agendamento real faria essa verificação no backend.

const SchedulingStep: React.FC<SchedulingStepProps> = ({ budget, estimatedDurationHours, needsDisassembly, onConfirmSchedule, onBack }) => {
  const [apiAvailability, setApiAvailability] = useState<ApiAvailabilityData>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoadingAvailability(true);
      setAvailabilityError(null);
      try {
        const res = await fetch('/api/availability');
        if (!res.ok) {
          throw new Error(`Falha ao buscar disponibilidade: ${res.statusText}`);
        }
        const data: ApiAvailabilityData = await res.json();
        setApiAvailability(data);
      } catch (e: any) {
        console.error("Failed to fetch API availability:", e);
        setAvailabilityError("Não foi possível carregar os horários disponíveis. Tente novamente mais tarde.");
        // Fallback para um objeto vazio ou lógica de erro
        setApiAvailability({}); 
      }
      setIsLoadingAvailability(false);
    };

    fetchAvailability();
  }, []);

  useEffect(() => {
    if (selectedDate && Object.keys(apiAvailability).length > 0 && !isLoadingAvailability) {
      const dayAvailability = apiAvailability[selectedDate] || [];
      
      const filteredTimes = dayAvailability.filter(slot => {
        const slotStartHour = parseInt(slot.split(':')[0]);
        const slotStartMinute = parseInt(slot.split(':')[1]);
        
        // Convert duration to minutes for easier calculation
        const durationInMinutes = estimatedDurationHours * 60;
        const slotStartTotalMinutes = slotStartHour * 60 + slotStartMinute;
        const slotEndTotalMinutes = slotStartTotalMinutes + durationInMinutes;

        // Simplificação: verificar se o slot + duração não ultrapassa o fim do dia (ex: 18:00 ou 19:00)
        // Assumindo que o dia de trabalho termina às 19:00 (1140 minutos)
        const endOfDayMinutes = 19 * 60;
        if (slotEndTotalMinutes > endOfDayMinutes) {
          return false;
        }

        // Aqui, a lógica de verificar MOCK_BLOCKED_SLOTS foi removida.
        // Se precisarmos de uma verificação de conflito no cliente (o que não é ideal),
        // precisaríamos de uma fonte de agendamentos existentes.
        // Por agora, confiamos que apiAvailability já está filtrada ou é apenas "potencial".
        return true;
      });
      setAvailableTimes(filteredTimes);
      setSelectedTime('');
    } else {
      setAvailableTimes([]);
      setSelectedTime('');
    }
  }, [selectedDate, apiAvailability, estimatedDurationHours, isLoadingAvailability]);

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !name || !phone || !address) {
      setError('Por favor, preencha todos os campos obrigatórios e selecione data/hora.');
      return;
    }
    setError('');
    onConfirmSchedule({ date: selectedDate, time: selectedTime, name, phone, email, address });
  };

  const availableDates = Object.keys(apiAvailability).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

  let disassemblyNote = null;
  if (needsDisassembly) {
    disassemblyNote = (
      <p className="text-amber-400 text-sm text-center mb-4">
        <strong>Atenção:</strong> O tempo estimado inclui 1h30 para desmontagem. 
        Se a montagem não puder ocorrer no mesmo dia devido à duração total, poderá ser necessário um agendamento separado para a montagem.
        Tentaremos acomodar tudo no mesmo dia, se possível.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-xl w-full transform transition-all hover:scale-105 duration-500">
        <h2 className="text-3xl font-bold mb-6 text-sky-400 text-center">
          Agendar Montagem
        </h2>
        <p className="text-center text-slate-300 mb-2">Orçamento: R$ {budget.toFixed(2).replace('.', ',')}</p>
        <p className="text-center text-slate-300 mb-1">Duração estimada do serviço: {Math.floor(estimatedDurationHours)}h {estimatedDurationHours % 1 > 0 ? (estimatedDurationHours % 1 * 60) + 'min' : ''}</p>
        {disassemblyNote}

        {isLoadingAvailability && <p className="text-center text-sky-300 py-4">A carregar horários disponíveis...</p>}
        {availabilityError && <p className="text-center text-red-400 py-4">{availabilityError}</p>}

        {!isLoadingAvailability && !availabilityError && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="date" className="block text-lg font-medium text-slate-300 mb-2">Data:</label>
                <select 
                  id="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors duration-300"
                >
                  <option value="">Selecione uma data</option>
                  {availableDates.map(date => <option key={date} value={date}>{new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="time" className="block text-lg font-medium text-slate-300 mb-2">Horário de Início:</label>
                <select 
                  id="time" 
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={!selectedDate || availableTimes.length === 0}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors duration-300 disabled:opacity-50"
                >
                  <option value="">Selecione um horário</option>
                  {availableTimes.map(time => <option key={time} value={time}>{time}</option>)}
                </select>
                {selectedDate && availableTimes.length === 0 && !isLoadingAvailability && <p className="text-amber-400 text-sm mt-2">Nenhum horário disponível para esta data com a duração do serviço.</p>}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-200 mb-4 mt-8">Seus Dados:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Nome Completo*:</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 outline-none" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Telefone/WhatsApp*:</label>
                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 outline-none" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email (Opcional):</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 outline-none" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-1">Morada Completa para Montagem*:</label>
                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 outline-none" required />
              </div>
            </div>
          </>
        )}

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <button
            onClick={onBack}
            className="w-full sm:w-auto bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75"
          >
            Voltar (Orçamento)
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoadingAvailability || !!availabilityError}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulingStep;

