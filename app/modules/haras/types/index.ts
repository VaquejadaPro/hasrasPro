// Tipos para o módulo de Haras
export interface Animal {
  id: string;
  nome: string;
  idade: number;
  raca: string;
  cor: string;
  peso: number;
  sexo: 'macho' | 'femea';
  status: 'ativo' | 'machucado' | 'descanso' | 'aposentado';
  pai?: string;
  mae?: string;
  nascimento: string;
  registro?: string;
  observacoes?: string;
  foto?: string;
  harasId: string;
  baiaId?: string;
}

export interface Garanhao extends Animal {
  sexo: 'macho';
  qualidadeSemen: 'excelente' | 'boa' | 'regular';
  numeroCoberturasAno: number;
  valorCobertura: number;
  statusReprodutivo: 'ativo' | 'aposentado' | 'temporario';
}

export interface Doadora extends Animal {
  sexo: 'femea';
  statusReprodutivo: 'ativa' | 'gestante' | 'descansando' | 'aposentada';
  numeroEmbrioes: number;
  qualidadeOocitos: 'excelente' | 'boa' | 'regular';
  ultimaColeta?: string;
  proximaColeta?: string;
  cicloEstral: 'cio' | 'diestro' | 'proestro' | 'estro';
}

export interface Receptora extends Animal {
  sexo: 'femea';
  statusReprodutivo: 'disponivel' | 'gestante' | 'parida' | 'descansando';
  cicloEstral: 'cio' | 'diestro' | 'proestro' | 'estro';
  ultimoParto?: string;
  gestacaoAtual?: {
    dataImplantacao: string;
    doadoraId: string;
    garanhaoId: string;
    dataPrevisaoParto: string;
    embriaoId: string;
  };
}

export interface RegistroEmbriao {
  id: string;
  doadoraId: string;
  garanhaoId: string;
  dataColeta: string;
  qualidadeEmbriao: 'grau1' | 'grau2' | 'grau3' | 'grau4';
  statusEmbriao: 'congelado' | 'transferido' | 'descartado';
  receptoraId?: string;
  dataTransferencia?: string;
  observacoes?: string;
  numeroEmbrioes: number;
  harasId: string;
  responsavel: string;
}

export type TipoEventoSaude = 'vacina' | 'medicamento' | 'exame' | 'cirurgia' | 'ferimento';

export interface RegistroSaude {
  id: string;
  animalId: string;
  animalNome: string;
  tipo: TipoEventoSaude;
  descricao: string;
  data: string;
  veterinario?: string;
  observacoes?: string;
  dosagem?: string;
  medicamento?: string;
  laboratorio?: string;
  lote?: string;
  dataValidade?: string;
  custo?: number;
  proximaAplicacao?: string;
  reacao?: boolean;
  tipoReacao?: string;
  harasId: string;
}

export interface ManejoReprodutivo {
  id: string;
  tipo: 'cobertura' | 'inseminacao' | 'implantacao' | 'parto';
  animalId: string;
  animalNome: string;
  parceirosId?: string;
  parceirosNome?: string;
  data: string;
  observacoes?: string;
  sucesso: boolean;
  custoOperacao?: number;
  responsavel?: string;
  condicoesTempo?: string;
  harasId: string;
}

export type TipoEventoAgenda = 'cobertura' | 'inseminacao' | 'implantacao' | 'exame' | 'parto' | 'medicacao';

export interface AgendaReprodutiva {
  id: string;
  tipo: TipoEventoAgenda;
  animalId: string;
  animalNome: string;
  dataEvento: string;
  observacoes?: string;
  realizado: boolean;
  responsavel?: string;
  prioridade: 'alta' | 'media' | 'baixa';
  notificar: boolean;
  harasId: string;
}

export interface Genealogia {
  id: string;
  animalId: string;
  pai?: {
    id: string;
    nome: string;
    registro?: string;
  };
  mae?: {
    id: string;
    nome: string;
    registro?: string;
  };
  avoPaternoMacho?: {
    id: string;
    nome: string;
    registro?: string;
  };
  avoPaternoFemea?: {
    id: string;
    nome: string;
    registro?: string;
  };
  avoMaternoMacho?: {
    id: string;
    nome: string;
    registro?: string;
  };
  avoMaternoFemea?: {
    id: string;
    nome: string;
    registro?: string;
  };
  descendentes?: Array<{
    id: string;
    nome: string;
    sexo: 'macho' | 'femea';
    idade: number;
    registro?: string;
  }>;
}

// DTOs para criação
export interface CreateAnimalDTO {
  nome: string;
  idade: number;
  raca: string;
  cor: string;
  peso: number;
  sexo: 'macho' | 'femea';
  pai?: string;
  mae?: string;
  nascimento: string;
  registro?: string;
  observacoes?: string;
  harasId: string;
  baiaId?: string;
}

export interface CreateGaranhaoDTO extends CreateAnimalDTO {
  sexo: 'macho';
  qualidadeSemen: 'excelente' | 'boa' | 'regular';
  valorCobertura: number;
}

export interface CreateDoadoraDTO extends CreateAnimalDTO {
  sexo: 'femea';
  qualidadeOocitos: 'excelente' | 'boa' | 'regular';
}

export interface CreateReceptoraDTO extends CreateAnimalDTO {
  sexo: 'femea';
}

export interface CreateEmbriaoDTO {
  doadoraId: string;
  garanhaoId: string;
  dataColeta: string;
  qualidadeEmbriao: 'grau1' | 'grau2' | 'grau3' | 'grau4';
  numeroEmbrioes: number;
  observacoes?: string;
  harasId: string;
  responsavel: string;
}

export interface CreateRegistroSaudeDTO {
  animalId: string;
  tipo: 'medicamento' | 'casqueamento' | 'ferradura' | 'vacina' | 'exame' | 'cirurgia';
  descricao: string;
  data: string;
  responsavel: string;
  observacoes?: string;
  valor?: number;
  proximaData?: string;
  medicamento?: {
    nome: string;
    dosagem: string;
    frequencia: string;
    duracao: number;
  };
}

export interface CreateDietaDTO {
  animalId: string;
  tipoRacao: string;
  quantidade: number;
  frequencia: number;
  suplementos: string[];
  observacoes?: string;
  dataInicio: string;
}

export interface CreateEventoReprodutivoDTO {
  data: string;
  tipo: 'coleta' | 'transferencia' | 'sincronizacao' | 'exame' | 'parto' | 'cobertura' | 'inseminacao';
  animalId: string;
  descricao: string;
  responsavel: string;
  observacoes?: string;
  harasId: string;
  lembrete?: {
    ativo: boolean;
    antecedencia: number;
  };
}

// Tipos para filtros e busca
export interface FiltroAnimais {
  sexo?: 'macho' | 'femea';
  status?: string;
  raca?: string;
  idadeMin?: number;
  idadeMax?: number;
  baiaId?: string;
}

export interface FiltroEventos {
  tipo?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  animalId?: string;
}

// Estatísticas
export interface EstatisticasReprodutivas {
  totalGaranhoes: number;
  totalDoadoras: number;
  totalReceptoras: number;
  totalEmbrioes: number;
  embrioesPorStatus: {
    congelado: number;
    transferido: number;
    descartado: number;
  };
  taxaSucessoTransferencia: number;
  proximosEventos: AgendaReprodutiva[];
}
