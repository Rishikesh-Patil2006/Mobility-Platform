import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ReplyCardProps {
  customerName: string;
  initialReply?: string;
  onSaveReply: (text: string) => void;
  onCancel: () => void;
}

export const ReplyCard: React.FC<ReplyCardProps> = ({
  customerName,
  initialReply = '',
  onSaveReply,
  onCancel,
}) => {
  const [replyText, setReplyText] = useState(initialReply);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!replyText.trim()) {
      return setError('Response text cannot be empty.');
    }
    if (replyText.trim().length < 5) {
      return setError('Response text must be at least 5 characters.');
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSaveReply(replyText.trim());
    }, 400);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reply to {customerName}'s Feedback</Text>

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Write a polite response to thank the customer or address feedback..."
          placeholderTextColor="#94A3B8"
          multiline
          value={replyText}
          onChangeText={(t) => {
            setError('');
            setReplyText(t);
          }}
        />
        <Text style={styles.counter}>{replyText.length}/500</Text>
      </View>

      {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}

      <View style={styles.btnRow}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={loading} onPress={handleSave} style={styles.saveBtn}>
          {loading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.saveText}>Submit Response</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  header: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  inputBox: {
    position: 'relative',
  },
  input: {
    height: 90,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    fontSize: 12.5,
    color: '#0F172A',
    textAlignVertical: 'top',
  },
  counter: {
    position: 'absolute',
    bottom: 6,
    right: 10,
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
    marginTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
});
export default ReplyCard;
