import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useTheme } from '../ThemeContext';
import { useCartStore } from '../store';
import { X, Mail, Lock } from 'lucide-react-native';

interface LoginScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const loginLayout = useCartStore((state) => state.loginLayout);
  const loginData = loginLayout[0] || {};
  
  const login = useCartStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Simulated login
    login();
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView 
          style={styles.keyboardView} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{loginData.title || 'Welcome'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>
              {loginData.subtitle || 'Log in to your account'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <Mail size={20} color={colors.subtext} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="parent@example.com"
                  placeholderTextColor={colors.subtext}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <Lock size={20} color={colors.subtext} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.subtext}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.loginBtn, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginBtnText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    alignSelf: 'center',
    zIndex: 100,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    outlineStyle: 'none', // For web
  },
  loginBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A2530',
  },
  forgotBtn: {
    alignItems: 'center',
    marginTop: 24,
    padding: 8,
  },
  forgotText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default LoginScreen;
