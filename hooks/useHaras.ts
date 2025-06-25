import { useState, useEffect } from 'react';
import { harasProService, Haras, Stall, StallStats, CreateStallDTO, CreateHarasDTO, StallStatus } from '../services/harasProService';

export const useHaras = () => {
  const [harasList, setHarasList] = useState<Haras[]>([]);
  const [selectedHaras, setSelectedHaras] = useState<Haras | null>(null);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [stallStats, setStallStats] = useState<StallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do backend
  const loadHaras = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando haras do backend...');
      console.log('🔍 Verificando se harasProService existe:', typeof harasProService);
      console.log('🔍 Verificando se getMyHaras existe:', typeof harasProService.getMyHaras);
      
      if (typeof harasProService.getMyHaras !== 'function') {
        console.error('❌ getMyHaras não é uma função!');
        console.log('🔍 Propriedades disponíveis:', Object.keys(harasProService));
        throw new Error('Método getMyHaras não encontrado no serviço');
      }
      
      console.log('✅ Chamando harasProService.getMyHaras()...');
      const response = await harasProService.getMyHaras();
      console.log('✅ Resposta recebida:', response);
      
      // Verificar tanto response.success quanto response.status para compatibilidade
      const isSuccess = response.success === true || (response as any).status === 'success';
      
      if (isSuccess && response.data) {
        setHarasList(response.data);
        
        // Se encontrou haras, selecionar o primeiro
        if (response.data.length > 0) {
          const firstHaras = response.data[0];
          setSelectedHaras(firstHaras);
          console.log('Haras selecionado:', firstHaras);
          
          // Buscar baias deste haras
          await loadStallsFromBackend(firstHaras.id);
        } else {
          console.log('Nenhum haras encontrado');
          setError('Nenhum haras encontrado. Crie um haras primeiro.');
        }
      } else {
        console.error('Erro na resposta:', response);
        setError('Erro ao carregar haras do servidor');
      }
      
    } catch (err: any) {
      console.error('Erro ao carregar haras:', err);
      if (err.response?.status === 401) {
        setError('Token de autenticação inválido. Faça login novamente.');
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        setError('Erro de conexão com o servidor. Verifique sua internet.');
      } else {
        setError(err.message || 'Erro ao carregar dados do servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  // Buscar baias do backend
  const loadStallsFromBackend = async (harasId: string) => {
    try {
      console.log('Buscando baias do haras:', harasId);
      
      const [stallsResponse, statsResponse] = await Promise.all([
        harasProService.getStallsByHaras(harasId).catch(err => {
          console.log('Erro ao buscar baias:', err);
          return { success: false, data: [] };
        }),
        harasProService.getStallStats(harasId).catch(err => {
          console.log('Erro ao buscar estatísticas:', err);  
          return { success: false, data: null };
        })
      ]);

      console.log('Baias encontradas:', stallsResponse);
      console.log('Estatísticas:', statsResponse);

      if (stallsResponse.success || (stallsResponse as any).status === 'success') {
        setStalls(stallsResponse.data);
      } else {
        console.log('Nenhuma baia encontrada para este haras');
        setStalls([]);
      }

      if (statsResponse.success || (statsResponse as any).status === 'success') {
        setStallStats(statsResponse.data);
      } else {
        // Calcular estatísticas localmente se não conseguir do backend
        const currentStalls = (stallsResponse.success || (stallsResponse as any).status === 'success') ? stallsResponse.data : [];
        setStallStats(calculateStats(currentStalls));
      }
    } catch (stallsError: any) {
      console.error('Erro ao buscar baias:', stallsError);
      setStalls([]);
      setStallStats({
        total: 0,
        empty: 0,
        occupied: 0,
        maintenance: 0,
        cleaning: 0,
      });
    }
  };

  // Calcular estatísticas das baias
  const calculateStats = (stallList: Stall[]): StallStats => {
    return {
      total: stallList.length,
      empty: stallList.filter(s => s.status === StallStatus.EMPTY).length,
      occupied: stallList.filter(s => s.status === StallStatus.OCCUPIED).length,
      maintenance: stallList.filter(s => s.status === StallStatus.MAINTENANCE).length,
      cleaning: stallList.filter(s => s.status === StallStatus.CLEANING).length,
    };
  };

  // Criar nova baia
  const createStall = async (data: CreateStallDTO) => {
    try {
      setError(null);
      
      if (!selectedHaras) {
        throw new Error('Nenhum haras selecionado');
      }

      console.log('Criando baia no backend:', data);
      const response = await harasProService.createStall({
        ...data,
        harasId: selectedHaras.id
      });
      
      if (response.success || (response as any).status === 'success') {
        console.log('Baia criada:', response.data);
        // Recarregar baias
        await loadStallsFromBackend(selectedHaras.id);
        return response.data;
      } else {
        throw new Error('Erro ao criar baia no servidor');
      }
    } catch (err: any) {
      console.error('Erro ao criar baia:', err);
      setError(err.message || 'Erro ao criar baia');
      throw err;
    }
  };

  // Excluir baia
  const deleteStall = async (id: string) => {
    try {
      setError(null);
      
      if (!selectedHaras) {
        throw new Error('Nenhum haras selecionado');
      }

      console.log('Excluindo baia:', id);
      const response = await harasProService.deleteStall(id);
      
      if (response.success || (response as any).status === 'success') {
        console.log('Baia excluída');
        // Recarregar baias
        await loadStallsFromBackend(selectedHaras.id);
      } else {
        throw new Error('Erro ao excluir baia no servidor');
      }
    } catch (err: any) {
      console.error('Erro ao excluir baia:', err);
      setError(err.message || 'Erro ao excluir baia');
      throw err;
    }
  };

  // Ocupar baia
  const occupyStall = async (stallId: string, horseData: { horseName: string }) => {
    try {
      setError(null);
      
      if (!selectedHaras) {
        throw new Error('Nenhum haras selecionado');
      }

      console.log('Ocupando baia:', stallId, horseData);
      // Para ocupar uma baia, precisamos usar o occupyStall com horseId
      // Como não temos horseId aqui, vamos usar setStallMaintenance temporariamente
      const response = await harasProService.occupyStall(stallId, horseData.horseName);
      
      if (response.success || (response as any).status === 'success') {
        console.log('Baia ocupada');
        // Recarregar baias
        await loadStallsFromBackend(selectedHaras.id);
      } else {
        throw new Error('Erro ao ocupar baia no servidor');
      }
    } catch (err: any) {
      console.error('Erro ao ocupar baia:', err);
      setError(err.message || 'Erro ao ocupar baia');
      throw err;
    }
  };

  // Desocupar baia
  const vacateStall = async (stallId: string) => {
    try {
      setError(null);
      
      if (!selectedHaras) {
        throw new Error('Nenhum haras selecionado');
      }

      console.log('Desocupando baia:', stallId);
      const response = await harasProService.setMaintenanceStatus(stallId, 'empty');
      
      if (response.success || (response as any).status === 'success') {
        console.log('Baia desocupada');
        // Recarregar baias
        await loadStallsFromBackend(selectedHaras.id);
      } else {
        throw new Error('Erro ao desocupar baia no servidor');
      }
    } catch (err: any) {
      console.error('Erro ao desocupar baia:', err);
      setError(err.message || 'Erro ao desocupar baia');
      throw err;
    }
  };

  // Registrar limpeza
  const recordCleaning = async (stallId: string, notes?: string) => {
    try {
      setError(null);
      
      if (!selectedHaras) {
        throw new Error('Nenhum haras selecionado');
      }

      console.log('Registrando limpeza:', stallId, notes);
      const response = await harasProService.setStallMaintenance(stallId, false, notes);
      
      if (response.success || (response as any).status === 'success') {
        console.log('Limpeza registrada');
        // Recarregar baias
        await loadStallsFromBackend(selectedHaras.id);
      } else {
        throw new Error('Erro ao registrar limpeza no servidor');
      }
    } catch (err: any) {
      console.error('Erro ao registrar limpeza:', err);
      setError(err.message || 'Erro ao registrar limpeza');
      throw err;
    }
  };

  // Atualizar dados
  const refreshData = async () => {
    await loadHaras();
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  // Selecionar haras
  const selectHaras = async (haras: Haras) => {
    setSelectedHaras(haras);
    await loadStallsFromBackend(haras.id);
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadHaras();
  }, []);

  return {
    harasList,
    selectedHaras,
    stalls,
    stallStats,
    loading,
    error,
    loadHaras,
    createHaras: async () => {}, // Função vazia para compatibilidade
    deleteHaras: async () => {}, // Função vazia para compatibilidade
    selectHaras,
    createStall,
    deleteStall,
    occupyStall,
    vacateStall,
    recordCleaning,
    refreshData,
    clearError,
  };
};
