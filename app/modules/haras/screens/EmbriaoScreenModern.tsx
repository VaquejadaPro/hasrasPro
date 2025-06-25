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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface RegistroEmbriao {
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
  responsavel: string;
}

interface Animal {
  id: string;
  nome: string;
  raca: string;
  status: string;
}

interface EmbriaoScreenProps {
  harasId: string;
}

const EmbriaoScreen: React.FC<EmbriaoScreenProps> = ({ harasId }) => {
  const [embrioes, setEmbrioes] = useState<RegistroEmbriao[]>([]);
  const [doadoras, setDoadoras] = useState<Animal[]>([]);
  const [garanhoes, setGaranhoes] = useState<Animal[]>([]);
  const [receptoras, setReceptoras] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedEmbriao, setSelectedEmbriao] = useState<RegistroEmbriao | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    doadoraId: '',
    garanhaoId: '',
    dataColeta: new Date().toISOString().split('T')[0],
    qualidadeEmbriao: 'grau1' as const,
    numeroEmbrioes: 1,
    observacoes: '',
    responsavel: 'Veterinário'
  });

  const [transferData, setTransferData] = useState({
    receptoraId: '',
    dataTransferencia: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, [harasId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock data para demonstração - substituir por chamadas reais da API
      const mockEmbrioes: RegistroEmbriao[] = [
        {
          id: '1',
          doadoraId: '1',
          garanhaoId: '1',
          dataColeta: '2024-01-15',
          qualidadeEmbriao: 'grau1',
          statusEmbriao: 'congelado',
          numeroEmbrioes: 3,
          responsavel: 'Dr. Veterinário',
          observacoes: 'Excelente qualidade'
        },
        {
          id: '2',
          doadoraId: '2',
          garanhaoId: '1',
          dataColeta: '2024-01-10',
          qualidadeEmbriao: 'grau2',
          statusEmbriao: 'transferido',
          receptoraId: '1',
          dataTransferencia: '2024-01-20',
          numeroEmbrioes: 2,
          responsavel: 'Dr. Veterinário'
        },
        {
          id: '3',
          doadoraId: '1',
          garanhaoId: '2',
          dataColeta: '2024-01-05',
          qualidadeEmbriao: 'grau1',
          statusEmbriao: 'congelado',
          numeroEmbrioes: 4,
          responsavel: 'Dr. Veterinário',
          observacoes: 'Qualidade superior'
        }
      ];

      const mockDoadoras: Animal[] = [
        { id: '1', nome: 'Égua Doadora 1', raca: 'Quarto de Milha', status: 'ativa' },
        { id: '2', nome: 'Égua Doadora 2', raca: 'Mangalarga', status: 'ativa' },
      ];

      const mockGaranhoes: Animal[] = [
        { id: '1', nome: 'Garanhão Elite', raca: 'Quarto de Milha', status: 'ativo' },
        { id: '2', nome: 'Garanhão Champion', raca: 'Mangalarga', status: 'ativo' },
      ];

      const mockReceptoras: Animal[] = [
        { id: '1', nome: 'Receptora 1', raca: 'Mestiça', status: 'disponível' },
        { id: '2', nome: 'Receptora 2', raca: 'Mestiça', status: 'disponível' },
      ];

      setEmbrioes(mockEmbrioes);
      setDoadoras(mockDoadoras);
      setGaranhoes(mockGaranhoes);
      setReceptoras(mockReceptoras);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getStatusColor = (status: string): [string, string] => {
    switch (status) {
      case 'congelado': return ['#3b82f6', '#1d4ed8'];
      case 'transferido': return ['#10b981', '#059669'];
      case 'descartado': return ['#ef4444', '#dc2626'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getQualidadeColor = (qualidade: string): [string, string] => {
    switch (qualidade) {
      case 'grau1': return ['#10b981', '#059669'];
      case 'grau2': return ['#f59e0b', '#d97706'];
      case 'grau3': return ['#ef4444', '#dc2626'];
      case 'grau4': return ['#dc2626', '#991b1b'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'congelado': return 'Congelado';
      case 'transferido': return 'Transferido';
      case 'descartado': return 'Descartado';
      default: return 'Desconhecido';
    }
  };

  const getQualidadeText = (qualidade: string): string => {
    switch (qualidade) {
      case 'grau1': return 'Grau 1';
      case 'grau2': return 'Grau 2';
      case 'grau3': return 'Grau 3';
      case 'grau4': return 'Grau 4';
      default: return 'N/A';
    }
  };

  const getAnimalNome = (animalId: string, lista: Animal[]): string => {
    const animal = lista.find(a => a.id === animalId);
    return animal ? animal.nome : 'N/A';
  };

  const filteredEmbrioes = embrioes.filter(embriao => {
    if (!searchQuery) return true;
    const doadoraNome = getAnimalNome(embriao.doadoraId, doadoras);
    const garanhaoNome = getAnimalNome(embriao.garanhaoId, garanhoes);
    const searchLower = searchQuery.toLowerCase();
    return (
      doadoraNome.toLowerCase().includes(searchLower) ||
      garanhaoNome.toLowerCase().includes(searchLower) ||
      embriao.statusEmbriao.toLowerCase().includes(searchLower) ||
      embriao.qualidadeEmbriao.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    total: embrioes.length,
    congelados: embrioes.filter(e => e.statusEmbriao === 'congelado').length,
    transferidos: embrioes.filter(e => e.statusEmbriao === 'transferido').length,
    grau1: embrioes.filter(e => e.qualidadeEmbriao === 'grau1').length,
  };

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

  const renderEmbriaoCard = ({ item }: { item: RegistroEmbriao }) => (
    <TouchableOpacity
      style={styles.embriaoCard}
      onPress={() => setSelectedEmbriao(item)}
      activeOpacity={0.8}
    >
      <View style={styles.embriaoHeader}>
        <View style={styles.embriaoInfo}>
          <Text style={styles.embriaoId}>#{item.id}</Text>
          <Text style={styles.embriaoData}>{new Date(item.dataColeta).toLocaleDateString('pt-BR')}</Text>
        </View>
        <View style={styles.embriaoStatus}>
          <LinearGradient
            colors={getStatusColor(item.statusEmbriao)}
            style={styles.statusBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.statusText}>{getStatusText(item.statusEmbriao)}</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.embriaoDetails}>
        <View style={styles.detailRow}>
          <Feather name="user" size={16} color="#64748b" />
          <Text style={styles.detailLabel}>Doadora:</Text>
          <Text style={styles.detailValue}>{getAnimalNome(item.doadoraId, doadoras)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Feather name="award" size={16} color="#64748b" />
          <Text style={styles.detailLabel}>Garanhão:</Text>
          <Text style={styles.detailValue}>{getAnimalNome(item.garanhaoId, garanhoes)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Feather name="star" size={16} color="#64748b" />
          <Text style={styles.detailLabel}>Qualidade:</Text>
          <LinearGradient
            colors={getQualidadeColor(item.qualidadeEmbriao)}
            style={styles.qualidadeBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.qualidadeText}>{getQualidadeText(item.qualidadeEmbriao)}</Text>
          </LinearGradient>
        </View>

        <View style={styles.detailRow}>
          <Feather name="layers" size={16} color="#64748b" />
          <Text style={styles.detailLabel}>Quantidade:</Text>
          <Text style={styles.detailValue}>{item.numeroEmbrioes}</Text>
        </View>
      </View>

      {item.statusEmbriao === 'congelado' && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setSelectedEmbriao(item);
            setShowTransferModal(true);
          }}
        >
          <Feather name="arrow-right" size={16} color="#3b82f6" />
          <Text style={styles.actionButtonText}>Transferir</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Gestão de Embriões</Text>
          <Text style={styles.headerSubtitle}>Controle de coleta e transferência</Text>
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
          placeholder="Buscar embriões..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          {renderStatsCard('Total', stats.total, 'layers', ['#667eea', '#764ba2'])}
          {renderStatsCard('Congelados', stats.congelados, 'pause', ['#3b82f6', '#1d4ed8'])}
          {renderStatsCard('Transferidos', stats.transferidos, 'check', ['#10b981', '#059669'])}
          {renderStatsCard('Grau 1', stats.grau1, 'star', ['#f59e0b', '#d97706'])}
        </ScrollView>
      </View>

      {/* Lista de Embriões */}
      <FlatList
        data={filteredEmbrioes}
        renderItem={renderEmbriaoCard}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#667eea"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="inbox" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Nenhum embrião encontrado</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Tente ajustar sua busca' : 'Adicione o primeiro embrião'}
            </Text>
          </View>
        }
      />

      {/* Modais */}
      {/* TODO: Implementar modais de criação e transferência */}
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  embriaoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  embriaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  embriaoInfo: {
    flex: 1,
  },
  embriaoId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  embriaoData: {
    fontSize: 14,
    color: '#64748b',
  },
  embriaoStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  embriaoDetails: {
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
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    flex: 1,
  },
  qualidadeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  qualidadeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
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

export default EmbriaoScreen;
