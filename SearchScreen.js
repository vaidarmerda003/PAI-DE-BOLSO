import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tutorials, categories } from '../data/tutorials';
import AnimatedButton from './components/AnimatedButton';

const NEON = '#00E5FF';

export default function SearchScreen({ navigate, goBack }) {
  const [query, setQuery] = useState('');

  const getCategory = (categoryId) => categories.find(c => c.id === categoryId);

  const results = query.length >= 2
    ? tutorials.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.tools.some(tool => tool.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AnimatedButton onPress={goBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={18} color="#8B92A8" />
          <Text style={styles.backText}>Voltar</Text>
        </AnimatedButton>
        <Text style={styles.title}>Buscar tutorial</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="search" size={17} color={NEON} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Ex: torneira, pneu, furadeira..."
            value={query}
            onChangeText={setQuery}
            autoFocus
            placeholderTextColor="#5C6378"
            selectionColor={NEON}
          />
        </View>
      </View>

      <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
        {query.length < 2 && (
          <View style={styles.hint}>
            <Ionicons name="search-outline" size={42} color="#3A3F4D" />
            <Text style={styles.hintText}>Digite pelo menos 2 letras para buscar</Text>
          </View>
        )}

        {query.length >= 2 && results.length === 0 && (
          <View style={styles.hint}>
            <Ionicons name="alert-circle-outline" size={42} color="#3A3F4D" />
            <Text style={styles.hintText}>Nenhum tutorial encontrado para "{query}"</Text>
            <Text style={styles.hintSub}>Tente palavras diferentes ou explore as categorias na tela inicial</Text>
          </View>
        )}

        {results.map((tutorial) => {
          const cat = getCategory(tutorial.categoryId);
          return (
            <AnimatedButton
              key={tutorial.id}
              style={styles.card}
              onPress={() => navigate('tutorial', { tutorial })}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.catBadge, { borderColor: cat?.color || '#3A3F4D' }]}>
                  <Ionicons name={cat?.icon || 'help-circle'} size={12} color={cat?.color || '#8B92A8'} />
                  <Text style={[styles.catName, { color: cat?.color || '#8B92A8' }]}>{cat?.title}</Text>
                </View>
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={12} color="#6B7280" />
                  <Text style={styles.time}>{tutorial.time}</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>{tutorial.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{tutorial.description}</Text>
            </AnimatedButton>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080C',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#07080C',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D27',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    alignSelf: 'flex-start',
    gap: 2,
  },
  backText: {
    fontSize: 15,
    color: '#8B92A8',
    fontWeight: '500',
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#F5F7FA',
    marginBottom: 14,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12141B',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,229,255,0.35)',
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 16,
    color: '#F5F7FA',
  },
  results: {
    flex: 1,
    padding: 24,
  },
  hint: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  hintText: {
    fontSize: 16,
    color: '#8B92A8',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 14,
    marginBottom: 6,
  },
  hintSub: {
    fontSize: 13,
    color: '#5C6378',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#12141B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2330',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  catName: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F7FA',
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 13,
    color: '#8B92A8',
    lineHeight: 19,
  },
});
