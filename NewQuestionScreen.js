// app/NewQuestionScreen.js
//
// Implementa o fluxo descrito na especificação:
// "Ao criar uma pergunta, o próprio usuário deverá selecionar um selo
//  (etiqueta) correspondente à categoria. Após a publicação, a pergunta
//  será direcionada automaticamente para a categoria escolhida."
//
// Uso sugerido no App.js:
//   {currentScreen === 'newQuestion' && (
//     <NewQuestionScreen
//       presetCategoryId={selectedCategory}   // já vem preenchido se abriu de dentro de uma categoria
//       goBack={goBack}
//       onSubmit={(categoryId, texto) => {
//         // aqui você grava a pergunta (state local, AsyncStorage ou Firestore)
//         goBack();
//       }}
//     />
//   )}
//
// Não esqueça de adicionar o case 'newQuestion' no switch de telas do App.js.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import AnimatedButton from './components/AnimatedButton';
import { CATEGORIES } from '../data/petCategoryData';

const NEON = '#00E5FF';
const BG = '#07080C';
const CARD = '#12141B';
const BORDER = 'rgba(255,255,255,0.08)';
const MUTED = '#8A8F98';

export default function NewQuestionScreen({ presetCategoryId, goBack, onSubmit }) {
  const [texto, setTexto] = useState('');
  const [selectedId, setSelectedId] = useState(presetCategoryId ?? null);

  const selectedCategory = CATEGORIES.find((c) => c.id === selectedId);

  const podePublicar = texto.trim().length >= 10 && !!selectedId;

  const handlePublicar = () => {
    if (!selectedId) {
      Alert.alert('Escolha um selo', 'Selecione a categoria da sua pergunta antes de publicar.');
      return;
    }
    if (texto.trim().length < 10) {
      Alert.alert('Pergunta muito curta', 'Escreva com um pouco mais de detalhe para a comunidade entender.');
      return;
    }
    if (onSubmit) {
      onSubmit(selectedId, texto.trim());
    } else {
      goBack?.();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Pressable onPress={goBack} hitSlop={10}>
          <Text style={styles.backArrow}>‹ Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Nova pergunta</Text>
        <Text style={styles.subtitle}>Escolha um selo e escreva sua dúvida para a comunidade.</Text>

        {/* Seletor de selo/etiqueta */}
        <Text style={styles.label}>Selo (categoria)</Text>
        <View style={styles.chipsWrap}>
          {CATEGORIES.map((cat) => {
            const active = cat.id === selectedId;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedId(cat.id)}
                style={[
                  styles.chip,
                  active && { borderColor: cat.cor, backgroundColor: `${cat.cor}22` },
                ]}
              >
                <Text style={[styles.chipText, active && { color: cat.cor }]}>
                  {cat.emoji}  {cat.nome}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Campo da pergunta */}
        <Text style={styles.label}>Sua pergunta</Text>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Ex: Como trocar um pneu furado com segurança?"
          placeholderTextColor="#5C6270"
          style={styles.textArea}
          multiline
          numberOfLines={5}
        />

        {/* Prévia de onde vai ser publicada */}
        {selectedCategory && (
          <Text style={styles.preview}>
            Sua pergunta será publicada em{' '}
            <Text style={{ color: selectedCategory.cor, fontWeight: '700' }}>
              {selectedCategory.emoji} {selectedCategory.nome}
            </Text>
          </Text>
        )}

        <AnimatedButton
          style={[styles.submitButton, !podePublicar && styles.submitButtonDisabled]}
          onPress={handlePublicar}
          disabled={!podePublicar}
        >
          <Text style={styles.submitButtonText}>Publicar pergunta</Text>
        </AnimatedButton>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scrollContent: { padding: 16, paddingBottom: 40 },
  backArrow: { color: NEON, fontSize: 15, marginBottom: 16 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  subtitle: { color: MUTED, fontSize: 14, marginTop: 4, marginBottom: 20 },
  label: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: CARD,
  },
  chipText: { color: MUTED, fontSize: 13, fontWeight: '600' },
  textArea: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 110,
  },
  preview: { color: MUTED, fontSize: 13, marginTop: 14 },
  submitButton: {
    backgroundColor: NEON,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: { opacity: 0.4 },
  submitButtonText: { color: '#07080C', fontWeight: '800', fontSize: 15 },
});
