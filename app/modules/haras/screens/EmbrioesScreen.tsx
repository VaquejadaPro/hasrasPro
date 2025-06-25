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
  TextInput,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { embryoService, Embryo } from '../services/embryoService';
import { useHaras } from '@/hooks/useHaras';
import Theme from '@/constants/Theme';
import PremiumCard from '@/components/ui/premium-card';
import QuickStat, { QuickStatsContainer } from '@/components/ui/quick-stat';

const EmbrioesScreen: React.FC = () => {
  const router = useRouter();
  const { selectedHaras } = useHaras();
  
  const [embryos, setEmbryos] = useState<Embryo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'frozen' | 'activated' | 'transferred' | 'failed'>('all');

  // Filtrar embriões
  const filteredEmbryos = embryos.filter(embryo => {
    const matchesSearch = embryo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         embryo.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         embryo.motherName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || embryo.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const stats = {
    total: embryos.length,
    frozen: embryos.filter(e => e.status === 'frozen').length,
    activated: embryos.filter(e => e.status === 'activated').length,
    transferred: embryos.filter(e => e.status === 'transferred').length,
    failed: embryos.filter(e => e.status === 'failed').length,
  };

  // Carregar embriões
  const loadEmbryos = useCallback(async () => {
    if (!selectedHaras?.id) return;
    
    try {
      setLoading(true);
      console.log('Carregando embriões do haras:', selectedHaras.id);
      
      const embryosData = await embryoService.getEmbryosByHaras(selectedHaras.id);
      console.log('Embriões carregados:', embryosData.length);
      
      setEmbryos(embryosData);
    } catch (error) {
      console.error('Erro ao carregar embriões:', error);
      Alert.alert('Erro', 'Não foi possível carregar os embriões.');
    } finally {
      setLoading(false);
    }
  }, [selectedHaras?.id]);

  // Refresh dos dados
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEmbryos();
    setRefreshing(false);
  }, [loadEmbryos]);

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadEmbryos();
  }, [loadEmbryos]);

  // Navegação para detalhes
  const handleEmbryoPress = (embryo: Embryo) => {
    router.push(`/modules/haras/screens/DetalheEmbriaoScreen?embryoId=${embryo.id}`);
    console.log('Navegar para detalhes do embrião:', embryo.id);
  };

  // Navegação para criar embrião
  const handleCreateEmbryo = () => {
    // router.push('/modules/haras/screens/CriarEmbriaoScreen');
    console.log('Navegar para criar embrião');
  };

  // Ativar embrião
  const handleActivateEmbryo = (embryo: Embryo) => {
    // router.push(`/modules/haras/screens/AtivarEmbriaoScreen?embryoId=${embryo.id}`);
    console.log('Ativar embrião:', embryo.id);
  };

  // Renderizar card de embrião
  const renderEmbryoCard = (embryo: Embryo, index: number) => {
    const statusInfo = embryoService.getEmbryoStatus(embryo);
    
    return (
      <TouchableOpacity
        key={embryo.id}
        style={styles.embryoCard}
        onPress={() => handleEmbryoPress(embryo)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#ffffff', Theme.colors.neutral[50]]}
          style={styles.embryoCardGradient}
        >
          {/* Header do card */}
          <View style={styles.embryoCardHeader}>
            <View style={styles.embryoCodeContainer}>
              <Text style={styles.embryoCode}>{embryo.code}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                  {statusInfo.label}
                </Text>
              </View>
            </View>
            
            {embryo.status === 'frozen' && (
              <TouchableOpacity
                style={styles.activateButton}
                onPress={() => handleActivateEmbryo(embryo)}
              >
                <Feather name="play" size={16} color={Theme.colors.primary[600]} />
              </TouchableOpacity>
            )}
          </View>

          {/* Informações dos pais */}
          <View style={styles.parentsContainer}>
            <View style={styles.parentInfo}>
              <View style={styles.parentIcon}>
                <MaterialIcons name="male" size={16} color={Theme.colors.primary[600]} />
              </View>
              <View style={styles.parentDetails}>
                <Text style={styles.parentName}>{embryo.fatherName}</Text>
                <Text style={styles.parentRegistration}>{embryo.fatherRegistration}</Text>
              </View>
            </View>

            <View style={styles.crossIcon}>
              <Feather name="x" size={16} color={Theme.colors.neutral[400]} />
            </View>

            <View style={styles.parentInfo}>
              <View style={[styles.parentIcon, { backgroundColor: Theme.colors.success[100] }]}>
                <MaterialIcons name="female" size={16} color={Theme.colors.success[600]} />
              </View>
              <View style={styles.parentDetails}>
                <Text style={styles.parentName}>{embryo.motherName}</Text>
                <Text style={styles.parentRegistration}>{embryo.motherRegistration}</Text>
              </View>
            </View>
          </View>

          {/* Informações da gestação (se transferido) */}
          {embryo.status === 'activated' && embryo.activationDate && (
            <View style={styles.gestationInfo}>
              <View style={styles.gestationHeader}>
                <Feather name="clock" size={16} color={Theme.colors.warning[600]} />
                <Text style={styles.gestationTitle}>Gestação</Text>
              </View>
              
              {(() => {
                const gestationInfo = embryoService.calculateGestationInfo(embryo.activationDate, embryo.daysPregnant);
                return (
                  <View style={styles.gestationDetails}>
                    <View style={styles.gestationBar}>
                      <View style={[styles.gestationProgress, { width: `${gestationInfo.gestationPercent}%` }]} />
                    </View>
                    <View style={styles.gestationStats}>
                      <Text style={styles.gestationText}>
                        {gestationInfo.gestationDays} dias
                      </Text>
                      <Text style={styles.gestationText}>
                        {gestationInfo.remainingDays > 0 ? `${gestationInfo.remainingDays} restantes` : 'Nascimento esperado'}
                      </Text>
                    </View>
                  </View>
                );
              })()}
            </View>
          )}

          {/* Informações técnicas */}
          <View style={styles.technicalInfo}>
            <View style={styles.technicalItem}>
              <Feather name="calendar" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.technicalText}>
                {new Date(embryo.creationDate).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            
            <View style={styles.technicalItem}>
              <Feather name="user" size={14} color={Theme.colors.neutral[500]} />
              <Text style={styles.technicalText}>{embryo.veterinarian}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Renderizar filtros
  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: 'all', label: 'Todos', count: stats.total },
          { key: 'frozen', label: 'Congelados', count: stats.frozen },
          { key: 'activated', label: 'Ativados', count: stats.activated },
          { key: 'transferred', label: 'Transferidos', count: stats.transferred },
          { key: 'failed', label: 'Falhou', count: stats.failed },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              filterStatus === filter.key && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus(filter.key as any)}
          >
            <Text style={[
              styles.filterButtonText,
              filterStatus === filter.key && styles.filterButtonTextActive,
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

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
          <Text style={styles.headerTitle}>Embriões</Text>
          <TouchableOpacity onPress={handleCreateEmbryo}>
            <Feather name="plus" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={Theme.colors.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por código, pai ou mãe..."
            placeholderTextColor={Theme.colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {/* Estatísticas */}
      <QuickStatsContainer>
        <QuickStat
          icon="layers"
          value={stats.total}
          label="Total"
          colors={[Theme.colors.primary[500], Theme.colors.primary[600]]}
          delay={0}
        />
        <QuickStat
          icon="archive"
          value={stats.frozen}
          label="Congelados"
          colors={[Theme.colors.primary[500], Theme.colors.primary[600]]}
          delay={100}
        />
        <QuickStat
          icon="activity"
          value={stats.activated}
          label="Ativos"
          colors={[Theme.colors.success[500], Theme.colors.success[600]]}
          delay={200}
        />
        <QuickStat
          icon="arrow-right"
          value={stats.transferred}
          label="Transferidos"
          colors={[Theme.colors.warning[500], Theme.colors.warning[600]]}
          delay={300}
        />
      </QuickStatsContainer>

      {/* Filtros */}
      {renderFilters()}

      {/* Lista de embriões */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando embriões...</Text>
          </View>
        ) : filteredEmbryos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="layers" size={48} color={Theme.colors.neutral[400]} />
            <Text style={styles.emptyTitle}>Nenhum embrião encontrado</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Tente buscar com outros termos' : 'Crie seu primeiro embrião'}
            </Text>
          </View>
        ) : (
          <View style={styles.embryosGrid}>
            {filteredEmbryos.map((embryo, index) => renderEmbryoCard(embryo, index))}
          </View>
        )}
      </ScrollView>
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
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Theme.typography.sizes.base,
    color: '#ffffff',
    marginLeft: Theme.spacing.sm,
  },
  filtersContainer: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  filterButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.neutral[200],
    marginRight: Theme.spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: Theme.colors.primary[600],
  },
  filterButtonText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    fontWeight: Theme.typography.weights.medium as any,
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
  },
  embryosGrid: {
    paddingBottom: Theme.spacing.xl,
  },
  embryoCard: {
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
    ...Theme.shadows.md,
  },
  embryoCardGradient: {
    padding: Theme.spacing.lg,
  },
  embryoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  embryoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  embryoCode: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
    marginRight: Theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
  },
  statusText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.semibold as any,
  },
  activateButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  parentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  parentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  parentIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  parentDetails: {
    flex: 1,
  },
  parentName: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[800],
  },
  parentRegistration: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[600],
  },
  crossIcon: {
    marginHorizontal: Theme.spacing.sm,
  },
  gestationInfo: {
    backgroundColor: Theme.colors.warning[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  gestationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  gestationTitle: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.warning[700],
    marginLeft: Theme.spacing.xs,
  },
  gestationDetails: {
    // Styled inline
  },
  gestationBar: {
    height: 6,
    backgroundColor: Theme.colors.warning[100],
    borderRadius: 3,
    marginBottom: Theme.spacing.sm,
  },
  gestationProgress: {
    height: '100%',
    backgroundColor: Theme.colors.warning[600],
    borderRadius: 3,
  },
  gestationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gestationText: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.warning[700],
    fontWeight: Theme.typography.weights.medium as any,
  },
  technicalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  technicalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  technicalText: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[600],
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
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
});

export default EmbrioesScreen;
