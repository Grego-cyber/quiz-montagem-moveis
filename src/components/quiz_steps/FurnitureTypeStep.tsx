import React from 'react';

interface FurnitureTypeStepProps {
  onSetFurnitureType: (type: 'new' | 'used') => void;
}

const FurnitureTypeStep: React.FC<FurnitureTypeStepProps> = ({ onSetFurnitureType }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-lg w-full text-center transform transition-all hover:scale-105 duration-500">
        <h2 className="text-3xl font-bold mb-8 text-sky-400">
          Tipo de Móvel
        </h2>
        <p className="text-lg mb-8 text-slate-300">
          O móvel que pretende montar é novo ou já foi usado anteriormente?
        </p>
        <div className="space-y-4 md:space-y-0 md:flex md:space-x-4 justify-center">
          <button
            onClick={() => onSetFurnitureType('new')}
            className="w-full md:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
          >
            Móvel Novo
          </button>
          <button
            onClick={() => onSetFurnitureType('used')}
            className="w-full md:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
          >
            Móvel Usado
          </button>
        </div>
      </div>
    </div>
  );
};

export default FurnitureTypeStep;

