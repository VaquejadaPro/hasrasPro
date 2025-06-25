import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  StatusBar,
  Dimensions,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { cavaloService, Cavalo, CavaloStats } from '../services/cavaloService';
import Theme from '../../../constants/Theme';

const { width, height } = Dimensions.get('window');

interface CavalosScreenProps {
  harasId: string;
}

const CavalosScreen: React.FC<CavalosScreenProps> = ({ harasId }) => {
  const router = useRouter();
  const [cavalos, setCavalos] = useState<Cavalo[]>([]);
  const [stats, setStats] = useState<CavaloStats>({
    total: 0,
    active: 0,
    inactive: 0,
    withStall: 0,
    withoutStall: 0,
    byGender: {
      male: 0,
      female: 0,
      gelding: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'todos' | 'garanhoes' | 'femeas' | 'castrados'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Encontrar o garanhão principal
  const garanhao = cavalos.find(cavalo => cavalo.gender === 'male' && cavalo.status === 'active');

  useEffect(() => {
    loadData();
  }, [harasId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cavalosList, statsData] = await Promise.all([
        cavaloService.getCavalosByHaras(harasId),
        cavaloService.getCavaloStats(harasId)
      ]);
      
      setCavalos(cavalosList);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados dos cavalos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getCategoriaColor = (categoria: string): [string, string] => {
    switch (categoria) {
      case 'garanhao': return ['#8b5cf6', '#7c3aed'];
      case 'doadora': return ['#f093fb', '#f5576c'];
      case 'receptora': return ['#4facfe', '#00f2fe'];
      case 'potro': return ['#ffeaa7', '#fdcb6e'];
      case 'competicao': return ['#fd79a8', '#e84393'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getStatusColor = (status: string): [string, string] => {
    switch (status) {
      case 'ativo': return ['#10b981', '#059669'];
      case 'inativo': return ['#f59e0b', '#d97706'];
      case 'vendido': return ['#3b82f6', '#1d4ed8'];
      case 'falecido': return ['#ef4444', '#dc2626'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getCategoriaText = (categoria: string): string => {
    switch (categoria) {
      case 'garanhao': return 'Garanhão';
      case 'doadora': return 'Doadora';
      case 'receptora': return 'Receptora';
      case 'potro': return 'Potro';
      case 'competicao': return 'Competição';
      default: return 'Não definido';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'inativo': return 'Inativo';
      case 'vendido': return 'Vendido';
      case 'falecido': return 'Falecido';
      default: return 'Desconhecido';
    }
  };

  const getCategoriaIcon = (categoria: string): string => {
    switch (categoria) {
      case 'garanhao': return 'award';
      case 'doadora': return 'heart';
      case 'receptora': return 'user-plus';
      case 'potro': return 'star';
      case 'competicao': return 'trophy';
      default: return 'circle';
    }
  };

  const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  };

  const navigateToDetail = (cavalo: Cavalo) => {
    router.push({
      pathname: '/modules/haras/screens/DetalheCavaloScreen',
      params: { cavaloId: cavalo.id, harasId }
    });
  };

  const renderGaranhaoCard = () => {
    if (!garanhao) return null;

    const [color1, color2] = getCategoriaColor('garanhao');
    
    return (
      <TouchableOpacity 
        style={styles.garanhaoContainer}
        onPress={() => navigateToDetail(garanhao)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[color1, color2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.garanhaoGradient}
        >
          <View style={styles.garanhaoHeader}>
            <View style={styles.garanhaoTitleContainer}>
              <MaterialIcons name="star" size={28} color="#fff" />
              <Text style={styles.garanhaoTitle}>Garanhão Principal</Text>
            </View>
            <TouchableOpacity style={styles.garanhaoMoreButton}>
              <Feather name="more-horizontal" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.garanhaoContent}>
            <View style={styles.garanhaoImageContainer}>
              {garanhao.foto ? (
                <Image source={{ uri: garanhao.foto }} style={styles.garanhaoImage} />
              ) : (
                <View style={styles.garanhaoImagePlaceholder}>
                  <MaterialIcons name="pets" size={48} color="#fff" />
                </View>
              )}
              <View style={styles.garanhaoImageOverlay}>
                <Text style={styles.garanhaoImageText}>Ver Detalhes</Text>
              </View>
            </View>
            
            <View style={styles.garanhaoInfo}>
              <Text style={styles.garanhaoName}>{garanhao.nome}</Text>
              <Text style={styles.garanhaoBreed}>{garanhao.raca}</Text>
              <Text style={styles.garanhaoAge}>{calcularIdade(garanhao.dataNascimento)} anos</Text>
              
              <View style={styles.garanhaoStats}>
                <View style={styles.garanhaoStatItem}>
                  <Text style={styles.garanhaoStatNumber}>--</Text>
                  <Text style={styles.garanhaoStatLabel}>Filhos</Text>
                </View>
                <View style={styles.garanhaoStatItem}>
                  <Text style={styles.garanhaoStatNumber}>--</Text>
                  <Text style={styles.garanhaoStatLabel}>Coberturas</Text>
                </View>
                <View style={styles.garanhaoStatItem}>
                  <Text style={styles.garanhaoStatNumber}>--</Text>
                  <Text style={styles.garanhaoStatLabel}>Troféus</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const filteredCavalos = cavalos.filter(cavalo => {
    if (activeTab !== 'todos') {
      if (activeTab === 'garanhoes' && cavalo.categoria !== 'garanhao') return false;
      if (activeTab === 'doadoras' && cavalo.categoria !== 'doadora') return false;
      if (activeTab === 'receptoras' && cavalo.categoria !== 'receptora') return false;
      if (activeTab === 'potros' && cavalo.categoria !== 'potro') return false;
    }
    
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      cavalo.nome.toLowerCase().includes(searchLower) ||
      cavalo.raca.toLowerCase().includes(searchLower) ||
      cavalo.cor.toLowerCase().includes(searchLower) ||
      cavalo.registro?.toLowerCase().includes(searchLower)
    );
  });

  const renderStatsCard = (title: string, value: number, icon: string, colors: [string, string]) => (
    <LinearGradient
      colors={colors}
      style={styles.statsCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.statsContent}>
        <Feather name={icon as any} size={24} color="white" />
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
      </View>
    </LinearGradient>
  );

  const renderTabButton = (tab: typeof activeTab, title: string) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderCavaloCard = ({ item }: { item: Cavalo }) => (
    <TouchableOpacity 
      style={styles.cavaloCard} 
      activeOpacity={0.8}
      onPress={() => setSelectedCavalo(item)}
    >
      <View style={styles.cavaloHeader}>
        <View style={styles.cavaloImageContainer}>
          {item.foto ? (
            <Image source={{ uri: item.foto }} style={styles.cavaloImage} />
          ) : (
            <LinearGradient
              colors={getCategoriaColor(item.categoria)}
              style={styles.cavaloImagePlaceholder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name={getCategoriaIcon(item.categoria) as any} size={32} color="white" />
            </LinearGradient>
          )}
        </View>
        
        <View style={styles.cavaloInfo}>
          <Text style={styles.cavaloNome}>{item.nome}</Text>
          <Text style={styles.cavaloRaca}>{item.raca}</Text>
          <View style={styles.cavaloMetadata}>
            <Text style={styles.cavaloIdade}>{calcularIdade(item.dataNascimento)} anos</Text>
            <Text style={styles.cavaloSexo}>{item.sexo === 'macho' ? '♂' : '♀'}</Text>
            <Text style={styles.cavaloCor}>{item.cor}</Text>
          </View>
        </View>

        <View style={styles.cavaloStatus}>
          <LinearGradient
            colors={getCategoriaColor(item.categoria)}
            style={styles.categoriaBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.categoriaText}>{getCategoriaText(item.categoria)}</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={getStatusColor(item.status)}
            style={styles.statusBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.cavaloDetails}>
        {item.registro && (
          <View style={styles.detailRow}>
            <Feather name="bookmark" size={16} color="#64748b" />
            <Text style={styles.detailLabel}>Registro:</Text>
            <Text style={styles.detailValue}>{item.registro}</Text>
          </View>
        )}

        {item.baiaId && (
          <View style={styles.detailRow}>
            <Feather name="home" size={16} color="#64748b" />
            <Text style={styles.detailLabel}>Baia:</Text>
            <Text style={styles.detailValue}>{item.baiaId}</Text>
          </View>
        )}

        {item.peso && (
          <View style={styles.detailRow}>
            <Feather name="activity" size={16} color="#64748b" />
            <Text style={styles.detailLabel}>Peso:</Text>
            <Text style={styles.detailValue}>{item.peso}kg</Text>
          </View>
        )}

        {item.altura && (
          <View style={styles.detailRow}>
            <Feather name="bar-chart" size={16} color="#64748b" />
            <Text style={styles.detailLabel}>Altura:</Text>
            <Text style={styles.detailValue}>{item.altura}cm</Text>
          </View>
        )}
      </View>

      <View style={styles.cavaloActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="edit" size={16} color="#3b82f6" />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="eye" size={16} color="#10b981" />
          <Text style={styles.actionText}>Detalhes</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Cavalos do Haras</Text>
          <Text style={styles.headerSubtitle}>Gestão completa do plantel</Text>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cavalos..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          {renderStatsCard('Total', stats.total, 'users', ['#8b5cf6', '#7c3aed'])}
          {renderStatsCard('Garanhões', stats.garanhoes, 'award', ['#f093fb', '#f5576c'])}
          {renderStatsCard('Doadoras', stats.doadoras, 'heart', ['#4facfe', '#00f2fe'])}
          {renderStatsCard('Receptoras', stats.receptoras, 'user-plus', ['#43e97b', '#38f9d7'])}
          {renderStatsCard('Potros', stats.potros, 'star', ['#ffeaa7', '#fdcb6e'])}
          {renderStatsCard('Disponíveis', stats.disponiveis, 'check-circle', ['#10b981', '#059669'])}
        </ScrollView>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {renderTabButton('todos', 'Todos')}
          {renderTabButton('garanhoes', 'Garanhões')}
          {renderTabButton('doadoras', 'Doadoras')}
          {renderTabButton('receptoras', 'Receptoras')}
          {renderTabButton('potros', 'Potros')}
        </ScrollView>
      </View>

      {/* Lista de Cavalos */}
      <FlatList
        data={filteredCavalos}
        renderItem={renderCavaloCard}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8b5cf6"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="users" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Nenhum cavalo encontrado</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Tente ajustar sua busca' : 'Adicione o primeiro cavalo ao haras'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  statsSection: {
    marginBottom: 20,
  },
  statsScroll: {
    paddingHorizontal: 20,
  },
  statsCard: {
    width: 120,
    height: 100,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  statsContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
  tabContainer: {
    marginBottom: 16,
  },
  tabScroll: {
    paddingHorizontal: 20,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: 'white',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cavaloCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cavaloHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cavaloImageContainer: {
    marginRight: 16,
  },
  cavaloImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  cavaloImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cavaloInfo: {
    flex: 1,
  },
  cavaloNome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  cavaloRaca: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  cavaloMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cavaloIdade: {
    fontSize: 12,
    color: '#9ca3af',
    marginRight: 12,
  },
  cavaloSexo: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 12,
  },
  cavaloCor: {
    fontSize: 12,
    color: '#9ca3af',
  },
  cavaloStatus: {
    alignItems: 'flex-end',
  },
  categoriaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  categoriaText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  cavaloDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 70,
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    flex: 1,
  },
  cavaloActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default CavalosScreen;
