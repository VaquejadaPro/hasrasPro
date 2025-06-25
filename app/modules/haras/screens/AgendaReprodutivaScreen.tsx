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
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { animalService } from '../services/animalService';
import { AgendaReprodutiva, TipoEventoAgenda } from '../types';

interface AgendaReprodutivaScreenProps {
  harasId: string;
}

const AgendaReprodutivaScreen: React.FC<AgendaReprodutivaScreenProps> = ({ harasId }) => {
  const [agenda, setAgenda] = useState<AgendaReprodutiva[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvento, setEditingEvento] = useState<AgendaReprodutiva | null>(null);
  const [activeTab, setActiveTab] = useState<'hoje' | 'proximos' | 'todos'>('hoje');

  // Form states
  const [formData, setFormData] = useState({
    tipo: 'cobertura' as TipoEventoAgenda,
    animalId: '',
    dataEvento: new Date().toISOString().split('T')[0],
    observacoes: '',
    realizado: false,
    responsavel: '',
    prioridade: 'media' as 'alta' | 'media' | 'baixa',
    notificar: true,
    horaEvento: '08:00',
  });

  useEffect(() => {
    loadAgenda();
  }, []);

  const loadAgenda = async () => {
    try {
      setLoading(true);
      const data = await animalService.getAgendaReprodutiva(harasId);
      setAgenda(data);
    } catch (error) {
      console.error('Erro ao carregar agenda:', error);
      Alert.alert('Erro', 'Falha ao carregar agenda reprodutiva');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAgenda();
    setRefreshing(false);
  };

  const handleSaveEvento = async () => {
    try {
      if (!formData.animalId || !formData.dataEvento) {
        Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
        return;
      }

      const eventoData = {
        ...formData,
        harasId,
        dataEvento: `${formData.dataEvento}T${formData.horaEvento}:00.000Z`,
      };

      if (editingEvento) {
        await animalService.updateAgendaReprodutiva(editingEvento.id, eventoData);
        Alert.alert('Sucesso', 'Evento atualizado com sucesso');
      } else {
        await animalService.createAgendaReprodutiva(eventoData);
        Alert.alert('Sucesso', 'Evento agendado com sucesso');
      }

      setShowCreateModal(false);
      setEditingEvento(null);
      resetForm();
      loadAgenda();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      Alert.alert('Erro', 'Falha ao salvar evento na agenda');
    }
  };

  const handleDeleteEvento = async (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este evento da agenda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await animalService.deleteAgendaReprodutiva(id);
              Alert.alert('Sucesso', 'Evento excluído com sucesso');
              loadAgenda();
            } catch (error) {
              console.error('Erro ao excluir evento:', error);
              Alert.alert('Erro', 'Falha ao excluir evento');
            }
          },
        },
      ]
    );
  };

  const handleMarcarRealizado = async (id: string, realizado: boolean) => {
    try {
      await animalService.updateAgendaReprodutiva(id, { realizado });
      Alert.alert('Sucesso', realizado ? 'Evento marcado como realizado' : 'Evento desmarcado');
      loadAgenda();
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      Alert.alert('Erro', 'Falha ao atualizar status do evento');
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: 'cobertura',
      animalId: '',
      dataEvento: new Date().toISOString().split('T')[0],
      observacoes: '',
      realizado: false,
      responsavel: '',
      prioridade: 'media',
      notificar: true,
      horaEvento: '08:00',
    });
  };

  const openEditModal = (evento: AgendaReprodutiva) => {
    setEditingEvento(evento);
    const dataEvento = new Date(evento.dataEvento);
    setFormData({
      tipo: evento.tipo,
      animalId: evento.animalId,
      dataEvento: dataEvento.toISOString().split('T')[0],
      observacoes: evento.observacoes || '',
      realizado: evento.realizado,
      responsavel: evento.responsavel || '',
      prioridade: evento.prioridade,
      notificar: evento.notificar,
      horaEvento: dataEvento.toTimeString().slice(0, 5),
    });
    setShowCreateModal(true);
  };

  const getFilteredAgenda = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const proximosSete = new Date(hoje);
    proximosSete.setDate(hoje.getDate() + 7);

    let filtered = agenda;

    if (activeTab === 'hoje') {
      filtered = filtered.filter(evento => {
        const dataEvento = new Date(evento.dataEvento);
        dataEvento.setHours(0, 0, 0, 0);
        return dataEvento.getTime() === hoje.getTime();
      });
    } else if (activeTab === 'proximos') {
      filtered = filtered.filter(evento => {
        const dataEvento = new Date(evento.dataEvento);
        return dataEvento >= hoje && dataEvento <= proximosSete;
      });
    }

    return filtered.sort((a, b) => new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime());
  };

  const getPrioridadeColor = (prioridade: 'alta' | 'media' | 'baixa') => {
    switch (prioridade) {
      case 'alta':
        return '#F44336';
      case 'media':
        return '#FF9800';
      case 'baixa':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const getTipoIcon = (tipo: TipoEventoAgenda) => {
    switch (tipo) {
      case 'cobertura':
        return 'heart';
      case 'inseminacao':
        return 'droplet';
      case 'implantacao':
        return 'plus-circle';
      case 'exame':
        return 'eye';
      case 'parto':
        return 'baby';
      case 'medicacao':
        return 'pill';
      default:
        return 'calendar';
    }
  };

  const isEventoVencido = (dataEvento: string) => {
    return new Date(dataEvento) < new Date();
  };

  const renderEventoCard = (evento: AgendaReprodutiva) => {
    const vencido = isEventoVencido(evento.dataEvento);
    
    return (
      <View key={evento.id} style={[
        styles.eventoCard,
        evento.realizado && styles.eventoRealizado,
        vencido && !evento.realizado && styles.eventoVencido,
      ]}>
        <View style={styles.eventoHeader}>
          <View style={styles.eventoInfo}>
            <Feather
              name={getTipoIcon(evento.tipo)}
              size={20}
              color={evento.realizado ? '#4CAF50' : getPrioridadeColor(evento.prioridade)}
              style={styles.eventoIcon}
            />
            <View>
              <Text style={[
                styles.eventoTipo,
                evento.realizado && styles.textoRealizado,
              ]}>
                {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
              </Text>
              <Text style={[
                styles.eventoData,
                evento.realizado && styles.textoRealizado,
              ]}>
                {new Date(evento.dataEvento).toLocaleDateString('pt-BR')} às{' '}
                {new Date(evento.dataEvento).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
          <View style={styles.eventoActions}>
            <View style={[
              styles.prioridadeBadge,
              { backgroundColor: getPrioridadeColor(evento.prioridade) }
            ]}>
              <Text style={styles.prioridadeText}>
                {evento.prioridade.toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleMarcarRealizado(evento.id, !evento.realizado)}
              style={styles.actionButton}
            >
              <Feather
                name={evento.realizado ? 'check-circle' : 'circle'}
                size={16}
                color={evento.realizado ? '#4CAF50' : '#666'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openEditModal(evento)}
              style={styles.actionButton}
            >
              <Feather name="edit-2" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteEvento(evento.id)}
              style={styles.actionButton}
            >
              <Feather name="trash-2" size={16} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.eventoDetails}>
          <Text style={[styles.detailText, evento.realizado && styles.textoRealizado]}>
            <Text style={styles.detailLabel}>Animal:</Text> {evento.animalNome}
          </Text>
          {evento.responsavel && (
            <Text style={[styles.detailText, evento.realizado && styles.textoRealizado]}>
              <Text style={styles.detailLabel}>Responsável:</Text> {evento.responsavel}
            </Text>
          )}
          {evento.observacoes && (
            <Text style={[styles.detailText, evento.realizado && styles.textoRealizado]}>
              <Text style={styles.detailLabel}>Observações:</Text> {evento.observacoes}
            </Text>
          )}
          {vencido && !evento.realizado && (
            <Text style={styles.vencidoText}>⚠️ Evento vencido</Text>
          )}
        </View>
      </View>
    );
  };

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => {
              setShowCreateModal(false);
              setEditingEvento(null);
              resetForm();
            }}
          >
            <Feather name="x" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {editingEvento ? 'Editar Evento' : 'Novo Evento na Agenda'}
          </Text>
          <TouchableOpacity onPress={handleSaveEvento}>
            <Text style={styles.saveButton}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Evento</Text>
            <View style={styles.radioGroup}>
              {[
                'cobertura',
                'inseminacao',
                'implantacao',
                'exame',
                'parto',
                'medicacao'
              ].map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.radioButton,
                    formData.tipo === tipo && styles.radioButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, tipo: tipo as TipoEventoAgenda })}
                >
                  <Text
                    style={[
                      styles.radioText,
                      formData.tipo === tipo && styles.radioTextSelected,
                    ]}
                  >
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Animal *</Text>
            <TextInput
              style={styles.input}
              value={formData.animalId}
              onChangeText={(text) => setFormData({ ...formData, animalId: text })}
              placeholder="ID do animal"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Data do Evento *</Text>
            <TextInput
              style={styles.input}
              value={formData.dataEvento}
              onChangeText={(text) => setFormData({ ...formData, dataEvento: text })}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Hora do Evento</Text>
            <TextInput
              style={styles.input}
              value={formData.horaEvento}
              onChangeText={(text) => setFormData({ ...formData, horaEvento: text })}
              placeholder="HH:MM"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.radioGroup}>
              {[
                { key: 'alta', label: 'Alta', color: '#F44336' },
                { key: 'media', label: 'Média', color: '#FF9800' },
                { key: 'baixa', label: 'Baixa', color: '#4CAF50' },
              ].map((prioridade) => (
                <TouchableOpacity
                  key={prioridade.key}
                  style={[
                    styles.radioButton,
                    formData.prioridade === prioridade.key && {
                      backgroundColor: prioridade.color,
                      borderColor: prioridade.color,
                    },
                  ]}
                  onPress={() => setFormData({ ...formData, prioridade: prioridade.key as any })}
                >
                  <Text
                    style={[
                      styles.radioText,
                      formData.prioridade === prioridade.key && styles.radioTextSelected,
                    ]}
                  >
                    {prioridade.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Responsável</Text>
            <TextInput
              style={styles.input}
              value={formData.responsavel}
              onChangeText={(text) => setFormData({ ...formData, responsavel: text })}
              placeholder="Nome do responsável"
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.switchGroup}>
              <Text style={styles.label}>Notificar</Text>
              <Switch
                value={formData.notificar}
                onValueChange={(value) => setFormData({ ...formData, notificar: value })}
                trackColor={{ false: '#DDD', true: '#4CAF50' }}
                thumbColor={formData.notificar ? '#FFF' : '#FFF'}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.switchGroup}>
              <Text style={styles.label}>Realizado</Text>
              <Switch
                value={formData.realizado}
                onValueChange={(value) => setFormData({ ...formData, realizado: value })}
                trackColor={{ false: '#DDD', true: '#4CAF50' }}
                thumbColor={formData.realizado ? '#FFF' : '#FFF'}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.observacoes}
              onChangeText={(text) => setFormData({ ...formData, observacoes: text })}
              placeholder="Observações sobre o evento..."
              multiline
              numberOfLines={4}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const getTabCount = (tab: 'hoje' | 'proximos' | 'todos') => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (tab === 'hoje') {
      return agenda.filter(evento => {
        const dataEvento = new Date(evento.dataEvento);
        dataEvento.setHours(0, 0, 0, 0);
        return dataEvento.getTime() === hoje.getTime();
      }).length;
    } else if (tab === 'proximos') {
      const proximosSete = new Date(hoje);
      proximosSete.setDate(hoje.getDate() + 7);
      return agenda.filter(evento => {
        const dataEvento = new Date(evento.dataEvento);
        return dataEvento >= hoje && dataEvento <= proximosSete;
      }).length;
    }
    return agenda.length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda Reprodutiva</Text>
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          style={styles.addButton}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {[
          { key: 'hoje', label: 'Hoje', icon: 'calendar' },
          { key: 'proximos', label: 'Próximos 7 dias', icon: 'clock' },
          { key: 'todos', label: 'Todos', icon: 'list' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Feather
              name={tab.icon as any}
              size={16}
              color={activeTab === tab.key ? '#2E7D32' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{getTabCount(tab.key as any)}</Text>
            </View>
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : getFilteredAgenda().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={48} color="#CCC" />
            <Text style={styles.emptyText}>Nenhum evento encontrado</Text>
            <Text style={styles.emptySubtext}>
              Toque no + para agendar um novo evento
            </Text>
          </View>
        ) : (
          getFilteredAgenda().map(renderEventoCard)
        )}
      </ScrollView>

      {renderCreateModal()}
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
  addButton: {
    backgroundColor: '#2E7D32',
    padding: 8,
    borderRadius: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#E8F5E8',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    marginRight: 4,
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  tabBadge: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  eventoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventoRealizado: {
    backgroundColor: '#F8F8F8',
    opacity: 0.8,
  },
  eventoVencido: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  eventoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventoIcon: {
    marginRight: 12,
  },
  eventoTipo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  eventoData: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  textoRealizado: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  eventoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prioridadeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  prioridadeText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  eventoDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: '500',
    color: '#333',
  },
  vencidoText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '500',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  radioButtonSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  radioText: {
    fontSize: 14,
    color: '#666',
  },
  radioTextSelected: {
    color: '#FFF',
    fontWeight: '500',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default AgendaReprodutivaScreen;
