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

interface RegistroSaude {
  id: string;
  animalId: string;
  animalNome: string;
  tipo: 'vacina' | 'medicamento' | 'exame' | 'tratamento';
  nome: string;
  data: string;
  dataVencimento?: string;
  dosagem?: string;
  via?: string;
  resultado?: string;
  status: 'agendado' | 'aplicado' | 'vencido' | 'cancelado';
  veterinario: string;
  observacoes?: string;
  custo?: number;
}

interface SaudeAnimalScreenProps {
  harasId: string;
}

const SaudeAnimalScreen: React.FC<SaudeAnimalScreenProps> = ({ harasId }) => {
  const [registros, setRegistros] = useState<RegistroSaude[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'todos' | 'vacinas' | 'medicamentos' | 'exames'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [harasId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock data - substituir por chamadas reais da API
      const mockRegistros: RegistroSaude[] = [
        {
          id: '1',
          animalId: '1',
          animalNome: 'Estrela da Manhã',
          tipo: 'vacina',
          nome: 'Vacina Tétano',
          data: '2024-01-15',
          dataVencimento: '2025-01-15',
          dosagem: '5ml',
          via: 'Intramuscular',
          status: 'aplicado',
          veterinario: 'Dr. João Silva',
          observacoes: 'Animal reagiu bem',
          custo: 85.00
        },
        {
          id: '2',
          animalId: '2',
          animalNome: 'Lua Cheia',
          tipo: 'exame',
          nome: 'Exame de Sangue',
          data: '2024-01-20',
          resultado: 'Normal',
          status: 'aplicado',
          veterinario: 'Dr. João Silva',
          custo: 150.00
        },
        {
          id: '3',
          animalId: '1',
          animalNome: 'Estrela da Manhã',
          tipo: 'medicamento',
          nome: 'Antibiótico',
          data: '2024-01-22',
          dosagem: '10ml',
          via: 'Oral',
          status: 'aplicado',
          veterinario: 'Dr. João Silva',
          observacoes: 'Tratamento por 7 dias',
          custo: 45.00
        },
        {
          id: '4',
          animalId: '3',
          animalNome: 'Trovão do Nordeste',
          tipo: 'vacina',
          nome: 'Vacina Influenza',
          data: '2024-01-25',
          dataVencimento: '2024-07-25',
          status: 'agendado',
          veterinario: 'Dr. João Silva'
        },
        {
          id: '5',
          animalId: '2',
          animalNome: 'Lua Cheia',
          tipo: 'exame',
          nome: 'Ultrassom',
          data: '2024-01-30',
          status: 'agendado',
          veterinario: 'Dr. João Silva'
        }
      ];

      setRegistros(mockRegistros);
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
      case 'vacina': return ['#10b981', '#059669'];
      case 'medicamento': return ['#3b82f6', '#1d4ed8'];
      case 'exame': return ['#f59e0b', '#d97706'];
      case 'tratamento': return ['#8b5cf6', '#7c3aed'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getStatusColor = (status: string): [string, string] => {
    switch (status) {
      case 'aplicado': return ['#10b981', '#059669'];
      case 'agendado': return ['#f59e0b', '#d97706'];
      case 'vencido': return ['#ef4444', '#dc2626'];
      case 'cancelado': return ['#6b7280', '#4b5563'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getTipoText = (tipo: string): string => {
    switch (tipo) {
      case 'vacina': return 'Vacina';
      case 'medicamento': return 'Medicamento';
      case 'exame': return 'Exame';
      case 'tratamento': return 'Tratamento';
      default: return 'Desconhecido';
    }
  };

  const getTipoIcon = (tipo: string): string => {
    switch (tipo) {
      case 'vacina': return 'shield';
      case 'medicamento': return 'activity';
      case 'exame': return 'search';
      case 'tratamento': return 'heart';
      default: return 'circle';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'aplicado': return 'Aplicado';
      case 'agendado': return 'Agendado';
      case 'vencido': return 'Vencido';
      case 'cancelado': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const isVencendo = (dataVencimento?: string): boolean => {
    if (!dataVencimento) return false;
    const vencimento = new Date(dataVencimento);
    const hoje = new Date();
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const filteredRegistros = registros.filter(registro => {
    if (activeTab !== 'todos') {
      if (activeTab === 'vacinas' && registro.tipo !== 'vacina') return false;
      if (activeTab === 'medicamentos' && registro.tipo !== 'medicamento') return false;
      if (activeTab === 'exames' && registro.tipo !== 'exame') return false;
    }
    
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      registro.animalNome.toLowerCase().includes(searchLower) ||
      registro.nome.toLowerCase().includes(searchLower) ||
      registro.veterinario.toLowerCase().includes(searchLower) ||
      registro.tipo.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    total: registros.length,
    aplicados: registros.filter(r => r.status === 'aplicado').length,
    agendados: registros.filter(r => r.status === 'agendado').length,
    vencendo: registros.filter(r => isVencendo(r.dataVencimento)).length,
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

  const renderRegistroCard = ({ item }: { item: RegistroSaude }) => (
    <TouchableOpacity style={styles.registroCard} activeOpacity={0.8}>
      <View style={styles.registroHeader}>
        <LinearGradient
          colors={getTipoColor(item.tipo)}
          style={styles.tipoIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name={getTipoIcon(item.tipo) as any} size={20} color="white" />
        </LinearGradient>
        
        <View style={styles.registroInfo}>
          <Text style={styles.registroNome}>{item.nome}</Text>
          <Text style={styles.registroAnimal}>{item.animalNome}</Text>
          <Text style={styles.registroTipo}>{getTipoText(item.tipo)}</Text>
        </View>

        <View style={styles.registroStatus}>
          <LinearGradient
            colors={getStatusColor(item.status)}
            style={styles.statusBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </LinearGradient>
          
          {isVencendo(item.dataVencimento) && (
            <View style={styles.alertBadge}>
              <Feather name="alert-triangle" size={12} color="#f59e0b" />
            </View>
          )}
        </View>
      </View>

      <View style={styles.registroDetails}>
        <View style={styles.detailRow}>
          <Feather name="calendar" size={16} color="#64748b" />
          <Text style={styles.detailLabel}>Data:</Text>
          <Text style={styles.detailValue}>{new Date(item.data).toLocaleDateString('pt-BR')}</Text>
        </View>

        {item.dataVencimento && (
          <View style={styles.detailRow}>
            <Feather name="clock" size={16} color="#64748b" />
            <Text style={styles.detailLabel}>Vencimento:</Text>
            <Text style={[
              styles.detailValue,
              isVencendo(item.dataVencimento) && styles.vencendoText
            ]}>
              {new Date(item.dataVencimento).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Feather name="user" size={16} color="#64748b" />
          <Text style={styles.detailLabel}>Veterinário:</Text>
          <Text style={styles.detailValue}>{item.veterinario}</Text>
        </View>

        {item.dosagem && (
          <View style={styles.detailRow}>
            <Feather name="droplet" size={16} color="#64748b" />
            <Text style={styles.detailLabel}>Dosagem:</Text>
            <Text style={styles.detailValue}>{item.dosagem}</Text>
          </View>
        )}

        {item.via && (
          <View style={styles.detailRow}>
            <Feather name="navigation" size={16} color="#64748b" />
            <Text style={styles.detailLabel}>Via:</Text>
            <Text style={styles.detailValue}>{item.via}</Text>
          </View>
        )}

        {item.resultado && (
          <View style={styles.detailRow}>
            <Feather name="file-text" size={16} color="#64748b" />
            <Text style={styles.detailLabel}>Resultado:</Text>
            <Text style={styles.detailValue}>{item.resultado}</Text>
          </View>
        )}

        {item.custo && (
          <View style={styles.detailRow}>
            <Feather name="dollar-sign" size={16} color="#64748b" />
            <Text style={styles.detailLabel}>Custo:</Text>
            <Text style={styles.detailValue}>R$ {item.custo.toFixed(2)}</Text>
          </View>
        )}

        {item.observacoes && (
          <View style={styles.detailRow}>
            <Feather name="message-circle" size={16} color="#64748b" />
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
        colors={['#43e97b', '#38f9d7']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Saúde Animal</Text>
          <Text style={styles.headerSubtitle}>Vacinas, medicamentos e exames</Text>
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
          placeholder="Buscar registros de saúde..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          {renderStatsCard('Total', stats.total, 'activity', ['#43e97b', '#38f9d7'])}
          {renderStatsCard('Aplicados', stats.aplicados, 'check', ['#10b981', '#059669'])}
          {renderStatsCard('Agendados', stats.agendados, 'clock', ['#f59e0b', '#d97706'])}
          {renderStatsCard('Vencendo', stats.vencendo, 'alert-triangle', ['#ef4444', '#dc2626'])}
        </ScrollView>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {renderTabButton('todos', 'Todos')}
          {renderTabButton('vacinas', 'Vacinas')}
          {renderTabButton('medicamentos', 'Medicamentos')}
          {renderTabButton('exames', 'Exames')}
        </ScrollView>
      </View>

      {/* Lista de Registros */}
      <FlatList
        data={filteredRegistros}
        renderItem={renderRegistroCard}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#43e97b"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="shield" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Nenhum registro encontrado</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Tente ajustar sua busca' : 'Adicione o primeiro registro de saúde'}
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
    backgroundColor: '#43e97b',
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
  registroCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  registroHeader: {
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
  registroInfo: {
    flex: 1,
  },
  registroNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  registroAnimal: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  registroTipo: {
    fontSize: 12,
    color: '#9ca3af',
  },
  registroStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  alertBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 4,
  },
  registroDetails: {
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
  vencendoText: {
    color: '#f59e0b',
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

export default SaudeAnimalScreen;
