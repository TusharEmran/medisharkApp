import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../app/theme/ThemeContext';
import { Colors } from '../../constants/theme';

interface ExamExitConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExamExitConfirmModal({ visible, onConfirm, onCancel }: ExamExitConfirmModalProps) {
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: palette.cardBackground }]}>
          <Text style={[styles.title, { color: palette.surfaceDarkText }]}>Leave this exam?</Text>
          <Text style={[styles.body, { color: palette.mutedText }]}>
            If you leave now, your current answers will be treated as final and submitted.
            You won't be able to re-enter or retake this exam while it is still in progress.
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.secondaryBtn,
                { borderColor: palette.borderSubtle, backgroundColor: palette.cardBackgroundSoft },
              ]}
              onPress={onCancel}
            >
              <Text style={[styles.secondaryText, { color: palette.mutedText }]}>Stay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={onConfirm}>
              <Text style={styles.primaryText}>Leave & Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: Colors.light.surfaceDarkText,
  },
  body: {
    fontSize: 14,
    color: Colors.light.mutedText,
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.light.borderSubtle,
    backgroundColor: Colors.light.cardBackground,
  },
  secondaryText: {
    fontSize: 14,
    color: Colors.light.mutedText,
    fontWeight: '500',
  },
  primaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#ef4444',
  },
  primaryText: {
    fontSize: 14,
    color: Colors.light.accentTealSofter,
    fontWeight: '600',
  },
});

export default ExamExitConfirmModal;
