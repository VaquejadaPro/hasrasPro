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
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { stockService } from '../services/stockService';
import { veterinaryService } from '../services/veterinaryService';
import { FeedStock, StockAlert } from '../types/stock';
import { Medicine, VeterinaryStock, VeterinaryAlert } from '../types/veterinary';
import { StockCard, StockAlertCard } from '../components/stock';
import Theme from '@/constants/Theme';

const EstoqueScreen: React.FC = () => {
  const router = useRouter();
  
  // Estado para aba ativa
  const [activeTab, setActiveTab] = useState<'racao' | 'farmacia'>('racao');
  
  // Estados para ração
  const [stocks, setStocks] = useState<FeedStock[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  
  // Estados para farmácia
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [veterinaryStocks, setVeterinaryStocks] = useState<VeterinaryStock[]>([]);
  const [veterinaryAlerts, setVeterinaryAlerts] = useState<VeterinaryAlert[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'expired'>('all');

  // Estados para modais de entrada
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantityModalType, setQuantityModalType] = useState<'consume' | 'restock'>('consume');
  const [selectedStock, setSelectedStock] = useState<FeedStock | null>(null);
  const [quantityInput, setQuantityInput] = useState('');

  // Simular harasId (em produção viria do contexto/params)
  const harasId = '4NDSBXQtOPeYWfROrVfm';

  // Carregar dados
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando dados do estoque para haras:', harasId);
      
      const [stocksData, alertsData] = await Promise.all([
        stockService.getStockByHaras(harasId),
        stockService.getStockAlerts(harasId)
      ]);

      console.log('✅ Dados do estoque carregados:', stocksData.length, 'itens');
      console.log('✅ Alertas carregados:', alertsData.length, 'alertas');

      setStocks(stocksData);
      setAlerts(alertsData.filter((alert: StockAlert) => !alert.isResolved));
    } catch (error: any) {
      console.error('❌ Erro ao carregar dados do estoque:', error);
      
      const isApiError = error.message?.includes('API Backend não encontrada') || 
                        error.response?.status === 404;
      
      Alert.alert(
        isApiError ? 'Backend Não Encontrado' : 'Erro de Conexão',
        isApiError 
          ? 'O servidor backend não está rodando na porta 3000.\n\nConsulte o arquivo CONFIGURACAO_BACKEND.md para instruções de como configurar o backend.'
          : 'Não foi possível carregar os dados do estoque. Verifique sua conexão e tente novamente.'
      );
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
    const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterType) {
      case 'low':
        return stock.currentQuantity <= stock.minimumThreshold;
      case 'expired':
        return stock.expirationDate && new Date(stock.expirationDate) < new Date();
      default:
        return true;
    }
  });

  // Consumir estoque
  const handleConsumeStock = (stock: FeedStock) => {
    setSelectedStock(stock);
    setQuantityModalType('consume');
    setQuantityInput('');
    setShowQuantityModal(true);
  };

  // Reabastecer estoque
  const handleRestockItem = (stock: FeedStock) => {
    setSelectedStock(stock);
    setQuantityModalType('restock');
    setQuantityInput('');
    setShowQuantityModal(true);
  };

  // Confirmar quantidade
  const handleConfirmQuantity = async () => {
    if (!selectedStock || !quantityInput || isNaN(Number(quantityInput))) {
      Alert.alert('Erro', 'Digite uma quantidade válida.');
      return;
    }

    try {
      const quantity = Number(quantityInput);
      
      if (quantityModalType === 'consume') {
        // Registrar consumo via movimento de saída
        await stockService.criarMovimentacao(harasId, {
          stockId: selectedStock.id,
          type: 'out',
          quantity: quantity,
          reason: 'Consumo diário',
          notes: 'Consumo registrado pelo usuário'
        });
        Alert.alert('Sucesso', 'Consumo registrado com sucesso!');
      } else {
        // Registrar entrada via movimento de entrada
        await stockService.criarMovimentacao(harasId, {
          stockId: selectedStock.id,
          type: 'in',
          quantity: quantity,
          reason: 'Reabastecimento',
          notes: 'Reabastecimento registrado pelo usuário'
        });
        Alert.alert('Sucesso', 'Reabastecimento registrado com sucesso!');
      }
      
      setShowQuantityModal(false);
      setSelectedStock(null);
      setQuantityInput('');
      await loadData();
    } catch (error) {
      Alert.alert('Erro', `Não foi possível registrar o ${quantityModalType === 'consume' ? 'consumo' : 'reabastecimento'}.`);
    }
  };

  // Cancelar modal de quantidade
  const handleCancelQuantity = () => {
    setShowQuantityModal(false);
    setSelectedStock(null);
    setQuantityInput('');
  };

  // Resolver alerta
  const handleResolveAlert = async (alertId: string) => {
    try {
      await stockService.confirmarAlerta(alertId);
      await loadData();
      Alert.alert('Sucesso', 'Alerta resolvido!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível resolver o alerta.');
    }
  };

  // Ver detalhes do item
  const handleViewStockDetails = (stock: FeedStock) => {
    // Por enquanto, mostrar um alert com os detalhes
    Alert.alert(
      stock.name,
      `Marca: ${stock.brand}\nQuantidade: ${stock.currentQuantity} ${stock.unit}\nValor: R$ ${(stock.currentQuantity * stock.costPerUnit).toFixed(2)}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[600]} />
      
      {/* Header */}
      <LinearGradient
        colors={[Theme.colors.primary[600], Theme.colors.primary[700]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Estoque de Ração</Text>
            <Text style={styles.headerSubtitle}>
              Gestão de Rações e Suplementos
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.veterinaryButton}
              onPress={() => router.push('/tabs/(tabs)/veterinario')}
            >
              <Feather name="plus-square" size={20} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => Alert.alert('Em breve', 'Funcionalidade de adicionar item será implementada em breve!')}
            >
              <Feather name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Abas internas */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderBottomWidth: activeTab === 'racao' ? 3 : 0,
            borderBottomColor: Theme.colors.primary[600],
            marginRight: 16,
          }}
          onPress={() => setActiveTab('racao')}
        >
          <Text style={{
            color: activeTab === 'racao' ? Theme.colors.primary[600] : Theme.colors.neutral[400],
            fontWeight: 'bold',
            fontSize: 16,
          }}>
            Ração
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderBottomWidth: activeTab === 'farmacia' ? 3 : 0,
            borderBottomColor: Theme.colors.primary[600],
          }}
          onPress={() => setActiveTab('farmacia')}
        >
          <Text style={{
            color: activeTab === 'farmacia' ? Theme.colors.primary[600] : Theme.colors.neutral[400],
            fontWeight: 'bold',
            fontSize: 16,
          }}>
            Farmácia
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color={Theme.colors.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder={activeTab === 'racao' ? "Buscar por nome ou marca..." : "Buscar medicamento..."}
            placeholderTextColor={Theme.colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[styles.filterText, filterType === 'all' && styles.filterButtonTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'low' && styles.filterButtonActive]}
            onPress={() => setFilterType('low')}
          >
            <Text style={[styles.filterText, filterType === 'low' && styles.filterButtonTextActive]}>
              Baixo estoque
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'expired' && styles.filterButtonActive]}
            onPress={() => setFilterType('expired')}
          >
            <Text style={[styles.filterText, filterType === 'expired' && styles.filterButtonTextActive]}>
              Vencidos
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Conteúdo das abas */}
      {activeTab === 'racao' ? (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Alertas */}
          {alerts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Alertas</Text>
              {alerts.slice(0, 3).map((alert) => (
                <StockAlertCard
                  key={alert.id}
                  alert={alert}
                  onResolve={() => handleResolveAlert(alert.id)}
                  onViewItem={() => {
                    const stock = stocks.find(s => s.id === alert.stockId);
                    if (stock) handleViewStockDetails(stock);
                  }}
                />
              ))}
              {alerts.length > 3 && (
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>
                    Ver todos os {alerts.length} alertas
                  </Text>
                  <Feather name="chevron-right" size={16} color={Theme.colors.primary[600]} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Lista de Estoque */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Itens do Estoque ({filteredStocks.length})
            </Text>
            {filteredStocks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="package" size={48} color={Theme.colors.neutral[400]} />
                <Text style={styles.emptyTitle}>Nenhum item encontrado</Text>
                <Text style={styles.emptyText}>
                  {searchQuery ? 'Tente ajustar sua busca' : 'Adicione o primeiro item ao estoque'}
                </Text>
              </View>
            ) : (
              filteredStocks.map((stock) => (
                <StockCard
                  key={stock.id}
                  stock={stock}
                  onPress={() => handleViewStockDetails(stock)}
                  onConsume={() => handleConsumeStock(stock)}
                  onRestock={() => handleRestockItem(stock)}
                />
              ))
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Filtros Farmácia */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={{paddingHorizontal: 20, marginBottom: 8}}
            contentContainerStyle={{gap: 12}}
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

          {/* Alertas Farmácia */}
          {veterinaryAlerts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="alert-triangle" size={20} color={Theme.colors.warning[500]} />
                <Text style={styles.sectionTitle}>Alertas Ativos</Text>
              </View>
              {veterinaryAlerts.map((alert) => (
                <View key={alert.id} style={[styles.alertCard, { borderLeftColor: Theme.colors.warning[500] }]}> 
                  <View style={styles.alertContent}>
                    <Feather name="alert-triangle" size={20} color={Theme.colors.warning[500]} />
                    <View style={styles.alertTextContainer}>
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                      <Text style={styles.alertDate}>{new Date(alert.createdAt).toLocaleString('pt-BR')}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Lista de medicamentos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="package" size={20} color={Theme.colors.primary[600]} />
              <Text style={styles.sectionTitle}>
                Medicamentos {filterType !== 'all' && `(${veterinaryStocks.length})`}
              </Text>
            </View>
            {veterinaryStocks.length === 0 ? (
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
              veterinaryStocks.map((stock) => (
                <View key={stock.id} style={styles.stockCard}>
                  <LinearGradient
                    colors={["#ffffff", Theme.colors.neutral[50]]}
                    style={styles.stockCardGradient}
                  >
                    <View style={styles.stockCardHeader}>
                      <View style={styles.medicineInfo}>
                        <View style={styles.medicineIconContainer}>
                          <Feather name="package" size={20} color={Theme.colors.primary[600]} />
                        </View>
                        <View style={styles.medicineDetails}>
                          <Text style={styles.medicineName}>{stock.medicine?.name || 'Medicamento'}</Text>
                          <Text style={styles.medicineManufacturer}>{stock.medicine?.manufacturer}</Text>
                          <Text style={styles.batchNumber}>Lote: {stock.lotNumber}</Text>
                        </View>
                      </View>
                      {stock.medicine?.prescriptionRequired && (
                        <View style={styles.prescriptionBadge}>
                          <Feather name="file-text" size={12} color={Theme.colors.warning[500]} />
                          <Text style={styles.prescriptionText}>Receita</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.quantitySection}>
                      <View style={styles.quantityItem}>
                        <Text style={styles.quantityLabel}>Atual</Text>
                        <Text style={styles.quantityValue}>{stock.quantity}</Text>
                      </View>
                      <View style={styles.quantityItem}>
                        <Text style={styles.quantityLabel}>Mínimo</Text>
                        <Text style={styles.quantityValue}>{stock.minimumQuantity}</Text>
                      </View>
                      <View style={styles.quantityItem}>
                        <Text style={styles.quantityLabel}>Valor Unit.</Text>
                        <Text style={styles.quantityValue}>R$ {stock.costPerUnit?.toFixed(2)}</Text>
                      </View>
                    </View>
                    <View style={styles.additionalInfo}>
                      <View style={styles.infoRow}>
                        <Feather name="calendar" size={16} color={Theme.colors.neutral[500]} />
                        <Text style={styles.infoText}>
                          Validade: {stock.expirationDate ? new Date(stock.expirationDate).toLocaleDateString('pt-BR') : '-'}
                        </Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Feather name="map-pin" size={16} color={Theme.colors.neutral[500]} />
                        <Text style={styles.infoText}>Local: {stock.location || '-'}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* Modal de Quantidade */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQuantityModal}
        onRequestClose={handleCancelQuantity}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {quantityModalType === 'consume' ? 'Consumir Estoque' : 'Reabastecer Estoque'}
              </Text>
              <TouchableOpacity onPress={handleCancelQuantity}>
                <Feather name="x" size={24} color={Theme.colors.neutral[600]} />
              </TouchableOpacity>
            </View>
            
            {selectedStock && (
              <View style={styles.modalBody}>
                <Text style={styles.stockName}>{selectedStock.name}</Text>
                <Text style={styles.stockInfo}>
                  Estoque atual: {selectedStock.currentQuantity} {selectedStock.unit}
                </Text>
                
                <Text style={styles.inputLabel}>
                  Quantidade a {quantityModalType === 'consume' ? 'consumir' : 'adicionar'}:
                </Text>
                <TextInput
                  style={styles.quantityInput}
                  value={quantityInput}
                  onChangeText={setQuantityInput}
                  keyboardType="numeric"
                  placeholder={`Ex: 10 ${selectedStock.unit}`}
                  placeholderTextColor={Theme.colors.neutral[400]}
                  autoFocus={true}
                />
              </View>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelQuantity}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmQuantity}
                disabled={!quantityInput.trim()}
              >
                <Text style={styles.confirmButtonText}>
                  {quantityModalType === 'consume' ? 'Consumir' : 'Reabastecer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
  },
  header: {
    paddingTop: StatusBar.currentHeight,
    paddingBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  headerTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: 'white',
  },
  headerSubtitle: {
    fontSize: Theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  veterinaryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.neutral[100],
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[800],
  },
  filterContainer: {
    paddingVertical: Theme.spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
  },
  filterButton: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    marginLeft: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.neutral[100],
  },
  filterButtonActive: {
    backgroundColor: Theme.colors.primary[600],
  },
  filterText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.neutral[600],
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
    marginTop: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.primary[50],
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary[200],
  },
  viewAllText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.primary[600],
    marginRight: Theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Theme.spacing['2xl'],
    paddingHorizontal: Theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[600],
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[500],
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
    lineHeight: Theme.typography.lineHeights.relaxed * Theme.typography.sizes.base,
  },
  emptySubtext: {
    fontSize: 14,
    color: Theme.colors.neutral[500],
    textAlign: 'center',
  },
  
  // Estilos do modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    margin: Theme.spacing.lg,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
  },
  modalTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[900],
  },
  modalBody: {
    padding: Theme.spacing.lg,
  },
  stockName: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[900],
    marginBottom: Theme.spacing.xs,
  },
  stockInfo: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginBottom: Theme.spacing.lg,
  },
  inputLabel: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.neutral[700],
    marginBottom: Theme.spacing.sm,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[900],
    backgroundColor: Theme.colors.neutral[50],
  },
  modalActions: {
    flexDirection: 'row',
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.neutral[200],
  },
  modalButton: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
  },
  confirmButton: {
    backgroundColor: Theme.colors.primary[600],
  },
  cancelButtonText: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.neutral[700],
  },
  confirmButtonText: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.medium as any,
    color: 'white',
  },

  // Estilos específicos para a aba de Farmácia
  stockCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
});

export default EstoqueScreen;
