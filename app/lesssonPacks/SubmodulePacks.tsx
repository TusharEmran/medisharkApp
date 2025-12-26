import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import StudyPacksCard from '../../components/StudyPacksCard';
import { Colors } from '../../constants/theme';
import { useTheme } from '../theme/ThemeContext';
import { SUBMODULE_TREE, SubmoduleTreeNode } from './submoduleData';

const bannerImage = require('../../assets/images/medisharkcourse.webp');

const SubmodulePacks: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ title?: string; parentId?: string; progress?: string }>();

  const isScrollingRef = useRef(false);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parentId = params.parentId ?? 'root';
  const courseTitle = params.title ?? 'Submodules';
  const progressRaw = params.progress;
  const progressValue = useMemo(() => {
    const parsed = Number(progressRaw);
    if (!Number.isFinite(parsed)) return null;
    return Math.max(0, Math.min(100, parsed));
  }, [progressRaw]);

  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;

  const node: SubmoduleTreeNode = SUBMODULE_TREE[parentId] ?? { submodules: [], exams: [] };
  const isLeaf = node.submodules.length === 0;
  const onlineClasses = node.onlineClasses ?? [];

  const [activeSection, setActiveSection] = useState<'classes' | 'exams'>('classes');

  const shouldShowSectionToggle = useMemo(() => {
    return isLeaf && (onlineClasses.length > 0 || node.exams.length > 0);
  }, [isLeaf, onlineClasses.length, node.exams.length]);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={palette.surfaceDarkText} />
        </TouchableOpacity>

        <Text style={[styles.heading, { color: palette.surfaceDarkText }]} numberOfLines={1}>
          {courseTitle}
        </Text>

        {/* Spacer to balance back button for centered title */}
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => {
          isScrollingRef.current = true;
          if (scrollEndTimerRef.current) {
            clearTimeout(scrollEndTimerRef.current);
            scrollEndTimerRef.current = null;
          }
        }}
        onMomentumScrollBegin={() => {
          isScrollingRef.current = true;
          if (scrollEndTimerRef.current) {
            clearTimeout(scrollEndTimerRef.current);
            scrollEndTimerRef.current = null;
          }
        }}
        onScrollEndDrag={() => {
          if (scrollEndTimerRef.current) {
            clearTimeout(scrollEndTimerRef.current);
          }
          scrollEndTimerRef.current = setTimeout(() => {
            isScrollingRef.current = false;
          }, 120);
        }}
        onMomentumScrollEnd={() => {
          isScrollingRef.current = false;
          if (scrollEndTimerRef.current) {
            clearTimeout(scrollEndTimerRef.current);
            scrollEndTimerRef.current = null;
          }
        }}
      >
        {shouldShowSectionToggle && (
          <View style={styles.toggleRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setActiveSection('classes')}
              style={[
                styles.toggleButton,
                {
                  backgroundColor: activeSection === 'classes' ? palette.primary : palette.cardBackground,
                  borderColor: activeSection === 'classes' ? palette.primary : palette.borderSubtle,
                },
              ]}
            >
              <Ionicons
                name="videocam-outline"
                size={16}
                color={activeSection === 'classes' ? palette.accentTealSofter : palette.primary}
              />
              <Text
                style={[
                  styles.toggleText,
                  { color: activeSection === 'classes' ? palette.accentTealSofter : palette.surfaceDarkText },
                ]}
              >
                Classes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setActiveSection('exams')}
              style={[
                styles.toggleButton,
                {
                  backgroundColor: activeSection === 'exams' ? palette.primary : palette.cardBackground,
                  borderColor: activeSection === 'exams' ? palette.primary : palette.borderSubtle,
                },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={16}
                color={activeSection === 'exams' ? palette.accentTealSofter : palette.primary}
              />
              <Text
                style={[
                  styles.toggleText,
                  { color: activeSection === 'exams' ? palette.accentTealSofter : palette.surfaceDarkText },
                ]}
              >
                Exams
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Child submodules: tapping drills down into deeper level */}
        {node.submodules.map((sub, index) => {
          const isLastSubmoduleCard = index === node.submodules.length - 1;

          return (
            <StudyPacksCard
              key={sub.id}
              title={sub.title}
              subtitle={sub.description}
              meta={isLastSubmoduleCard ? '' : 'Submodule'}
              thumbnail="medisharkcourse.webp"
              progressPercent={isLastSubmoduleCard ? (progressValue ?? undefined) : undefined}
              onPress={() => {
                router.push({
                  pathname: '/lesssonPacks/SubmodulePacks',
                  params: {
                    title: sub.title,
                    parentId: sub.id,
                    progress: progressRaw,
                  },
                });
              }}
            />
          );
        })}

        {/* Online classes only appear at leaf nodes */}
        {isLeaf && (!shouldShowSectionToggle || activeSection === 'classes') && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionPill, { backgroundColor: palette.cardBackgroundSoft }]}>
                <Ionicons name="videocam-outline" size={14} color={palette.primary} />
                <Text style={[styles.sectionHeaderLabel, { color: palette.surfaceDarkText }]}>Online classes</Text>
              </View>
            </View>

            {onlineClasses.length === 0 ? (
              <View style={[styles.emptyCard, { borderColor: palette.borderSubtle, backgroundColor: palette.cardBackground }]}>
                <Ionicons name="videocam-off-outline" size={16} color={palette.iconMuted} />
                <Text style={[styles.emptyText, { color: palette.mutedText }]}>No live classes listed for this submodule.</Text>
              </View>
            ) : (
              onlineClasses.map((live, index) => (
                <TouchableOpacity
                  key={live.id}
                  style={[
                    styles.onlineClassCard,
                    {
                      backgroundColor: palette.cardBackground,
                      borderColor: palette.borderSubtle,
                      shadowColor: palette.surfaceDarkText,
                    },
                  ]}
                  activeOpacity={0.9}
                  onPress={() => {
                    router.push({
                      pathname: '/lesssonPacks/viewClass',
                      params: {
                        parentId,
                        classId: live.id,
                        title: courseTitle,
                      },
                    });
                  }}
                >
                  <ImageBackground
                    source={bannerImage}
                    style={[styles.onlineClassThumb, { backgroundColor: palette.cardBackgroundSoft }]}
                    imageStyle={styles.onlineClassThumbImage}
                    resizeMode="cover"
                  />

                  <View style={styles.onlineClassTextCol}>
                    <Text style={[styles.onlineClassKicker, { color: palette.primary }]} numberOfLines={1}>
                      Video - {index + 1}
                    </Text>
                    <Text style={[styles.onlineClassTitle, { color: palette.surfaceDarkText }]} numberOfLines={2}>
                      {live.title}
                    </Text>

                    <View style={styles.onlineClassMetaRow}>
                      <Text style={[styles.onlineClassDuration, { color: palette.mutedText }]} numberOfLines={1}>
                        {live.duration ?? '40m 9s'}
                      </Text>
                      <View style={[styles.onlineClassStatusDot, { backgroundColor: palette.greenPrimary }]} />
                      <Text style={[styles.onlineClassStatus, { color: palette.greenPrimary }]} numberOfLines={1}>
                        {live.status ?? 'Completed'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Exams that live directly under this submodule */}
        {(!shouldShowSectionToggle || activeSection === 'exams') && node.exams.length > 0 && (
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionPill, { backgroundColor: palette.cardBackgroundSoft }]}>
              <Ionicons name="document-text-outline" size={14} color={palette.primary} />
              <Text style={[styles.sectionHeaderLabel, { color: palette.surfaceDarkText }]}>Exams</Text>
            </View>
          </View>
        )}

        {(!shouldShowSectionToggle || activeSection === 'exams') &&
          node.exams.map((exam) => {
            const questionCount = exam.questionCount ?? 40;
            const duration = exam.duration ?? '30 min';
            const meta = `${questionCount} questions • ${duration}`;

            return (
              <StudyPacksCard
                key={exam.id}
                title={exam.title}
                subtitle={exam.description}
                meta={meta}
                thumbnail="medisharkcourse.webp"
                onPress={() => {
                  if (isScrollingRef.current) return;
                  router.push('/exam/examLayout');
                }}
              />
            );
          })}

        {isLeaf && (!shouldShowSectionToggle || activeSection === 'exams') && node.exams.length === 0 && (
          <View style={[styles.emptyCard, { borderColor: palette.borderSubtle, backgroundColor: palette.cardBackground }]}>
            <Text style={[styles.emptyText, { color: palette.mutedText }]}>No exams available for this submodule.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 0,
    color: Colors.light.surfaceDarkText,
  },
  rightSpacer: {
    width: 32,
  },
  listContainer: {
    paddingBottom: 120,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionBlock: {
    marginTop: 8,
    marginBottom: 12,
    gap: 8,
  },
  sectionHeaderRow: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeaderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.surfaceDarkText,
  },
  sectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
  },
  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  examIconColumn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examTextCol: {
    flex: 1,
  },
  examTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  examSubtitle: {
    fontSize: 13,
  },
  examMetaRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  examMetaText: {
    fontSize: 11,
  },
  examBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 64,
    alignItems: 'center',
  },
  examBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  classAccent: {
    width: 4,
    height: '100%',
    borderRadius: 4,
  },
  classIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classTextCol: {
    flex: 1,
  },
  classTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  classSubtitle: {
    fontSize: 13,
  },
  classMetaRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 12,
    flexWrap: 'wrap',
  },
  classMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classMetaText: {
    fontSize: 11,
  },
  classBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 64,
    alignItems: 'center',
  },
  classBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  onlineClassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  onlineClassThumb: {
    width: 112,
    height: 68,
    borderRadius: 10,
    overflow: 'hidden',
  },
  onlineClassThumbImage: {
    borderRadius: 10,
  },
  onlineClassTextCol: {
    flex: 1,
  },
  onlineClassKicker: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  onlineClassTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  onlineClassMetaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineClassDuration: {
    fontSize: 12,
    fontWeight: '600',
  },
  onlineClassStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineClassStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  banner: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  bannerImage: {
    borderRadius: 16,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerContent: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    gap: 6,
  },
  bannerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerKicker: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  bannerSubtitle: {
    fontSize: 13,
    opacity: 0.9,
  },
});

export default SubmodulePacks;
