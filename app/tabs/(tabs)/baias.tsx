import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../../constants/Theme';
import { useHaras } from '../../../hooks/useHaras';
import { Haras, Stall, StallStatus, Horse, Diet, Medication, CreateHarasDTO, CreateStallDTO } from '../../../services/harasProService';
import { authService } from '../../../services/api';
import LoginScreen from '../../../components/LoginScreen';
import { harasProService } from '../../../services/harasProService';

const { width } = Dimensions.get('window');

export default function Baias() {
  const {
    harasList,
    selectedHaras,
    stalls,
    stallStats,
    loading,
    error,
    loadHaras,
    createHaras,
    deleteHaras,
    selectHaras,
    createStall,
    deleteStall,
    occupyStall,
    vacateStall,
    recordCleaning,
    refreshData,
    clearError
  } = useHaras();

  // Estados dos modais
  const [showCreateStallModal, setShowCreateStallModal] = useState(false);
  const [showStallDetailsModal, setShowStallDetailsModal] = useState(false);
  const [showHorseSelectionModal, setShowHorseSelectionModal] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [horseNameInput, setHorseNameInput] = useState('');
  const [availableHorses, setAvailableHorses] = useState<Horse[]>([]);
  const [loadingHorses, setLoadingHorses] = useState(false);

  // Estado de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Estados dos formulários
  const [stallForm, setStallForm] = useState<CreateStallDTO>({
    haras_id: '',
    number: '',
    name: '',
    dimensions: '',
    description: ''
  });

  const [refreshing, setRefreshing] = useState(false);

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      setCheckingAuth(true);
      const { token, user } = await authService.loadStoredAuthData();
      
      if (token && user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLoginSuccess = async () => {
    // Aguardar um pouco para garantir que o token foi salvo
    setTimeout(async () => {
      await checkAuthentication();
    }, 100);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Erro', error);
      clearError();
    }
  }, [error]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleCreateStall = async () => {
    if (!selectedHaras) return;

    try {
      await createStall({
        ...stallForm,
        haras_id: selectedHaras.id
      });
      setShowCreateStallModal(false);
      setStallForm({
        haras_id: '',
        number: '',
        name: '',
        dimensions: '',
        description: ''
      });
      Alert.alert('Sucesso', 'Baia criada com sucesso!');
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  // Função para carregar cavalos disponíveis
  const loadAvailableHorses = async () => {
    console.log('=== CARREGANDO CAVALOS DISPONÍVEIS ===');
    console.log('selectedHaras:', selectedHaras);
    
    if (!selectedHaras) {
      console.log('selectedHaras não está definido, retornando...');
      return;
    }

    try {
      setLoadingHorses(true);
      console.log('Buscando cavalos para haras ID:', selectedHaras.id);
      const response = await harasProService.getHorsesByHaras(selectedHaras.id);
      
      console.log('Resposta da API:', response);
      
      if (response.data) {
        console.log('Total de cavalos encontrados:', response.data.length);
        // Filtrar apenas cavalos que não estão em baias
        const unassignedHorses = response.data.filter(horse => !horse.stallId);
        console.log('Cavalos disponíveis (sem baia):', unassignedHorses.length);
        console.log('Lista de cavalos disponíveis:', unassignedHorses.map(h => ({ name: h.name, stallId: h.stallId })));
        setAvailableHorses(unassignedHorses);
      } else {
        console.log('Nenhum dado retornado pela API');
        setAvailableHorses([]);
      }
    } catch (error) {
      console.error('Erro ao carregar cavalos:', error);
      setAvailableHorses([]);
      Alert.alert('Erro', 'Não foi possível carregar a lista de cavalos.');
    } finally {
      setLoadingHorses(false);
    }
  };

  const handleStallAction = (stall: Stall, action: string) => {
    switch (action) {
      case 'occupy':
        setSelectedStall(stall);
        loadAvailableHorses();
        setShowHorseSelectionModal(true);
        break;
      case 'vacate':
        Alert.alert(
          'Desocupar Baia',
          'Tem certeza que deseja desocupar esta baia?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Desocupar',
              onPress: () => vacateStall(stall.id)
            }
          ]
        );
        break;
      case 'clean':
        recordCleaning(stall.id, 'Limpeza registrada');
        break;
      case 'delete':
        Alert.alert(
          'Excluir Baia',
          `Tem certeza que deseja excluir a baia ${stall.number}?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Excluir',
              style: 'destructive',
              onPress: () => deleteStall(stall.id)
            }
          ]
        );
        break;
    }
  };

  // Funções para lidar com o prompt modal
  const handleOccupyStall = async () => {
    if (selectedStall && horseNameInput.trim()) {
      try {
        await occupyStall(selectedStall.id, { horseName: horseNameInput.trim() });
        setPromptVisible(false);
        setHorseNameInput('');
        setSelectedStall(null);
      } catch (error) {
        // Erro já tratado no hook
      }
    }
  };

  const handleCancelPrompt = () => {
    setPromptVisible(false);
    setHorseNameInput('');
    setSelectedStall(null);
  };

  // Função para ocupar baia com cavalo selecionado
  const handleAssignHorseToStall = async (horse: Horse) => {
    if (!selectedStall) return;

    try {
      await occupyStall(selectedStall.id, { 
        horseId: horse.id, 
        horseName: horse.name 
      });
      setShowHorseSelectionModal(false);
      setSelectedStall(null);
      setAvailableHorses([]);
      Alert.alert('Sucesso', `${horse.name} foi atribuído à baia ${selectedStall.number}!`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atribuir o cavalo à baia.');
      console.error('Erro ao atribuir cavalo:', error);
    }
  };

  const handleCancelHorseSelection = () => {
    setShowHorseSelectionModal(false);
    setSelectedStall(null);
    setAvailableHorses([]);
  };

  const getStatusGradient = (status: StallStatus): [string, string] => {
    switch (status) {
      case StallStatus.OCCUPIED:
        return ['#10b981', '#059669']; // Verde
      case StallStatus.EMPTY:
        return ['#3b82f6', '#1d4ed8']; // Azul
      case StallStatus.MAINTENANCE:
        return ['#f59e0b', '#d97706']; // Amarelo
      case StallStatus.CLEANING:
        return ['#8b5cf6', '#7c3aed']; // Roxo
      default:
        return ['#6b7280', '#4b5563']; // Cinza
    }
  };

  const getStatusColor = (status: StallStatus): string => {
    const [primaryColor] = getStatusGradient(status);
    return primaryColor;
  };

  const getStatusIcon = (status: StallStatus): string => {
    switch (status) {
      case StallStatus.OCCUPIED:
        return 'user';
      case StallStatus.EMPTY:
        return 'home';
      case StallStatus.MAINTENANCE:
        return 'tool';
      case StallStatus.CLEANING:
        return 'droplet';
      default:
        return 'circle';
    }
  };

  const getStatusText = (status: StallStatus) => {
    switch (status) {
      case StallStatus.OCCUPIED:
        return 'Ocupada';
      case StallStatus.EMPTY:
        return 'Livre';
      case StallStatus.MAINTENANCE:
        return 'Manutenção';
      case StallStatus.CLEANING:
        return 'Limpeza';
      default:
        return 'Desconhecido';
    }
  };

  const getStallActions = (stall: Stall) => {
    const actions = [];
    
    if (stall.status === StallStatus.EMPTY) {
      actions.push({ icon: 'user-plus', label: 'Ocupar', action: 'occupy', color: Theme.colors.success[600] });
    }
    
    if (stall.status === StallStatus.OCCUPIED) {
      actions.push({ icon: 'user-minus', label: 'Desocupar', action: 'vacate', color: Theme.colors.warning[600] });
    }
    
    actions.push({ icon: 'droplet', label: 'Limpar', action: 'clean', color: Theme.colors.primary[600] });
    actions.push({ icon: 'trash-2', label: 'Excluir', action: 'delete', color: Theme.colors.error[600] });
    
    return actions;
  };

  // Mostrar loading enquanto verifica autenticação
  if (checkingAuth) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary[600]} />
          <Text style={styles.loadingText}>Verificando autenticação...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar tela de login se não estiver autenticado
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8b5cf6" />
      
      {/* Header com Gradiente */}
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Gestão de Baias</Text>
            <Text style={styles.subtitle}>
              {selectedHaras ? selectedHaras.name : 'Selecione um haras'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleLogout}
            >
              <Feather name="log-out" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Estatísticas das Baias */}
        {selectedHaras && stallStats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stallStats.occupied}</Text>
              <Text style={styles.statLabel}>Ocupadas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stallStats.empty}</Text>
              <Text style={styles.statLabel}>Livres</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stallStats.maintenance}</Text>
              <Text style={styles.statLabel}>Manutenção</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stallStats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        )}

        {/* Botão para criar nova baia */}
        {selectedHaras && (
          <View style={styles.createStallSection}>
            <TouchableOpacity
              style={styles.createStallButton}
              onPress={() => setShowCreateStallModal(true)}
            >
              <Feather name="plus" size={20} color={Theme.colors.primary[600]} />
              <Text style={styles.createStallText}>Nova Baia</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de Baias */}
        {selectedHaras && (
          <View style={styles.baiasContainer}>
            {loading && stalls.length === 0 ? (
              <ActivityIndicator size="large" color={Theme.colors.primary[600]} />
            ) : stalls.length > 0 ? (
              stalls.map((stall) => (
                <View key={stall.id} style={styles.baiaCard}>
                  {/* Header do Card com Gradiente */}
                  <LinearGradient
                    colors={getStatusGradient(stall.status)}
                    style={styles.baiaCardHeader}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.baiaHeaderLeft}>
                      <Feather name={getStatusIcon(stall.status) as any} size={24} color="white" />
                      <View style={styles.baiaHeaderText}>
                        <Text style={styles.baiaNumero}>Baia {stall.number}</Text>
                        <Text style={styles.baiaStatus}>{getStatusText(stall.status)}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.baiaOptionsButton}
                      onPress={() => {
                        setSelectedStall(stall);
                        setShowStallDetailsModal(true);
                      }}
                    >
                      <Feather name="more-vertical" size={20} color="white" />
                    </TouchableOpacity>
                  </LinearGradient>

                  {/* Conteúdo do Card */}
                  <View style={styles.baiaCardContent}>
                    {stall.name && (
                      <View style={styles.baiaInfoRow}>
                        <Feather name="tag" size={16} color="#64748b" />
                        <Text style={styles.baiaInfoLabel}>Nome:</Text>
                        <Text style={styles.baiaInfoValue}>{stall.name}</Text>
                      </View>
                    )}
                    
                    {stall.horse ? (
                      <>
                        <View style={styles.baiaInfoRow}>
                          <Feather name="user" size={16} color="#64748b" />
                          <Text style={styles.baiaInfoLabel}>Cavalo:</Text>
                          <Text style={styles.baiaInfoValue}>{stall.horse.name}</Text>
                        </View>
                        
                        <View style={styles.baiaInfoRow}>
                          <Feather name="info" size={16} color="#64748b" />
                          <Text style={styles.baiaInfoLabel}>Raça:</Text>
                          <Text style={styles.baiaInfoValue}>{stall.horse.breed}</Text>
                        </View>
                        
                        <View style={styles.baiaInfoRow}>
                          <Feather name="calendar" size={16} color="#64748b" />
                          <Text style={styles.baiaInfoLabel}>Idade:</Text>
                          <Text style={styles.baiaInfoValue}>{stall.horse.age} anos</Text>
                        </View>
                      </>
                    ) : stall.horseName && (
                      <View style={styles.baiaInfoRow}>
                        <Feather name="user" size={16} color="#64748b" />
                        <Text style={styles.baiaInfoLabel}>Cavalo:</Text>
                        <Text style={styles.baiaInfoValue}>{stall.horseName}</Text>
                      </View>
                    )}

                    {stall.dimensions && (
                      <View style={styles.baiaInfoRow}>
                        <Feather name="maximize" size={16} color="#64748b" />
                        <Text style={styles.baiaInfoLabel}>Dimensões:</Text>
                        <Text style={styles.baiaInfoValue}>{stall.dimensions}</Text>
                      </View>
                    )}

                    {stall.lastCleaning && (
                      <View style={styles.baiaInfoRow}>
                        <Feather name="droplet" size={16} color="#10b981" />
                        <Text style={styles.baiaInfoLabel}>Última Limpeza:</Text>
                        <Text style={styles.baiaInfoValue}>
                          {new Date(stall.lastCleaning).toLocaleDateString('pt-BR')}
                        </Text>
                      </View>
                    )}

                    {stall.nextCleaningDue && (
                      <View style={styles.baiaInfoRow}>
                        <Feather name="clock" size={16} color="#f59e0b" />
                        <Text style={styles.baiaInfoLabel}>Próxima Limpeza:</Text>
                        <Text style={[
                          styles.baiaInfoValue,
                          new Date(stall.nextCleaningDue) < new Date() && styles.overdue
                        ]}>
                          {new Date(stall.nextCleaningDue).toLocaleDateString('pt-BR')}
                        </Text>
                      </View>
                    )}

                    {/* Ações Rápidas */}
                    <View style={styles.baiaQuickActions}>
                      {getStallActions(stall).slice(0, 3).map((action, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.quickActionButton,
                            { backgroundColor: action.color + '15' }
                          ]}
                          onPress={() => handleStallAction(stall, action.action)}
                        >
                          <Feather name={action.icon as any} size={16} color={action.color} />
                          <Text style={[styles.quickActionText, { color: action.color }]}>
                            {action.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Feather name="home" size={48} color={Theme.colors.neutral[400]} />
                <Text style={styles.emptyText}>Nenhuma baia encontrada</Text>
                <Text style={styles.emptySubtext}>
                  Crie sua primeira baia clicando no botão acima
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal Criar Baia */}
      <Modal
        visible={showCreateStallModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateStallModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateStallModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Baia</Text>
            <TouchableOpacity 
              onPress={handleCreateStall}
              disabled={!stallForm.number}
            >
              <Text style={[
                styles.modalSaveText,
                !stallForm.number && styles.modalSaveTextDisabled
              ]}>
                Salvar
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número da Baia *</Text>
              <TextInput
                style={styles.textInput}
                value={stallForm.number}
                onChangeText={(text) => setStallForm(prev => ({ ...prev, number: text }))}
                placeholder="Ex: A1, B2, 001"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da Baia</Text>
              <TextInput
                style={styles.textInput}
                value={stallForm.name}
                onChangeText={(text) => setStallForm(prev => ({ ...prev, name: text }))}
                placeholder="Ex: Box Principal A1"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dimensões</Text>
              <TextInput
                style={styles.textInput}
                value={stallForm.dimensions}
                onChangeText={(text) => setStallForm(prev => ({ ...prev, dimensions: text }))}
                placeholder="Ex: 3x4m"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={stallForm.description}
                onChangeText={(text) => setStallForm(prev => ({ ...prev, description: text }))}
                placeholder="Descrição da baia..."
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal Detalhes da Baia */}
      <Modal
        visible={showStallDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowStallDetailsModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowStallDetailsModal(false)}>
              <Text style={styles.modalCancelText}>Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Baia {selectedStall?.number}
            </Text>
            <View style={{ width: 50 }} />
          </View>

          {selectedStall && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.stallDetailCard}>
                <View style={styles.stallDetailHeader}>
                  <Text style={styles.stallDetailTitle}>{selectedStall.number}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedStall.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(selectedStall.status) }]}>
                      {getStatusText(selectedStall.status)}
                    </Text>
                  </View>
                </View>

                {selectedStall.name && (
                  <View style={styles.stallDetailItem}>
                    <Text style={styles.stallDetailLabel}>Nome:</Text>
                    <Text style={styles.stallDetailValue}>{selectedStall.name}</Text>
                  </View>
                )}

                {selectedStall.horseName && (
                  <View style={styles.stallDetailItem}>
                    <Text style={styles.stallDetailLabel}>Cavalo:</Text>
                    <Text style={styles.stallDetailValue}>{selectedStall.horseName}</Text>
                  </View>
                )}

                {selectedStall.dimensions && (
                  <View style={styles.stallDetailItem}>
                    <Text style={styles.stallDetailLabel}>Dimensões:</Text>
                    <Text style={styles.stallDetailValue}>{selectedStall.dimensions}</Text>
                  </View>
                )}

                {selectedStall.description && (
                  <View style={styles.stallDetailItem}>
                    <Text style={styles.stallDetailLabel}>Descrição:</Text>
                    <Text style={styles.stallDetailValue}>{selectedStall.description}</Text>
                  </View>
                )}

                {selectedStall.lastCleaning && (
                  <View style={styles.stallDetailItem}>
                    <Text style={styles.stallDetailLabel}>Última Limpeza:</Text>
                    <Text style={styles.stallDetailValue}>
                      {new Date(selectedStall.lastCleaning).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                )}

                {selectedStall.lastMaintenance && (
                  <View style={styles.stallDetailItem}>
                    <Text style={styles.stallDetailLabel}>Última Manutenção:</Text>
                    <Text style={styles.stallDetailValue}>
                      {new Date(selectedStall.lastMaintenance).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                )}
              </View>

              {/* Informações do Cavalo */}
              {selectedStall.horse && (
                <View style={styles.stallDetailCard}>
                  <View style={styles.stallDetailHeader}>
                    <Text style={styles.stallDetailTitle}>Informações do Cavalo</Text>
                    <Feather name="user" size={20} color={Theme.colors.primary[600]} />
                  </View>

                  <View style={styles.stallDetailItem}>
                    <Text style={styles.stallDetailLabel}>Nome:</Text>
                    <Text style={styles.stallDetailValue}>{selectedStall.horse.name}</Text>
                  </View>

                  <View style={styles.stallDetailItem}>
                    <Text style={styles.stallDetailLabel}>Raça:</Text>
                    <Text style={styles.stallDetailValue}>{selectedStall.horse.breed}</Text>
                  </View>

                  <View style={styles.stallDetailItem}>
                    <Text style={styles.stallDetailLabel}>Idade:</Text>
                    <Text style={styles.stallDetailValue}>{selectedStall.horse.age} anos</Text>
                  </View>

                  <View style={styles.stallDetailItem}>
                    <Text style={styles.stallDetailLabel}>Sexo:</Text>
                    <Text style={styles.stallDetailValue}>
                      {selectedStall.horse.gender === 'male' ? 'Macho' : 
                       selectedStall.horse.gender === 'female' ? 'Fêmea' : 'Castrado'}
                    </Text>
                  </View>

                  <View style={styles.stallDetailItem}>
                    <Text style={styles.stallDetailLabel}>Cor:</Text>
                    <Text style={styles.stallDetailValue}>{selectedStall.horse.color}</Text>
                  </View>

                  {selectedStall.horse.weight && (
                    <View style={styles.stallDetailItem}>
                      <Text style={styles.stallDetailLabel}>Peso:</Text>
                      <Text style={styles.stallDetailValue}>{selectedStall.horse.weight} kg</Text>
                    </View>
                  )}

                  {selectedStall.horse.notes && (
                    <View style={styles.stallDetailItem}>
                      <Text style={styles.stallDetailLabel}>Observações:</Text>
                      <Text style={styles.stallDetailValue}>{selectedStall.horse.notes}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Dieta Atual */}
              {selectedStall.horse && (
                <View style={styles.stallDetailCard}>
                  <View style={styles.stallDetailHeader}>
                    <Text style={styles.stallDetailTitle}>Dieta Atual</Text>
                    <Feather name="coffee" size={20} color={Theme.colors.success[600]} />
                  </View>

                  <View style={styles.dietPlaceholder}>
                    <Feather name="coffee" size={24} color={Theme.colors.neutral[400]} />
                    <Text style={styles.placeholderText}>
                      As informações de dieta serão carregadas do servidor
                    </Text>
                    <Text style={styles.placeholderSubtext}>
                      Inclui horários de alimentação, quantidades e tipo de ração
                    </Text>
                  </View>
                </View>
              )}

              {/* Medicações Ativas */}
              {selectedStall.horse && (
                <View style={styles.stallDetailCard}>
                  <View style={styles.stallDetailHeader}>
                    <Text style={styles.stallDetailTitle}>Medicações Ativas</Text>
                    <Feather name="activity" size={20} color={Theme.colors.warning[600]} />
                  </View>

                  <View style={styles.medicationPlaceholder}>
                    <Feather name="activity" size={24} color={Theme.colors.neutral[400]} />
                    <Text style={styles.placeholderText}>
                      As medicações ativas serão carregadas do servidor
                    </Text>
                    <Text style={styles.placeholderSubtext}>
                      Inclui dosagem, frequência e instruções especiais
                    </Text>
                  </View>
                </View>
              )}

              {/* Histórico de Limpeza */}
              <View style={styles.stallDetailCard}>
                <View style={styles.stallDetailHeader}>
                  <Text style={styles.stallDetailTitle}>Histórico de Limpeza</Text>
                  <Feather name="droplet" size={20} color={Theme.colors.primary[600]} />
                </View>

                <View style={styles.cleaningPlaceholder}>
                  <Feather name="droplet" size={24} color={Theme.colors.neutral[400]} />
                  <Text style={styles.placeholderText}>
                    O histórico de limpeza será carregado do servidor
                  </Text>
                  <Text style={styles.placeholderSubtext}>
                    Mostra quando foi limpa, por quem e observações
                  </Text>
                </View>
              </View>

              <View style={styles.stallActionsContainer}>
                <Text style={styles.stallActionsTitle}>Ações Disponíveis</Text>
                {getStallActions(selectedStall).map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.stallActionButton, { borderColor: action.color }]}
                    onPress={() => {
                      setShowStallDetailsModal(false);
                      handleStallAction(selectedStall, action.action);
                    }}
                  >
                    <Feather name={action.icon as any} size={20} color={action.color} />
                    <Text style={[styles.stallActionText, { color: action.color }]}>
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Modal de Seleção de Cavalos */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showHorseSelectionModal}
        onRequestClose={handleCancelHorseSelection}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancelHorseSelection}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Selecionar Cavalo para Baia {selectedStall?.number}
            </Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.modalContent}>
            {loadingHorses ? (
              <View style={styles.emptyContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary[600]} />
                <Text style={styles.emptyText}>Carregando cavalos...</Text>
              </View>
            ) : availableHorses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="search" size={48} color={Theme.colors.neutral[400]} />
                <Text style={styles.emptyText}>Nenhum cavalo disponível</Text>
                <Text style={styles.emptySubtext}>
                  Todos os cavalos já estão atribuídos a baias ou não há cavalos cadastrados neste haras.
                </Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {availableHorses.map((horse) => (
                  <TouchableOpacity
                    key={horse.id}
                    style={styles.horseItem}
                    onPress={() => handleAssignHorseToStall(horse)}
                  >
                    <View style={styles.horseInfo}>
                      <View style={styles.horseAvatar}>
                        <Feather name="user" size={24} color={Theme.colors.primary[600]} />
                      </View>
                      <View style={styles.horseDetails}>
                        <Text style={styles.horseName}>{horse.name}</Text>
                        <Text style={styles.horseBreed}>{horse.breed} • {horse.age} anos</Text>
                        <Text style={styles.horseGender}>
                          {horse.gender === 'male' ? 'Macho' : 
                           horse.gender === 'female' ? 'Fêmea' : 'Castrado'}
                        </Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={20} color={Theme.colors.neutral[400]} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal de Prompt para Ocupar Baia */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={promptVisible}
        onRequestClose={handleCancelPrompt}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.promptModalContent}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptTitle}>Ocupar Baia {selectedStall?.number}</Text>
              <TouchableOpacity onPress={handleCancelPrompt}>
                <Feather name="x" size={24} color={Theme.colors.neutral[600]} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.promptLabel}>Digite o nome do cavalo:</Text>
            <TextInput
              style={styles.promptInput}
              value={horseNameInput}
              onChangeText={setHorseNameInput}
              placeholder="Nome do cavalo"
              placeholderTextColor={Theme.colors.neutral[400]}
              autoFocus={true}
              returnKeyType="done"
              onSubmitEditing={handleOccupyStall}
            />
            
            <View style={styles.promptButtons}>
              <TouchableOpacity
                style={[styles.promptButton, styles.cancelButton]}
                onPress={handleCancelPrompt}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.promptButton, styles.confirmButton]}
                onPress={handleOccupyStall}
                disabled={!horseNameInput.trim()}
              >
                <Text style={styles.confirmButtonText}>Ocupar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Theme.colors.primary[600]} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.primary[600],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[50],
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary[50],
    marginBottom: Theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Theme.typography.sizes['2xl'],
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[700],
  },
  statLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginTop: 4,
  },
  baiasContainer: {
    padding: Theme.spacing.lg,
  },
  baiaCard: {
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.md,
    overflow: 'hidden',
  },
  // Estilos faltantes para haras selector
  harasSelector: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary[50],
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[700],
    marginBottom: Theme.spacing.md,
  },
  harasCard: {
    backgroundColor: Theme.colors.primary[100],
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    minWidth: 200,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  harasCardSelected: {
    borderColor: Theme.colors.primary[600],
    backgroundColor: Theme.colors.primary[200],
  },
  harasName: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.primary[700],
    marginBottom: 4,
  },
  harasNameSelected: {
    color: Theme.colors.primary[800],
  },
  harasInfo: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginBottom: 2,
  },
  harasLocation: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[500],
  },
  // Estilos para criar baia
  createStallSection: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
  },
  createStallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary[100],
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: Theme.colors.primary[600],
    borderStyle: 'dashed',
  },
  createStallText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.primary[600],
    fontWeight: Theme.typography.weights.medium as any,
    marginLeft: Theme.spacing.sm,
  },
  // Estilos para estados vazios
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing['2xl'],
  },
  emptyText: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.neutral[600],
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[500],
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
    lineHeight: Theme.typography.lineHeights.relaxed * Theme.typography.sizes.sm,
  },
  // Estilos para modais
  modalContainer: {
    flex: 1,
    backgroundColor: Theme.colors.primary[50],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
    backgroundColor: Theme.colors.primary[100],
  },
  modalCancelText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.error[600],
    fontWeight: Theme.typography.weights.medium as any,
  },
  modalTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[700],
  },
  modalSaveText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.success[600],
    fontWeight: Theme.typography.weights.semibold as any,
  },
  modalSaveTextDisabled: {
    color: Theme.colors.neutral[400],
  },
  modalContent: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  // Estilos para formulários
  inputGroup: {
    marginBottom: Theme.spacing.lg,
  },
  inputLabel: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.primary[700],
    marginBottom: Theme.spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.primary[700],
    backgroundColor: Theme.colors.primary[50],
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  // Estilos para detalhes da baia
  stallDetailCard: {
    backgroundColor: Theme.colors.primary[100],
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.sm,
  },
  stallDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
  },
  stallDetailTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[700],
  },
  stallDetailItem: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.sm,
  },
  stallDetailLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    width: 120,
    fontWeight: Theme.typography.weights.medium as any,
  },
  stallDetailValue: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary[700],
    flex: 1,
    fontWeight: Theme.typography.weights.medium as any,
  },
  // Estilos para ações da baia
  stallActionsContainer: {
    backgroundColor: Theme.colors.primary[100],
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.sm,
  },
  stallActionsTitle: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[700],
    marginBottom: Theme.spacing.md,
  },
  stallActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary[50],
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
  },
  stallActionText: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.medium as any,
    marginLeft: Theme.spacing.sm,
  },
  // Overlay de loading
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Loading de autenticação
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.primary[600],
    marginTop: Theme.spacing.md,
  },
  // Estilos do header modernizado
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: Theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Theme.spacing.sm,
  },
  // Estilos dos cards de baia modernizados
  baiaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderTopLeftRadius: Theme.borderRadius.lg,
    borderTopRightRadius: Theme.borderRadius.lg,
  },
  baiaHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  baiaHeaderText: {
    marginLeft: Theme.spacing.sm,
  },
  baiaNumero: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: 'white',
  },
  baiaStatus: {
    fontSize: Theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  baiaOptionsButton: {
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  baiaCardContent: {
    padding: Theme.spacing.md,
    backgroundColor: 'white',
    borderBottomLeftRadius: Theme.borderRadius.lg,
    borderBottomRightRadius: Theme.borderRadius.lg,
  },
  baiaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  baiaInfoLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: '#64748b',
    marginLeft: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    minWidth: 70,
  },
  baiaInfoValue: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[800],
    fontWeight: Theme.typography.weights.medium as any,
    flex: 1,
  },
  overdue: {
    color: Theme.colors.error[600],
    fontWeight: Theme.typography.weights.bold as any,
  },
  baiaQuickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.neutral[200],
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
    marginLeft: 4,
  },
  // Estilos para o modal de detalhes
  statusBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.md,
  },
  statusText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
  },
  // Estilos para placeholders de informações futuras
  dietPlaceholder: {
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
    borderStyle: 'dashed',
  },
  medicationPlaceholder: {
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
    borderStyle: 'dashed',
  },
  cleaningPlaceholder: {
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
    fontWeight: Theme.typography.weights.medium as any,
  },
  placeholderSubtext: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[500],
    textAlign: 'center',
    marginTop: Theme.spacing.xs,
    lineHeight: Theme.typography.lineHeights.relaxed * Theme.typography.sizes.xs,
  },
  
  // Estilos do Modal de Prompt
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptModalContent: {
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xl,
    margin: Theme.spacing.lg,
    width: width - (Theme.spacing.lg * 2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  promptTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[900],
  },
  promptLabel: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.neutral[700],
    marginBottom: Theme.spacing.sm,
  },
  promptInput: {
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[900],
    backgroundColor: Theme.colors.neutral[50],
    marginBottom: Theme.spacing.lg,
  },
  promptButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Theme.spacing.md,
  },
  promptButton: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
  },
  confirmButton: {
    backgroundColor: Theme.colors.primary[600],
  },
  cancelButtonText: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.neutral[700],
  },
  confirmButtonText: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.medium as any,
    color: 'white',
  },
  
  // Estilos para o modal de seleção de cavalos
  horseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
    backgroundColor: 'white',
    marginBottom: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  horseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  horseAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  horseDetails: {
    flex: 1,
  },
  horseName: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[900],
    marginBottom: 2,
  },
  horseBreed: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginBottom: 2,
  },
  horseGender: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[500],
    fontWeight: Theme.typography.weights.medium as any,
  },
});
