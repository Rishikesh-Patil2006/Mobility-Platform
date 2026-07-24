import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  description: string;
  confirmWord?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  description,
  confirmWord = 'DELETE',
  onConfirm,
  onCancel,
}) => {
  const [inputVal, setInputVal] = useState('');

  const canConfirm = inputVal.trim().toUpperCase() === confirmWord;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>⚠️ {title}</Text>
          <Text style={styles.desc}>{description}</Text>
          <Text style={styles.instruction}>
            Type <Text style={styles.bold}>{confirmWord}</Text> below to confirm:
          </Text>

          <TextInput
            style={styles.input}
            placeholder={`Type ${confirmWord}`}
            value={inputVal}
            onChangeText={setInputVal}
            autoCapitalize="characters"
          />

          <View style={styles.btnRow}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!canConfirm}
              onPress={() => {
                setInputVal('');
                onConfirm();
              }}
              style={[styles.confirmBtn, !canConfirm ? styles.confirmBtnDisabled : null]}
            >
              <Text style={styles.confirmText}>Confirm Permanent Action</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 8,
  },
  desc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 12,
  },
  instruction: {
    fontSize: 11.5,
    color: '#334155',
    marginBottom: 6,
  },
  bold: {
    fontWeight: '900',
    color: '#DC2626',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#DC2626',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
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
  confirmBtn: {
    flex: 1.5,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#FCA5A5',
  },
  confirmText: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '900',
  },
});
export default ConfirmationDialog;
