import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import CadastroScreen from './app/CadastroScreen';
import LoginScreen from './app/LoginScreen';
import HomeScreen from './app/HomeScreen';
import CategoryScreen from './app/CategoryScreen';
import TutorialScreen from './app/TutorialScreen';
import SearchScreen from './app/SearchScreen';
import {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutCurrentUser,
  hasAnyRegisteredUser,
} from './data/authStorage';

const NEON = '#00E5FF';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  // 'cadastro' | 'login' | null (null = já logado, mostra o app normal)
  const [authScreen, setAuthScreen] = useState('cadastro');
  // Histórico de telas de verdade: cada "navigate" empilha, cada "goBack" desempilha.
  // Assim o botão Voltar sempre retorna pra tela de onde a pessoa realmente veio
  // (Home, Categoria ou Busca), em vez de assumir sempre a mesma tela anterior.
  const [screenStack, setScreenStack] = useState(['home']);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const currentScreen = screenStack[screenStack.length - 1];

  // Ao abrir o app: se já tem alguém logado, vai direto pra Home.
  // Se não, mas já existe conta cadastrada neste aparelho, mostra Login.
  // Se nunca cadastrou ninguém, mostra Cadastro.
  useEffect(() => {
    (async () => {
      const savedUser = await getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
        setAuthScreen(null);
        setScreenStack(['home']);
      } else {
        const hasAccounts = await hasAnyRegisteredUser();
        setAuthScreen(hasAccounts ? 'login' : 'cadastro');
      }
      setIsLoading(false);
    })();
  }, []);

  const handleRegister = async (data) => {
    const result = await registerUser(data);
    if (result.success) {
      setUser(result.user);
      setAuthScreen(null);
      setScreenStack(['home']);
    }
    return result;
  };

  const handleLoginSubmit = async (data) => {
    const result = await loginUser(data);
    if (result.success) {
      setUser(result.user);
      setAuthScreen(null);
      setScreenStack(['home']);
    }
    return result;
  };

  const handleLogout = async () => {
    await logoutCurrentUser();
    setUser(null);
    setScreenStack(['home']);
    setAuthScreen('login');
  };

  // params.reset   -> começa um histórico novo (usado ao voltar pro início de vez)
  // params.replace -> troca a tela atual sem empilhar (usado ao avançar pro próximo tutorial)
  const navigate = (screen, params = {}) => {
    if (params.category) setSelectedCategory(params.category);
    if (params.tutorial) setSelectedTutorial(params.tutorial);
    setScreenStack(prev => {
      if (params.reset) return [screen];
      if (params.replace) return [...prev.slice(0, -1), screen];
      return [...prev, screen];
    });
  };

  const goBack = () => {
    setScreenStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#07080C" />
        <ActivityIndicator size="large" color={NEON} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07080C" />
      {authScreen === 'cadastro' && (
        <CadastroScreen
          onRegister={handleRegister}
          goToLogin={() => setAuthScreen('login')}
        />
      )}
      {authScreen === 'login' && (
        <LoginScreen
          onLogin={handleLoginSubmit}
          goToCadastro={() => setAuthScreen('cadastro')}
        />
      )}
      {authScreen === null && currentScreen === 'home' && (
        <HomeScreen navigate={navigate} userName={user?.nome} userEmail={user?.email} onLogout={handleLogout} />
      )}
      {authScreen === null && currentScreen === 'category' && (
        <CategoryScreen
          category={selectedCategory}
          navigate={navigate}
          goBack={goBack}
        />
      )}
      {authScreen === null && currentScreen === 'tutorial' && (
        <TutorialScreen
          tutorial={selectedTutorial}
          goBack={goBack}
          navigate={navigate}
          userEmail={user?.email}
        />
      )}
      {authScreen === null && currentScreen === 'search' && (
        <SearchScreen
          navigate={navigate}
          goBack={goBack}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080C',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#07080C',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
