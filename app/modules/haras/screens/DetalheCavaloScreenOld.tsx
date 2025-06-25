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
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { animalService } from '../services/animalService';
import { Animal, RegistroSaude, ManejoReprodutivo, Genealogia } from '../types';

interface DetalheCavaloScreenProps {
  animalId: string;
  onClose: () => void;
}

const DetalheCavaloScreen: React.FC<DetalheCavaloScreenProps> = ({ animalId, onClose }) => {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [registrosSaude, setRegistrosSaude] = useState<RegistroSaude[]>([]);
  const [manejos, setManejos] = useState<ManejoReprodutivo[]>([]);
  const [genealogia, setGenealogia] = useState<Genealogia | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'saude' | 'reproducao' | 'genealogia'>('info');
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    raca: '',
    cor: '',
    peso: '',
    sexo: 'macho' as 'macho' | 'femea',
    status: 'ativo' as 'ativo' | 'machucado' | 'descanso' | 'aposentado',
    observacoes: '',
    registro: '',
    foto: '',
  });

  useEffect(() => {
    loadAnimalData();
  }, [animalId]);

  const loadAnimalData = async () => {
    try {
      setLoading(true);
      const [animalData, saudeData, manejoData, genealogiaData] = await Promise.all([
        animalService.getAnimalById(animalId),
        animalService.getRegistrosSaudeByAnimal(animalId),
        animalService.getManejoReprodutivo('temp'), // Precisa ser ajustado quando tivermos o harasId
        animalService.getGenealogiaByAnimal(animalId),
      ]);

      setAnimal(animalData.data);
      setRegistrosSaude(saudeData);
      setManejos(manejoData);
      setGenealogia(genealogiaData.data);

      // Populate form data
      setFormData({
        nome: animalData.nome,
        idade: animalData.idade.toString(),
        raca: animalData.raca,
        cor: animalData.cor,
        peso: animalData.peso.toString(),
        sexo: animalData.sexo,
        status: animalData.status,
        observacoes: animalData.observacoes || '',
        registro: animalData.registro || '',
        foto: animalData.foto || '',
      });
    } catch (error) {
      console.error('Erro ao carregar dados do animal:', error);
      Alert.alert('Erro', 'Falha ao carregar dados do animal');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnimalData();
    setRefreshing(false);
  };

  const handleSaveAnimal = async () => {
    try {
      if (!formData.nome || !formData.idade || !formData.raca) {
        Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
        return;
      }

      const animalData = {
        ...formData,
        idade: parseInt(formData.idade),
        peso: parseFloat(formData.peso),
      };

      await animalService.updateAnimal(animalId, animalData);
      Alert.alert('Sucesso', 'Animal atualizado com sucesso');
      setShowEditModal(false);
      loadAnimalData();
    } catch (error) {
      console.error('Erro ao salvar animal:', error);
      Alert.alert('Erro', 'Falha ao atualizar animal');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return '#4CAF50';
      case 'machucado':
        return '#F44336';
      case 'descanso':
        return '#FF9800';
      case 'aposentado':
        return '#9E9E9E';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'check-circle';
      case 'machucado':
        return 'alert-triangle';
      case 'descanso':
        return 'pause-circle';
      case 'aposentado':
        return 'clock';
      default:
        return 'circle';
    }
  };

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View style={styles.animalPhoto}>
            {animal?.foto ? (
              <Image source={{ uri: animal.foto }} style={styles.photoImage} />
            ) : (
              <Feather name="camera" size={32} color="#CCC" />
            )}
          </View>
          <View style={styles.animalBasicInfo}>
            <Text style={styles.animalName}>{animal?.nome}</Text>
            <Text style={styles.animalRace}>{animal?.raca}</Text>
            <View style={styles.statusContainer}>
              <Feather
                name={getStatusIcon(animal?.status || 'ativo')}
                size={16}
                color={getStatusColor(animal?.status || 'ativo')}
              />
              <Text style={[styles.statusText, { color: getStatusColor(animal?.status || 'ativo') }]}>
                {(animal?.status || 'ativo').charAt(0).toUpperCase() + (animal?.status || 'ativo').slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Informações Básicas</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Idade</Text>
            <Text style={styles.infoValue}>{animal?.idade} anos</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sexo</Text>
            <Text style={styles.infoValue}>
              {animal?.sexo === 'macho' ? 'Macho' : 'Fêmea'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Cor</Text>
            <Text style={styles.infoValue}>{animal?.cor}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={styles.infoValue}>{animal?.peso} kg</Text>
          </View>
        </View>
      </View>

      {animal?.registro && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Registro</Text>
          <Text style={styles.registroText}>{animal.registro}</Text>
        </View>
      )}

      {animal?.nascimento && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Data de Nascimento</Text>
          <Text style={styles.infoValue}>
            {new Date(animal.nascimento).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      )}

      {animal?.observacoes && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Observações</Text>
          <Text style={styles.observacoesText}>{animal.observacoes}</Text>
        </View>
      )}
    </View>
  );

  const renderSaudeTab = () => (
    <View style={styles.tabContent}>
      {registrosSaude.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Nenhum registro de saúde</Text>
        </View>
      ) : (
        registrosSaude.map((registro) => (
          <View key={registro.id} style={styles.registroCard}>
            <View style={styles.registroHeader}>
              <View style={styles.registroInfo}>
                <Feather
                  name={registro.tipo === 'vacina' ? 'shield' : 'heart'}
                  size={18}
                  color={registro.tipo === 'vacina' ? '#4CAF50' : '#2196F3'}
                />
                <View style={styles.registroTexto}>
                  <Text style={styles.registroTipo}>
                    {registro.tipo.charAt(0).toUpperCase() + registro.tipo.slice(1)}
                  </Text>
                  <Text style={styles.registroData}>
                    {new Date(registro.data).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </View>
              {registro.reacao && (
                <View style={styles.reacaoBadge}>
                  <Feather name="alert-circle" size={12} color="#F44336" />
                  <Text style={styles.reacaoText}>Reação</Text>
                </View>
              )}
            </View>
            <Text style={styles.registroDescricao}>{registro.descricao}</Text>
            {registro.proximaAplicacao && (
              <Text style={styles.proximaAplicacao}>
                Próxima: {new Date(registro.proximaAplicacao).toLocaleDateString('pt-BR')}
              </Text>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderReproducaoTab = () => (
    <View style={styles.tabContent}>
      {manejos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Nenhum registro reprodutivo</Text>
        </View>
      ) : (
        manejos.map((manejo) => (
          <View key={manejo.id} style={styles.registroCard}>
            <View style={styles.registroHeader}>
              <View style={styles.registroInfo}>
                <Feather
                  name={manejo.tipo === 'cobertura' ? 'heart' : 'plus-circle'}
                  size={18}
                  color="#2E7D32"
                />
                <View style={styles.registroTexto}>
                  <Text style={styles.registroTipo}>
                    {manejo.tipo.charAt(0).toUpperCase() + manejo.tipo.slice(1)}
                  </Text>
                  <Text style={styles.registroData}>
                    {new Date(manejo.data).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.sucessoBadge,
                { backgroundColor: manejo.sucesso ? '#4CAF50' : '#F44336' }
              ]}>
                <Text style={styles.sucessoText}>
                  {manejo.sucesso ? 'Sucesso' : 'Falha'}
                </Text>
              </View>
            </View>
            {manejo.parceirosNome && (
              <Text style={styles.parceiroText}>
                Parceiro: {manejo.parceirosNome}
              </Text>
            )}
            {manejo.observacoes && (
              <Text style={styles.registroDescricao}>{manejo.observacoes}</Text>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderGenealogiaTab = () => (
    <View style={styles.tabContent}>
      {!genealogia ? (
        <View style={styles.emptyContainer}>
          <Feather name="git-branch" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Genealogia não disponível</Text>
        </View>
      ) : (
        <View>
          {/* Pais */}
          <View style={styles.genealogiaCard}>
            <Text style={styles.genealogiaTitle}>Pais</Text>
            <View style={styles.genealogiaGrid}>
              <View style={styles.genealogiaItem}>
                <Text style={styles.genealogiaLabel}>Pai</Text>
                <Text style={styles.genealogiaValue}>
                  {genealogia.pai?.nome || 'Não informado'}
                </Text>
                {genealogia.pai?.registro && (
                  <Text style={styles.genealogiaRegistro}>{genealogia.pai.registro}</Text>
                )}
              </View>
              <View style={styles.genealogiaItem}>
                <Text style={styles.genealogiaLabel}>Mãe</Text>
                <Text style={styles.genealogiaValue}>
                  {genealogia.mae?.nome || 'Não informado'}
                </Text>
                {genealogia.mae?.registro && (
                  <Text style={styles.genealogiaRegistro}>{genealogia.mae.registro}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Avós Paternos */}
          {(genealogia.avoPaternoMacho || genealogia.avoPaternoFemea) && (
            <View style={styles.genealogiaCard}>
              <Text style={styles.genealogiaTitle}>Avós Paternos</Text>
              <View style={styles.genealogiaGrid}>
                <View style={styles.genealogiaItem}>
                  <Text style={styles.genealogiaLabel}>Avô Paterno</Text>
                  <Text style={styles.genealogiaValue}>
                    {genealogia.avoPaternoMacho?.nome || 'Não informado'}
                  </Text>
                </View>
                <View style={styles.genealogiaItem}>
                  <Text style={styles.genealogiaLabel}>Avó Paterna</Text>
                  <Text style={styles.genealogiaValue}>
                    {genealogia.avoPaternoFemea?.nome || 'Não informado'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Avós Maternos */}
          {(genealogia.avoMaternoMacho || genealogia.avoMaternoFemea) && (
            <View style={styles.genealogiaCard}>
              <Text style={styles.genealogiaTitle}>Avós Maternos</Text>
              <View style={styles.genealogiaGrid}>
                <View style={styles.genealogiaItem}>
                  <Text style={styles.genealogiaLabel}>Avô Materno</Text>
                  <Text style={styles.genealogiaValue}>
                    {genealogia.avoMaternoMacho?.nome || 'Não informado'}
                  </Text>
                </View>
                <View style={styles.genealogiaItem}>
                  <Text style={styles.genealogiaLabel}>Avó Materna</Text>
                  <Text style={styles.genealogiaValue}>
                    {genealogia.avoMaternoFemea?.nome || 'Não informado'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Descendentes */}
          {genealogia.descendentes && genealogia.descendentes.length > 0 && (
            <View style={styles.genealogiaCard}>
              <Text style={styles.genealogiaTitle}>Descendentes</Text>
              {genealogia.descendentes.map((descendente, index) => (
                <View key={index} style={styles.descendenteItem}>
                  <Text style={styles.descendenteNome}>{descendente.nome}</Text>
                  <Text style={styles.descendenteInfo}>
                    {descendente.sexo === 'macho' ? 'Macho' : 'Fêmea'} - {descendente.idade} anos
                  </Text>
                  {descendente.registro && (
                    <Text style={styles.descendenteRegistro}>{descendente.registro}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowEditModal(false)}>
            <Feather name="x" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Editar Animal</Text>
          <TouchableOpacity onPress={handleSaveAnimal}>
            <Text style={styles.saveButton}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(text) => setFormData({ ...formData, nome: text })}
              placeholder="Nome do animal"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Idade *</Text>
            <TextInput
              style={styles.input}
              value={formData.idade}
              onChangeText={(text) => setFormData({ ...formData, idade: text })}
              placeholder="Idade em anos"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Raça *</Text>
            <TextInput
              style={styles.input}
              value={formData.raca}
              onChangeText={(text) => setFormData({ ...formData, raca: text })}
              placeholder="Raça do animal"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cor</Text>
            <TextInput
              style={styles.input}
              value={formData.cor}
              onChangeText={(text) => setFormData({ ...formData, cor: text })}
              placeholder="Cor do animal"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.peso}
              onChangeText={(text) => setFormData({ ...formData, peso: text })}
              placeholder="Peso em kg"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Sexo</Text>
            <View style={styles.radioGroup}>
              {['macho', 'femea'].map((sexo) => (
                <TouchableOpacity
                  key={sexo}
                  style={[
                    styles.radioButton,
                    formData.sexo === sexo && styles.radioButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, sexo: sexo as 'macho' | 'femea' })}
                >
                  <Text
                    style={[
                      styles.radioText,
                      formData.sexo === sexo && styles.radioTextSelected,
                    ]}
                  >
                    {sexo === 'macho' ? 'Macho' : 'Fêmea'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.radioGroup}>
              {['ativo', 'machucado', 'descanso', 'aposentado'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.radioButton,
                    formData.status === status && {
                      backgroundColor: getStatusColor(status),
                      borderColor: getStatusColor(status),
                    },
                  ]}
                  onPress={() => setFormData({ 
                    ...formData, 
                    status: status as 'ativo' | 'machucado' | 'descanso' | 'aposentado' 
                  })}
                >
                  <Text
                    style={[
                      styles.radioText,
                      formData.status === status && styles.radioTextSelected,
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Registro</Text>
            <TextInput
              style={styles.input}
              value={formData.registro}
              onChangeText={(text) => setFormData({ ...formData, registro: text })}
              placeholder="Número de registro"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>URL da Foto</Text>
            <TextInput
              style={styles.input}
              value={formData.foto}
              onChangeText={(text) => setFormData({ ...formData, foto: text })}
              placeholder="http://exemplo.com/foto.jpg"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.observacoes}
              onChangeText={(text) => setFormData({ ...formData, observacoes: text })}
              placeholder="Observações sobre o animal..."
              multiline
              numberOfLines={4}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>  
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Feather name="arrow-left" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Animal</Text>
        <TouchableOpacity onPress={() => setShowEditModal(true)}>
          <Feather name="edit-2" size={20} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {[
          { key: 'info', label: 'Info', icon: 'info' },
          { key: 'saude', label: 'Saúde', icon: 'heart' },
          { key: 'reproducao', label: 'Reprodução', icon: 'baby' },
          { key: 'genealogia', label: 'Genealogia', icon: 'git-branch' },
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
        {activeTab === 'info' && renderInfoTab()}
        {activeTab === 'saude' && renderSaudeTab()}
        {activeTab === 'reproducao' && renderReproducaoTab()}
        {activeTab === 'genealogia' && renderGenealogiaTab()}
      </ScrollView>

      {renderEditModal()}
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  animalPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  photoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  animalBasicInfo: {
    flex: 1,
  },
  animalName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  animalRace: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  registroText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
    fontFamily: 'monospace',
  },
  observacoesText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  registroCard: {
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
  registroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  registroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  registroTexto: {
    marginLeft: 12,
  },
  registroTipo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  registroData: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  registroDescricao: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  reacaoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  reacaoText: {
    fontSize: 10,
    color: '#F44336',
    fontWeight: '500',
    marginLeft: 2,
  },
  proximaAplicacao: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
    marginTop: 4,
  },
  sucessoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sucessoText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500',
  },
  parceiroText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
    marginTop: 4,
  },
  genealogiaCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  genealogiaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  genealogiaGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  genealogiaItem: {
    flex: 1,
  },
  genealogiaLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  genealogiaValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  genealogiaRegistro: {
    fontSize: 12,
    color: '#2E7D32',
    marginTop: 2,
  },
  descendenteItem: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 12,
  },
  descendenteNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  descendenteInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  descendenteRegistro: {
    fontSize: 12,
    color: '#2E7D32',
    marginTop: 2,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
});

export default DetalheCavaloScreen;
