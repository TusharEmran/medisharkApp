import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../../constants/theme';

export default function ExamRulesScreen() {
  const router = useRouter();
  const { examId, title, course } = useLocalSearchParams<{
    examId?: string;
    title?: string;
    course?: string;
  }>();

  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;

  const handleEnterExam = () => {
    if (!examId) {
      router.back();
      return;
    }
    router.replace(`/exam/examLayout?examId=${examId}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }] }>
      <View style={[styles.header, { backgroundColor: palette.tabBackground }] }>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={palette.surfaceDarkText} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: palette.surfaceDarkText }]}>Exam Rules</Text>
          {title && (
            <Text style={[styles.headerSubtitle, { color: palette.mutedText }]} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {course && (
          <View style={styles.metaBox}>
            <Text style={[styles.metaLabel, { color: palette.mutedText }]}>Course</Text>
            <Text style={[styles.metaValue, { color: palette.surfaceDarkText }]}>{course}</Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: palette.surfaceDarkText }]}>Before you start</Text>

        <View style={styles.ruleItem}>
          <Ionicons name="alert-circle" size={20} color={palette.warning} />
          <Text style={[styles.ruleText, { color: palette.subtleText }]}>
            Once you start the exam, you can't leave or pause until you submit or the exam time ends.
          </Text>
        </View>

        <View style={styles.ruleItem}>
          <Ionicons name="checkmark-circle" size={20} color={palette.primary} />
          <Text style={[styles.ruleText, { color: palette.subtleText }]}>
            On single-choice questions, the first option you select for each question is locked and can't be
            changed.
          </Text>
        </View>

        <View style={styles.ruleItem}>
          <Ionicons name="remove-circle" size={20} color={palette.warning} />
          <Text style={[styles.ruleText, { color: palette.subtleText }]}>
            Wrong answers may deduct points according to this exam's marking scheme. Avoid random guessing.
          </Text>
        </View>

        <View style={styles.ruleItem}>
          <Ionicons name="time" size={20} color={palette.iconMuted} />
          <Text style={[styles.ruleText, { color: palette.subtleText }]}>
            Keep an eye on the timer. The exam will be auto-submitted when time runs out.
          </Text>
        </View>

        <View style={styles.ruleItem}>
          <Ionicons name="document-text" size={20} color={palette.iconMuted} />
          <Text style={[styles.ruleText, { color: palette.subtleText }]}>
            By entering, you confirm you understand these rules and agree to continue this attempt.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: palette.borderSubtle }]}
          onPress={handleCancel}
          activeOpacity={0.9}
        >
          <Text style={[styles.cancelText, { color: palette.mutedText }]}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.enterButton, { backgroundColor: palette.primary }]}
          onPress={handleEnterExam}
          activeOpacity={0.9}
        >
          <Text style={[styles.enterText, { color: palette.accentTealSofter }]}>Enter Exam</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
    gap: 14,
  },
  metaBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  ruleItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#0b11200d',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  enterButton: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  enterText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
