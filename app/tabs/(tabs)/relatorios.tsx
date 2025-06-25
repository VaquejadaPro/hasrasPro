import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../constants/Theme';

export default function Relatorios() {
  const relatorios = [
    {
      id: 1,
      title: 'Relatório de Reprodução',
      description: 'Coberturas, nascimentos e estatísticas reprodutivas',
      icon: 'heart',
      color: Theme.colors.success[600],
    },
    {
      id: 2,
      title: 'Relatório de Baias',
      description: 'Ocupação, disponibilidade e manutenção das baias',
      icon: 'grid',
      color: Theme.colors.primary[600],
    },
    {
      id: 3,
      title: 'Relatório Financeiro',
      description: 'Custos, receitas e análise financeira',
      icon: 'dollar-sign',
      color: Theme.colors.warning[600],
    },
    {
      id: 4,
      title: 'Relatório Veterinário',
      description: 'Saúde dos animais, vacinas e tratamentos',
      icon: 'activity',
      color: Theme.colors.error[600],
    },
    {
      id: 5,
      title: 'Relatório de Genealogia',
      description: 'Linhagem e histórico dos cavalos',
      icon: 'users',
      color: Theme.colors.primary[500],
    },
    {
      id: 6,
      title: 'Relatório de Performance',
      description: 'Desempenho geral do haras',
      icon: 'trending-up',
      color: Theme.colors.success[500],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatórios</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={24} color={Theme.colors.primary[50]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relatórios Disponíveis</Text>
          <Text style={styles.sectionDescription}>
            Selecione um relatório para visualizar ou exportar
          </Text>
        </View>

        <View style={styles.relatoriosContainer}>
          {relatorios.map((relatorio) => (
            <TouchableOpacity key={relatorio.id} style={styles.relatorioCard}>
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: relatorio.color + '20' }]}>
                  <Feather name={relatorio.icon as any} size={24} color={relatorio.color} />
                </View>
                <View style={styles.textContent}>
                  <Text style={styles.relatorioTitle}>{relatorio.title}</Text>
                  <Text style={styles.relatorioDescription}>{relatorio.description}</Text>
                </View>
                <View style={styles.actionContainer}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="download" size={16} color={Theme.colors.primary[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="eye" size={16} color={Theme.colors.primary[600]} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickStatsContainer}>
          <Text style={styles.sectionTitle}>Resumo Rápido</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Total Cavalos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statLabel}>Prenhas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>Baias Ocupadas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Nascimentos/Mês</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.primary[600],
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[50],
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary[50],
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.primary[700],
    marginBottom: Theme.spacing.sm,
  },
  sectionDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },
  relatoriosContainer: {
    padding: Theme.spacing.lg,
  },
  relatorioCard: {
    backgroundColor: Theme.colors.primary[50],
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  textContent: {
    flex: 1,
  },
  relatorioTitle: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.primary[700],
    marginBottom: 4,
  },
  relatorioDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },
  actionContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Theme.spacing.sm,
  },
  quickStatsContainer: {
    padding: Theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: Theme.colors.primary[50],
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  statValue: {
    fontSize: Theme.typography.sizes['2xl'],
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[700],
  },
  statLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginTop: 4,
    textAlign: 'center',
  },
});
