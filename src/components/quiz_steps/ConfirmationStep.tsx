import React from 'react';

interface ConfirmationStepProps {
  details: {
    service: string;
    budget: number;
    date: string;
    time: string;
    name: string;
    phone: string;
    address: string;
    estimatedDuration?: string; // Ex: "2 horas", "1 hora e 30 minutos"
  };
  onGoToHome: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ details, onGoToHome }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <div className="bg-slate-800 p-8 md:p-10 rounded-xl shadow-2xl max-w-lg w-full text-center transform transition-all hover:scale-105 duration-500">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500 mb-6 animate-bounce">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-emerald-400">
          Agendamento Recebido!
        </h2>
        <p className="text-lg text-slate-300 mb-6">
          Obrigado, {details.name}! O seu pedido de agendamento foi recebido com sucesso.
        </p>
        
        <div className="bg-slate-700 p-6 rounded-lg mb-8 shadow-inner text-left space-y-3">
          <h3 className="text-xl font-semibold text-sky-400 mb-3 border-b border-slate-600 pb-2">Detalhes do Agendamento:</h3>
          <p><strong className="text-slate-200">Serviço:</strong> {details.service}</p>
          <p><strong className="text-slate-200">Orçamento Estimado:</strong> R$ {details.budget.toFixed(2).replace('.', ',')}</p>
          {details.estimatedDuration && <p><strong className="text-slate-200">Duração Estimada:</strong> {details.estimatedDuration}</p>}
          <p><strong className="text-slate-200">Data:</strong> {new Date(details.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          <p><strong className="text-slate-200">Horário:</strong> {details.time}</p>
          <p><strong className="text-slate-200">Morada da Montagem:</strong> {details.address}</p>
          <p><strong className="text-slate-200">Contacto:</strong> {details.phone}</p>
        </div>

        <p className="text-sm text-slate-400 mb-8">
          Entraremos em contacto em breve para confirmar todos os detalhes. 
          Caso necessite de alguma alteração, por favor, contacte-nos através do [Seu Número de Telefone/Email].
        </p>

        <button
          onClick={onGoToHome}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
};

export default ConfirmationStep;

