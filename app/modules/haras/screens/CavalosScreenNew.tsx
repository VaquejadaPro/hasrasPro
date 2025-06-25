import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  TextInput,
  StatusBar,
  Dimensions,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { cavaloService, Cavalo, CavaloStats } from '../services/cavaloService';
import { useHaras } from '../../../../hooks/useHaras';
import Theme from '../../../constants/Theme';

const { width, height } = Dimensions.get('window');

const CavalosScreen: React.FC = () => {
  const router = useRouter();
  const { selectedHaras } = useHaras();
  
  const [cavalos, setCavalos] = useState<Cavalo[]>([]);
  const [stats, setStats] = useState<CavaloStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'todos' | 'machos' | 'femeas' | 'castrados'>('todos');
  
  // Garanhão principal (primeiro macho da lista)
  const garanhao = cavalos.find(cavalo => cavalo.gender === 'male' && cavalo.status === 'active');
  
  // Cavalos filtrados
  const cavalosFiltrados = cavalos.filter(cavalo => {
    const matchesSearch = cavalo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cavalo.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cavalo.registration?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'todos' || 
                         (selectedFilter === 'machos' && cavalo.gender === 'male') ||
                         (selectedFilter === 'femeas' && cavalo.gender === 'female') ||
                         (selectedFilter === 'castrados' && cavalo.gender === 'gelding');
    
    return matchesSearch && matchesFilter;
  });

  // Calcular idade a partir da data de nascimento
  const calcularIdade = (birthDate: string): number => {
    const hoje = new Date();
    const nascimento = new Date(birthDate);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  };

  // Carregar dados dos cavalos
  const loadCavalos = useCallback(async () => {
    if (!selectedHaras?.id) return;
    
    try {
      setLoading(true);
      console.log('Carregando cavalos do haras:', selectedHaras.id);
      
      const [cavalosData, statsData] = await Promise.all([
        cavaloService.getCavalosByHaras(selectedHaras.id),
        cavaloService.getCavaloStats(selectedHaras.id)
      ]);
      
      console.log('Cavalos carregados:', cavalosData);
      console.log('Estatísticas carregadas:', statsData);
      
      setCavalos(cavalosData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar cavalos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os cavalos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [selectedHaras?.id]);

  // Refresh dos dados
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCavalos();
    setRefreshing(false);
  }, [loadCavalos]);

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadCavalos();
  }, [loadCavalos]);

  // Navegar para detalhes do cavalo
  const navigateToDetails = (cavalo: Cavalo) => {
    router.push({
      pathname: '/modules/haras/screens/DetalheCavaloScreen',
      params: { cavaloId: cavalo.id }
    });
  };

  // Obter gradiente baseado no gênero
  const getGenderGradient = (gender: string): [string, string] => {
    switch (gender) {
      case 'male':
        return [Theme.colors.primary[500], Theme.colors.primary[600]];
      case 'female':
        return [Theme.colors.success[500], Theme.colors.success[600]];
      case 'gelding':
        return [Theme.colors.warning[500], Theme.colors.warning[600]];
      default:
        return [Theme.colors.neutral[500], Theme.colors.neutral[600]];
    }
  };

  // Obter ícone baseado no gênero
  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'user';
      case 'female':
        return 'user';
      case 'gelding':
        return 'minus-circle';
      default:
        return 'help-circle';
    }
  };

  // Renderizar card do garanhão
  const renderGaranhaoCard = () => {
    if (!garanhao) return null;

    return (
      <View style={styles.garanhaoContainer}>
        <LinearGradient
          colors={[Theme.colors.primary[500], Theme.colors.primary[600]]}
          style={styles.garanhaoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.garanhaoHeader}>
            <View style={styles.garanhaoTitleContainer}>
              <Feather name="award" size={20} color="#ffffff" />
              <Text style={styles.garanhaoTitle}>Garanhão Principal</Text>
            </View>
            <TouchableOpacity 
              style={styles.garanhaoMoreButton}
              onPress={() => navigateToDetails(garanhao)}
            >
              <Feather name="more-horizontal" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.garanhaoContent}>
            <View style={styles.garanhaoImageContainer}>
              {garanhao.photos && garanhao.photos.length > 0 ? (
                <Image source={{ uri: garanhao.photos[0] }} style={styles.garanhaoImage} />
              ) : (
                <View style={styles.garanhaoImagePlaceholder}>
                  <Feather name="image" size={32} color="#ffffff" />
                </View>
              )}
              <View style={styles.garanhaoImageOverlay}>
                <Text style={styles.garanhaoImageText}>Ver Detalhes</Text>
              </View>
            </View>
            
            <View style={styles.garanhaoInfo}>
              <Text style={styles.garanhaoName}>{garanhao.name}</Text>
              <Text style={styles.garanhaoBreed}>{garanhao.breed}</Text>
              <Text style={styles.garanhaoAge}>{calcularIdade(garanhao.birthDate)} anos</Text>
              
              <View style={styles.garanhaoStats}>
                <View style={styles.garanhaoStatItem}>
                  <Text style={styles.garanhaoStatValue}>{garanhao.offspring?.length || 0}</Text>
                  <Text style={styles.garanhaoStatLabel}>Filhos</Text>
                </View>
                <View style={styles.garanhaoStatItem}>
                  <Text style={styles.garanhaoStatValue}>{garanhao.achievements?.length || 0}</Text>
                  <Text style={styles.garanhaoStatLabel}>Conquistas</Text>
                </View>
                <View style={styles.garanhaoStatItem}>
                  <Text style={styles.garanhaoStatValue}>{garanhao.registration || 'N/A'}</Text>
                  <Text style={styles.garanhaoStatLabel}>Registro</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  // Renderizar item da lista de cavalos
  const renderCavaloItem = ({ item }: { item: Cavalo }) => (
    <TouchableOpacity
      style={styles.cavaloCard}
      onPress={() => navigateToDetails(item)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={getGenderGradient(item.gender)}
        style={styles.cavaloGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.cavaloHeader}>
          <View style={styles.cavaloTitleContainer}>
            <Text style={styles.cavaloName}>{item.name}</Text>
            <Text style={styles.cavaloBreed}>{item.breed}</Text>
          </View>
          <View style={styles.cavaloIconContainer}>
            <Feather name={getGenderIcon(item.gender) as any} size={20} color="#ffffff" />
          </View>
        </View>
        
        <View style={styles.cavaloInfo}>
          <View style={styles.cavaloInfoItem}>
            <Text style={styles.cavaloInfoLabel}>Idade</Text>
            <Text style={styles.cavaloInfoValue}>{calcularIdade(item.birthDate)} anos</Text>
          </View>
          <View style={styles.cavaloInfoItem}>
            <Text style={styles.cavaloInfoLabel}>Cor</Text>
            <Text style={styles.cavaloInfoValue}>{item.color}</Text>
          </View>
          <View style={styles.cavaloInfoItem}>
            <Text style={styles.cavaloInfoLabel}>Registro</Text>
            <Text style={styles.cavaloInfoValue}>{item.registration || 'N/A'}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Renderizar filtros
  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: 'todos', label: 'Todos', count: cavalos.length },
          { key: 'machos', label: 'Machos', count: stats?.byGender.male || 0 },
          { key: 'femeas', label: 'Fêmeas', count: stats?.byGender.female || 0 },
          { key: 'castrados', label: 'Castrados', count: stats?.byGender.gelding || 0 },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === filter.key && styles.filterButtonTextActive
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[600]} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary[600]} />
          <Text style={styles.loadingText}>Carregando cavalos...</Text>
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
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cavalos do Haras</Text>
          <TouchableOpacity>
            <Feather name="plus" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={Theme.colors.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cavalos..."
            placeholderTextColor={Theme.colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Garanhão Principal */}
        {renderGaranhaoCard()}
        
        {/* Estatísticas */}
        {stats && (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Estatísticas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.active}</Text>
                <Text style={styles.statLabel}>Ativos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.withStall}</Text>
                <Text style={styles.statLabel}>Com Baia</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.withoutStall}</Text>
                <Text style={styles.statLabel}>Sem Baia</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Filtros */}
        {renderFilters()}
        
        {/* Lista de Cavalos */}
        <View style={styles.cavalosContainer}>
          <Text style={styles.sectionTitle}>
            Todos os Cavalos ({cavalosFiltrados.length})
          </Text>
          
          {cavalosFiltrados.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="search" size={48} color={Theme.colors.neutral[400]} />
              <Text style={styles.emptyTitle}>Nenhum cavalo encontrado</Text>
              <Text style={styles.emptySubtitle}>
                Tente ajustar os filtros ou adicionar novos cavalos
              </Text>
            </View>
          ) : (
            <FlatList
              data={cavalosFiltrados}
              renderItem={renderCavaloItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
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
    borderBottomLeftRadius: Theme.borderRadius.xl,
    borderBottomRightRadius: Theme.borderRadius.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  headerTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[800],
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Theme.spacing.md,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[600],
  },
  
  // Garanhão Principal
  garanhaoContainer: {
    margin: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
    ...Theme.shadows.lg,
  },
  garanhaoGradient: {
    padding: Theme.spacing.lg,
  },
  garanhaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  garanhaoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  garanhaoTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
    marginLeft: Theme.spacing.sm,
  },
  garanhaoMoreButton: {
    padding: Theme.spacing.xs,
  },
  garanhaoContent: {
    flexDirection: 'row',
  },
  garanhaoImageContainer: {
    width: 80,
    height: 80,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    marginRight: Theme.spacing.md,
  },
  garanhaoImage: {
    width: '100%',
    height: '100%',
  },
  garanhaoImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  garanhaoImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 2,
  },
  garanhaoImageText: {
    fontSize: Theme.typography.sizes.xs,
    color: '#ffffff',
    textAlign: 'center',
  },
  garanhaoInfo: {
    flex: 1,
  },
  garanhaoName: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
    marginBottom: 2,
  },
  garanhaoBreed: {
    fontSize: Theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  garanhaoAge: {
    fontSize: Theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Theme.spacing.sm,
  },
  garanhaoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  garanhaoStatItem: {
    alignItems: 'center',
  },
  garanhaoStatValue: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
  },
  garanhaoStatLabel: {
    fontSize: Theme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  // Estatísticas
  statsContainer: {
    padding: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
    marginBottom: Theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    alignItems: 'center',
    minWidth: 70,
    ...Theme.shadows.sm,
  },
  statValue: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[600],
  },
  statLabel: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[600],
    marginTop: 2,
  },
  
  // Filtros
  filtersContainer: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  filterButton: {
    backgroundColor: '#ffffff',
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    ...Theme.shadows.sm,
  },
  filterButtonActive: {
    backgroundColor: Theme.colors.primary[600],
  },
  filterButtonText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },
  filterButtonTextActive: {
    color: '#ffffff',
    fontWeight: Theme.typography.weights.semibold as any,
  },
  
  // Lista de Cavalos
  cavalosContainer: {
    padding: Theme.spacing.lg,
  },
  cavaloCard: {
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  cavaloGradient: {
    padding: Theme.spacing.md,
  },
  cavaloHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  cavaloTitleContainer: {
    flex: 1,
  },
  cavaloName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
  },
  cavaloBreed: {
    fontSize: Theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cavaloIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Theme.borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cavaloInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cavaloInfoItem: {
    alignItems: 'center',
  },
  cavaloInfoLabel: {
    fontSize: Theme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cavaloInfoValue: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: '#ffffff',
    marginTop: 2,
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[600],
    marginTop: Theme.spacing.md,
  },
  emptySubtitle: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[500],
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
    lineHeight: 22,
  },
});

export default CavalosScreen;
