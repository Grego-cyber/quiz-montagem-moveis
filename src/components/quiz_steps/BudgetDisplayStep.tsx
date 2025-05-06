import React from 'react';

interface BudgetDisplayStepProps {
  budget: number;
  summary: string[]; // Array of strings to display a summary of choices
  onSchedule: () => void;
  onRedoBudget: () => void;
  onBack?: () => void; // Optional: if there's a direct back action from this step
}

const BudgetDisplayStep: React.FC<BudgetDisplayStepProps> = ({ budget, summary, onSchedule, onRedoBudget, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all hover:scale-105 duration-500">
        <h2 className="text-3xl font-bold mb-6 text-sky-400 text-center">
          Seu Orçamento Estimado
        </h2>
        
        <div className="bg-slate-700 p-6 rounded-lg mb-8 shadow-inner">
          <p className="text-5xl font-bold text-emerald-400 text-center mb-4">
            R$ {budget.toFixed(2).replace('.', ',')}
          </p>
          <div className="text-slate-300 text-sm space-y-1">
            <h4 className="font-semibold text-slate-200 mb-2">Resumo das suas escolhas:</h4>
            {summary.map((item, index) => (
              <p key={index} className="ml-2">- {item}</p>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-8 text-center">
          Este é um valor estimado. O valor final será confirmado após o agendamento.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={onSchedule}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
          >
            Agendar Montagem
          </button>
          <button
            onClick={onRedoBudget}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
          >
            Refazer Orçamento / Alterar Opções
          </button>
          {onBack && (
             <button
              onClick={onBack}
              className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 mt-2"
            >
              Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetDisplayStep;

