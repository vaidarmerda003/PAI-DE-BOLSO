import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedButton from './components/AnimatedButton';

const NEON = '#00E5FF';

export default function CadastroScreen({ onRegister, goToLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCadastrar = async () => {
    if (!nome.trim()) {
      Alert.alert('Ops', 'Digite seu nome.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Ops', 'Digite um e-mail válido.');
      return;
    }
    if (!senha.trim() || senha.length < 4) {
      Alert.alert('Ops', 'A senha precisa ter pelo menos 4 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Ops', 'As senhas não são iguais.');
      return;
    }

    setSubmitting(true);
    const result = await onRegister({ nome: nome.trim(), email: email.trim(), senha });
    setSubmitting(false);

    if (!result.success) {
      Alert.alert('Não foi possível cadastrar', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.logoWrap}>
          <View style={styles.logoBadge}>
            <Ionicons name="hammer" size={28} color={NEON} />
          </View>
          <Text style={styles.appName}>PAI DE BOLSO</Text>
          <Text style={styles.tagline}>Tutoriais práticos para o dia a dia</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Criar conta</Text>
          <Text style={styles.formSubtitle}>Preencha seus dados pra começar a aprender.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOME</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={NEON} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Como você quer ser chamado"
                placeholderTextColor="#5C6378"
                value={nome}
                onChangeText={setNome}
                selectionColor={NEON}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-MAIL</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={NEON} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#5C6378"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                selectionColor={NEON}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SENHA</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={NEON} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 4 caracteres"
                placeholderTextColor="#5C6378"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showSenha}
                selectionColor={NEON}
              />
              <Ionicons
                name={showSenha ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color="#6B7280"
                onPress={() => setShowSenha(v => !v)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CONFIRMAR SENHA</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={NEON} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Repita a senha"
                placeholderTextColor="#5C6378"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!showSenha}
                selectionColor={NEON}
              />
            </View>
          </View>

          <AnimatedButton style={styles.submitBtn} onPress={handleCadastrar} disabled={submitting}>
            <Text style={styles.submitText}>{submitting ? 'Criando...' : 'Criar conta'}</Text>
            <Ionicons name="arrow-forward" size={18} color="#07080C" />
          </AnimatedButton>

          <AnimatedButton style={styles.linkBtn} onPress={goToLogin}>
            <Text style={styles.linkText}>Já tem uma conta? <Text style={styles.linkTextAccent}>Entrar</Text></Text>
          </AnimatedButton>

          <Text style={styles.footerNote}>
            Seus dados ficam salvos só neste aparelho.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080C',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#12141B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,229,255,0.4)',
    marginBottom: 14,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F5F7FA',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    color: '#6B7280',
  },
  form: {
    backgroundColor: '#12141B',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#1F2330',
  },
  formTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#F5F7FA',
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#8B92A8',
    marginBottom: 22,
    lineHeight: 19,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C0E14',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#1F2330',
    gap: 10,
  },
  inputIcon: {
    marginRight: 0,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: '#F5F7FA',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: NEON,
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#07080C',
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  linkText: {
    fontSize: 13.5,
    color: '#8B92A8',
  },
  linkTextAccent: {
    color: NEON,
    fontWeight: '700',
  },
  footerNote: {
    fontSize: 11.5,
    color: '#5C6378',
    textAlign: 'center',
    marginTop: 4,
  },
});
