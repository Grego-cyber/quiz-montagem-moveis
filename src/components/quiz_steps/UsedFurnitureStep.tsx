import React, { useState } from 'react';

interface UsedFurnitureStepProps {
  onCalculateBudget: (size: 'pequeno' | 'medio' | 'grande' | 'cozinha_pecas', needsDisassembly: boolean, numberOfPieces?: number) => void;
  onBack: () => void;
}

const UsedFurnitureStep: React.FC<UsedFurnitureStepProps> = ({ onCalculateBudget, onBack }) => {
  const [size, setSize] = useState<'pequeno' | 'medio' | 'grande' | 'cozinha_pecas' | ''>('');
  const [numberOfPieces, setNumberOfPieces] = useState<string>('');
  const [needsDisassembly, setNeedsDisassembly] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleNext = () => {
    if (!size) {
      setError('Por favor, selecione o tipo ou tamanho do móvel.');
      return;
    }
    if (size === 'cozinha_pecas') {
      const pieces = parseInt(numberOfPieces, 10);
      if (isNaN(pieces) || pieces <= 0) {
        setError('Por favor, insira um número válido de peças.');
        return;
      }
      setError('');
      onCalculateBudget(size, needsDisassembly, pieces);
    } else {
      setError('');
      onCalculateBudget(size as 'pequeno' | 'medio' | 'grande', needsDisassembly);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all hover:scale-105 duration-500">
        <h2 className="text-3xl font-bold mb-8 text-sky-400 text-center">
          Orçamento para Móvel Usado
        </h2>

        <div className="mb-6">
          <label className="block text-lg font-medium text-slate-300 mb-3">
            Qual é o tipo ou tamanho do móvel usado?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {['Pequeno (ex: mesa de cabeceira)', 'Médio (ex: cómoda, secretária)', 'Grande (ex: roupeiro, cama)', 'Móveis de Cozinha ou Peças Avulsas'].map((item, index) => {
              const itemValue = item.startsWith('Pequeno') ? 'pequeno' : item.startsWith('Médio') ? 'medio' : item.startsWith('Grande') ? 'grande' : 'cozinha_pecas';
              return (
                <button
                  key={item}
                  onClick={() => setSize(itemValue as any)}
                  className={`w-full p-3 rounded-lg text-left transition-colors duration-300 font-medium 
                              ${size === itemValue ? 'bg-sky-500 text-white ring-2 ring-sky-300' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {size === 'cozinha_pecas' && (
          <div className="mb-6">
            <label htmlFor="numberOfPieces" className="block text-lg font-medium text-slate-300 mb-2">
              Quantas peças individuais compõem a montagem?
            </label>
            <input
              type="number"
              id="numberOfPieces"
              value={numberOfPieces}
              onChange={(e) => setNumberOfPieces(e.target.value)}
              placeholder="Ex: 3"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors duration-300"
            />
          </div>
        )}

        <div className="mb-8 flex items-center">
          <input
            type="checkbox"
            id="needsDisassembly"
            checked={needsDisassembly}
            onChange={(e) => setNeedsDisassembly(e.target.checked)}
            className="w-5 h-5 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-500 focus:ring-offset-slate-800 mr-3 cursor-pointer"
          />
          <label htmlFor="needsDisassembly" className="text-lg text-slate-300 cursor-pointer">
            Será necessário desmontar algum móvel antigo no local?
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

export default UsedFurnitureStep;

