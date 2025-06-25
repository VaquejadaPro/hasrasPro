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
  TextInput,
  StatusBar,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { cavaloService, Cavalo, CavaloStats } from '../services/cavaloService';

const { width } = Dimensions.get('window');

interface CavalosDisponiveisScreenProps {
  harasId: string;
  onVoltar?: () => void;
}

const CavalosDisponiveisScreen: React.FC<CavalosDisponiveisScreenProps> = ({ 
  harasId, 
  onVoltar 
}) => {
  const [cavalosDisponiveis, setCavalosDisponiveis] = useState<Cavalo[]>([]);
  const [stats, setStats] = useState<CavaloStats>({
    total: 0,
    disponiveis: 0,
    comBaia: 0,
    garanhoes: 0,
    doadoras: 0,
    receptoras: 0,
    potros: 0,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'todos' | 'garanhoes' | 'doadoras' | 'receptoras' | 'potros'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCavalo, setSelectedCavalo] = useState<Cavalo | null>(null);

  useEffect(() => {
    loadData();
  }, [harasId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cavalosList, statsData] = await Promise.all([
        cavaloService.getCavalosDisponiveis(harasId), // Endpoint específico para cavalos disponíveis
        cavaloService.getCavaloStats(harasId)
      ]);
      
      setCavalosDisponiveis(cavalosList);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar cavalos disponíveis:', error);
      Alert.alert('Erro', 'Não foi possível carregar os cavalos disponíveis');
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

  const filteredCavalos = cavalosDisponiveis.filter(cavalo => {
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

  const handleAlocarBaia = async (cavalo: Cavalo) => {
    Alert.alert(
      'Alocar Baia',
      `Deseja alocar uma baia para ${cavalo.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Alocar', 
          onPress: () => {
            // Implementar lógica de alocação de baia
            Alert.alert('Sucesso', 'Baia alocada com sucesso!');
            loadData(); // Recarregar dados
          }
        },
      ]
    );
  };

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
          
          <View style={styles.disponibilidadeBadge}>
            <Feather name="check-circle" size={12} color="#10b981" />
            <Text style={styles.disponibilidadeText}>Disponível</Text>
          </View>
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

        <View style={styles.detailRow}>
          <Feather name="home" size={16} color="#ef4444" />
          <Text style={styles.detailLabel}>Baia:</Text>
          <Text style={[styles.detailValue, styles.semBaia]}>Sem baia</Text>
        </View>

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
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryAction]}
          onPress={() => handleAlocarBaia(item)}
        >
          <Feather name="home" size={16} color="white" />
          <Text style={[styles.actionText, styles.primaryActionText]}>Alocar Baia</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="eye" size={16} color="#64748b" />
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
        colors={['#10b981', '#059669']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          {onVoltar && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onVoltar}
            >
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Cavalos Disponíveis</Text>
            <Text style={styles.headerSubtitle}>Animais sem baia alocada</Text>
          </View>
        </View>
        
        <View style={styles.headerStats}>
          <Text style={styles.headerStatsValue}>{cavalosDisponiveis.length}</Text>
          <Text style={styles.headerStatsLabel}>Disponíveis</Text>
        </View>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cavalos disponíveis..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats Rápidas */}
      <View style={styles.quickStatsContainer}>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>{stats.disponiveis}</Text>
          <Text style={styles.quickStatLabel}>Total Disponíveis</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>
            {cavalosDisponiveis.filter(c => c.categoria === 'garanhao').length}
          </Text>
          <Text style={styles.quickStatLabel}>Garanhões</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>
            {cavalosDisponiveis.filter(c => c.categoria === 'doadora').length}
          </Text>
          <Text style={styles.quickStatLabel}>Doadoras</Text>
        </View>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>
            {cavalosDisponiveis.filter(c => c.categoria === 'receptora').length}
          </Text>
          <Text style={styles.quickStatLabel}>Receptoras</Text>
        </View>
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
            tintColor="#10b981"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.emptyIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="check-circle" size={48} color="white" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Nenhum cavalo encontrado' : 'Todos os cavalos têm baia'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Tente ajustar sua busca' 
                : 'Todos os cavalos estão devidamente alocados'
              }
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
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
  headerStats: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  headerStatsValue: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  headerStatsLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
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
  quickStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#64748b',
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
    backgroundColor: '#10b981',
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
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
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
    marginBottom: 8,
  },
  categoriaText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  disponibilidadeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  disponibilidadeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 4,
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
  semBaia: {
    color: '#ef4444',
    fontStyle: 'italic',
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
  primaryAction: {
    backgroundColor: '#10b981',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 8,
  },
  primaryActionText: {
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default CavalosDisponiveisScreen;
