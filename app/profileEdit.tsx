import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './theme/ThemeContext';
import { Colors } from '../constants/theme';
import { getUserProfile, updateUserProfile, UserProfile } from './api/userData.api';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [medicalCollege, setMedicalCollege] = useState('');
  const [session, setSession] = useState('');
  const [avatarVariant, setAvatarVariant] = useState<'teal' | 'emerald'>('teal');
  const [showMedicalOptions, setShowMedicalOptions] = useState(false);
  const [showSessionOptions, setShowSessionOptions] = useState(false);

  const router = useRouter();
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;

  const userId = profile?.userId ?? 'ID: MED-XXXX-0000';
  const mainBatch = profile?.mainBatch ?? 'Main batch';

  const MEDICAL_COLLEGE_OPTIONS = [
    'Dhaka Medical College',
    'Sir Salimullah Medical College',
    'Shaheed Suhrawardy Medical College',
    'Chittagong Medical College',
    'Rajshahi Medical College',
  ];

  const SESSION_OPTIONS = [
    '2022-2023',
    '2023-2024',
    '2024-2025',
    '2025-2026',
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setName(data.name ?? '');
        setMobile(data.mobile ?? '');
        setMedicalCollege(data.medicalCollege ?? '');
        setSession(data.session ?? '');
      } catch {
      }
    };

    loadProfile();
  }, []);

  const handleToggleAvatar = () => {
    setAvatarVariant((prev) => (prev === 'teal' ? 'emerald' : 'teal'));
  };

  const handleChangePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    const updated = await updateUserProfile({ avatarUrl: uri });
    setProfile(updated);
  };

  const handleSave = async () => {
    try {
      const updated = await updateUserProfile({
        name,
        mobile,
        medicalCollege,
        session,
      });
      setProfile(updated);
      router.replace('/(tabs)/profile');
    } catch {
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={palette.surfaceDarkText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: palette.surfaceDarkText }]}>Edit Profile</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <View style={styles.profileCardShadow}>
        <View style={[styles.profileCard, { backgroundColor: palette.cardBackground }]}>
          <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.8}>
            <View
              style={[
                styles.avatar,
                avatarVariant === 'teal'
                  ? { backgroundColor: palette.accentTealSoft }
                  : { backgroundColor: palette.accentEmeraldSoft },
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
              <View style={[styles.avatarEditBadge, { backgroundColor: palette.accentTealSofter }]}>
                <Ionicons name="camera" size={14} color={palette.primaryMuted} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.nameText, { color: palette.surfaceDarkText }]}>{name}</Text>
            </View>
            <Text style={[styles.userIdText, { color: palette.mutedText }]}>{userId}</Text>
            <View style={styles.batchRow}>
              <Ionicons name="school" size={16} color={palette.primaryMuted} />
              <Text style={[styles.batchText, { color: palette.primary }]}>{mainBatch}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: palette.cardBackground }]}
      >
        <Text style={[styles.label, { color: palette.mutedText }]}>Full name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={[styles.input, { backgroundColor: palette.cardBackgroundSoft, color: palette.surfaceDarkText }]}
          placeholder="Enter your name"
          placeholderTextColor={palette.iconMuted}
        />

        <Text style={[styles.label, { color: palette.mutedText }]}>Mobile number</Text>
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          style={[styles.input, { backgroundColor: palette.cardBackgroundSoft, color: palette.surfaceDarkText }]}
          placeholder="Enter your mobile number"
          placeholderTextColor={palette.iconMuted}
        />

        <Text style={[styles.label, { color: palette.mutedText }]}>Medical college</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.selector, { backgroundColor: palette.cardBackgroundSoft }]}
          onPress={() => {
            setShowMedicalOptions((prev) => !prev);
            setShowSessionOptions(false);
          }}
        >
          <Text style={[styles.selectorText, { color: medicalCollege ? palette.surfaceDarkText : palette.iconMuted }]}>
            {medicalCollege || 'Select medical college'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={palette.iconMuted} />
        </TouchableOpacity>

        {showMedicalOptions && (
          <View style={[styles.optionsList, { backgroundColor: palette.cardBackgroundSoft }]}>
            {MEDICAL_COLLEGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionItem}
                onPress={() => {
                  setMedicalCollege(option);
                  setShowMedicalOptions(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        option === medicalCollege
                          ? palette.primary
                          : palette.surfaceDarkText,
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TextInput
          value={medicalCollege}
          onChangeText={setMedicalCollege}
          style={[styles.hiddenInput]}
        />

        <Text style={[styles.label, { color: palette.mutedText }]}>Session</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.selector, { backgroundColor: palette.cardBackgroundSoft }]}
          onPress={() => {
            setShowSessionOptions((prev) => !prev);
            setShowMedicalOptions(false);
          }}
        >
          <Text style={[styles.selectorText, { color: session ? palette.surfaceDarkText : palette.iconMuted }]}>
            {session || 'Select session'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={palette.iconMuted} />
        </TouchableOpacity>

        {showSessionOptions && (
          <View style={[styles.optionsList, { backgroundColor: palette.cardBackgroundSoft }]}>
            {SESSION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionItem}
                onPress={() => {
                  setSession(option);
                  setShowSessionOptions(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        option === session
                          ? palette.primary
                          : palette.surfaceDarkText,
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TextInput
          value={session}
          onChangeText={setSession}
          style={[styles.hiddenInput]}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: palette.primary }]}
        activeOpacity={0.8}
        onPress={handleSave}
      >
        <Text style={[styles.saveButtonText, { color: '#ffffff' }]}>Save changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
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
    fontWeight: '600',
  },
  headerRightSpacer: {
    width: 40,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  selector: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  selectorText: {
    fontSize: 14,
  },
  optionsList: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 14,
  },
  hiddenInput: {
    height: 0,
    opacity: 0,
    marginBottom: 0,
  },
  saveButton: {
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
});
