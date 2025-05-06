"use client";

import React, { useState, useEffect } from 'react';
import WelcomeStep from '../components/quiz_steps/WelcomeStep';
import FurnitureTypeStep from '../components/quiz_steps/FurnitureTypeStep';
import NewFurnitureStep from '../components/quiz_steps/NewFurnitureStep';
import UsedFurnitureStep from '../components/quiz_steps/UsedFurnitureStep';
import BudgetDisplayStep from '../components/quiz_steps/BudgetDisplayStep';
import SchedulingStep from '../components/quiz_steps/SchedulingStep';
import ConfirmationStep from '../components/quiz_steps/ConfirmationStep';
import { calculateNewFurnitureBudget, calculateUsedFurnitureBudget } from '../logic/budgetLogic';

type QuizStep = 'welcome' | 'furnitureType' | 'newFurniture' | 'usedFurniture' | 'budgetDisplay' | 'scheduling' | 'confirmation';

interface FormData {
  furnitureType?: 'new' | 'used';
  furnitureValue?: number;
  hasMirror?: boolean;
  usedFurnitureSize?: 'pequeno' | 'medio' | 'grande' | 'cozinha_pecas';
  needsDisassembly?: boolean;
  numberOfPieces?: number;
  budget?: number;
  schedulingDetails?: {
    date: string;
    time: string;
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  estimatedDurationHours?: number;
  budgetSummary?: string[];
}

const HomePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<QuizStep>('welcome');
  const [formData, setFormData] = useState<FormData>({});

  const resetQuiz = () => {
    setFormData({});
    setCurrentStep('welcome');
  };

  const handleNextStep = (nextStep: QuizStep, data?: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(nextStep);
  };

  const handleBack = (previousStep: QuizStep) => {
    setCurrentStep(previousStep);
  };

  const calculateAndShowBudget = (data: Partial<FormData>) => {
    let budget = 0;
    let summary: string[] = [];
    let duration = 0;

    const updatedFormData = { ...formData, ...data };

    if (updatedFormData.furnitureType === 'new' && updatedFormData.furnitureValue !== undefined) {
      budget = calculateNewFurnitureBudget(updatedFormData.furnitureValue, updatedFormData.hasMirror || false);
      summary.push(`Tipo: Móvel Novo`);
      summary.push(`Valor do Móvel: R$ ${updatedFormData.furnitureValue.toFixed(2).replace('.', ',')}`);
      if (updatedFormData.hasMirror) summary.push("Possui Espelho: Sim");

      if (updatedFormData.furnitureValue <= 1000) duration = 2;
      else if (updatedFormData.furnitureValue <= 1500) duration = 3;
      else duration = 5;

    } else if (updatedFormData.furnitureType === 'used' && updatedFormData.usedFurnitureSize) {
      budget = calculateUsedFurnitureBudget(
        updatedFormData.usedFurnitureSize,
        updatedFormData.needsDisassembly || false,
        updatedFormData.usedFurnitureSize === 'cozinha_pecas',
        updatedFormData.numberOfPieces
      );
      summary.push(`Tipo: Móvel Usado`);
      summary.push(`Tamanho/Tipo: ${updatedFormData.usedFurnitureSize === 'cozinha_pecas' ? `Cozinha/Peças (${updatedFormData.numberOfPieces} peças)` : updatedFormData.usedFurnitureSize}`);
      if (updatedFormData.needsDisassembly) summary.push("Necessita Desmontagem: Sim");

      if (updatedFormData.needsDisassembly) duration += 1.5;
      
      if (updatedFormData.usedFurnitureSize === 'cozinha_pecas' && updatedFormData.numberOfPieces) {
        duration += updatedFormData.numberOfPieces * 1;
      } else if (updatedFormData.usedFurnitureSize === 'pequeno') {
        duration += 1;
      } else if (updatedFormData.usedFurnitureSize === 'medio' || updatedFormData.usedFurnitureSize === 'grande') {
        duration += 2;
      }
    }
    
    handleNextStep('budgetDisplay', { budget, estimatedDurationHours: duration, budgetSummary: summary });
  };

  switch (currentStep) {
    case 'welcome':
      return <WelcomeStep onNextStep={() => handleNextStep('furnitureType')} />;
    case 'furnitureType':
      return <FurnitureTypeStep onSetFurnitureType={(type) => handleNextStep(type === 'new' ? 'newFurniture' : 'usedFurniture', { furnitureType: type })} />;
    case 'newFurniture':
      return <NewFurnitureStep 
                onCalculateBudget={(value, hasMirror) => calculateAndShowBudget({ furnitureValue: value, hasMirror })}
                onBack={() => handleBack('furnitureType')}
              />;
    case 'usedFurniture':
      return <UsedFurnitureStep 
                onCalculateBudget={(size, needsDisassembly, numberOfPieces) => calculateAndShowBudget({ usedFurnitureSize: size, needsDisassembly, numberOfPieces })}
                onBack={() => handleBack('furnitureType')}
              />;
    case 'budgetDisplay':
      return <BudgetDisplayStep 
                budget={formData.budget || 0}
                summary={formData.budgetSummary || []}
                onSchedule={() => handleNextStep('scheduling')}
                onRedoBudget={() => handleNextStep('furnitureType')}
                onBack={() => handleBack(formData.furnitureType === 'new' ? 'newFurniture' : 'usedFurniture')}
              />;
    case 'scheduling':
      return <SchedulingStep 
                budget={formData.budget || 0}
                estimatedDurationHours={formData.estimatedDurationHours || 0}
                needsDisassembly={formData.needsDisassembly}
                onConfirmSchedule={(details) => handleNextStep('confirmation', { schedulingDetails: details })}
                onBack={() => handleBack('budgetDisplay')}
              />;
    case 'confirmation':
      const serviceDescription = formData.furnitureType === 'new' ? 'Montagem de Móvel Novo' : 'Montagem de Móvel Usado';
      let durationString = '';
      if (formData.estimatedDurationHours) {
        const hours = Math.floor(formData.estimatedDurationHours);
        const minutes = (formData.estimatedDurationHours % 1) * 60;
        if (hours > 0) durationString += `${hours} hora${hours > 1 ? 's' : ''}`;
        if (minutes > 0) durationString += `${hours > 0 ? ' e ' : ''}${minutes} minutos`;
      }

      return <ConfirmationStep 
                details={{
                  service: serviceDescription,
                  budget: formData.budget || 0,
                  date: formData.schedulingDetails?.date || '',
                  time: formData.schedulingDetails?.time || '',
                  name: formData.schedulingDetails?.name || '',
                  phone: formData.schedulingDetails?.phone || '',
                  address: formData.schedulingDetails?.address || '',
                  estimatedDuration: durationString,
                }}
                onGoToHome={resetQuiz}
              />;
    default:
      return <WelcomeStep onNextStep={() => handleNextStep('furnitureType')} />;
  }
};

export default HomePage;

