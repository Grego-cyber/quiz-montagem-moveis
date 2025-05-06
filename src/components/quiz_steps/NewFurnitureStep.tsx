import React, { useState } from 'react';

interface NewFurnitureStepProps {
  onCalculateBudget: (value: number, hasMirror: boolean) => void;
  onBack: () => void;
}

const NewFurnitureStep: React.FC<NewFurnitureStepProps> = ({ onCalculateBudget, onBack }) => {
  const [furnitureValue, setFurnitureValue] = useState<string>('');
  const [hasMirror, setHasMirror] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleNext = () => {
    const value = parseFloat(furnitureValue);
    if (isNaN(value) || value <= 0) {
      setError('Por favor, insira um valor válido para o móvel.');
      return;
    }
    setError('');
    onCalculateBudget(value, hasMirror);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all hover:scale-105 duration-500">
        <h2 className="text-3xl font-bold mb-8 text-sky-400 text-center">
          Orçamento para Móvel Novo
        </h2>
        
        <div className="mb-6">
          <label htmlFor="furnitureValue" className="block text-lg font-medium text-slate-300 mb-2">
            Qual é o valor de compra do seu móvel novo? (R$)
          </label>
          <input
            type="number"
            id="furnitureValue"
            value={furnitureValue}
            onChange={(e) => setFurnitureValue(e.target.value)}
            placeholder="Ex: 750.00"
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors duration-300"
          />
        </div>

        <div className="mb-8 flex items-center">
          <input
            type="checkbox"
            id="hasMirror"
            checked={hasMirror}
            onChange={(e) => setHasMirror(e.target.checked)}
            className="w-5 h-5 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-500 focus:ring-offset-slate-800 mr-3 cursor-pointer"
          />
          <label htmlFor="hasMirror" className="text-lg text-slate-300 cursor-pointer">
            O móvel possui espelho?
          </label>
        </div>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75"
          >
            Voltar
          </button>
          <button
            onClick={handleNext}
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
          >
            Ver Orçamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewFurnitureStep;

