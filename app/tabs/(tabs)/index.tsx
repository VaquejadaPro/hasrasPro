import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import { useHaras } from '../../../hooks/useHaras';
import { cavaloService } from '../../modules/haras/services/cavaloService';
import Theme from '../../constants/Theme';

export default function Home() {
  const { user } = useAuth();
  const { selectedHaras, loading: harasLoading, error: harasError } = useHaras();
  const router = useRouter();
  const [cavalosStats, setCavalosStats] = useState({
    total: 0,
    disponiveis: 0,
    garanhoes: 0,
    doadoras: 0,
    receptoras: 0,
    potros: 0,
  });
  const [atividades, setAtividades] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Carregar atividades recentes
  useEffect(() => {
    const loadAtividades = async () => {
      if (selectedHaras?.id) {
        try {
          console.log('Carregando atividades recentes para haras:', selectedHaras.id);
          // Por enquanto, vamos simular com dados reais que seriam obtidos do backend
          // Quando o backend tiver endpoint de atividades, implementar aqui
          const atividadesSimuladas = [
            {
              id: '1',
              titulo: 'Cavalo adicionado ao haras',
              descricao: `Novo cavalo registrado no haras ${selectedHaras.name}`,
              tipo: 'cavalo',
              icone: 'plus-circle',
              cor: Theme.colors.success[600],
              tempo: 'Há 2 horas',
              data: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
              id: '2',
              titulo: 'Baia limpa e organizada',
              descricao: 'Limpeza realizada na baia 5',
              tipo: 'baia',
              icone: 'refresh-cw',
              cor: Theme.colors.primary[600],
              tempo: 'Há 4 horas',
              data: new Date(Date.now() - 4 * 60 * 60 * 1000)
            },
            {
              id: '3',
              titulo: 'Cavalo transferido para baia',
              descricao: 'Cavalo movido para baia disponível',
              tipo: 'movimentacao',
              icone: 'move',
              cor: Theme.colors.warning[600],
              tempo: 'Ontem',
              data: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          ];
          
          setAtividades(atividadesSimuladas);
        } catch (error) {
          console.error('Erro ao carregar atividades:', error);
          setAtividades([]);
        }
      }
    };

    loadAtividades();
  }, [selectedHaras?.id]);

  // Carregar estatísticas dos cavalos quando haras estiver disponível
  useEffect(() => {
    const loadCavalosStats = async () => {
      if (selectedHaras?.id) {
        try {
          setLoadingStats(true);
          console.log('Carregando estatísticas dos cavalos para haras:', selectedHaras.id);
          
          const stats = await cavaloService.getCavaloStats(selectedHaras.id);
          console.log('Estatísticas recebidas:', stats);
          
          setCavalosStats({
            total: stats.total || 0,
            disponiveis: stats.withoutStall || 0,
            garanhoes: stats.byGender?.male || 0,
            doadoras: stats.byGender?.female || 0,
            receptoras: stats.byGender?.gelding || 0,
            potros: stats.inactive || 0,
          });
        } catch (error) {
          console.error('Erro ao carregar estatísticas:', error);
          // Manter valores zerados em caso de erro
          setCavalosStats({
            total: 0,
            disponiveis: 0,
            garanhoes: 0,
            doadoras: 0,
            receptoras: 0,
            potros: 0,
          });
        } finally {
          setLoadingStats(false);
        }
      }
    };

    loadCavalosStats();
  }, [selectedHaras?.id]);

  // Mostrar loading enquanto carrega haras
  if (harasLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary[600]} />
        <Text style={styles.loadingText}>Carregando haras...</Text>
      </View>
    );
  }

  // Mostrar erro se não conseguir carregar haras
  if (harasError || !selectedHaras) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={48} color={Theme.colors.error[500]} />
        <Text style={styles.errorTitle}>Erro ao carregar haras</Text>
        <Text style={styles.errorText}>
          {harasError || 'Nenhum haras encontrado para este usuário'}
        </Text>
      </View>
    );
  }

  const stats = [
    { title: 'Total de Cavalos', value: cavalosStats.total.toString(), icon: 'activity', color: Theme.colors.primary[600] },
    { title: 'Cavalos Sem Baia', value: cavalosStats.disponiveis.toString(), icon: 'check-circle', color: Theme.colors.success[600] },
    { title: 'Machos', value: cavalosStats.garanhoes.toString(), icon: 'star', color: Theme.colors.warning[600] },
    { title: 'Fêmeas', value: cavalosStats.doadoras.toString(), icon: 'heart', color: Theme.colors.primary[500] },
  ];

  const quickActions = [
    { 
      title: 'Todos os Cavalos', 
      icon: 'users', 
      color: '#8b5cf6',
      action: () => router.push('/tabs/cavalos')
    },
    { 
      title: 'Estoque', 
      icon: 'package', 
      color: '#f97316',
      action: () => router.push('/tabs/estoque')
    },
    { 
      title: 'Cavalos Disponíveis', 
      icon: 'check-circle', 
      color: '#10b981',
      action: () => router.push('/tabs/cavalos-disponiveis')
    },
    { 
      title: 'Nova Cobertura', 
      icon: 'plus-circle', 
      color: Theme.colors.success[600],
      action: () => router.push('/tabs/reproducao?tela=manejo')
    },
    { 
      title: 'Ver Relatórios', 
      icon: 'bar-chart-2', 
      color: Theme.colors.primary[500],
      action: () => router.push('/tabs/reproducao?tela=estatisticas')
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bem-vindo,</Text>
            <Text style={styles.userName}>{user?.email || 'Usuário'}</Text>
            <Text style={styles.harasName}>{selectedHaras.name}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Feather name="bell" size={24} color={Theme.colors.primary[600]} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Resumo do Haras</Text>
          {loadingStats ? (
            <View style={styles.statsLoadingContainer}>
              <ActivityIndicator size="small" color={Theme.colors.primary[600]} />
              <Text style={styles.statsLoadingText}>Carregando estatísticas...</Text>
            </View>
          ) : (
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <TouchableOpacity key={index} style={styles.statCard}>
                  <LinearGradient
                    colors={[stat.color + '20', stat.color + '05']}
                    style={styles.statCardGradient}
                  >
                    <View style={styles.statCardContent}>
                      <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                        <Feather name={stat.icon as any} size={20} color={stat.color} />
                      </View>
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={styles.statTitle}>{stat.title}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.actionCard}
                onPress={action.action}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Feather name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Atividades Recentes</Text>
          <View style={styles.activityCard}>
            {atividades.length > 0 ? (
              atividades.map((atividade, index) => (
                <View key={atividade.id} style={[
                  styles.activityItem,
                  index === atividades.length - 1 && { borderBottomWidth: 0 }
                ]}>
                  <View style={styles.activityIcon}>
                    <Feather name={atividade.icone as any} size={16} color={atividade.cor} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{atividade.titulo}</Text>
                    <Text style={styles.activityDescription}>{atividade.descricao}</Text>
                    <Text style={styles.activityTime}>{atividade.tempo}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyActivity}>
                <Feather name="clock" size={32} color={Theme.colors.neutral[400]} />
                <Text style={styles.emptyActivityText}>Nenhuma atividade recente</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.primary[50],
  },
  welcomeText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[600],
    fontWeight: Theme.typography.weights.normal as any,
  },
  userName: {
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.primary[700],
    fontWeight: Theme.typography.weights.bold as any,
    marginTop: 2,
  },
  harasName: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary[600],
    fontWeight: Theme.typography.weights.medium as any,
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.primary[700],
    marginBottom: Theme.spacing.md,
  },
  statsContainer: {
    padding: Theme.spacing.lg,
  },
  statsLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  statsLoadingText: {
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    fontWeight: Theme.typography.weights.medium as any,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  statCardGradient: {
    padding: Theme.spacing.md,
  },
  statCardContent: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  statValue: {
    fontSize: Theme.typography.sizes['2xl'],
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[700],
    marginBottom: 4,
  },
  statTitle: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    textAlign: 'center',
    fontWeight: Theme.typography.weights.medium as any,
  },
  actionsContainer: {
    padding: Theme.spacing.lg,
    paddingTop: 0,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: Theme.colors.primary[50],
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  actionTitle: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary[700],
    textAlign: 'center',
    fontWeight: Theme.typography.weights.medium as any,
  },
  activityContainer: {
    padding: Theme.spacing.lg,
    paddingTop: 0,
  },
  activityCard: {
    backgroundColor: Theme.colors.primary[50],
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary[700],
    fontWeight: Theme.typography.weights.medium as any,
  },
  activityDescription: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[600],
    marginTop: 2,
  },
  activityTime: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[500],
    marginTop: 2,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  emptyActivityText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[500],
    marginTop: Theme.spacing.sm,
    fontWeight: Theme.typography.weights.medium as any,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.neutral[50],
  },
  loadingText: {
    marginTop: Theme.spacing.md,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[600],
    fontWeight: Theme.typography.weights.medium as any,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.neutral[50],
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
  },
});
