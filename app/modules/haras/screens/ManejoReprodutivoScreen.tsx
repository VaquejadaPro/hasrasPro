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

interface EventoReprodutivo {
  id: string;
  tipo: 'cobertura' | 'inseminacao' | 'parto' | 'diagnostico';
  animalId: string;
  animalNome: string;
  parceiro?: string;
  data: string;
  status: 'agendado' | 'realizado' | 'cancelado';
  resultado: 'positivo' | 'negativo' | 'pendente';
  observacoes?: string;
  responsavel: string;
}

interface ManejoReprodutivoScreenProps {
  harasId: string;
}

const ManejoReprodutivoScreen: React.FC<ManejoReprodutivoScreenProps> = ({ harasId }) => {
  const [eventos, setEventos] = useState<EventoReprodutivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'todos' | 'coberturas' | 'inseminacoes' | 'partos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [harasId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock data - substituir por chamadas reais da API
      const mockEventos: EventoReprodutivo[] = [
        {
          id: '1',
          tipo: 'cobertura',
          animalId: '1',
          animalNome: 'Estrela da Manhã',
          parceiro: 'Trovão do Nordeste',
          data: '2024-01-20',
          status: 'realizado',
          resultado: 'positivo',
          responsavel: 'Dr. Veterinário',
          observacoes: 'Cobertura realizada com sucesso'
        },
        {
          id: '2',
          tipo: 'inseminacao',
          animalId: '2',
          animalNome: 'Lua Cheia',
          data: '2024-01-18',
          status: 'realizado',
          resultado: 'pendente',
          responsavel: 'Dr. Veterinário'
        },
        {
          id: '3',
          tipo: 'diagnostico',
          animalId: '1',
          animalNome: 'Estrela da Manhã',
          data: '2024-01-25',
          status: 'agendado',
          resultado: 'pendente',
          responsavel: 'Dr. Veterinário'
        },
        {
          id: '4',
          tipo: 'parto',
          animalId: '3',
          animalNome: 'Égua Gestante',
          data: '2024-02-15',
          status: 'agendado',
          resultado: 'pendente',
          responsavel: 'Dr. Veterinário'
        },
      ];

      setEventos(mockEventos);
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

  const getTipoColor = (tipo: string): [string, string] => {
    switch (tipo) {
      case 'cobertura': return ['#f093fb', '#f5576c'];
      case 'inseminacao': return ['#4facfe', '#00f2fe'];
      case 'parto': return ['#43e97b', '#38f9d7'];
      case 'diagnostico': return ['#667eea', '#764ba2'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getStatusColor = (status: string): [string, string] => {
    switch (status) {
      case 'realizado': return ['#10b981', '#059669'];
      case 'agendado': return ['#f59e0b', '#d97706'];
      case 'cancelado': return ['#ef4444', '#dc2626'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getResultadoColor = (resultado: string): [string, string] => {
    switch (resultado) {
      case 'positivo': return ['#10b981', '#059669'];
      case 'negativo': return ['#ef4444', '#dc2626'];
      case 'pendente': return ['#f59e0b', '#d97706'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getTipoText = (tipo: string): string => {
    switch (tipo) {
      case 'cobertura': return 'Cobertura';
      case 'inseminacao': return 'Inseminação';
      case 'parto': return 'Parto';
      case 'diagnostico': return 'Diagnóstico';
      default: return 'Desconhecido';
    }
  };

  const getTipoIcon = (tipo: string): string => {
    switch (tipo) {
      case 'cobertura': return 'heart';
      case 'inseminacao': return 'zap';
      case 'parto': return 'baby';
      case 'diagnostico': return 'search';
      default: return 'circle';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'realizado': return 'Realizado';
      case 'agendado': return 'Agendado';
      case 'cancelado': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const getResultadoText = (resultado: string): string => {
    switch (resultado) {
      case 'positivo': return 'Positivo';
      case 'negativo': return 'Negativo';
      case 'pendente': return 'Pendente';
      default: return 'N/A';
    }
  };

  const filteredEventos = eventos.filter(evento => {
    if (activeTab !== 'todos' && activeTab + 's' !== evento.tipo + 's') {
      if (activeTab === 'coberturas' && evento.tipo !== 'cobertura') return false;
      if (activeTab === 'inseminacoes' && evento.tipo !== 'inseminacao') return false;
      if (activeTab === 'partos' && evento.tipo !== 'parto') return false;
    }
    
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      evento.animalNome.toLowerCase().includes(searchLower) ||
      evento.tipo.toLowerCase().includes(searchLower) ||
      evento.status.toLowerCase().includes(searchLower) ||
      (evento.parceiro && evento.parceiro.toLowerCase().includes(searchLower))
    );
  });

  const stats = {
    total: eventos.length,
    realizados: eventos.filter(e => e.status === 'realizado').length,
    agendados: eventos.filter(e => e.status === 'agendado').length,
    positivos: eventos.filter(e => e.resultado === 'positivo').length,
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

  const renderEventoCard = ({ item }: { item: EventoReprodutivo }) => (
    <TouchableOpacity style={styles.eventoCard} activeOpacity={0.8}>
      <View style={styles.eventoHeader}>
        <LinearGradient
          colors={getTipoColor(item.tipo)}
          style={styles.tipoIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name={getTipoIcon(item.tipo) as any} size={20} color="white" />
        </LinearGradient>
        
        <View style={styles.eventoInfo}>
          <Text style={styles.eventoTipo}>{getTipoText(item.tipo)}</Text>
          <Text style={styles.eventoAnimal}>{item.animalNome}</Text>
          {item.parceiro && (
            <Text style={styles.eventoParceiro}>com {item.parceiro}</Text>
          )}
        </View>

        <View style={styles.eventoStatus}>
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

      <View style={styles.eventoDetails}>
        <View style={styles.detailRow}>
          <Feather name="calendar" size={16} color="#64748b" />
          <Text style={styles.detailLabel}>Data:</Text>
          <Text style={styles.detailValue}>{new Date(item.data).toLocaleDateString('pt-BR')}</Text>
        </View>

        <View style={styles.detailRow}>
          <Feather name="user" size={16} color="#64748b" />
          <Text style={styles.detailLabel}>Responsável:</Text>
          <Text style={styles.detailValue}>{item.responsavel}</Text>
        </View>

        <View style={styles.detailRow}>
          <Feather name="activity" size={16} color="#64748b" />
          <Text style={styles.detailLabel}>Resultado:</Text>
          <LinearGradient
            colors={getResultadoColor(item.resultado)}
            style={styles.resultadoBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.resultadoText}>{getResultadoText(item.resultado)}</Text>
          </LinearGradient>
        </View>

        {item.observacoes && (
          <View style={styles.detailRow}>
            <Feather name="file-text" size={16} color="#64748b" />
            <Text style={styles.detailLabel}>Obs:</Text>
            <Text style={styles.detailValue}>{item.observacoes}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      
      {/* Header */}
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Manejo Reprodutivo</Text>
          <Text style={styles.headerSubtitle}>Coberturas, inseminações e partos</Text>
        </View>
        
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar eventos..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          {renderStatsCard('Total', stats.total, 'layers', ['#f093fb', '#f5576c'])}
          {renderStatsCard('Realizados', stats.realizados, 'check', ['#10b981', '#059669'])}
          {renderStatsCard('Agendados', stats.agendados, 'clock', ['#f59e0b', '#d97706'])}
          {renderStatsCard('Positivos', stats.positivos, 'thumbs-up', ['#43e97b', '#38f9d7'])}
        </ScrollView>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {renderTabButton('todos', 'Todos')}
          {renderTabButton('coberturas', 'Coberturas')}
          {renderTabButton('inseminacoes', 'Inseminações')}
          {renderTabButton('partos', 'Partos')}
        </ScrollView>
      </View>

      {/* Lista de Eventos */}
      <FlatList
        data={filteredEventos}
        renderItem={renderEventoCard}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#f093fb"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="calendar" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Nenhum evento encontrado</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Tente ajustar sua busca' : 'Adicione o primeiro evento'}
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
    backgroundColor: '#f093fb',
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
  eventoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tipoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventoInfo: {
    flex: 1,
  },
  eventoTipo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  eventoAnimal: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  eventoParceiro: {
    fontSize: 12,
    color: '#9ca3af',
  },
  eventoStatus: {},
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
  eventoDetails: {
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
  resultadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultadoText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
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

export default ManejoReprodutivoScreen;
