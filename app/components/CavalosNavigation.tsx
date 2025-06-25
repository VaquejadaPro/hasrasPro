import React from 'react';
import { CavalosScreen, CavalosDisponiveisScreen } from '../modules/haras/screens';

// Componente para navegar direto para todos os cavalos
export const NavigateToCavalos = () => {
  const harasId = 'default-haras-id';
  return <CavalosScreen harasId={harasId} />;
};

// Componente para navegar direto para cavalos disponíveis
export const NavigateToCavalosDisponiveis = () => {
  const harasId = 'default-haras-id';
  return <CavalosDisponiveisScreen harasId={harasId} />;
};
