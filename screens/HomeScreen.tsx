import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../contexts/AuthContext';
import { canRecord, saveVoiceLog } from '../lib/supabase';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user, signOut } = useAuth();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [usage, setUsage] = useState({ allowed: false, remaining: 0, isPro: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUsage();
  }, [user]);

  const checkUsage = async () => {
    if (!user) return;
    try {
      const result = await canRecord(user.id);
      setUsage(result);
    } catch (error) {
      console.error('Error checking usage:', error);
    }
  };

  const startRecording = async () => {
    if (!usage.allowed) {
      Alert.alert('次數用完了', '請升級 Pro 解鎖更多次數', [
        { text: '升級', onPress: () => navigation.navigate('Paywall') },
        { text: '取消', style: 'cancel' },
      ]);
      return;
    }

    try {
      setLoading(true);
      
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('需要權限', '請允許麥克風權限');
        return;
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('錯誤', '無法開始錄音');
    } finally {
      setLoading(false);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setLoading(true);
      setIsRecording(false);
      
      // Stop recording
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) {
        Alert.alert('錯誤', '無法取得錄音檔');
        return;
      }

      // TODO: Upload to Supabase Storage
      // TODO: Call Edge Function to process with Whisper + Gemini
      
      Alert.alert('成功', '錄音已儲存！AI 正在分析中...');
      
      // Refresh usage
      await checkUsage();
 (error) {
      
    } catch      console.error('Error stopping recording:', error);
      Alert.alert('錯誤', '儲存失敗');
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>小步腳印</Text>
          <Text style={styles.subtitle}>早療日誌</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>登出</Text>
        </TouchableOpacity>
      </View>

      {/* Usage Card */}
      <View style={styles.usageCard}>
        <Text style={styles.usageLabel}>
          {usage.isPro ? 'Pro 會員' : '免費版'}
        </Text>
        <Text style={styles.usageCount}>
          本週剩餘：{usage.remaining} / {usage.isPro ? '20' : '2'} 次
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(usage.remaining / (usage.isPro ? 20 : 2)) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Record Button */}
      <View style={styles.recordArea}>
        <TouchableOpacity 
          onPress={toggleRecording}
          disabled={loading}
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive
          ]}
        >
          <View style={[
            styles.recordButtonInner,
            isRecording && styles.recordButtonInnerActive
          ]} />
        </TouchableOpacity>
        <Text style={styles.recordHint}>
          {isRecording ? '點擊停止' : '點擊開始錄音'}
        </Text>
      </View>

      {/* View Logs Button */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('Logs')}
        style={styles.logsButton}
      >
        <Text style={styles.logsButtonText}>📋 查看記錄列表</Text>
      </TouchableOpacity>

      {/* Paywall Banner (for free users) */}
      {!usage.isPro && (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Paywall')}
          style={styles.paywallBanner}
        >
          <Text style={styles.paywallBannerText}>
            🚀 升級 Pro，解鎖每週 20 次錄音
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#D4AF37',
  },
  logoutBtn: {
    padding: 10,
  },
  logoutText: {
    color: '#ef5350',
    fontSize: 16,
  },
  usageCard: {
    backgroundColor: '#1B3A4B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  usageLabel: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  usageCount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#0f0f0f',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 4,
  },
  recordArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1B3A4B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#D4AF37',
  },
  recordButtonActive: {
    borderColor: '#ef5350',
  },
  recordButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D4AF37',
  },
  recordButtonInnerActive: {
    backgroundColor: '#ef5350',
    borderRadius: 8,
    width: 40,
    height: 40,
  },
  recordHint: {
    color: '#a0a0a0',
    marginTop: 16,
    fontSize: 16,
  },
  logsButton: {
    backgroundColor: '#1B3A4B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paywallBanner: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  paywallBannerText: {
    color: '#0D1B2A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
