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
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { cavaloService, Cavalo } from '../services/cavaloService';
import { baiaService, Baia } from '../services/baiaService';
import Theme from '../../../constants/Theme';
import QuickStat, { QuickStatsContainer } from '@/components/ui/quick-stat';
import useAnimations from '@/hooks/useAnimations';
import { 
  InformacoesTecnicasCard, 
  TimelineCard, 
  ValoresFinanceirosCard, 
  GenealogiaTab, 
  FilhosTab, 
  ConquistasTab, 
  ObservacoesCard 
} from '../components/cavalo';

const { width, height } = Dimensions.get('window');

const DetalheCavaloScreen: React.FC = () => {
  const router = useRouter();
  const { cavaloId } = useLocalSearchParams<{ cavaloId: string }>();
  
  const [cavalo, setCavalo] = useState<Cavalo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'genealogia' | 'filhos' | 'conquistas'>('info');
  const [baiasDisponiveis, setBaiasDisponiveis] = useState<Baia[]>([]);
  const [baiaAtual, setBaiaAtual] = useState<Baia | null>(null);

  // Animações
  const { fadeAnim, scaleAnim, slideAnim, fadeIn, scaleIn, slideIn } = useAnimations();

  // Inicializar animações quando o cavalo for carregado
  useEffect(() => {
    if (cavalo) {
      fadeIn();
      scaleIn();
      slideIn();
    }
  }, [cavalo]);

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

  // Formatar data brasileira
  const formatarData = (data: string): string => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // Carregar dados do cavalo
  const loadCavalo = useCallback(async () => {
    if (!cavaloId) return;
    
    try {
      setLoading(true);
      console.log('Carregando detalhes do cavalo:', cavaloId);
      
      const cavaloData = await cavaloService.getCavaloById(cavaloId);
      console.log('Dados do cavalo carregados:', cavaloData);
      
      setCavalo(cavaloData);

      // Carregar informações da baia se o cavalo tiver uma
      if (cavaloData.stallId) {
        try {
          const baiaData = await baiaService.getBaiaById(cavaloData.stallId);
          setBaiaAtual(baiaData);
        } catch (error) {
          console.error('Erro ao carregar baia:', error);
        }
      } else {
        setBaiaAtual(null);
      }

      // Carregar baias disponíveis
      try {
        const baiasData = await baiaService.getBaiasDisponiveis(cavaloData.harasId);
        setBaiasDisponiveis(baiasData);
      } catch (error) {
        console.error('Erro ao carregar baias disponíveis:', error);
      }
    } catch (error) {
      console.error('Erro ao carregar cavalo:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do cavalo.');
    } finally {
      setLoading(false);
    }
  }, [cavaloId]);

  // Refresh dos dados
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCavalo();
    setRefreshing(false);
  }, [loadCavalo]);

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadCavalo();
  }, [loadCavalo]);

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

  // Obter cor do status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return Theme.colors.success[600];
      case 'inactive':
        return Theme.colors.warning[600];
      case 'sold':
        return Theme.colors.primary[600];
      case 'deceased':
        return Theme.colors.error[600];
      default:
        return Theme.colors.neutral[600];
    }
  };

  // Obter label do status
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'sold':
        return 'Vendido';
      case 'deceased':
        return 'Falecido';
      default:
        return 'Desconhecido';
    }
  };

  // Atribuir cavalo a uma baia
  const handleAssignToBaia = async (stallId: string) => {
    if (!cavalo) return;
    
    try {
      await cavaloService.assignCavaloToBaia(cavalo.id, stallId);
      await loadCavalo(); // Recarregar dados
      Alert.alert('Sucesso', 'Cavalo atribuído à baia com sucesso!');
    } catch (error) {
      console.error('Erro ao atribuir cavalo à baia:', error);
      Alert.alert('Erro', 'Não foi possível atribuir o cavalo à baia.');
    }
  };

  // Remover cavalo da baia
  const handleRemoveFromBaia = async () => {
    if (!cavalo) return;
    
    Alert.alert(
      'Remover da Baia',
      'Deseja realmente remover este cavalo da baia atual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await cavaloService.removeCavaloFromBaia(cavalo.id);
              await loadCavalo(); // Recarregar dados
              Alert.alert('Sucesso', 'Cavalo removido da baia com sucesso!');
            } catch (error) {
              console.error('Erro ao remover cavalo da baia:', error);
              Alert.alert('Erro', 'Não foi possível remover o cavalo da baia.');
            }
          }
        }
      ]
    );
  };

  // Mostrar opções de baia
  const showBaiaOptions = () => {
    if (baiaAtual) {
      // Se já tem baia, mostrar opção de remover
      Alert.alert(
        'Gerenciar Baia',
        `Cavalo está na baia ${baiaAtual.number}${baiaAtual.name ? ` (${baiaAtual.name})` : ''}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Remover da Baia', style: 'destructive', onPress: handleRemoveFromBaia },
          {
            text: 'Trocar Baia',
            onPress: () => {
              // Mostrar lista de baias disponíveis
              const baiaOptions = baiasDisponiveis.map(baia => ({
                text: `${baia.number}${baia.name ? ` - ${baia.name}` : ''}`,
                onPress: () => handleAssignToBaia(baia.id)
              }));
              
              baiaOptions.push({ text: 'Cancelar', onPress: async () => {} });
              
              Alert.alert('Escolher Nova Baia', 'Selecione a nova baia:', baiaOptions);
            }
          }
        ]
      );
    } else if (baiasDisponiveis.length > 0) {
      // Se não tem baia, mostrar lista de baias disponíveis
      const baiaOptions = baiasDisponiveis.map(baia => ({
        text: `${baia.number}${baia.name ? ` - ${baia.name}` : ''}`,
        onPress: () => handleAssignToBaia(baia.id)
      }));
      
      baiaOptions.push({ text: 'Cancelar', onPress: async () => {} });
      
      Alert.alert('Atribuir à Baia', 'Selecione uma baia:', baiaOptions);
    } else {
      Alert.alert('Aviso', 'Não há baias disponíveis no momento.');
    }
  };

  // Obter ícone do gênero
  const getGenderIcon = (gender: string): any => {
    switch (gender) {
      case 'male':
        return 'male';
      case 'female':
        return 'female';
      default:
        return 'help-circle';
    }
  };

  // Renderizar aba de informações gerais
  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      {/* Quick Stats Cards */}
      <QuickStatsContainer>
        <QuickStat
          icon="calendar"
          value={cavalo ? calcularIdade(cavalo.birthDate) : 0}
          label="Anos"
          colors={[Theme.colors.primary[500], Theme.colors.primary[600]]}
          delay={0}
        />
        <QuickStat
          icon={getGenderIcon(cavalo?.gender || '') as any}
          value={cavalo?.gender === 'male' ? 'M' : cavalo?.gender === 'female' ? 'F' : 'C'}
          label="Gênero"
          colors={[Theme.colors.success[500], Theme.colors.success[600]]}
          delay={100}
        />
        <QuickStat
          icon="activity"
          value={getStatusLabel(cavalo?.status || '').charAt(0)}
          label="Status"
          colors={[Theme.colors.warning[500], Theme.colors.warning[600]]}
          delay={200}
        />
        <QuickStat
          icon="home"
          value={baiaAtual?.number || '--'}
          label="Baia"
          colors={[baiaAtual ? Theme.colors.primary[500] : Theme.colors.neutral[400], baiaAtual ? Theme.colors.primary[600] : Theme.colors.neutral[500]]}
          delay={300}
          onPress={showBaiaOptions}
        />
      </QuickStatsContainer>

      {/* Componentes refatorados */}
      {cavalo && (
        <>
          <InformacoesTecnicasCard cavalo={cavalo} delay={400} />
          <TimelineCard 
            birthDate={cavalo.birthDate}
            acquisitionDate={cavalo.acquisitionDate}
            createdAt={cavalo.createdAt}
            delay={500}
          />
          <ValoresFinanceirosCard 
            acquisitionValue={cavalo.acquisitionValue}
            currentValue={cavalo.currentValue}
            delay={600}
          />
          <ObservacoesCard notes={cavalo.notes} delay={700} />
        </>
      )}
    </View>
  );

  // Renderizar aba de genealogia
  const renderGenealogiaTab = () => (
    <GenealogiaTab 
      father={cavalo?.father}
      mother={cavalo?.mother}
    />
  );

  // Renderizar aba de filhos
  const renderFilhosTab = () => (
    <FilhosTab offspring={cavalo?.offspring} />
  );

  // Renderizar aba de conquistas
  const renderConquistasTab = () => (
    <ConquistasTab achievements={cavalo?.achievements} />
  );

  // Renderizar tabs
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {[
        { key: 'info', label: 'Info', icon: 'info' },
        { key: 'genealogia', label: 'Genealogia', icon: 'users' },
        { key: 'filhos', label: 'Filhos', icon: 'heart' },
        { key: 'conquistas', label: 'Conquistas', icon: 'award' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.tabActive
          ]}
          onPress={() => setActiveTab(tab.key as any)}
        >
          <Feather 
            name={tab.icon as any} 
            size={16} 
            color={activeTab === tab.key ? Theme.colors.primary[600] : Theme.colors.neutral[500]} 
          />
          <Text style={[
            styles.tabText,
            activeTab === tab.key && styles.tabTextActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[600]} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary[600]} />
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!cavalo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[600]} />
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color={Theme.colors.error[500]} />
          <Text style={styles.errorTitle}>Cavalo não encontrado</Text>
          <Text style={styles.errorText}>
            Não foi possível carregar os detalhes deste cavalo.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[600]} />
      
      {/* Header com foto e informações principais */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
          ],
        }}
      >
        <LinearGradient
          colors={getGenderGradient(cavalo.gender)}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="more-horizontal" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              {cavalo.photos && cavalo.photos.length > 0 ? (
                <Image source={{ uri: cavalo.photos[0] }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Feather name="image" size={32} color="#ffffff" />
                </View>
              )}
              <View style={styles.avatarBadge}>
                <MaterialIcons 
                  name={getGenderIcon(cavalo.gender)} 
                  size={16} 
                  color="#ffffff" 
                />
              </View>
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.cavaloName}>{cavalo.name}</Text>
              <Text style={styles.cavaloRegistration}>
                {cavalo.registration ? `Registro: ${cavalo.registration}` : 'Sem registro'}
              </Text>
              
              <View style={styles.headerStats}>
                <View style={styles.headerStat}>
                  <Text style={styles.headerStatValue}>{calcularIdade(cavalo.birthDate)}</Text>
                  <Text style={styles.headerStatLabel}>anos</Text>
                </View>
                <View style={styles.headerStatDivider} />
                <View style={styles.headerStat}>
                  <Text style={styles.headerStatValue}>{cavalo.breed || 'N/A'}</Text>
                  <Text style={styles.headerStatLabel}>raça</Text>
                </View>
                <View style={styles.headerStatDivider} />
                <View style={styles.headerStat}>
                  <Text style={styles.headerStatValue}>{cavalo.color || 'N/A'}</Text>
                  <Text style={styles.headerStatLabel}>cor</Text>
                </View>
              </View>
              
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: getStatusColor(cavalo.status) + '30' }
                ]}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(cavalo.status) }
                  ]} />
                  <Text style={[
                    styles.statusText,
                    { color: '#ffffff' }
                  ]}>
                    {getStatusLabel(cavalo.status)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Tabs */}
      {renderTabs()}

      {/* Conteúdo das tabs */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'info' && renderInfoTab()}
        {activeTab === 'genealogia' && renderGenealogiaTab()}
        {activeTab === 'filhos' && renderFilhosTab()}
        {activeTab === 'conquistas' && renderConquistasTab()}
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
    paddingBottom: Theme.spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: Theme.spacing.md,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  headerInfo: {
    flex: 1,
  },
  cavaloName: {
    fontSize: Theme.typography.sizes['2xl'],
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cavaloRegistration: {
    fontSize: Theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Theme.spacing.sm,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.lg,
  },
  headerStat: {
    alignItems: 'center',
    flex: 1,
  },
  headerStatValue: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  headerStatLabel: {
    fontSize: Theme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: Theme.spacing.xs,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
  },
  
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Theme.colors.primary[600],
  },
  tabText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[500],
    marginLeft: 4,
    fontWeight: Theme.typography.weights.medium as any,
  },
  tabTextActive: {
    color: Theme.colors.primary[600],
    fontWeight: Theme.typography.weights.semibold as any,
  },
  
  // Conteúdo
  content: {
    flex: 1,
  },
  tabContent: {
    padding: Theme.spacing.lg,
  },
  
  // States
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  errorTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.error[600],
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  errorText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Theme.spacing.lg,
  },
  backButton: {
    backgroundColor: Theme.colors.primary[600],
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
  },
});

export default DetalheCavaloScreen;
