import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { veterinaryService, VeterinaryStock, VeterinaryAlert } from '../services/veterinaryService';
import Theme from '@/constants/Theme';

const EstoqueVeterinarioScreen: React.FC = () => {
  const router = useRouter();
  
  const [stocks, setStocks] = useState<VeterinaryStock[]>([]);
  const [alerts, setAlerts] = useState<VeterinaryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'expired' | 'prescription'>('all');

  // Simular harasId (em produção viria do contexto/params)
  const harasId = '4NDSBXQtOPeYWfROrVfm';

  // Carregar dados
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando dados do estoque veterinário para haras:', harasId);
      
      const [stocksData, alertsData] = await Promise.all([
        veterinaryService.getVeterinaryStocksByHaras(harasId),
        veterinaryService.getLowStockAlerts(harasId)
      ]);

      console.log('✅ Dados do estoque veterinário carregados:', stocksData.length, 'itens');
      console.log('✅ Alertas veterinários carregados:', alertsData.length, 'alertas');

      setStocks(stocksData);
      setAlerts(alertsData.filter((alert: VeterinaryAlert) => !alert.isResolved));
    } catch (error) {
      console.error('❌ Erro ao carregar dados do estoque veterinário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do estoque veterinário.');
    } finally {
      setLoading(false);
    }
  }, [harasId]);

  // Refresh dos dados
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtrar stocks por busca e tipo
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterType) {
      case 'low':
        return stock.currentQuantity <= stock.minimumThreshold;
      case 'expired':
        return stock.expirationDate && new Date(stock.expirationDate) < new Date();
      case 'prescription':
        return stock.medicine.prescriptionRequired;
      default:
        return true;
    }
  });

  // Obter cor do status do medicamento
  const getStockStatusColor = (stock: VeterinaryStock) => {
    const isExpired = new Date(stock.expirationDate) < new Date();
    const isLowStock = stock.currentQuantity <= stock.minimumThreshold;
    const isExpiringSoon = new Date(stock.expirationDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (isExpired) return Theme.colors.error[500];
    if (isLowStock) return Theme.colors.warning[500];
    if (isExpiringSoon) return Theme.colors.blue[500];
    return Theme.colors.success[500];
  };

  // Obter ícone do tipo de medicamento
  const getMedicineTypeIcon = (type: string) => {
    switch (type) {
      case 'antibiotic': return 'shield';
      case 'anti-inflammatory': return 'heart';
      case 'vaccine': return 'shield-check';
      case 'supplement': return 'plus-circle';
      default: return 'package';
    }
  };

  // Renderizar card de estoque
  const renderStockCard = (stock: VeterinaryStock, index: number) => {
    const statusColor = getStockStatusColor(stock);
    const typeIcon = getMedicineTypeIcon(stock.medicine.type);
    const isExpired = new Date(stock.expirationDate) < new Date();
    const isLowStock = stock.currentQuantity <= stock.minimumThreshold;

    return (
      <TouchableOpacity
        key={stock.id}
        style={styles.stockCard}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#ffffff', Theme.colors.neutral[50]]}
          style={styles.stockCardGradient}
        >
          {/* Header do card */}
          <View style={styles.stockCardHeader}>
            <View style={styles.medicineInfo}>
              <View style={styles.medicineIconContainer}>
                <Feather name={typeIcon as any} size={20} color={statusColor} />
              </View>
              <View style={styles.medicineDetails}>
                <Text style={styles.medicineName}>{stock.medicine.name}</Text>
                <Text style={styles.medicineManufacturer}>{stock.medicine.manufacturer}</Text>
                <Text style={styles.batchNumber}>Lote: {stock.batchNumber}</Text>
              </View>
            </View>
            
            {stock.medicine.prescriptionRequired && (
              <View style={styles.prescriptionBadge}>
                <Feather name="file-text" size={12} color={Theme.colors.warning[500]} />
                <Text style={styles.prescriptionText}>Receita</Text>
              </View>
            )}
          </View>

          {/* Informações de quantidade */}
          <View style={styles.quantitySection}>
            <View style={styles.quantityItem}>
              <Text style={styles.quantityLabel}>Atual</Text>
              <Text style={[styles.quantityValue, { color: statusColor }]}>
                {stock.currentQuantity}
              </Text>
            </View>
            <View style={styles.quantityItem}>
              <Text style={styles.quantityLabel}>Mínimo</Text>
              <Text style={styles.quantityValue}>{stock.minimumThreshold}</Text>
            </View>
            <View style={styles.quantityItem}>
              <Text style={styles.quantityLabel}>Valor Unit.</Text>
              <Text style={styles.quantityValue}>R$ {stock.unitCost.toFixed(2)}</Text>
            </View>
          </View>

          {/* Informações de validade e localização */}
          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Feather name="calendar" size={16} color={Theme.colors.neutral[500]} />
              <Text style={[styles.infoText, isExpired && { color: Theme.colors.error[500] }]}>
                Validade: {new Date(stock.expirationDate).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoText}>Local: {stock.storageLocation}</Text>
            </View>
          </View>

          {/* Alertas */}
          {(isLowStock || isExpired) && (
            <View style={styles.alertSection}>
              {isExpired && (
                <View style={[styles.alertBadge, { backgroundColor: Theme.colors.error[100] }]}>
                  <Feather name="alert-triangle" size={14} color={Theme.colors.error[500]} />
                  <Text style={[styles.alertText, { color: Theme.colors.error[500] }]}>
                    Vencido
                  </Text>
                </View>
              )}
              {isLowStock && !isExpired && (
                <View style={[styles.alertBadge, { backgroundColor: Theme.colors.warning[100] }]}>
                  <Feather name="alert-circle" size={14} color={Theme.colors.warning[500]} />
                  <Text style={[styles.alertText, { color: Theme.colors.warning[500] }]}>
                    Estoque baixo
                  </Text>
                </View>
              )}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Renderizar card de alerta
  const renderAlertCard = (alert: VeterinaryAlert, index: number) => {
    const getAlertColor = () => {
      switch (alert.severity) {
        case 'critical': return Theme.colors.error[500];
        case 'high': return Theme.colors.warning[500];
        case 'medium': return Theme.colors.primary[500];
        default: return Theme.colors.neutral[400];
      }
    };

    return (
      <View key={alert.id} style={[styles.alertCard, { borderLeftColor: getAlertColor() }]}>
        <View style={styles.alertContent}>
          <Feather name="alert-triangle" size={20} color={getAlertColor()} />
          <View style={styles.alertTextContainer}>
            <Text style={styles.alertMessage}>{alert.message}</Text>
            <Text style={styles.alertDate}>
              {new Date(alert.createdAt).toLocaleString('pt-BR')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando estoque veterinário...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <LinearGradient
        colors={[Theme.colors.primary[600], Theme.colors.primary[800]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Estoque Veterinário</Text>
            <Text style={styles.headerSubtitle}>
              {filteredStocks.length} medicamentos • {alerts.length} alertas
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/tabs/(tabs)/estoque')}
          >
            <Feather name="package" size={20} color="#ffffff" />
            <Text style={styles.headerButtonText}>Ração</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Busca e filtros */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={Theme.colors.neutral[500]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar medicamentos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Theme.colors.neutral[500]}
          />
        </View>
      </View>

      {/* Filtros */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {[
          { key: 'all', label: 'Todos' },
          { key: 'low', label: 'Estoque Baixo' },
          { key: 'expired', label: 'Vencidos' },
          { key: 'prescription', label: 'Receita Obrigatória' },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              filterType === filter.key && styles.filterButtonActive
            ]}
            onPress={() => setFilterType(filter.key as any)}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === filter.key && styles.filterButtonTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Conteúdo principal */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Alertas */}
        {alerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="alert-triangle" size={20} color={Theme.colors.warning[500]} />
              <Text style={styles.sectionTitle}>Alertas Ativos</Text>
            </View>
            {alerts.map(renderAlertCard)}
          </View>
        )}

        {/* Lista de medicamentos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="package" size={20} color={Theme.colors.primary[600]} />
            <Text style={styles.sectionTitle}>
              Medicamentos {filterType !== 'all' && `(${filteredStocks.length})`}
            </Text>
          </View>
          
          {filteredStocks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="package" size={48} color={Theme.colors.neutral[400]} />
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhum medicamento encontrado' : 'Nenhum medicamento cadastrado'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Tente ajustar os filtros de busca' : 'Adicione medicamentos ao estoque'}
              </Text>
            </View>
          ) : (
            filteredStocks.map(renderStockCard)
          )}
        </View>
      </ScrollView>

      {/* Botão de adicionar */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <LinearGradient
          colors={[Theme.colors.primary[600], Theme.colors.primary[800]]}
          style={styles.fabGradient}
        >
          <Feather name="plus" size={24} color="#ffffff" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Theme.colors.neutral[600],
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 16,
  },
  headerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Theme.colors.neutral[800],
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  filtersContent: {
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
  },
  filterButtonActive: {
    backgroundColor: Theme.colors.primary[600],
    borderColor: Theme.colors.primary[600],
  },
  filterButtonText: {
    fontSize: 14,
    color: Theme.colors.neutral[600],
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.neutral[800],
    marginLeft: 8,
  },
  stockCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stockCardGradient: {
    padding: 16,
  },
  stockCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  medicineInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  medicineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.neutral[800],
    marginBottom: 2,
  },
  medicineManufacturer: {
    fontSize: 14,
    color: Theme.colors.neutral[600],
    marginBottom: 2,
  },
  batchNumber: {
    fontSize: 12,
    color: Theme.colors.neutral[500],
  },
  prescriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.warning[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  prescriptionText: {
    fontSize: 10,
    fontWeight: '500',
    color: Theme.colors.warning[600],
    marginLeft: 4,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quantityItem: {
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 12,
    color: Theme.colors.neutral[600],
    marginBottom: 4,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.neutral[800],
  },
  additionalInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Theme.colors.neutral[600],
    marginLeft: 8,
  },
  alertSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  alertMessage: {
    fontSize: 14,
    color: Theme.colors.neutral[800],
    fontWeight: '500',
    marginBottom: 4,
  },
  alertDate: {
    fontSize: 12,
    color: Theme.colors.neutral[500],
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: Theme.colors.neutral[600],
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Theme.colors.neutral[500],
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EstoqueVeterinarioScreen;
