import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tutorials } from '../data/tutorials';
import { categoryImages } from '../data/categoryImages';
import AnimatedButton from './components/AnimatedButton';

const difficultyColor = {
  'Fácil': '#39FF8A',
  'Médio': '#FFB020',
  'Difícil': '#FF3B6B',
};

export default function CategoryScreen({ category, navigate, goBack }) {
  // Proteção: se por algum motivo chegar aqui sem categoria definida,
  // volta pra Home em vez de travar o app.
  if (!category) {
    goBack();
    return null;
  }

  const categoryTutorials = tutorials.filter(t => t.categoryId === category.id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <ImageBackground
        source={categoryImages[category.id]}
        style={styles.header}
        imageStyle={styles.headerImage}
      >
        <View style={[styles.headerTint, { backgroundColor: category.color + '2E' }]} />
        <View style={styles.headerGradient} />
        <AnimatedButton onPress={goBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={18} color="#F5F7FA" />
          <Text style={styles.backTextLight}>Voltar</Text>
        </AnimatedButton>
        <View style={[styles.headerIconBadge, { borderColor: category.color }]}>
          <Ionicons name={category.icon} size={24} color={category.color} />
        </View>
        <Text style={styles.headerTitle}>{category.title}</Text>
        <Text style={styles.headerDesc}>{category.description}</Text>
        <Text style={[styles.headerCount, { color: category.color }]}>
          {categoryTutorials.length} TUTORIAL{categoryTutorials.length !== 1 ? 'IS' : ''}
        </Text>
      </ImageBackground>

      {/* Lista de tutoriais */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.listContent}>
          {categoryTutorials.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="construct-outline" size={44} color="#3A3F4D" />
              <Text style={styles.emptyText}>Tutoriais em construção.{'\n'}Em breve novidades nessa categoria!</Text>
            </View>
          ) : (
            categoryTutorials.map((tutorial) => (
              <AnimatedButton
                key={tutorial.id}
                style={styles.tutorialCard}
                onPress={() => navigate('tutorial', { tutorial })}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardMeta}>
                    <View style={[styles.difficultyBadge, { borderColor: difficultyColor[tutorial.difficulty] }]}>
                      <Text style={[styles.difficultyText, { color: difficultyColor[tutorial.difficulty] }]}>
                        {tutorial.difficulty.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.timeRow}>
                      <Ionicons name="time-outline" size={13} color="#6B7280" />
                      <Text style={styles.timeText}>{tutorial.time}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={category.color} />
                </View>
                <Text style={styles.cardTitle}>{tutorial.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{tutorial.description}</Text>
                <View style={styles.toolsRow}>
                  {tutorial.tools.slice(0, 3).map((tool, i) => (
                    <View key={i} style={styles.toolBadge}>
                      <Text style={styles.toolText}>{tool}</Text>
                    </View>
                  ))}
                  {tutorial.tools.length > 3 && (
                    <Text style={styles.moreTool}>+{tutorial.tools.length - 3}</Text>
                  )}
                </View>
              </AnimatedButton>
            ))
          )}
        </View>
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
    paddingBottom: 28,
    overflow: 'hidden',
  },
  headerImage: {
    resizeMode: 'cover',
  },
  headerTint: {
    ...StyleSheet.absoluteFillObject,
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,8,12,0.6)',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    alignSelf: 'flex-start',
    gap: 2,
  },
  backTextLight: {
    fontSize: 15,
    color: '#F5F7FA',
    fontWeight: '600',
  },
  headerIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(7,8,12,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 4,
    color: '#F5F7FA',
  },
  headerDesc: {
    fontSize: 14,
    color: '#AEB4C4',
    marginBottom: 10,
  },
  headerCount: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 24,
    gap: 14,
  },
  tutorialCard: {
    backgroundColor: '#12141B',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F2330',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F5F7FA',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#8B92A8',
    lineHeight: 20,
    marginBottom: 12,
  },
  toolsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  toolBadge: {
    backgroundColor: '#1A1D27',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#242837',
  },
  toolText: {
    fontSize: 11,
    color: '#9AA1B5',
  },
  moreTool: {
    fontSize: 11,
    color: '#5C6378',
    alignSelf: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#5C6378',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
  },
});
