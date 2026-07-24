import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categories, tutorials } from '../data/tutorials';
import AnimatedButton from './components/AnimatedButton';
import Confetti from './components/Confetti';
import { loadProgress, saveProgress, areAllTutorialsComplete } from '../data/progressStorage';

const difficultyColor = {
  'Fácil': '#39FF8A',
  'Médio': '#FFB020',
  'Difícil': '#FF3B6B',
};

const TABS = [
  { key: 'steps', label: 'Passo a passo', icon: 'list' },
  { key: 'tools', label: 'Ferramentas', icon: 'construct' },
  { key: 'videos', label: 'Vídeos', icon: 'play-circle' },
  { key: 'tips', label: 'Dicas', icon: 'bulb' },
];

export default function TutorialScreen({ tutorial, goBack, navigate, userEmail }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeTab, setActiveTab] = useState('steps');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);
  const category = categories.find(c => c.id === tutorial.categoryId);
  const accent = category?.color || '#00E5FF';

  // Próximo tutorial da mesma categoria (pra avançar ao concluir)
  const categoryTutorials = tutorials.filter(t => t.categoryId === tutorial.categoryId);
  const currentIndex = categoryTutorials.findIndex(t => t.id === tutorial.id);
  const nextTutorial = currentIndex >= 0 ? categoryTutorials[currentIndex + 1] : null;

  // Sempre que troca de tutorial (ou abre pela primeira vez), carrega o
  // progresso salvo daquela conta pra aquele tutorial específico.
  useEffect(() => {
    let active = true;
    setActiveTab('steps');
    setShowCelebration(false);
    setShowGrandFinale(false);
    (async () => {
      const saved = await loadProgress(userEmail, tutorial.id);
      if (active) setCompletedSteps(saved);
    })();
    return () => { active = false; };
  }, [tutorial.id, userEmail]);

  const toggleStep = (index) => {
    setCompletedSteps(prev => {
      const alreadyDone = prev.includes(index);
      const next = alreadyDone ? prev.filter(i => i !== index) : [...prev, index];
      saveProgress(userEmail, tutorial.id, next);
      // Só comemora quando o ÚLTIMO passo é marcado agora (não ao desmarcar)
      if (!alreadyDone && tutorial.steps && next.length === tutorial.steps.length) {
        areAllTutorialsComplete(userEmail, tutorials).then((allDone) => {
          if (allDone) {
            setShowGrandFinale(true);
          } else {
            setShowCelebration(true);
          }
        });
      }
      return next;
    });
  };

  const handleCelebrationDismiss = () => {
    setShowCelebration(false);
    if (nextTutorial) {
      navigate('tutorial', { tutorial: nextTutorial, replace: true });
    } else {
      goBack();
    }
  };

  const handleGrandFinaleDismiss = () => {
    setShowGrandFinale(false);
    navigate('home', { reset: true });
  };

  const openVideo = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Não foi possível abrir o link', 'Copie e cole no YouTube: ' + url);
    });
  };

  const progress = tutorial.steps ? Math.round((completedSteps.length / tutorial.steps.length) * 100) : 0;
  const isResuming = completedSteps.length > 0 && completedSteps.length < (tutorial.steps?.length || 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <AnimatedButton onPress={goBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={18} color="#8B92A8" />
            <Text style={styles.backText}>Voltar</Text>
          </AnimatedButton>
          {category && (
            <View style={[styles.categoryTag, { borderColor: accent }]}>
              <Ionicons name={category.icon} size={12} color={accent} />
              <Text style={[styles.categoryTagText, { color: accent }]}>{category.title.toUpperCase()}</Text>
            </View>
          )}
          <View style={styles.headerMeta}>
            <View style={[styles.diffBadge, { borderColor: difficultyColor[tutorial.difficulty] }]}>
              <Text style={[styles.diffText, { color: difficultyColor[tutorial.difficulty] }]}>
                {tutorial.difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={13} color="#6B7280" />
              <Text style={styles.timeText}>{tutorial.time}</Text>
            </View>
          </View>
          <Text style={styles.title}>{tutorial.title}</Text>
          <Text style={styles.description}>{tutorial.description}</Text>
        </View>

        {/* Aviso de segurança */}
        {tutorial.warning && (
          <View style={styles.warning}>
            <Ionicons name="warning" size={16} color="#FFB020" style={{ marginTop: 1 }} />
            <Text style={styles.warningText}>{tutorial.warning.replace(/^[⚠️\s]+/, '')}</Text>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <AnimatedButton
                key={tab.key}
                style={[styles.tab, isActive && { backgroundColor: accent, borderColor: accent }]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons name={tab.icon} size={14} color={isActive ? '#07080C' : '#6B7280'} />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </AnimatedButton>
            );
          })}
        </View>

        {/* Passo a passo */}
        {activeTab === 'steps' && (
          <View style={styles.section}>
            {/* Barra de progresso */}
            {tutorial.steps && tutorial.steps.length > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>PROGRESSO</Text>
                  <Text style={[styles.progressPercent, { color: accent }]}>{progress}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: accent }]} />
                </View>
                {isResuming && (
                  <Text style={styles.resumingText}>Retomando de onde você parou</Text>
                )}
              </View>
            )}

            {tutorial.steps && tutorial.steps.map((step, index) => {
              const done = completedSteps.includes(index);
              return (
                <AnimatedButton
                  key={index}
                  style={[styles.stepCard, done && { borderColor: accent }]}
                  onPress={() => toggleStep(index)}
                >
                  <View style={styles.stepLeft}>
                    <View style={[styles.stepNumber, done && { backgroundColor: accent, borderColor: accent }]}>
                      {done ? (
                        <Ionicons name="checkmark" size={14} color="#07080C" />
                      ) : (
                        <Text style={styles.stepNum}>{index + 1}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, done && { color: accent }]}>
                      {step.title}
                    </Text>
                    <Text style={styles.stepDesc}>{step.description}</Text>
                  </View>
                </AnimatedButton>
              );
            })}

            {progress === 100 && (
              <View style={[styles.successBanner, { borderColor: accent }]}>
                <Ionicons name="trophy" size={22} color={accent} />
                <Text style={[styles.successText, { color: accent }]}>Parabéns! Você concluiu esse tutorial!</Text>
              </View>
            )}
          </View>
        )}

        {/* Ferramentas e materiais */}
        {activeTab === 'tools' && (
          <View style={styles.section}>
            {tutorial.tools && tutorial.tools.length > 0 && (
              <>
                <View style={styles.sectionLabelRow}>
                  <Ionicons name="construct" size={15} color={accent} />
                  <Text style={styles.sectionLabel}>Ferramentas necessárias</Text>
                </View>
                {tutorial.tools.map((tool, i) => (
                  <View key={i} style={styles.itemRow}>
                    <View style={[styles.bullet, { backgroundColor: accent }]} />
                    <Text style={styles.itemText}>{tool}</Text>
                  </View>
                ))}
              </>
            )}

            {tutorial.materials && tutorial.materials.length > 0 && (
              <>
                <View style={[styles.sectionLabelRow, { marginTop: 24 }]}>
                  <Ionicons name="bag-handle" size={15} color="#2D9CFF" />
                  <Text style={styles.sectionLabel}>Materiais / Peças</Text>
                </View>
                {tutorial.materials.map((mat, i) => (
                  <View key={i} style={styles.itemRow}>
                    <View style={[styles.bullet, { backgroundColor: '#2D9CFF' }]} />
                    <Text style={styles.itemText}>{mat}</Text>
                  </View>
                ))}
              </>
            )}

            <View style={styles.shopHint}>
              <Ionicons name="storefront-outline" size={16} color="#2D9CFF" style={{ marginTop: 1 }} />
              <Text style={styles.shopHintText}>
                Encontre esses itens em lojas de material de construção como Leroy Merlin, C&C, ou nas casas de materiais do seu bairro.
              </Text>
            </View>
          </View>
        )}

        {/* Vídeos */}
        {activeTab === 'videos' && (
          <View style={styles.section}>
            <Text style={styles.videosIntro}>
              Assista a vídeos para ver o tutorial na prática antes de começar:
            </Text>
            {tutorial.videos && tutorial.videos.map((video, i) => (
              <AnimatedButton
                key={i}
                style={styles.videoCard}
                onPress={() => openVideo(video.url)}
              >
                <View style={styles.videoThumb}>
                  <Ionicons name="play" size={20} color="#FF3B6B" />
                </View>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoChannel}>{video.channel}</Text>
                  <View style={styles.videoLinkRow}>
                    <Text style={[styles.videoLink, { color: accent }]}>Abrir no YouTube</Text>
                    <Ionicons name="open-outline" size={12} color={accent} />
                  </View>
                </View>
              </AnimatedButton>
            ))}
          </View>
        )}

        {/* Dicas */}
        {activeTab === 'tips' && (
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <Ionicons name="bulb" size={15} color="#FFB020" />
              <Text style={styles.sectionLabel}>Dicas importantes</Text>
            </View>
            {tutorial.tips && tutorial.tips.map((tip, i) => (
              <View key={i} style={styles.tipCard}>
                <Text style={styles.tipNum}>{String(i + 1).padStart(2, '0')}</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>

      {/* Comemoração ao concluir o tutorial */}
      <Modal
        visible={showCelebration}
        transparent
        animationType="fade"
        onRequestClose={handleCelebrationDismiss}
      >
        <Pressable style={styles.celebrationOverlay} onPress={handleCelebrationDismiss}>
          <Confetti />
          <Pressable style={[styles.celebrationCard, { borderColor: accent }]} onPress={() => {}}>
            <View style={[styles.celebrationIconWrap, { backgroundColor: accent + '22', borderColor: accent }]}>
              <Ionicons name="trophy" size={32} color={accent} />
            </View>
            <Text style={styles.celebrationTitle}>Parabéns!</Text>
            <Text style={styles.celebrationText}>
              Você concluiu "{tutorial.title}"!
            </Text>
            <Text style={styles.celebrationHint}>
              {nextTutorial
                ? `Toque fora para ir para "${nextTutorial.title}"`
                : 'Toque fora para voltar à categoria'}
            </Text>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Comemoração especial ao concluir TODOS os tutoriais do app */}
      <Modal
        visible={showGrandFinale}
        transparent
        animationType="fade"
        onRequestClose={handleGrandFinaleDismiss}
      >
        <Pressable style={styles.celebrationOverlay} onPress={handleGrandFinaleDismiss}>
          <Confetti />
          <Pressable style={[styles.celebrationCard, { borderColor: '#FFD60A' }]} onPress={() => {}}>
            <View style={[styles.celebrationIconWrap, { backgroundColor: '#FFD60A22', borderColor: '#FFD60A' }]}>
              <Ionicons name="ribbon" size={34} color="#FFD60A" />
            </View>
            <Text style={styles.celebrationTitle}>Parabéns!</Text>
            <Text style={styles.celebrationText}>
              Você concluiu todos os tutoriais! Agora você pode passar esses ensinamentos
              para seus futuros filhos, pois você já é um homem crescido.
            </Text>
            <Text style={styles.celebrationHint}>Toque fora para voltar ao início</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080C',
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#07080C',
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
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    marginBottom: 12,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  diffText: {
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
  title: {
    fontSize: 23,
    fontWeight: '700',
    color: '#F5F7FA',
    marginBottom: 8,
    lineHeight: 29,
  },
  description: {
    fontSize: 14,
    color: '#8B92A8',
    lineHeight: 21,
  },
  warning: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#1A1611',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.4)',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#FFC861',
    lineHeight: 20,
    fontWeight: '500',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#12141B',
    borderWidth: 1,
    borderColor: '#1F2330',
  },
  tabText: {
    fontSize: 10.5,
    color: '#6B7280',
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#07080C',
  },
  section: {
    padding: 24,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1A1D27',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  resumingText: {
    fontSize: 11.5,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
  },
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7,8,12,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  celebrationCard: {
    backgroundColor: '#12141B',
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 1.5,
  },
  celebrationIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F5F7FA',
    marginBottom: 8,
  },
  celebrationText: {
    fontSize: 15,
    color: '#C2C7D4',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },
  celebrationHint: {
    fontSize: 12.5,
    color: '#6B7280',
    textAlign: 'center',
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#12141B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1F2330',
    gap: 12,
  },
  stepLeft: {
    paddingTop: 2,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1A1D27',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2A2F3D',
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8B92A8',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F5F7FA',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: '#8B92A8',
    lineHeight: 19,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12141B',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    gap: 10,
    borderWidth: 1,
  },
  successText: {
    fontSize: 15,
    fontWeight: '600',
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F5F7FA',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 6,
  },
  itemText: {
    fontSize: 14,
    color: '#C2C7D4',
    lineHeight: 22,
    flex: 1,
  },
  shopHint: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    backgroundColor: '#0E1620',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(45,156,255,0.3)',
  },
  shopHintText: {
    flex: 1,
    fontSize: 13,
    color: '#7FBFFF',
    lineHeight: 20,
  },
  videosIntro: {
    fontSize: 14,
    color: '#8B92A8',
    marginBottom: 16,
    lineHeight: 21,
  },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: '#12141B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2330',
    gap: 14,
    alignItems: 'center',
  },
  videoThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: 'rgba(255,59,107,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,59,107,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F5F7FA',
    marginBottom: 3,
    lineHeight: 18,
  },
  videoChannel: {
    fontSize: 12,
    color: '#5C6378',
    marginBottom: 5,
  },
  videoLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoLink: {
    fontSize: 12,
    fontWeight: '700',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1611',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.3)',
  },
  tipNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFB020',
    minWidth: 22,
  },
  tipText: {
    fontSize: 14,
    color: '#E0C896',
    lineHeight: 21,
    flex: 1,
  },
});
