import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getVoiceLogs, VoiceLog } from '../lib/supabase';

export default function LogsScreen() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<VoiceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;
    try {
      const data = await getVoiceLogs(user.id);
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😢';
      default: return '😐';
    }
  };

  const renderItem = ({ item }: { item: VoiceLog }) => {
    const data = item.structured_json || {};
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.date}>{formatDate(item.created_at)}</Text>
          <Text style={styles.mood}>{getMoodEmoji(data.mood)}</Text>
        </View>
        
        {data.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{data.category}</Text>
          </View>
        )}
        
        <Text style={styles.summary}>{data.summary || '分析中...'}</Text>
        
        {data.milestones && data.milestones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ 進度</Text>
            {data.milestones.map((m, i) => (
              <Text key={i} style={styles.bullet}>• {m}</Text>
            ))}
          </View>
        )}
        
        {data.next_steps && data.next_steps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 下次練習</Text>
            {data.next_steps.map((n, i) => (
              <Text key={i} style={styles.bullet}>• {n}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>載入中...</Text>
      </View>
    );
  }

  if (logs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>還沒有記錄</Text>
        <Text style={styles.emptyHint}>回到首頁開始錄音</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    padding: 16,
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
  },
  empty: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  emptyHint: {
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1B3A4B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    color: '#a0a0a0',
    fontSize: 14,
  },
  mood: {
    fontSize: 20,
  },
  categoryBadge: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    color: '#0D1B2A',
    fontSize: 12,
    fontWeight: '600',
  },
  summary: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  bullet: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 8,
  },
});
