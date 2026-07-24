import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categories, tutorials } from '../data/tutorials';
import { categoryImages } from '../data/categoryImages';
import { loadProgress } from '../data/progressStorage';
import AnimatedButton from './components/AnimatedButton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;
const NEON = '#00E5FF';

// Só tutoriais com passo a passo entram na conta de progresso.
const TRACKABLE_TUTORIALS = tutorials.filter(t => t.steps && t.steps.length > 0);

export default function HomeScreen({ navigate, userName, userEmail, onLogout }) {
  const [progress, setProgress] = useState({
    doneSteps: 0,
    totalSteps: 0,
    percent: 0,
    tutorialsCompleted: 0,
    tutorialsTotal: TRACKABLE_TUTORIALS.length,
  });

  // Recalcula o progresso geral (todos os tutoriais do app) toda vez que a
  // Home aparece na tela — assim ela reflete o que foi feito nos tutoriais.
  const loadOverallProgress = useCallback(async () => {
    let doneSteps = 0;
    let totalSteps = 0;
    let tutorialsCompleted = 0;

    for (const t of TRACKABLE_TUTORIALS) {
      totalSteps += t.steps.length;
      const saved = await loadProgress(userEmail, t.id);
      doneSteps += saved.length;
      if (saved.length === t.steps.length) tutorialsCompleted += 1;
    }

    setProgress({
      doneSteps,
      totalSteps,
      percent: totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0,
      tutorialsCompleted,
      tutorialsTotal: TRACKABLE_TUTORIALS.length,
    });
  }, [userEmail]);

  useEffect(() => {
    loadOverallProgress();
  }, [loadOverallProgress]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.greeting}>PAI DE BOLSO</Text>
          {onLogout && (
            <AnimatedButton style={styles.logoutBtn} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={16} color="#6B7280" />
            </AnimatedButton>
          )}
        </View>
        <Text style={styles.title}>
          {userName ? `Olá Filhão, ${userName}!` : 'Bem-vindo!'}
        </Text>
        <Text style={styles.subtitle}>
          Tutoriais práticos para o dia a dia — coisas que todo mundo precisa saber.
        </Text>
      </View>

      {/* Search Button */}
      <AnimatedButton style={styles.searchBar} onPress={() => navigate('search')}>
        <Ionicons name="search" size={18} color={NEON} style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>Buscar tutorial...</Text>
      </AnimatedButton>

      {/* Progresso geral */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeaderRow}>
          <Text style={styles.progressTitle}>SEU PROGRESSO</Text>
          <Text style={styles.progressPercent}>{progress.percent}%</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progress.percent}%` }]} />
        </View>
        <Text style={styles.progressSubtitle}>
          {progress.tutorialsCompleted} de {progress.tutorialsTotal} tutoriais concluídos
        </Text>

        {progress.percent === 100 && progress.totalSteps > 0 && (
          <View style={styles.finalMessage}>
            <Ionicons name="ribbon" size={22} color="#FFD60A" />
            <Text style={styles.finalMessageText}>
              Parabéns! Você concluiu todos os tutoriais. Agora você já pode passar esses
              ensinamentos adiante, pois você já é um homem crescido.
            </Text>
          </View>
        )}
      </View>

      {/* Destaque do dia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ESSENCIAL CONHECER</Text>
        <AnimatedButton
          onPress={() => {
            const t = tutorials.find(t => t.id === 'pneu-furado');
            navigate('tutorial', { tutorial: t });
          }}
        >
          <ImageBackground
            source={categoryImages.carro}
            style={styles.featuredCard}
            imageStyle={styles.featuredImage}
          >
            <View style={styles.featuredOverlay} />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredCategory}>CARRO · MÉDIO</Text>
              <Text style={styles.featuredTitle}>Trocar pneu furado</Text>
              <Text style={styles.featuredDesc}>Pode acontecer a qualquer hora. Saber isso pode te salvar.</Text>
            </View>
            <View style={styles.featuredArrowWrap}>
              <Ionicons name="chevron-forward" size={18} color="#0A0A0F" />
            </View>
          </ImageBackground>
        </AnimatedButton>
      </View>

      {/* Categorias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CATEGORIAS</Text>
        <View style={styles.grid}>
          {categories.map((cat) => (
            <AnimatedButton
              key={cat.id}
              style={[styles.categoryCard, { borderColor: cat.color + '55' }]}
              onPress={() => navigate('category', { category: cat })}
            >
              <ImageBackground
                source={categoryImages[cat.id]}
                style={styles.categoryImageBg}
                imageStyle={styles.categoryImage}
              >
                <View style={[styles.categoryTint, { backgroundColor: cat.color + '26' }]} />
                <View style={styles.categoryGradient} />
                <View style={[styles.categoryIconBadge, { borderColor: cat.color }]}>
                  <Ionicons name={cat.icon} size={16} color={cat.color} />
                </View>
                <View style={styles.categoryTextWrap}>
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                  <Text style={styles.categoryDesc} numberOfLines={2}>{cat.description}</Text>
                </View>
              </ImageBackground>
            </AnimatedButton>
          ))}
        </View>
      </View>

      {/* Frase motivacional */}
      <View style={styles.motivational}>
        <Text style={styles.motivationalText}>
          "Ninguém nasce sabendo. Você está aqui, aprendendo — e isso já é muito."
        </Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080C',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 12,
    color: NEON,
    fontWeight: '700',
    letterSpacing: 2,
  },
  logoutBtn: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#12141B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1F2330',
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#F5F7FA',
    lineHeight: 34,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#8B92A8',
    lineHeight: 21,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12141B',
    marginHorizontal: 24,
    marginTop: 22,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0,229,255,0.35)',
    gap: 10,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#5C6378',
  },
  progressSection: {
    marginHorizontal: 24,
    marginTop: 18,
    backgroundColor: '#12141B',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F2330',
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: '700',
    color: NEON,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#1A1D27',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: NEON,
  },
  progressSubtitle: {
    fontSize: 12.5,
    color: '#8B92A8',
    marginTop: 10,
  },
  finalMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#1A1611',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,214,10,0.35)',
  },
  finalMessageText: {
    flex: 1,
    fontSize: 13,
    color: '#E0C896',
    lineHeight: 19,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.4,
    marginBottom: 14,
  },
  featuredCard: {
    borderRadius: 20,
    minHeight: 150,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(177,78,255,0.4)',
  },
  featuredImage: {
    borderRadius: 20,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,8,12,0.7)',
  },
  featuredContent: {
    flex: 1,
    paddingRight: 12,
  },
  featuredCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B14EFF',
    letterSpacing: 1,
    marginBottom: 6,
  },
  featuredTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#F5F7FA',
    marginBottom: 5,
  },
  featuredDesc: {
    fontSize: 13,
    color: '#9AA1B5',
    lineHeight: 18,
  },
  featuredArrowWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#B14EFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: CARD_WIDTH,
    borderRadius: 18,
    minHeight: 138,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: '#12141B',
  },
  categoryImageBg: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  categoryImage: {
    borderRadius: 18,
  },
  categoryTint: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,8,12,0.55)',
  },
  categoryIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: 'rgba(7,8,12,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
  },
  categoryTextWrap: {
    gap: 2,
  },
  categoryTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#F5F7FA',
  },
  categoryDesc: {
    fontSize: 11.5,
    color: '#9AA1B5',
    lineHeight: 15,
  },
  motivational: {
    marginHorizontal: 24,
    marginTop: 28,
    backgroundColor: '#12141B',
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 3,
    borderLeftColor: NEON,
  },
  motivationalText: {
    fontSize: 14,
    color: '#9AA1B5',
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
