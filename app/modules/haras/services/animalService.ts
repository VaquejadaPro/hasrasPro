import { apiClient } from '../../../../services/api';
import {
  Animal,
  Garanhao,
  Doadora,
  Receptora,
  RegistroEmbriao,
  RegistroSaude,
  DietaAnimal,
  ManejoReprodutivo,
  AgendaReprodutiva,
  Genealogia,
  CreateAnimalDTO,
  CreateGaranhaoDTO,
  CreateDoadoraDTO,
  CreateReceptoraDTO,
  CreateEmbriaoDTO,
  CreateRegistroSaudeDTO,
  CreateDietaDTO,
  FiltroAnimais,
  FiltroEventos,
  EstatisticasReprodutivas
} from '../types';

export interface ApiResponse<T = any> {
  status: string;
  data: T;
  message: string;
}

export const animalService = {
  // =============== ANIMAIS ===============
  
  // Listar todos os animais de um haras
  async getAnimaisByHaras(harasId: string, filtros?: FiltroAnimais): Promise<ApiResponse<Animal[]>> {
    const params = new URLSearchParams();
    if (filtros?.sexo) params.append('sexo', filtros.sexo);
    if (filtros?.status) params.append('status', filtros.status);
    if (filtros?.raca) params.append('raca', filtros.raca);
    if (filtros?.idadeMin) params.append('idadeMin', filtros.idadeMin.toString());
    if (filtros?.idadeMax) params.append('idadeMax', filtros.idadeMax.toString());
    if (filtros?.baiaId) params.append('baiaId', filtros.baiaId);
    
    const queryString = params.toString();
    const url = `/haras-pro/haras/${harasId}/animais${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<ApiResponse<Animal[]>>(url);
    return response.data;
  },

  // Buscar animal por ID
  async getAnimalById(animalId: string): Promise<ApiResponse<Animal>> {
    const response = await apiClient.get<ApiResponse<Animal>>(`/haras-pro/animais/${animalId}`);
    return response.data;
  },

  // Criar animal genérico
  async createAnimal(data: CreateAnimalDTO): Promise<ApiResponse<Animal>> {
    const response = await apiClient.post<ApiResponse<Animal>>('/haras-pro/animais', data);
    return response.data;
  },

  // Atualizar animal
  async updateAnimal(animalId: string, data: Partial<CreateAnimalDTO>): Promise<ApiResponse<Animal>> {
    const response = await apiClient.put<ApiResponse<Animal>>(`/haras-pro/animais/${animalId}`, data);
    return response.data;
  },

  // Excluir animal
  async deleteAnimal(animalId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/haras-pro/animais/${animalId}`);
    return response.data;
  },

  // =============== GARANHÕES ===============
  
  // Listar garanhões de um haras
  async getGaranhoesByHaras(harasId: string): Promise<ApiResponse<Garanhao[]>> {
    const response = await apiClient.get<ApiResponse<Garanhao[]>>(`/haras-pro/haras/${harasId}/garanhoes`);
    return response.data;
  },

  // Criar garanhão
  async createGaranhao(data: CreateGaranhaoDTO): Promise<ApiResponse<Garanhao>> {
    const response = await apiClient.post<ApiResponse<Garanhao>>('/haras-pro/garanhoes', data);
    return response.data;
  },

  // =============== DOADORAS ===============
  
  // Listar doadoras de um haras
  async getDoadorasByHaras(harasId: string): Promise<ApiResponse<Doadora[]>> {
    const response = await apiClient.get<ApiResponse<Doadora[]>>(`/haras-pro/haras/${harasId}/doadoras`);
    return response.data;
  },

  // Criar doadora
  async createDoadora(data: CreateDoadoraDTO): Promise<ApiResponse<Doadora>> {
    const response = await apiClient.post<ApiResponse<Doadora>>('/haras-pro/doadoras', data);
    return response.data;
  },

  // =============== RECEPTORAS ===============
  
  // Listar receptoras de um haras
  async getReceptorasByHaras(harasId: string): Promise<ApiResponse<Receptora[]>> {
    const response = await apiClient.get<ApiResponse<Receptora[]>>(`/haras-pro/haras/${harasId}/receptoras`);
    return response.data;
  },

  // Criar receptora
  async createReceptora(data: CreateReceptoraDTO): Promise<ApiResponse<Receptora>> {
    const response = await apiClient.post<ApiResponse<Receptora>>('/haras-pro/receptoras', data);
    return response.data;
  },

  // =============== EMBRIÕES ===============
  
  // Listar embriões de um haras
  async getEmbrioesByHaras(harasId: string): Promise<ApiResponse<RegistroEmbriao[]>> {
    const response = await apiClient.get<ApiResponse<RegistroEmbriao[]>>(`/haras-pro/haras/${harasId}/embrioes`);
    return response.data;
  },

  // Criar registro de embrião
  async createEmbriao(data: CreateEmbriaoDTO): Promise<ApiResponse<RegistroEmbriao>> {
    const response = await apiClient.post<ApiResponse<RegistroEmbriao>>('/haras-pro/embrioes', data);
    return response.data;
  },

  // Transferir embrião para receptora
  async transferirEmbriao(embriaoId: string, receptoraId: string, dataTransferencia: string): Promise<ApiResponse<RegistroEmbriao>> {
    const response = await apiClient.post<ApiResponse<RegistroEmbriao>>(`/haras-pro/embrioes/${embriaoId}/transferir`, {
      receptoraId,
      dataTransferencia
    });
    return response.data;
  },

  // =============== SAÚDE ===============
  
  // Listar registros de saúde de um animal
  async getRegistrosSaudeByAnimal(animalId: string): Promise<RegistroSaude[]> {
    const response = await apiClient.get<ApiResponse<RegistroSaude[]>>(`/haras-pro/animais/${animalId}/saude`);
    return response.data.data;
  },

  // Criar registro de saúde
  async createRegistroSaude(data: CreateRegistroSaudeDTO): Promise<ApiResponse<RegistroSaude>> {
    const response = await apiClient.post<ApiResponse<RegistroSaude>>('/haras-pro/saude', data);
    return response.data;
  },

  // Atualizar registro de saúde
  async updateRegistroSaude(registroId: string, data: Partial<CreateRegistroSaudeDTO>): Promise<ApiResponse<RegistroSaude>> {
    const response = await apiClient.put<ApiResponse<RegistroSaude>>(`/haras-pro/saude/${registroId}`, data);
    return response.data;
  },

  // Excluir registro de saúde
  async deleteRegistroSaude(registroId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/haras-pro/saude/${registroId}`);
    return response.data;
  },

  // =============== DIETA ===============
  
  // Listar dietas de um animal
  async getDietasByAnimal(animalId: string): Promise<ApiResponse<DietaAnimal[]>> {
    const response = await apiClient.get<ApiResponse<DietaAnimal[]>>(`/haras-pro/animais/${animalId}/dietas`);
    return response.data;
  },

  // Criar dieta
  async createDieta(data: CreateDietaDTO): Promise<ApiResponse<DietaAnimal>> {
    const response = await apiClient.post<ApiResponse<DietaAnimal>>('/haras-pro/dietas', data);
    return response.data;
  },

  // Atualizar dieta
  async updateDieta(dietaId: string, data: Partial<CreateDietaDTO>): Promise<ApiResponse<DietaAnimal>> {
    const response = await apiClient.put<ApiResponse<DietaAnimal>>(`/haras-pro/dietas/${dietaId}`, data);
    return response.data;
  },

  // Finalizar dieta (marcar como inativa)
  async finalizarDieta(dietaId: string, dataFim: string): Promise<ApiResponse<DietaAnimal>> {
    const response = await apiClient.post<ApiResponse<DietaAnimal>>(`/haras-pro/dietas/${dietaId}/finalizar`, {
      dataFim
    });
    return response.data;
  },

  // =============== EVENTOS REPRODUTIVOS ===============
  
  // Listar eventos reprodutivos de um haras
  async getEventosReprodutivosByHaras(harasId: string, filtros?: FiltroEventos): Promise<ApiResponse<EventoReprodutivo[]>> {
    const params = new URLSearchParams();
    if (filtros?.tipo) params.append('tipo', filtros.tipo);
    if (filtros?.status) params.append('status', filtros.status);
    if (filtros?.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros?.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros?.animalId) params.append('animalId', filtros.animalId);
    
    const queryString = params.toString();
    const url = `/haras-pro/haras/${harasId}/eventos-reprodutivos${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<ApiResponse<EventoReprodutivo[]>>(url);
    return response.data;
  },

  // Criar evento reprodutivo
  async createEventoReprodutivo(data: CreateEventoReprodutivoDTO): Promise<ApiResponse<EventoReprodutivo>> {
    const response = await apiClient.post<ApiResponse<EventoReprodutivo>>('/haras-pro/eventos-reprodutivos', data);
    return response.data;
  },

  // Atualizar status de evento reprodutivo
  async updateStatusEventoReprodutivo(eventoId: string, status: 'agendado' | 'realizado' | 'cancelado', observacoes?: string): Promise<ApiResponse<EventoReprodutivo>> {
    const response = await apiClient.put<ApiResponse<EventoReprodutivo>>(`/haras-pro/eventos-reprodutivos/${eventoId}/status`, {
      status,
      observacoes
    });
    return response.data;
  },

  // =============== GENEALOGIA ===============
  
  // Buscar genealogia de um animal
  async getGenealogiaByAnimal(animalId: string): Promise<ApiResponse<GenealogiaCavalo>> {
    const response = await apiClient.get<ApiResponse<GenealogiaCavalo>>(`/haras-pro/animais/${animalId}/genealogia`);
    return response.data;
  },

  // Atualizar genealogia
  async updateGenealogia(animalId: string, genealogia: Partial<GenealogiaCavalo>): Promise<ApiResponse<GenealogiaCavalo>> {
    const response = await apiClient.put<ApiResponse<GenealogiaCavalo>>(`/haras-pro/animais/${animalId}/genealogia`, genealogia);
    return response.data;
  },

  // Obter manejo reprodutivo por animal
  async getManejoReprodutivoByAnimal(animalId: string): Promise<ManejoReprodutivo[]> {
    const response = await apiClient.get<ApiResponse<ManejoReprodutivo[]>>(`/haras-pro/animais/${animalId}/manejo-reprodutivo`);
    return response.data.data;
  },

  // Obter genealogia
  async getGenealogia(animalId: string): Promise<Genealogia> {
    const response = await apiClient.get<ApiResponse<Genealogia>>(`/haras-pro/animais/${animalId}/genealogia`);
    return response.data.data;
  },

  // =============== MANEJO REPRODUTIVO ===============
  
  // Listar manejos reprodutivos
  async getManejoReprodutivo(harasId: string): Promise<ManejoReprodutivo[]> {
    const response = await apiClient.get<ApiResponse<ManejoReprodutivo[]>>(`/haras-pro/haras/${harasId}/manejo-reprodutivo`);
    return response.data.data;
  },

  // Criar manejo reprodutivo
  async createManejoReprodutivo(data: Partial<ManejoReprodutivo>): Promise<ManejoReprodutivo> {
    const response = await apiClient.post<ApiResponse<ManejoReprodutivo>>('/haras-pro/manejo-reprodutivo', data);
    return response.data.data;
  },

  // Atualizar manejo reprodutivo
  async updateManejoReprodutivo(id: string, data: Partial<ManejoReprodutivo>): Promise<ManejoReprodutivo> {
    const response = await apiClient.put<ApiResponse<ManejoReprodutivo>>(`/haras-pro/manejo-reprodutivo/${id}`, data);
    return response.data.data;
  },

  // Excluir manejo reprodutivo
  async deleteManejoReprodutivo(id: string): Promise<void> {
    await apiClient.delete(`/haras-pro/manejo-reprodutivo/${id}`);
  },

  // =============== AGENDA REPRODUTIVA ===============
  
  // Listar agenda reprodutiva
  async getAgendaReprodutiva(harasId: string): Promise<AgendaReprodutiva[]> {
    const response = await apiClient.get<ApiResponse<AgendaReprodutiva[]>>(`/haras-pro/haras/${harasId}/agenda-reprodutiva`);
    return response.data.data;
  },

  // Criar evento na agenda
  async createAgendaReprodutiva(data: Partial<AgendaReprodutiva>): Promise<AgendaReprodutiva> {
    const response = await apiClient.post<ApiResponse<AgendaReprodutiva>>('/haras-pro/agenda-reprodutiva', data);
    return response.data.data;
  },

  // Atualizar evento na agenda
  async updateAgendaReprodutiva(id: string, data: Partial<AgendaReprodutiva>): Promise<AgendaReprodutiva> {
    const response = await apiClient.put<ApiResponse<AgendaReprodutiva>>(`/haras-pro/agenda-reprodutiva/${id}`, data);
    return response.data.data;
  },

  // Excluir evento da agenda
  async deleteAgendaReprodutiva(id: string): Promise<void> {
    await apiClient.delete(`/haras-pro/agenda-reprodutiva/${id}`);
  },

  // =============== ESTATÍSTICAS ===============
  
  // Buscar estatísticas reprodutivas de um haras
  async getEstatisticasReprodutivas(harasId: string): Promise<ApiResponse<EstatisticasReprodutivas>> {
    const response = await apiClient.get<ApiResponse<EstatisticasReprodutivas>>(`/haras-pro/haras/${harasId}/estatisticas-reprodutivas`);
    return response.data;
  },

  // =============== RELATÓRIOS ===============
  
  // Gerar relatório de saúde por período
  async getRelatorioSaude(harasId: string, dataInicio: string, dataFim: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(`/haras-pro/haras/${harasId}/relatorio-saude`, {
      params: { dataInicio, dataFim }
    });
    return response.data;
  },

  // Gerar relatório reprodutivo por período
  async getRelatorioReprodutivo(harasId: string, dataInicio: string, dataFim: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(`/haras-pro/haras/${harasId}/relatorio-reprodutivo`, {
      params: { dataInicio, dataFim }
    });
    return response.data;
  }
};

export default animalService;
