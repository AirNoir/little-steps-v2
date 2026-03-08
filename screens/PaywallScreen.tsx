import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function PaywallScreen() {
  const { user } = useAuth();

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    // TODO: Integrate with RevenueCat
    // For now, show a message
    alert('RevenueCat 整合即將上線！');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>💎</Text>
      <Text style={styles.title}>升級 Pro</Text>
      <Text style={styles.subtitle}>不遺漏任何一堂課的進步</Text>

      {/* Features */}
      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📈</Text>
          <View>
            <Text style={styles.featureTitle}>每週 20 次錄音</Text>
            <Text style={styles.featureDesc}>從 2 次升級到 20 次</Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🤖</Text>
          <View>
            <Text style={styles.featureTitle}>AI 結構化報告</Text>
            <Text style={styles.featureDesc}>專業早療師級分析</Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📊</Text>
          <View>
            <Text style={styles.featureTitle}>歷史趨勢分析</Text>
            <Text style={styles.featureDesc}>追蹤孩子成長進步</Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🏷️</Text>
          <View>
            <Text style={styles.featureTitle}>標籤自動化</Text>
            <Text style={styles.featureDesc}>自動分類更方便</Text>
          </View>
        </View>
      </View>

      {/* Pricing */}
      <TouchableOpacity 
        style={styles.planButton}
        onPress={() => handleSubscribe('yearly')}
      >
        <View style={styles.planHeader}>
          <Text style={styles.planName}>年付</Text>
          <Text style={styles.planBadge}>節省 17%</Text>
        </View>
        <Text style={styles.planPrice}>NT$ 990 / 年</Text>
        <Text style={styles.planPerMonth}>相當於每月 NT$ 82</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.planButton, styles.planButtonSecondary]}
        onPress={() => handleSubscribe('monthly')}
      >
        <Text style={styles.planNameSecondary}>月付</Text>
        <Text style={styles.planPriceSecondary}>NT$ 99 / 月</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        訂閱後可隨時取消
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 60,
    marginTop: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    marginBottom: 30,
  },
  features: {
    width: '100%',
    marginBottom: 30,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  featureDesc: {
    color: '#666',
    fontSize: 14,
  },
  planButton: {
    backgroundColor: '#D4AF37',
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  planName: {
    color: '#0D1B2A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  planBadge: {
    backgroundColor: '#fff',
    color: '#D4AF37',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  planPrice: {
    color: '#0D1B2A',
    fontSize: 24,
    fontWeight: 'bold',
  },
  planPerMonth: {
    color: '#0D1B2A',
    fontSize: 14,
    opacity: 0.8,
  },
  planButtonSecondary: {
    backgroundColor: '#1B3A4B',
  },
  planNameSecondary: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planPriceSecondary: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  terms: {
    color: '#666',
    fontSize: 12,
    marginTop: 20,
  },
});
