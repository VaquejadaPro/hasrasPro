import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  StatusBar,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Import das telas
import CavalosScreen from './CavalosScreen';
import CavalosDisponiveisScreen from './CavalosDisponiveisScreen';
import EmbriaoScreen from './EmbriaoScreen';
import ManejoReprodutivoScreen from './ManejoReprodutivoScreen';
import AgendaReprodutivaScreen from './AgendaReprodutivaScreen';
import SaudeAnimalScreen from './SaudeAnimalScreen';
import DetalheCavaloScreen from './DetalheCavaloScreen';
import EstatisticasScreen from './EstatisticasScreen';

const { width } = Dimensions.get('window');

interface HarasMainScreenProps {
  harasId: string;
  telaInicial?: string;
}

interface DashboardStats {
  totalAnimais: number;
  embrioesPendentes: number;
  eventosHoje: number;
  taxaSucesso: number;
  proximosEventos: number;
  animaisGestantes: number;
}

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  colors: [string, string];
  action: () => void;
}

type TelaAtiva = 
  | 'dashboard' 
  | 'cavalos'
  | 'cavalos-disponiveis'
  | 'embrioes' 
  | 'manejo' 
  | 'agenda' 
  | 'saude' 
  | 'detalhe-cavalo' 
  | 'estatisticas';

const HarasMainScreen: React.FC<HarasMainScreenProps> = ({ harasId, telaInicial }) => {
  const [telaAtiva, setTelaAtiva] = useState<TelaAtiva>(telaInicial as TelaAtiva || 'dashboard');
  const [animalSelecionado, setAnimalSelecionado] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalAnimais: 0,
    embrioesPendentes: 0,
    eventosHoje: 0,
    taxaSucesso: 0,
    proximosEventos: 0,
    animaisGestantes: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, [harasId]);

  const loadDashboardData = async () => {
    try {
      // Mock data - substituir por chamadas reais da API
      setStats({
        totalAnimais: 142,
        embrioesPendentes: 8,
        eventosHoje: 5,
        taxaSucesso: 87,
        proximosEventos: 12,
        animaisGestantes: 23,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'cavalos',
      title: 'Cavalos do Haras',
      subtitle: `${stats.totalAnimais} no plantel`,
      icon: 'users',
      colors: ['#8b5cf6', '#7c3aed'],
      action: () => setTelaAtiva('cavalos'),
    },
    {
      id: 'embrioes',
      title: 'Gestão de Embriões',
      subtitle: `${stats.embrioesPendentes} pendentes`,
      icon: 'circle',
      colors: ['#667eea', '#764ba2'],
      action: () => setTelaAtiva('embrioes'),
    },
    {
      id: 'manejo',
      title: 'Manejo Reprodutivo',
      subtitle: 'Coberturas e partos',
      icon: 'heart',
      colors: ['#f093fb', '#f5576c'],
      action: () => setTelaAtiva('manejo'),
    },
    {
      id: 'agenda',
      title: 'Agenda Reprodutiva',
      subtitle: `${stats.eventosHoje} eventos hoje`,
      icon: 'calendar',
      colors: ['#4facfe', '#00f2fe'],
      action: () => setTelaAtiva('agenda'),
    },
    {
      id: 'saude',
      title: 'Saúde Animal',
      subtitle: 'Vacinas e exames',
      icon: 'shield',
      colors: ['#43e97b', '#38f9d7'],
      action: () => setTelaAtiva('saude'),
    },
    {
      id: 'estatisticas',
      title: 'Relatórios',
      subtitle: `${stats.taxaSucesso}% sucesso`,
      icon: 'bar-chart-2',
      colors: ['#fa709a', '#fee140'],
      action: () => setTelaAtiva('estatisticas'),
    },
  ];

  const renderStatsCard = (title: string, value: string | number, icon: string, colors: [string, string]) => (
    <LinearGradient
      colors={colors}
      style={styles.statsCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.statsContent}>
        <View style={styles.statsIconContainer}>
          <Feather name={icon as any} size={24} color="white" />
        </View>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
      </View>
    </LinearGradient>
  );

  const renderQuickActionCard = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      onPress={action.action}
      activeOpacity={0.8}
      style={styles.actionCardContainer}
    >
      <LinearGradient
        colors={action.colors}
        style={styles.actionCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.actionIconContainer}>
          <Feather name={action.icon as any} size={28} color="white" />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.8)" />
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderDashboard = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      
      {/* Header com busca */}
      <LinearGradient
        colors={['#1a237e', '#3949ab']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>HarasPro</Text>
          <Text style={styles.headerSubtitle}>Sistema de Gestão Reprodutiva</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar animais, eventos..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1a237e"
          />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Resumo Geral</Text>
          <View style={styles.statsGrid}>
            {renderStatsCard('Total Animais', stats.totalAnimais, 'users', ['#667eea', '#764ba2'])}
            {renderStatsCard('Gestantes', stats.animaisGestantes, 'heart', ['#f093fb', '#f5576c'])}
            {renderStatsCard('Eventos Hoje', stats.eventosHoje, 'calendar', ['#4facfe', '#00f2fe'])}
            {renderStatsCard('Taxa Sucesso', `${stats.taxaSucesso}%`, 'trending-up', ['#43e97b', '#38f9d7'])}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Módulos Principais</Text>
          {quickActions.map(renderQuickActionCard)}
        </View>

        {/* Ações Rápidas Extras */}
        <View style={styles.extraActionsSection}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <TouchableOpacity
            style={styles.extraActionCard}
            onPress={() => setTelaAtiva('cavalos-disponiveis')}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.extraActionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="check-circle" size={24} color="white" />
            </LinearGradient>
            <View style={styles.extraActionText}>
              <Text style={styles.extraActionTitle}>Cavalos Disponíveis</Text>
              <Text style={styles.extraActionSubtitle}>Sem baia alocada</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.extraActionCard}
            onPress={() => {
              setAnimalSelecionado('exemplo-animal-id');
              setTelaAtiva('detalhe-cavalo');
            }}
          >
            <LinearGradient
              colors={['#ff9a9e', '#fecfef']}
              style={styles.extraActionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="search" size={24} color="white" />
            </LinearGradient>
            <View style={styles.extraActionText}>
              <Text style={styles.extraActionTitle}>Buscar Animal</Text>
              <Text style={styles.extraActionSubtitle}>Ver detalhes completos</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.extraActionCard}
            onPress={() => setTelaAtiva('agenda')}
          >
            <LinearGradient
              colors={['#a8edea', '#fed6e3']}
              style={styles.extraActionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="plus" size={24} color="white" />
            </LinearGradient>
            <View style={styles.extraActionText}>
              <Text style={styles.extraActionTitle}>Novo Evento</Text>
              <Text style={styles.extraActionSubtitle}>Agendar procedimento</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderTelaAtiva = () => {
    switch (telaAtiva) {
      case 'cavalos':
        return <CavalosScreen harasId={harasId} />;
      case 'cavalos-disponiveis':
        return <CavalosDisponiveisScreen harasId={harasId} onVoltar={() => setTelaAtiva('dashboard')} />;
      case 'embrioes':
        return <EmbriaoScreen harasId={harasId} />;
      case 'manejo':
        return <ManejoReprodutivoScreen harasId={harasId} />;
      case 'agenda':
        return <AgendaReprodutivaScreen harasId={harasId} />;
      case 'saude':
        return <SaudeAnimalScreen harasId={harasId} />;
      case 'estatisticas':
        return <EstatisticasScreen harasId={harasId} />;
      case 'detalhe-cavalo':
        return animalSelecionado ? (
          <DetalheCavaloScreen
            animalId={animalSelecionado}
            onClose={() => {
              setAnimalSelecionado(null);
              setTelaAtiva('dashboard');
            }}
          />
        ) : null;
      default:
        return renderDashboard();
    }
  };

  if (telaAtiva !== 'dashboard') {
    return (
      <Modal
        visible={true}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setTelaAtiva('dashboard')}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#1a237e" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>HarasPro</Text>
            <View style={{ width: 40 }} />
          </View>
          {renderTelaAtiva()}
        </SafeAreaView>
      </Modal>
    );
  }

  return renderDashboard();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsCard: {
    width: (width - 52) / 2,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  statsContent: {
    alignItems: 'center',
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionCardContainer: {
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  extraActionsSection: {
    marginBottom: 32,
  },
  extraActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  extraActionGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  extraActionText: {
    flex: 1,
  },
  extraActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  extraActionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a237e',
  },
});

export default HarasMainScreen;
