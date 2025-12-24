import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../../constants/theme';
import { getUserProfile, updateUserProfile, UserProfile } from '../api/userData.api';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');

  const router = useRouter();

  const { isDarkMode, toggleDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;

  const userId = profile?.userId ?? 'ID: MED-XXXX-0000';
  const mainBatch = profile?.mainBatch ?? 'Main batch';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setName(data.name);
      } catch {
        // ignore for now
      }
    };

    loadProfile();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: palette.surfaceDarkText }]}>Profile</Text>
        <View style={[styles.headerBadge, { backgroundColor: palette.accentTealSoft }]}>
          <Ionicons name="shield-checkmark" size={18} color={palette.primaryMuted} />
          <Text style={[styles.headerBadgeText, { color: palette.primaryMuted }]}>Verified</Text>
        </View>
      </View>

      <View style={styles.profileCardShadow}>
        <View style={[styles.profileCard, { backgroundColor: palette.cardBackground }]}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: palette.accentTealSoft },
            ]}
          >
            {profile?.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={[styles.avatarInitials, { color: palette.primaryMuted }]}>
                {profile?.initials ?? 'CN'}
              </Text>
            )}
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <>
                <Text style={[styles.nameText, { color: palette.surfaceDarkText }]}>{name}</Text>
                <TouchableOpacity
                  onPress={() => router.push('/profileEdit')}
                  style={styles.editNameButton}
                >
                  <Ionicons name="pencil" size={16} color={palette.primary} />
                </TouchableOpacity>
              </>
            </View>

            <Text style={[styles.userIdText, { color: palette.mutedText }]}>{userId}</Text>
            <View style={styles.batchRow}>
              <Ionicons name="school" size={16} color={palette.primaryMuted} />
              <Text style={[styles.batchText, { color: palette.primary }]}>{mainBatch}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: isDarkMode ? palette.cardBackgroundSoft : palette.accentTealSoft },
          ]}
        >
          <Text style={[styles.statNumber, { color: palette.text }]}>
            {profile?.enrolledCourses.length ?? 0}
          </Text>
          <Text style={[styles.statLabel, { color: palette.primary }]}>Enrolled courses</Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: isDarkMode ? palette.cardBackgroundSoft : palette.accentTealSoft },
          ]}
        >
          <Text style={[styles.statNumber, { color: palette.text }]}>
            {profile?.admissionYear ?? 0}
          </Text>
          <Text style={[styles.statLabel, { color: palette.primary }]}>Admission year</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: palette.surfaceDarkText }]}>Enrolled courses</Text>
      </View>

      {(profile?.enrolledCourses ?? []).map((course) => (
        <View key={course.id} style={styles.courseCardShadow}>
          <View style={[styles.courseCard, { backgroundColor: palette.cardBackground }]}>
            <View style={[styles.courseIconCircle, { backgroundColor: palette.accentTealSoft }]}>
              <Ionicons name="layers" size={18} color={palette.primaryMuted} />
            </View>
            <View style={styles.courseContent}>
              <Text style={[styles.courseTitle, { color: palette.surfaceDarkText }]}>{course.title}</Text>
              <Text style={[styles.courseBatch, { color: palette.primary }]}>{course.batch}</Text>
              <Text style={[styles.courseEnrolledOn, { color: palette.mutedText }]}>{course.enrolledOn}</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: palette.surfaceDarkText }]}>App settings</Text>
      </View>

      <View style={styles.settingsCardShadow}>
        <View style={[styles.settingsCard, { backgroundColor: palette.cardBackground }]}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsLabelRow}>
              <Ionicons name="moon" size={20} color={palette.primaryMuted} />
              <View>
                <Text style={[styles.settingsTitle, { color: palette.surfaceDarkText }]}>Dark mode</Text>
                <Text style={[styles.settingsSubtitle, { color: palette.mutedText }]}>Toggle app appearance</Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? palette.primarySoft : '#f9fafb'}
              trackColor={{ false: palette.borderSubtle, true: palette.accentTealSoft }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#020617',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  textLight: {
    color: '#f9fafb',
  },
  textMutedDark: {
    color: '#9ca3af',
  },
  textAccentDark: {
    color: '#a5f3fc',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#ecfeff',
  },
  headerBadgeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#0f766e',
  },
  profileCardShadow: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  avatarTeal: {
    backgroundColor: '#ccfbf1',
  },
  avatarEmerald: {
    backgroundColor: '#bbf7d0',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f766e',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ecfeff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  editNameButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  nameEditRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f3f4f6',
    fontSize: 14,
    color: '#111827',
  },
  saveNameButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#0d9488',
  },
  saveNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ecfeff',
  },
  userIdText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  batchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  batchText: {
    fontSize: 13,
    color: '#0f766e',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#ecfeff',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardSoftDark: {
    backgroundColor: '#0b1120',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f766e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  courseCardShadow: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  cardDark: {
    backgroundColor: '#020617',
  },
  courseIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#ccfbf1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  courseBatch: {
    fontSize: 13,
    color: '#047857',
    marginBottom: 2,
  },
  courseEnrolledOn: {
    fontSize: 12,
    color: '#6b7280',
  },
  settingsCardShadow: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 12,
  },
  settingsCard: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  settingsSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
});
