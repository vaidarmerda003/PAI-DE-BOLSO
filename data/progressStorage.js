import AsyncStorage from '@react-native-async-storage/async-storage';

// Deixa a chave segura (sem espaços/caracteres estranhos do e-mail)
const sanitize = (value) => (value || 'convidado').toLowerCase().replace(/[^a-z0-9]/g, '_');

const buildKey = (userEmail, tutorialId) =>
  `@pai_presente_progress_${sanitize(userEmail)}_${tutorialId}`;

// Retorna a lista de índices de passos concluídos (ex: [0, 1, 3]) daquele
// tutorial, para aquela conta. Se nunca abriu, retorna lista vazia.
export async function loadProgress(userEmail, tutorialId) {
  try {
    const raw = await AsyncStorage.getItem(buildKey(userEmail, tutorialId));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Salva a lista de índices de passos concluídos daquele tutorial, para
// aquela conta — em formato JSON, direto no aparelho.
export async function saveProgress(userEmail, tutorialId, completedSteps) {
  try {
    await AsyncStorage.setItem(buildKey(userEmail, tutorialId), JSON.stringify(completedSteps));
  } catch (e) {
    // se der erro ao salvar, o app continua funcionando normalmente
  }
}

// Confere se a conta já concluiu TODOS os tutoriais do app (100% em cada um).
// Recebe a lista completa de tutoriais (import de data/tutorials.js).
export async function areAllTutorialsComplete(userEmail, allTutorials) {
  for (const t of allTutorials) {
    if (!t.steps || t.steps.length === 0) continue;
    const saved = await loadProgress(userEmail, t.id);
    if (saved.length < t.steps.length) return false;
  }
  return true;
}
