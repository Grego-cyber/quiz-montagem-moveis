import React from 'react';

interface WelcomeStepProps {
  onNextStep: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNextStep }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-lg w-full text-center transform transition-all hover:scale-105 duration-500">
        <h1 className="text-4xl font-bold mb-6 text-sky-400 animate-pulse">
          Bem-vindo ao nosso Serviço de Montagem de Móveis!
        </h1>
        <p className="text-lg mb-8 text-slate-300">
          Precisa de ajuda para montar os seus móveis novos ou usados? Está no sítio certo! 
          Com o nosso quiz interativo, pode obter um orçamento instantâneo e agendar a montagem de forma rápida e fácil.
        </p>
        <button
          onClick={onNextStep}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
        >
          Iniciar Orçamento
        </button>
        <p className="mt-6 text-sm text-slate-400">
          Vamos começar?
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;

