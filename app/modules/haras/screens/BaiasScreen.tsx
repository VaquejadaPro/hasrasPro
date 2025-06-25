import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { baiaService, Baia, BaiaStats } from '../services/baiaService';
import { cavaloService, Cavalo } from '../services/cavaloService';
import Theme from '@/constants/Theme';
import PremiumCard from '@/components/ui/premium-card';
import QuickStat from '@/components/ui/quick-stat';

const BaiasScreen: React.FC = () => {
  const router = useRouter();
  
  const [baias, setBaias] = useState<Baia[]>([]);
  const [cavalosDisponiveis, setCavalosDisponiveis] = useState<Cavalo[]>([]);
  const [stats, setStats] = useState<BaiaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBaia, setSelectedBaia] = useState<Baia | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Simular harasId (em produção viria do contexto/params)
  const harasId = 'haras-example-id';

  // Carregar dados
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [baiasData, statsData, cavalosData] = await Promise.all([
        baiaService.getBaiasByHaras(harasId),
        baiaService.getBaiaStats(harasId),
        cavaloService.getCavalosDisponiveis(harasId)
      ]);
      
      setBaias(baiasData);
      setStats(statsData);
      setCavalosDisponiveis(cavalosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados das baias.');
    } finally {
      setLoading(false);
    }
  }, [harasId]);

  // Refresh dos dados
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtrar baias por busca
  const filteredBaias = baias.filter(baia =>
    baia.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (baia.name && baia.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (baia.horse && baia.horse.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Atribuir cavalo à baia
  const handleAssignCavalo = async (baiaId: string, cavaloId: string) => {
    try {
      await baiaService.assignCavaloToBaia(baiaId, cavaloId);
      await loadData();
      setModalVisible(false);
      Alert.alert('Sucesso', 'Cavalo atribuído à baia com sucesso!');
    } catch (error) {
      console.error('Erro ao atribuir cavalo:', error);
      Alert.alert('Erro', 'Não foi possível atribuir o cavalo à baia.');
    }
  };

  // Remover cavalo da baia
  const handleRemoveCavalo = async (baiaId: string) => {
    Alert.alert(
      'Remover Cavalo',
      'Deseja realmente remover o cavalo desta baia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await baiaService.removeCavaloFromBaia(baiaId);
              await loadData();
              Alert.alert('Sucesso', 'Cavalo removido da baia com sucesso!');
            } catch (error) {
              console.error('Erro ao remover cavalo:', error);
              Alert.alert('Erro', 'Não foi possível remover o cavalo da baia.');
            }
          }
        }
      ]
    );
  };

  // Alterar status da baia
  const handleChangeStatus = async (baiaId: string, newStatus: Baia['status']) => {
    try {
      await baiaService.setBaiaStatus(baiaId, newStatus);
      await loadData();
      Alert.alert('Sucesso', 'Status da baia alterado com sucesso!');
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      Alert.alert('Erro', 'Não foi possível alterar o status da baia.');
    }
  };

  // Obter cor do status
  const getStatusColor = (status: Baia['status']) => {
    switch (status) {
      case 'empty': return Theme.colors.success[500];
      case 'occupied': return Theme.colors.primary[500];
      case 'maintenance': return Theme.colors.warning[500];
      case 'reserved': return Theme.colors.neutral[500];
      default: return Theme.colors.neutral[400];
    }
  };

  // Obter label do status
  const getStatusLabel = (status: Baia['status']) => {
    switch (status) {
      case 'empty': return 'Disponível';
      case 'occupied': return 'Ocupada';
      case 'maintenance': return 'Manutenção';
      case 'reserved': return 'Reservada';
      default: return 'Desconhecido';
    }
  };

  // Obter ícone do tipo
  const getTypeIcon = (type: Baia['type']) => {
    switch (type) {
      case 'individual': return 'home';
      case 'paddock': return 'map';
      case 'quarantine': return 'shield';
      case 'breeding': return 'heart';
      default: return 'square';
    }
  };

  // Renderizar baia
  const renderBaia = (baia: Baia) => (
    <PremiumCard
      key={baia.id}
      title={baia.name || baia.number}
      icon={getTypeIcon(baia.type)}
      iconColor={getStatusColor(baia.status)}
      delay={0}
    >
      <View style={styles.baiaContent}>
        {/* Status */}
        <View style={styles.baiaHeader}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(baia.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(baia.status) }]}>
              {getStatusLabel(baia.status)}
            </Text>
          </View>
          <Text style={styles.baiaNumber}>#{baia.number}</Text>
        </View>

        {/* Cavalo (se ocupada) */}
        {baia.horse && (
          <View style={styles.horseInfo}>
            <MaterialIcons name="pets" size={20} color={Theme.colors.primary[600]} />
            <View style={styles.horseDetails}>
              <Text style={styles.horseName}>{baia.horse.name}</Text>
              {baia.horse.registration && (
                <Text style={styles.horseRegistration}>Reg: {baia.horse.registration}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveCavalo(baia.id)}
            >
              <Feather name="x" size={16} color={Theme.colors.error[600]} />
            </TouchableOpacity>
          </View>
        )}

        {/* Informações da baia */}
        <View style={styles.baiaInfo}>
          <View style={styles.infoItem}>
            <Feather name="users" size={14} color={Theme.colors.neutral[500]} />
            <Text style={styles.infoText}>Capacidade: {baia.capacity}</Text>
          </View>
          {baia.dimensions && (
            <View style={styles.infoItem}>
              <Feather name="maximize" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText}>
                {baia.dimensions.width}x{baia.dimensions.length}m
              </Text>
            </View>
          )}
        </View>

        {/* Ações */}
        <View style={styles.baiaActions}>
          {baia.status === 'available' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.assignButton]}
              onPress={() => {
                setSelectedBaia(baia);
                setModalVisible(true);
              }}
            >
              <Feather name="plus" size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>Atribuir</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.statusButton]}
            onPress={() => {
              // Mostrar opções de status
              Alert.alert(
                'Alterar Status',
                'Escolha o novo status da baia:',
                [
                  { text: 'Disponível', onPress: () => handleChangeStatus(baia.id, 'available') },
                  { text: 'Manutenção', onPress: () => handleChangeStatus(baia.id, 'maintenance') },
                  { text: 'Reservada', onPress: () => handleChangeStatus(baia.id, 'reserved') },
                  { text: 'Cancelar', style: 'cancel' }
                ]
              );
            }}
          >
            <Feather name="settings" size={16} color={Theme.colors.neutral[600]} />
            <Text style={[styles.actionButtonText, { color: Theme.colors.neutral[600] }]}>Status</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PremiumCard>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[600]} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando baias...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[600]} />
      
      {/* Header */}
      <LinearGradient
        colors={[Theme.colors.primary[600], Theme.colors.primary[700]]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Baias</Text>
          <TouchableOpacity onPress={() => Alert.alert('Em breve', 'Funcionalidade de criar baia em desenvolvimento')}>
            <Feather name="plus" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#ffffff" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar baia ou cavalo..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {/* Estatísticas */}
      {stats && (
        <View style={styles.statsContainer}>
          <QuickStat
            icon="home"
            value={stats.total.toString()}
            label="Total"
            colors={[Theme.colors.primary[500], Theme.colors.primary[600]]}
            delay={0}
          />
          <QuickStat
            icon="check-circle"
            value={stats.available.toString()}
            label="Disponíveis"
            colors={[Theme.colors.success[500], Theme.colors.success[600]]}
            delay={100}
          />
          <QuickStat
            icon="users"
            value={stats.occupied.toString()}
            label="Ocupadas"
            colors={[Theme.colors.warning[500], Theme.colors.warning[600]]}
            delay={200}
          />
          <QuickStat
            icon="percent"
            value={`${stats.occupancyRate.toFixed(0)}%`}
            label="Ocupação"
            colors={[Theme.colors.neutral[500], Theme.colors.neutral[600]]}
            delay={300}
          />
        </View>
      )}

      {/* Lista de Baias */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBaias.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="home" size={48} color={Theme.colors.neutral[400]} />
            <Text style={styles.emptyTitle}>Nenhuma baia encontrada</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Tente ajustar sua busca' : 'Adicione a primeira baia do haras'}
            </Text>
          </View>
        ) : (
          filteredBaias.map(renderBaia)
        )}
      </ScrollView>

      {/* Modal de Atribuição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Atribuir Cavalo à Baia {selectedBaia?.number}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={Theme.colors.neutral[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList}>
              {cavalosDisponiveis.length === 0 ? (
                <View style={styles.emptyModal}>
                  <Text style={styles.emptyModalText}>
                    Nenhum cavalo disponível
                  </Text>
                </View>
              ) : (
                cavalosDisponiveis.map(cavalo => (
                  <TouchableOpacity
                    key={cavalo.id}
                    style={styles.cavaloItem}
                    onPress={() => handleAssignCavalo(selectedBaia!.id, cavalo.id)}
                  >
                    <MaterialIcons name="pets" size={24} color={Theme.colors.primary[600]} />
                    <View style={styles.cavaloInfo}>
                      <Text style={styles.cavaloName}>{cavalo.name}</Text>
                      {cavalo.registration && (
                        <Text style={styles.cavaloRegistration}>Reg: {cavalo.registration}</Text>
                      )}
                    </View>
                    <Feather name="chevron-right" size={20} color={Theme.colors.neutral[400]} />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
  },
  header: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  headerTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    color: '#ffffff',
    fontSize: Theme.typography.sizes.base,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
  },
  baiaContent: {
    gap: Theme.spacing.md,
  },
  baiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
  },
  statusText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
  },
  baiaNumber: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
  },
  horseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  horseDetails: {
    flex: 1,
  },
  horseName: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.primary[800],
  },
  horseRegistration: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary[600],
  },
  removeButton: {
    padding: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.error[100],
  },
  baiaInfo: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  infoText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },
  baiaActions: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.xs,
  },
  assignButton: {
    backgroundColor: Theme.colors.primary[600],
  },
  statusButton: {
    backgroundColor: Theme.colors.neutral[100],
  },
  actionButtonText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[600],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[600],
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  emptyText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[500],
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[100],
  },
  modalTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
  },
  modalList: {
    flex: 1,
  },
  emptyModal: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  emptyModalText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[600],
  },
  cavaloItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[100],
    gap: Theme.spacing.md,
  },
  cavaloInfo: {
    flex: 1,
  },
  cavaloName: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[800],
  },
  cavaloRegistration: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },
});

export default BaiasScreen;
