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
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { cavaloService, Cavalo } from '../services/cavaloService';
import Theme from '../../../constants/Theme';

const { width, height } = Dimensions.get('window');

const DetalheCavaloScreen: React.FC = () => {
  const router = useRouter();
  const { cavaloId } = useLocalSearchParams<{ cavaloId: string }>();
  
  const [cavalo, setCavalo] = useState<Cavalo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'genealogia' | 'filhos' | 'conquistas'>('info');

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
        return status;
    }
  };

  // Copiar microchip para área de transferência
  const copyMicrochip = () => {
    // TODO: Implementar copy to clipboard
    Alert.alert('Copiado!', 'Microchip copiado para a área de transferência');
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
      <View style={styles.quickStatsContainer}>
        <View style={styles.quickStatCard}>
          <LinearGradient
            colors={[Theme.colors.primary[500], Theme.colors.primary[600]]}
            style={styles.quickStatGradient}
          >
            <Feather name="calendar" size={24} color="#ffffff" />
            <Text style={styles.quickStatValue}>
              {cavalo ? calcularIdade(cavalo.birthDate) : 0}
            </Text>
            <Text style={styles.quickStatLabel}>Anos</Text>
          </LinearGradient>
        </View>

        <View style={styles.quickStatCard}>
          <LinearGradient
            colors={[Theme.colors.success[500], Theme.colors.success[600]]}
            style={styles.quickStatGradient}
          >
            <MaterialIcons 
              name={getGenderIcon(cavalo?.gender || '')} 
              size={24} 
              color="#ffffff" 
            />
            <Text style={styles.quickStatValue}>
              {cavalo?.gender === 'male' ? 'M' : 
               cavalo?.gender === 'female' ? 'F' : 'C'}
            </Text>
            <Text style={styles.quickStatLabel}>Gênero</Text>
          </LinearGradient>
        </View>

        <View style={styles.quickStatCard}>
          <LinearGradient
            colors={[Theme.colors.warning[500], Theme.colors.warning[600]]}
            style={styles.quickStatGradient}
          >
            <Feather name="activity" size={24} color="#ffffff" />
            <Text style={styles.quickStatValue}>
              {getStatusLabel(cavalo?.status || '').charAt(0)}
            </Text>
            <Text style={styles.quickStatLabel}>Status</Text>
          </LinearGradient>
        </View>

        <View style={styles.quickStatCard}>
          <LinearGradient
            colors={[Theme.colors.error[500], Theme.colors.error[600]]}
            style={styles.quickStatGradient}
          >
            <Feather name="heart" size={24} color="#ffffff" />
            <Text style={styles.quickStatValue}>
              {cavalo?.offspring?.length || 0}
            </Text>
            <Text style={styles.quickStatLabel}>Filhos</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Informações Básicas com Design Premium */}
      <View style={styles.premiumCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.cardIcon}>
              <Feather name="info" size={20} color={Theme.colors.primary[600]} />
            </View>
            <Text style={styles.cardTitle}>Informações Básicas</Text>
          </View>
          <View style={styles.genderBadge}>
            <MaterialIcons 
              name={getGenderIcon(cavalo?.gender || '')} 
              size={16} 
              color={getGenderGradient(cavalo?.gender || '')[0]} 
            />
            <Text style={[styles.genderBadgeText, { color: getGenderGradient(cavalo?.gender || '')[0] }]}>
              {cavalo?.gender === 'male' ? 'Macho' : 
               cavalo?.gender === 'female' ? 'Fêmea' : 'Castrado'}
            </Text>
          </View>
        </View>

        <View style={styles.infoGridPremium}>
          <View style={styles.infoItemPremium}>
            <View style={styles.infoIconContainer}>
              <Feather name="bookmark" size={16} color={Theme.colors.primary[600]} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabelPremium}>Raça</Text>
              <Text style={styles.infoValuePremium}>{cavalo?.breed || 'Não informado'}</Text>
            </View>
          </View>

          <View style={styles.infoItemPremium}>
            <View style={styles.infoIconContainer}>
              <Feather name="eye" size={16} color={Theme.colors.success[600]} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabelPremium}>Cor</Text>
              <Text style={styles.infoValuePremium}>{cavalo?.color || 'Não informado'}</Text>
            </View>
          </View>

          {cavalo?.weight && (
            <View style={styles.infoItemPremium}>
              <View style={styles.infoIconContainer}>
                <Feather name="trending-up" size={16} color={Theme.colors.warning[600]} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabelPremium}>Peso</Text>
                <Text style={styles.infoValuePremium}>{cavalo.weight} kg</Text>
              </View>
            </View>
          )}

          {cavalo?.height && (
            <View style={styles.infoItemPremium}>
              <View style={styles.infoIconContainer}>
                <Feather name="bar-chart-2" size={16} color={Theme.colors.error[600]} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabelPremium}>Altura</Text>
                <Text style={styles.infoValuePremium}>{cavalo.height} cm</Text>
              </View>
            </View>
          )}
        </View>

        {/* Microchip destacado */}
        {cavalo?.microchip && (
          <TouchableOpacity 
            style={styles.microchipContainer}
            onPress={copyMicrochip}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[Theme.colors.neutral[100], Theme.colors.neutral[200]]}
              style={styles.microchipGradient}
            >
              <View style={styles.microchipLeft}>
                <Feather name="cpu" size={20} color={Theme.colors.primary[600]} />
                <View style={styles.microchipTextContainer}>
                  <Text style={styles.microchipLabel}>Microchip</Text>
                  <Text style={styles.microchipValue}>{cavalo.microchip}</Text>
                </View>
              </View>
              <Feather name="copy" size={16} color={Theme.colors.neutral[500]} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Timeline Visual de Datas */}
      <View style={styles.premiumCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.cardIcon}>
              <Feather name="clock" size={20} color={Theme.colors.success[600]} />
            </View>
            <Text style={styles.cardTitle}>Timeline</Text>
          </View>
        </View>

        <View style={styles.timelineContainer}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot}>
              <Feather name="gift" size={12} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Nascimento</Text>
              <Text style={styles.timelineDate}>
                {cavalo ? formatarData(cavalo.birthDate) : ''}
              </Text>
            </View>
          </View>

          {cavalo?.acquisitionDate && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: Theme.colors.primary[600] }]}>
                <Feather name="home" size={12} color="#ffffff" />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Aquisição</Text>
                <Text style={styles.timelineDate}>
                  {formatarData(cavalo.acquisitionDate)}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: Theme.colors.warning[600] }]}>
              <Feather name="edit" size={12} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Cadastro</Text>
              <Text style={styles.timelineDate}>
                {cavalo ? formatarData(cavalo.createdAt) : ''}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Seção Financeira Premium */}
      {(cavalo?.acquisitionValue || cavalo?.currentValue) && (
        <View style={styles.premiumCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardIcon}>
                <Feather name="dollar-sign" size={20} color={Theme.colors.warning[600]} />
              </View>
              <Text style={styles.cardTitle}>Valores</Text>
            </View>
          </View>

          <View style={styles.financialGrid}>
            {cavalo?.acquisitionValue && (
              <View style={styles.financialCard}>
                <View style={styles.financialHeader}>
                  <Feather name="shopping-cart" size={16} color={Theme.colors.primary[600]} />
                  <Text style={styles.financialLabel}>Aquisição</Text>
                </View>
                <Text style={styles.financialValue}>
                  R$ {cavalo.acquisitionValue.toLocaleString('pt-BR')}
                </Text>
              </View>
            )}

            {cavalo?.currentValue && (
              <View style={styles.financialCard}>
                <View style={styles.financialHeader}>
                  <Feather name="trending-up" size={16} color={Theme.colors.success[600]} />
                  <Text style={styles.financialLabel}>Atual</Text>
                </View>
                <Text style={styles.financialValue}>
                  R$ {cavalo.currentValue.toLocaleString('pt-BR')}
                </Text>
              </View>
            )}
          </View>

          {/* Indicador de valorização */}
          {cavalo?.acquisitionValue && cavalo?.currentValue && (
            <View style={styles.appreciationContainer}>
              <View style={styles.appreciationIcon}>
                <Feather 
                  name={cavalo.currentValue > cavalo.acquisitionValue ? "trending-up" : "trending-down"} 
                  size={16} 
                  color={cavalo.currentValue > cavalo.acquisitionValue ? Theme.colors.success[600] : Theme.colors.error[600]} 
                />
              </View>
              <Text style={[
                styles.appreciationText,
                { color: cavalo.currentValue > cavalo.acquisitionValue ? Theme.colors.success[600] : Theme.colors.error[600] }
              ]}>
                {cavalo.currentValue > cavalo.acquisitionValue ? '+' : ''}
                {(((cavalo.currentValue - cavalo.acquisitionValue) / cavalo.acquisitionValue) * 100).toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Observações Premium */}
      {cavalo?.notes && (
        <View style={styles.premiumCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardIcon}>
                <Feather name="file-text" size={20} color={Theme.colors.neutral[600]} />
              </View>
              <Text style={styles.cardTitle}>Observações</Text>
            </View>
          </View>
          
          <View style={styles.notesContainer}>
            <Text style={styles.notesTextPremium}>{cavalo.notes}</Text>
          </View>
        </View>
      )}
    </View>
  );

  // Renderizar aba de genealogia
  const renderGenealogiaTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Árvore Genealógica</Text>
        
        {cavalo?.father && (
          <View style={styles.genealogiaItem}>
            <View style={styles.genealogiaHeader}>
              <Feather name="user" size={20} color={Theme.colors.primary[600]} />
              <Text style={styles.genealogiaTitle}>Pai</Text>
            </View>
            <Text style={styles.genealogiaName}>{cavalo.father.name}</Text>
            <Text style={styles.genealogiaRegistration}>
              Registro: {cavalo.father.registration}
            </Text>
          </View>
        )}

        {cavalo?.mother && (
          <View style={styles.genealogiaItem}>
            <View style={styles.genealogiaHeader}>
              <Feather name="user" size={20} color={Theme.colors.success[600]} />
              <Text style={styles.genealogiaTitle}>Mãe</Text>
            </View>
            <Text style={styles.genealogiaName}>{cavalo.mother.name}</Text>
            <Text style={styles.genealogiaRegistration}>
              Registro: {cavalo.mother.registration}
            </Text>
          </View>
        )}

        {!cavalo?.father && !cavalo?.mother && (
          <View style={styles.emptyState}>
            <Feather name="users" size={48} color={Theme.colors.neutral[400]} />
            <Text style={styles.emptyText}>Informações genealógicas não disponíveis</Text>
          </View>
        )}
      </View>
    </View>
  );

  // Renderizar aba de filhos
  const renderFilhosTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          Descendentes ({cavalo?.offspring?.length || 0})
        </Text>
        
        {cavalo?.offspring && cavalo.offspring.length > 0 ? (
          cavalo.offspring.map((filho, index) => (
            <View key={index} style={styles.filhoItem}>
              <View style={styles.filhoHeader}>
                <Text style={styles.filhoName}>{filho.name}</Text>
                <Text style={styles.filhoRegistration}>{filho.registration}</Text>
              </View>
              <Text style={styles.filhoDate}>
                Nascimento: {formatarData(filho.birthDate)}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="heart" size={48} color={Theme.colors.neutral[400]} />
            <Text style={styles.emptyText}>Nenhum descendente registrado</Text>
          </View>
        )}
      </View>
    </View>
  );

  // Renderizar aba de conquistas
  const renderConquistasTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          Conquistas ({cavalo?.achievements?.length || 0})
        </Text>
        
        {cavalo?.achievements && cavalo.achievements.length > 0 ? (
          cavalo.achievements.map((conquista, index) => (
            <View key={index} style={styles.conquistaItem}>
              <View style={styles.conquistaIcon}>
                <Feather name="award" size={20} color={Theme.colors.warning[600]} />
              </View>
              <Text style={styles.conquistaText}>{conquista}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="award" size={48} color={Theme.colors.neutral[400]} />
            <Text style={styles.emptyText}>Nenhuma conquista registrada</Text>
          </View>
        )}
      </View>
    </View>
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
      <LinearGradient
        colors={getGenderGradient(cavalo.gender)}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="edit-3" size={24} color="#ffffff" />
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
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.cavaloName}>{cavalo.name}</Text>
            <Text style={styles.cavaloRegistration}>
              Registro: {cavalo.registration || 'Não informado'}
            </Text>
            
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(cavalo.status) + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(cavalo.status) }
                ]}>
                  {getStatusLabel(cavalo.status)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

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
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  cavaloName: {
    fontSize: Theme.typography.sizes['2xl'],
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
    marginBottom: 4,
  },
  cavaloRegistration: {
    fontSize: Theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Theme.spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
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

  // Quick Stats Premium
  quickStatsContainer: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.lg,
    marginHorizontal: -Theme.spacing.xs,
  },
  quickStatCard: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  quickStatGradient: {
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  quickStatValue: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
    marginTop: 4,
  },
  quickStatLabel: {
    fontSize: Theme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: Theme.typography.weights.medium as any,
    marginTop: 2,
  },

  // Premium Cards
  premiumCard: {
    backgroundColor: '#ffffff',
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  cardTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
  },
  genderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.neutral[100],
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
  },
  genderBadgeText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    marginLeft: 4,
  },

  // Info Grid Premium
  infoGridPremium: {
    marginBottom: Theme.spacing.md,
  },
  infoItemPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[100],
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabelPremium: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    fontWeight: Theme.typography.weights.medium as any,
    marginBottom: 2,
  },
  infoValuePremium: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[800],
    fontWeight: Theme.typography.weights.semibold as any,
  },

  // Microchip Premium
  microchipContainer: {
    marginTop: Theme.spacing.md,
  },
  microchipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  microchipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  microchipTextContainer: {
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  microchipLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    fontWeight: Theme.typography.weights.medium as any,
    marginBottom: 2,
  },
  microchipValue: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[800],
    fontWeight: Theme.typography.weights.bold as any,
    fontFamily: 'monospace',
  },

  // Timeline Premium
  timelineContainer: {
    paddingLeft: Theme.spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    position: 'relative',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.success[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    zIndex: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[800],
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },

  // Financial Premium
  financialGrid: {
    flexDirection: 'row',
    marginHorizontal: -Theme.spacing.xs,
    marginBottom: Theme.spacing.md,
  },
  financialCard: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    marginHorizontal: Theme.spacing.xs,
  },
  financialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  financialLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    fontWeight: Theme.typography.weights.medium as any,
    marginLeft: Theme.spacing.xs,
  },
  financialValue: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
  },
  appreciationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.neutral[50],
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
  },
  appreciationIcon: {
    marginRight: Theme.spacing.xs,
  },
  appreciationText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
  },

  // Notes Premium
  notesContainer: {
    backgroundColor: Theme.colors.neutral[50],
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  notesTextPremium: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[700],
    lineHeight: 24,
    fontStyle: 'italic',
  },

  // Legacy styles (manter compatibilidade)
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
    marginBottom: Theme.spacing.md,
  },
  
  // Genealogia
  genealogiaItem: {
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  genealogiaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  genealogiaTitle: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[700],
    marginLeft: Theme.spacing.sm,
  },
  genealogiaName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
    marginBottom: 4,
  },
  genealogiaRegistration: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },
  
  // Filhos
  filhoItem: {
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  filhoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  filhoName: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[800],
    flex: 1,
  },
  filhoRegistration: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary[600],
    fontWeight: Theme.typography.weights.medium as any,
  },
  filhoDate: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },
  
  // Conquistas
  conquistaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  conquistaIcon: {
    marginRight: Theme.spacing.md,
  },
  conquistaText: {
    flex: 1,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[800],
    fontWeight: Theme.typography.weights.medium as any,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  emptyText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[500],
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
});

export default DetalheCavaloScreen;
