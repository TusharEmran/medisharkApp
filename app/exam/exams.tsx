import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../../constants/theme';

export default function ExamsScreen() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const palette = isDarkMode ? Colors.dark : Colors.light;

    const exams = [
        {
            id: 'e1',
            title: 'Midterm Exam',
            course: 'Anatomy & Physiology Basics',
            date: '24 Dec, 2024',
            time: '10:00 AM',
            duration: '2 hours',
            questions: 50,
            status: 'upcoming',
        },
        {
            id: 'e2',
            title: 'Quiz 3',
            course: 'Clinical Pharmacology',
            date: '28 Dec, 2024',
            time: '2:00 PM',
            duration: '45 minutes',
            questions: 20,
            status: 'upcoming',
        },
        {
            id: 'e3',
            title: 'Final Exam',
            course: 'Medical Ethics & Law',
            date: '05 Jan, 2025',
            time: '9:00 AM',
            duration: '3 hours',
            questions: 100,
            status: 'upcoming',
        },
    ];

    const handleStartExam = (examId: string, title: string, course: string) => {
        router.push({
            pathname: '/exam/rules',
            params: { examId, title, course },
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: palette.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: palette.tabBackground }]}>
                <TouchableOpacity
                    onPress={() => router.navigate('/(tabs)/explore')}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color={palette.surfaceDarkText} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerTitle, { color: palette.surfaceDarkText }]}>Exams</Text>
                    <Text style={[styles.headerSubtitle, { color: palette.mutedText }]}>
                        {exams.length} upcoming exams
                    </Text>
                </View>
                <View style={styles.headerIconWrap}>
                    <Ionicons name="document-text" size={24} color={palette.primary} />
                </View>
            </View>

            {/* Exams List */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {exams.map(exam => (
                    <View
                        key={exam.id}
                        style={[styles.examCard, { backgroundColor: palette.cardBackground }]}
                    >
                        <View style={styles.examHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.examTitle, { color: palette.surfaceDarkText }]}>
                                    {exam.title}
                                </Text>
                                <Text style={[styles.examCourse, { color: palette.mutedText }]}>
                                    {exam.course}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor:
                                            exam.status === 'upcoming'
                                                ? palette.accentTealSofter
                                                : palette.borderSubtle,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        {
                                            color:
                                                exam.status === 'upcoming'
                                                    ? palette.primary
                                                    : palette.mutedText,
                                        },
                                    ]}
                                >
                                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.examDetailsRow}>
                            <View style={styles.detailItem}>
                                <Ionicons name="calendar-outline" size={16} color={palette.iconMuted} />
                                <Text style={[styles.detailText, { color: palette.subtleText }]}>
                                    {exam.date}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="time-outline" size={16} color={palette.iconMuted} />
                                <Text style={[styles.detailText, { color: palette.subtleText }]}>
                                    {exam.time}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.examDetailsRow}>
                            <View style={styles.detailItem}>
                                <Ionicons name="hourglass-outline" size={16} color={palette.iconMuted} />
                                <Text style={[styles.detailText, { color: palette.subtleText }]}>
                                    {exam.duration}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="help-circle-outline" size={16} color={palette.iconMuted} />
                                <Text style={[styles.detailText, { color: palette.subtleText }]}>
                                    {exam.questions} questions
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.startButton, { backgroundColor: palette.primary }]}
                            onPress={() => handleStartExam(exam.id, exam.title, exam.course)}
                            activeOpacity={0.9}
                        >
                            <Ionicons name="play-circle-outline" size={18} color={palette.accentTealSofter} />
                            <Text style={[styles.startButtonText, { color: palette.accentTealSofter }]}>
                                Start Exam
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
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

    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    headerSubtitle: { marginTop: 4, fontSize: 13 },

    headerIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    scrollContent: { padding: 20, paddingBottom: 80 },

    examCard: {
        borderRadius: 16,
        padding: 18,
        marginBottom: 18,
        borderWidth: 1,
    },

    examHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
        gap: 12,
    },

    examTitle: {
        fontSize: 16,
        fontWeight: '600',
    },

    examCourse: {
        marginTop: 4,
        fontSize: 13,
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },

    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },

    examDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 6,
    },

    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },

    detailText: {
        fontSize: 12,
    },

    startButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    startButtonText: {
        fontSize: 14,
    },
});
