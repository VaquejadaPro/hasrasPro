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
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { animalService } from '../services/animalService';
import { EstatisticasReprodutivas } from '../types';

interface EstatisticasScreenProps {
  harasId: string;
}

const EstatisticasScreen: React.FC<EstatisticasScreenProps> = ({ harasId }) => {
  const [estatisticas, setEstatisticas] = useState<EstatisticasReprodutivas | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [periodo, setPeriodo] = useState<'mes' | 'trimestre' | 'semestre' | 'ano'>('mes');

  useEffect(() => {
    loadEstatisticas();
  }, [periodo]);

  const loadEstatisticas = async () => {
    try {
      setLoading(true);
      const data = await animalService.getEstatisticasReprodutivas(harasId);
      setEstatisticas(data.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      Alert.alert('Erro', 'Falha ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEstatisticas();
    setRefreshing(false);
  };

  const getCorPorcentagem = (porcentagem: number) => {
    if (porcentagem >= 80) return '#4CAF50';
    if (porcentagem >= 60) return '#FF9800';
    return '#F44336';
  };

  const renderCardEstatistica = (
    titulo: string,
    valor: string | number,
    icone: string,
    cor: string,
    subtitulo?: string
  ) => (
    <View style={[styles.estatisticaCard, { borderLeftColor: cor }]}>
      <View style={styles.estatisticaHeader}>
        <View style={[styles.iconContainer, { backgroundColor: cor + '20' }]}>
          <Feather name={icone as any} size={24} color={cor} />
        </View>
        <View style={styles.estatisticaTexto}>
          <Text style={styles.estatisticaValor}>{valor}</Text>
          <Text style={styles.estatisticaTitulo}>{titulo}</Text>
          {subtitulo && <Text style={styles.estatisticaSubtitulo}>{subtitulo}</Text>}
        </View>
      </View>
    </View>
  );

  const renderGraficoStatus = () => {
    if (!estatisticas) return null;

    const { embrioesPorStatus } = estatisticas;
    const total = embrioesPorStatus.congelado + embrioesPorStatus.transferido + embrioesPorStatus.descartado;

    if (total === 0) return null;

    const porcentagemCongelado = (embrioesPorStatus.congelado / total) * 100;
    const porcentagemTransferido = (embrioesPorStatus.transferido / total) * 100;
    const porcentagemDescartado = (embrioesPorStatus.descartado / total) * 100;

    return (
      <View style={styles.graficoCard}>
        <Text style={styles.graficoTitulo}>Status dos Embriões</Text>
        
        <View style={styles.graficoBarras}>
          <View style={styles.barraContainer}>
            <View 
              style={[
                styles.barra, 
                { width: `${porcentagemCongelado}%`, backgroundColor: '#2196F3' }
              ]} 
            />
            <Text style={styles.barraLabel}>
              Congelados ({embrioesPorStatus.congelado})
            </Text>
          </View>
          
          <View style={styles.barraContainer}>
            <View 
              style={[
                styles.barra, 
                { width: `${porcentagemTransferido}%`, backgroundColor: '#4CAF50' }
              ]} 
            />
            <Text style={styles.barraLabel}>
              Transferidos ({embrioesPorStatus.transferido})
            </Text>
          </View>
          
          <View style={styles.barraContainer}>
            <View 
              style={[
                styles.barra, 
                { width: `${porcentagemDescartado}%`, backgroundColor: '#F44336' }
              ]} 
            />
            <Text style={styles.barraLabel}>
              Descartados ({embrioesPorStatus.descartado})
            </Text>
          </View>
        </View>

        <View style={styles.legenda}>
          <View style={styles.legendaItem}>
            <View style={[styles.legendaCor, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.legendaTexto}>Congelados</Text>
            <Text style={styles.legendaPorcentagem}>{porcentagemCongelado.toFixed(1)}%</Text>
          </View>
          <View style={styles.legendaItem}>
            <View style={[styles.legendaCor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendaTexto}>Transferidos</Text>
            <Text style={styles.legendaPorcentagem}>{porcentagemTransferido.toFixed(1)}%</Text>
          </View>
          <View style={styles.legendaItem}>
            <View style={[styles.legendaCor, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendaTexto}>Descartados</Text>
            <Text style={styles.legendaPorcentagem}>{porcentagemDescartado.toFixed(1)}%</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderProximosEventos = () => {
    if (!estatisticas?.proximosEventos || estatisticas.proximosEventos.length === 0) {
      return null;
    }

    return (
      <View style={styles.eventosCard}>
        <Text style={styles.eventosTitulo}>Próximos Eventos</Text>
        {estatisticas.proximosEventos.slice(0, 5).map((evento) => (
          <View key={evento.id} style={styles.eventoItem}>
            <View style={styles.eventoInfo}>
              <Feather
                name={evento.tipo === 'cobertura' ? 'heart' : 'calendar'}
                size={16}
                color="#2E7D32"
              />
              <View style={styles.eventoTexto}>
                <Text style={styles.eventoTipo}>
                  {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                </Text>
                <Text style={styles.eventoAnimal}>{evento.animalNome}</Text>
              </View>
            </View>
            <Text style={styles.eventoData}>
              {new Date(evento.dataEvento).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading && !estatisticas) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando estatísticas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estatísticas</Text>
        <TouchableOpacity onPress={loadEstatisticas}>
          <Feather name="refresh-cw" size={20} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <View style={styles.periodoContainer}>
        {[
          { key: 'mes', label: 'Mês' },
          { key: 'trimestre', label: 'Trimestre' },
          { key: 'semestre', label: 'Semestre' },
          { key: 'ano', label: 'Ano' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.periodoButton,
              periodo === item.key && styles.periodoButtonActive,
            ]}
            onPress={() => setPeriodo(item.key as any)}
          >
            <Text
              style={[
                styles.periodoText,
                periodo === item.key && styles.periodoTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!estatisticas ? (
          <View style={styles.emptyContainer}>
            <Feather name="bar-chart-2" size={48} color="#CCC" />
            <Text style={styles.emptyText}>Nenhuma estatística disponível</Text>
          </View>
        ) : (
          <>
            {/* Cards de Estatísticas Gerais */}
            <View style={styles.estatisticasGrid}>
              {renderCardEstatistica(
                'Garanhões',
                estatisticas.totalGaranhoes,
                'activity',
                '#2E7D32'
              )}
              {renderCardEstatistica(
                'Doadoras',
                estatisticas.totalDoadoras,
                'heart',
                '#E91E63'
              )}
              {renderCardEstatistica(
                'Receptoras',
                estatisticas.totalReceptoras,
                'shield',
                '#FF9800'
              )}
              {renderCardEstatistica(
                'Embriões',
                estatisticas.totalEmbrioes,
                'circle',
                '#2196F3'
              )}
            </View>

            {/* Taxa de Sucesso */}
            <View style={styles.sucessoCard}>
              <View style={styles.sucessoHeader}>
                <Text style={styles.sucessoTitulo}>Taxa de Sucesso</Text>
                <View style={[
                  styles.sucessoBadge,
                  { backgroundColor: getCorPorcentagem(estatisticas.taxaSucessoTransferencia) }
                ]}>
                  <Text style={styles.sucessoPorcentagem}>
                    {estatisticas.taxaSucessoTransferencia.toFixed(1)}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.sucessoBarraContainer}>
                <View style={styles.sucessoBarraFundo}>
                  <View 
                    style={[
                      styles.sucessoBarra,
                      { 
                        width: `${estatisticas.taxaSucessoTransferencia}%`,
                        backgroundColor: getCorPorcentagem(estatisticas.taxaSucessoTransferencia)
                      }
                    ]}
                  />
                </View>
              </View>
              
              <Text style={styles.sucessoDescricao}>
                Transferências de embriões bem-sucedidas
              </Text>
            </View>

            {/* Gráfico de Status dos Embriões */}
            {renderGraficoStatus()}

            {/* Próximos Eventos */}
            {renderProximosEventos()}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
  },
  periodoContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  periodoButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  periodoButtonActive: {
    backgroundColor: '#E8F5E8',
  },
  periodoText: {
    fontSize: 14,
    color: '#666',
  },
  periodoTextActive: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  estatisticasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  estatisticaCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estatisticaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  estatisticaTexto: {
    flex: 1,
  },
  estatisticaValor: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  estatisticaTitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  estatisticaSubtitulo: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  sucessoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sucessoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sucessoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sucessoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sucessoPorcentagem: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  sucessoBarraContainer: {
    marginBottom: 8,
  },
  sucessoBarraFundo: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sucessoBarra: {
    height: '100%',
    borderRadius: 4,
  },
  sucessoDescricao: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  graficoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  graficoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  graficoBarras: {
    marginBottom: 16,
  },
  barraContainer: {
    marginBottom: 12,
  },
  barra: {
    height: 24,
    borderRadius: 4,
    marginBottom: 4,
  },
  barraLabel: {
    fontSize: 14,
    color: '#666',
  },
  legenda: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendaCor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendaTexto: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  legendaPorcentagem: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  eventosCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventosTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  eventoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  eventoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventoTexto: {
    marginLeft: 12,
    flex: 1,
  },
  eventoTipo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  eventoAnimal: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  eventoData: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});

export default EstatisticasScreen;
