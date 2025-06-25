import { useState, useEffect } from 'react';
import { 
  harasProService, 
  Haras, 
  CreateHarasDTO, 
  UpdateHarasDTO, 
  Stall, 
  CreateStallDTO,
  StallStats 
} from '../services/harasProService';

export interface UseHarasResult {
  // Estado
  harasList: Haras[];
  selectedHaras: Haras | null;
  stalls: Stall[];
  stallStats: StallStats | null;
  loading: boolean;
  error: string | null;

  // Ações de Haras
  loadHaras: () => Promise<void>;
  createHaras: (data: CreateHarasDTO) => Promise<void>;
  updateHaras: (id: string, data: UpdateHarasDTO) => Promise<void>;
  deleteHaras: (id: string) => Promise<void>;
  selectHaras: (haras: Haras | null) => void;

  // Ações de Baias
  loadStalls: (harasId: string) => Promise<void>;
  createStall: (data: CreateStallDTO) => Promise<void>;
  deleteStall: (stallId: string) => Promise<void>;
  occupyStall: (stallId: string, horseData: { horseId?: string; horseName?: string; notes?: string }) => Promise<void>;
  vacateStall: (stallId: string, notes?: string) => Promise<void>;
  recordCleaning: (stallId: string, notes?: string) => Promise<void>;
  recordMaintenance: (stallId: string, notes?: string) => Promise<void>;

  // Utilitários
  clearError: () => void;
  refreshData: () => Promise<void>;
}

export const useHaras = (): UseHarasResult => {
  const [harasList, setHarasList] = useState<Haras[]>([]);
  const [selectedHaras, setSelectedHaras] = useState<Haras | null>(null);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [stallStats, setStallStats] = useState<StallStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar lista de haras
  const loadHaras = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await harasProService.getMyHaras();
      setHarasList(response.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar haras');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo haras
  const createHaras = async (data: CreateHarasDTO) => {
    try {
      setLoading(true);
      setError(null);
      await harasProService.createHaras(data);
      await loadHaras(); // Recarregar lista
    } catch (err: any) {
      setError(err.message || 'Erro ao criar haras');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar haras
  const updateHaras = async (id: string, data: UpdateHarasDTO) => {
    try {
      setLoading(true);
      setError(null);
      const response = await harasProService.updateHaras(id, data);
      
      // Atualizar na lista
      setHarasList(prev => prev.map(h => h.id === id ? response.data : h));
      
      // Atualizar selecionado se for o mesmo
      if (selectedHaras?.id === id) {
        setSelectedHaras(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar haras');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir haras
  const deleteHaras = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await harasProService.deleteHaras(id);
      
      // Remover da lista
      setHarasList(prev => prev.filter(h => h.id !== id));
      
      // Limpar seleção se for o mesmo
      if (selectedHaras?.id === id) {
        setSelectedHaras(null);
        setStalls([]);
        setStallStats(null);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir haras');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Selecionar haras
  const selectHaras = (haras: Haras | null) => {
    setSelectedHaras(haras);
    if (haras) {
      loadStalls(haras.id);
    } else {
      setStalls([]);
      setStallStats(null);
    }
  };

  // Carregar baias do haras selecionado
  const loadStalls = async (harasId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const [stallsResponse, statsResponse] = await Promise.all([
        harasProService.getStallsByHaras(harasId),
        harasProService.getStallStats(harasId)
      ]);
      
      setStalls(stallsResponse.data);
      setStallStats(statsResponse.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar baias');
    } finally {
      setLoading(false);
    }
  };

  // Criar nova baia
  const createStall = async (data: CreateStallDTO) => {
    try {
      setLoading(true);
      setError(null);
      await harasProService.createStall(data);
      
      // Recarregar baias se o haras está selecionado
      if (selectedHaras && selectedHaras.id === data.haras_id) {
        await loadStalls(data.haras_id);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar baia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir baia
  const deleteStall = async (stallId: string) => {
    try {
      setLoading(true);
      setError(null);
      await harasProService.deleteStall(stallId);
      
      // Remover da lista local
      setStalls(prev => prev.filter(s => s.id !== stallId));
      
      // Atualizar estatísticas se haras está selecionado
      if (selectedHaras) {
        const statsResponse = await harasProService.getStallStats(selectedHaras.id);
        setStallStats(statsResponse.data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir baia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Ocupar baia
  const occupyStall = async (stallId: string, horseData: { horseId?: string; horseName?: string; notes?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await harasProService.manageStallOccupation(stallId, 'occupy', horseData);
      
      // Atualizar na lista local
      setStalls(prev => prev.map(s => s.id === stallId ? response.data : s));
      
      // Atualizar estatísticas
      if (selectedHaras) {
        const statsResponse = await harasProService.getStallStats(selectedHaras.id);
        setStallStats(statsResponse.data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao ocupar baia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Desocupar baia
  const vacateStall = async (stallId: string, notes?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await harasProService.manageStallOccupation(stallId, 'vacate', { notes });
      
      // Atualizar na lista local
      setStalls(prev => prev.map(s => s.id === stallId ? response.data : s));
      
      // Atualizar estatísticas
      if (selectedHaras) {
        const statsResponse = await harasProService.getStallStats(selectedHaras.id);
        setStallStats(statsResponse.data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao desocupar baia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Registrar limpeza
  const recordCleaning = async (stallId: string, notes?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await harasProService.recordMaintenance(stallId, 'cleaning', notes);
      
      // Atualizar na lista local
      setStalls(prev => prev.map(s => s.id === stallId ? response.data : s));
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar limpeza');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Registrar manutenção
  const recordMaintenance = async (stallId: string, notes?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await harasProService.recordMaintenance(stallId, 'maintenance', notes);
      
      // Atualizar na lista local
      setStalls(prev => prev.map(s => s.id === stallId ? response.data : s));
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar manutenção');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  // Atualizar todos os dados
  const refreshData = async () => {
    await loadHaras();
    if (selectedHaras) {
      await loadStalls(selectedHaras.id);
    }
  };

  // Carregar haras ao inicializar
  useEffect(() => {
    loadHaras();
  }, []);

  return {
    // Estado
    harasList,
    selectedHaras,
    stalls,
    stallStats,
    loading,
    error,

    // Ações de Haras
    loadHaras,
    createHaras,
    updateHaras,
    deleteHaras,
    selectHaras,

    // Ações de Baias
    loadStalls,
    createStall,
    deleteStall,
    occupyStall,
    vacateStall,
    recordCleaning,
    recordMaintenance,

    // Utilitários
    clearError,
    refreshData
  };
};
