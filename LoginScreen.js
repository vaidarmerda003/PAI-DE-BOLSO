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

export default function LoginScreen({ onLogin, goToCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleEntrar = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Ops', 'Digite um e-mail válido.');
      return;
    }
    if (!senha.trim()) {
      Alert.alert('Ops', 'Digite sua senha.');
      return;
    }

    setSubmitting(true);
    const result = await onLogin({ email: email.trim(), senha });
    setSubmitting(false);

    if (!result.success) {
      Alert.alert('Não foi possível entrar', result.message);
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
          <Text style={styles.formTitle}>Entrar</Text>
          <Text style={styles.formSubtitle}>Bem-vindo de volta! Informe seus dados.</Text>

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
                placeholder="Sua senha"
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

          <AnimatedButton style={styles.submitBtn} onPress={handleEntrar} disabled={submitting}>
            <Text style={styles.submitText}>{submitting ? 'Entrando...' : 'Entrar'}</Text>
            <Ionicons name="arrow-forward" size={18} color="#07080C" />
          </AnimatedButton>

          <AnimatedButton style={styles.linkBtn} onPress={goToCadastro}>
            <Text style={styles.linkText}>Não tem conta? <Text style={styles.linkTextAccent}>Cadastre-se</Text></Text>
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
