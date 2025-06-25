import React from 'react';
import { HarasMainScreen } from '../../modules/haras/screens';

export default function Reproducao() {
  // Por enquanto, vamos usar um harasId fixo
  // Em uma implementação real, isso viria do contexto do usuário logado
  const harasId = 'default-haras-id';

  return <HarasMainScreen harasId={harasId} />;
}
