import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@pai_presente_users';
const CURRENT_USER_KEY = '@pai_presente_current_user_email';

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

async function loadUsers() {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

async function saveUsers(users) {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    // segue mesmo se der erro ao salvar
  }
}

// Diz se já existe pelo menos uma conta cadastrada neste aparelho.
// Usado pra decidir se a primeira tela é Cadastro ou Login.
export async function hasAnyRegisteredUser() {
  const users = await loadUsers();
  return Object.keys(users).length > 0;
}

// Cria uma nova conta. Se o e-mail já existir, retorna erro.
export async function registerUser({ nome, email, senha }) {
  const key = normalizeEmail(email);
  const users = await loadUsers();
  if (users[key]) {
    return { success: false, message: 'Esse e-mail já está cadastrado. Faça login.' };
  }
  const newUser = { nome: nome.trim(), email: email.trim(), senha };
  users[key] = newUser;
  await saveUsers(users);
  await AsyncStorage.setItem(CURRENT_USER_KEY, key);
  return { success: true, user: newUser };
}

// Confere e-mail + senha contra as contas salvas.
export async function loginUser({ email, senha }) {
  const key = normalizeEmail(email);
  const users = await loadUsers();
  const found = users[key];
  if (!found) {
    return { success: false, message: 'Não encontramos uma conta com esse e-mail.' };
  }
  if (found.senha !== senha) {
    return { success: false, message: 'Senha incorreta.' };
  }
  await AsyncStorage.setItem(CURRENT_USER_KEY, key);
  return { success: true, user: found };
}

// Recupera quem está logado no momento (se alguém estiver).
export async function getCurrentUser() {
  try {
    const key = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!key) return null;
    const users = await loadUsers();
    return users[key] || null;
  } catch (e) {
    return null;
  }
}

// Sai da conta atual, mas mantém o cadastro salvo pra próxima vez fazer login.
export async function logoutCurrentUser() {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (e) {}
}
