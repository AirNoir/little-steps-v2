import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>👶</Text>
      <Text style={styles.title}>小步腳印</Text>
      <Text style={styles.subtitle}>記錄孩子的每一個成長足跡</Text>

      <TouchableOpacity 
        onPress={handleLogin}
        disabled={loading}
        style={styles.loginButton}
      >
        {loading ? (
          <ActivityIndicator color="#0D1B2A" />
        ) : (
          <Text style={styles.loginButtonText}>開始使用</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        登入即表示同意我們的服務條款
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#0D1B2A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    color: '#666',
    fontSize: 12,
    marginTop: 20,
    position: 'absolute',
    bottom: 40,
  },
});
