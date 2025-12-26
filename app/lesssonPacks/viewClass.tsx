
import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEvent } from 'expo';
import { VideoView, useVideoPlayer } from 'expo-video';

import { Colors } from '../../constants/theme';
import { useTheme } from '../theme/ThemeContext';
import { SUBMODULE_TREE, OnlineClassNode } from './submoduleData';

type ViewClassParams = {
    parentId?: string;
    classId?: string;
    title?: string;
};

function normalizeVideoUri(url: string): string {
    const trimmed = url.trim();
    const unquoted = trimmed.replace(/^['"]+|['"]+$/g, '');

    const windowsPathMatch = /^([A-Za-z]):\\(.+)$/.exec(unquoted);
    if (windowsPathMatch) {
        const drive = windowsPathMatch[1];
        const rest = windowsPathMatch[2].replace(/\\/g, '/');
        const encoded = rest
            .split('/')
            .map((seg) => encodeURIComponent(seg))
            .join('/');
        return `file:///${drive}:/${encoded}`;
    }
    return unquoted;
}

function formatDuration(durationMillis: number): string {
    const totalSeconds = Math.max(0, Math.floor(durationMillis / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

export default function ViewClassScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<ViewClassParams>();

    const parentId = typeof params.parentId === 'string' ? params.parentId : 'root';
    const classId = typeof params.classId === 'string' ? params.classId : undefined;
    const headerTitle = typeof params.title === 'string' ? params.title : 'Online class';

    const { isDarkMode } = useTheme();
    const palette = isDarkMode ? Colors.dark : Colors.light;

    const onlineClasses: OnlineClassNode[] = SUBMODULE_TREE[parentId]?.onlineClasses ?? [];

    const currentIndex = useMemo(() => {
        if (!classId) return 0;
        const idx = onlineClasses.findIndex((c) => c.id === classId);
        return idx >= 0 ? idx : 0;
    }, [classId, onlineClasses]);

    const currentClass = onlineClasses[currentIndex];

    const [playlistVisible, setPlaylistVisible] = useState(false);

    const navigateToIndex = (nextIndex: number) => {
        const next = onlineClasses[nextIndex];
        if (!next) return;
        router.replace({
            pathname: '/lesssonPacks/viewClass',
            params: {
                parentId,
                classId: next.id,
                title: headerTitle,
            },
        });
    };

    const videoLabel = `Video - ${Math.min(currentIndex + 1, Math.max(onlineClasses.length, 1))}`;
    const rawVideoUrl = currentClass?.videoUrl;
    const rawVideoUrlClean = typeof rawVideoUrl === 'string' ? rawVideoUrl.trim().replace(/^['"]+|['"]+$/g, '') : undefined;
    const looksLikeWindowsPath =
        typeof rawVideoUrlClean === 'string' && /^[A-Za-z]:/.test(rawVideoUrlClean) && !rawVideoUrlClean.includes('://');

    const normalizedUri = typeof rawVideoUrlClean === 'string' ? normalizeVideoUri(rawVideoUrlClean) : undefined;
    const videoUri =
        !looksLikeWindowsPath && typeof normalizedUri === 'string' && /^(https?:|file:)/.test(normalizedUri)
            ? normalizedUri
            : undefined;

    const player = useVideoPlayer(videoUri ?? null, (p) => {
        p.pause();
    });

    const statusChange = useEvent(player, 'statusChange', {
        status: player.status,
        oldStatus: player.status,
    });

    const sourceLoad = useEvent(player, 'sourceLoad', {
        availableAudioTracks: [],
        availableSubtitleTracks: [],
        availableVideoTracks: [],
        duration: player.duration,
        videoSource: null,
    });

    const loadedDurationSeconds = sourceLoad?.duration;

    const durationText = useMemo(() => {
        if (typeof loadedDurationSeconds === 'number' && loadedDurationSeconds > 0) {
            return formatDuration(loadedDurationSeconds * 1000);
        }
        return currentClass?.duration ?? '40m 9s';
    }, [currentClass?.duration, loadedDurationSeconds]);
    const statusText = currentClass?.status ?? 'Completed';
    const statusIsCompleted = statusText.toLowerCase() === 'completed';

    const playbackError = statusChange?.status === 'error' ? 'Unable to play this video.' : undefined;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.headerIconButton, { backgroundColor: palette.cardBackgroundSoft }]}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chevron-back" size={20} color={palette.surfaceDarkText} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: palette.surfaceDarkText }]} numberOfLines={1}>
                    {headerTitle}
                </Text>

                <TouchableOpacity
                    onPress={() => setPlaylistVisible(true)}
                    style={[styles.headerIconButton, { backgroundColor: palette.cardBackgroundSoft }]}
                    activeOpacity={0.8}
                >
                </TouchableOpacity>
            </View>

            <View style={[styles.playerCard, { backgroundColor: palette.cardBackground, borderColor: palette.borderSubtle }]}>
                {videoUri ? (
                    <VideoView
                        style={styles.video}
                        player={player}
                        nativeControls
                        contentFit="contain"
                    />
                ) : (
                    <View style={[styles.videoPlaceholder, { backgroundColor: palette.cardBackgroundSoft }]}
                    >
                        <Ionicons name="videocam-outline" size={28} color={palette.iconMuted} />
                        <Text style={[styles.placeholderText, { color: palette.mutedText }]}>No video source set</Text>
                    </View>
                )}

                {videoUri ? (
                    <View style={styles.playerHintRow}>
                        {looksLikeWindowsPath ? (
                            <Text style={[styles.playerHintText, { color: palette.warning }]}>This is a Windows PC path; it won’t play on Android/iOS/web.</Text>
                        ) : null}
                        {playbackError ? (
                            <Text style={[styles.playerHintText, { color: palette.warning }]}>Video error: {playbackError}</Text>
                        ) : null}
                    </View>
                ) : null}

                <View style={styles.metaBlock}>
                    <Text style={[styles.kicker, { color: palette.primary }]} numberOfLines={1}>
                        {videoLabel}
                    </Text>
                    <Text style={[styles.title, { color: palette.surfaceDarkText }]} numberOfLines={2}>
                        {currentClass?.title ?? 'Video'}
                    </Text>

                    <View style={styles.metaRow}>
                        <Text style={[styles.duration, { color: palette.mutedText }]} numberOfLines={1}>
                            {durationText}
                        </Text>
                        <View style={[styles.statusDot, { backgroundColor: statusIsCompleted ? palette.greenPrimary : palette.iconMuted }]} />
                        <Text
                            style={[styles.statusText, { color: statusIsCompleted ? palette.greenPrimary : palette.mutedText }]}
                            numberOfLines={1}
                        >
                            {statusText}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionsWrap}>
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigateToIndex(currentIndex - 1)}
                        disabled={currentIndex <= 0}
                        style={[
                            styles.actionButton,
                            {
                                backgroundColor: palette.cardBackground,
                                borderColor: palette.borderSubtle,
                                opacity: currentIndex <= 0 ? 0.5 : 1,
                            },
                        ]}
                    >
                        <Ionicons name="chevron-back" size={18} color={palette.surfaceDarkText} />
                        <Text style={[styles.actionText, { color: palette.surfaceDarkText }]}>Prev</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigateToIndex(currentIndex + 1)}
                        disabled={currentIndex >= onlineClasses.length - 1}
                        style={[
                            styles.actionButton,
                            {
                                backgroundColor: palette.cardBackground,
                                borderColor: palette.borderSubtle,
                                opacity: currentIndex >= onlineClasses.length - 1 ? 0.5 : 1,
                            },
                        ]}
                    >
                        <Text style={[styles.actionText, { color: palette.surfaceDarkText }]}>Next</Text>
                        <Ionicons name="chevron-forward" size={18} color={palette.surfaceDarkText} />
                    </TouchableOpacity>
                </View>

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setPlaylistVisible(true)}
                        style={[
                            styles.actionButton,
                            {
                                backgroundColor: palette.cardBackground,
                                borderColor: palette.borderSubtle,
                            },
                        ]}
                    >
                        <Ionicons name="list" size={18} color={palette.surfaceDarkText} />
                        <Text style={[styles.actionText, { color: palette.surfaceDarkText }]}>Playlist</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={playlistVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setPlaylistVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalCard, { backgroundColor: palette.cardBackground, borderColor: palette.borderSubtle }]}>
                        <View style={styles.modalHeaderRow}>
                            <Text style={[styles.modalTitle, { color: palette.surfaceDarkText }]}>Playlist</Text>
                            <TouchableOpacity
                                onPress={() => setPlaylistVisible(false)}
                                style={[styles.modalClose, { backgroundColor: palette.cardBackgroundSoft }]}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="close" size={18} color={palette.surfaceDarkText} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={onlineClasses}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.playlistContent}
                            renderItem={({ item, index }) => {
                                const selected = item.id === currentClass?.id;
                                const rowStatus = item.status ?? 'Completed';
                                const rowCompleted = rowStatus.toLowerCase() === 'completed';
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            setPlaylistVisible(false);
                                            navigateToIndex(index);
                                        }}
                                        style={[
                                            styles.playlistRow,
                                            {
                                                borderColor: palette.borderSubtle,
                                                backgroundColor: selected ? palette.cardBackgroundSoft : palette.cardBackground,
                                            },
                                        ]}
                                    >
                                        <View style={styles.playlistTextCol}>
                                            <Text style={[styles.playlistKicker, { color: palette.primary }]} numberOfLines={1}>
                                                Video - {index + 1}
                                            </Text>
                                            <Text style={[styles.playlistTitle, { color: palette.surfaceDarkText }]} numberOfLines={2}>
                                                {item.title}
                                            </Text>
                                            <View style={styles.playlistMetaRow}>
                                                <Text style={[styles.playlistDuration, { color: palette.mutedText }]} numberOfLines={1}>
                                                    {item.duration ?? '40m 9s'}
                                                </Text>
                                                <View
                                                    style={[
                                                        styles.statusDot,
                                                        { backgroundColor: rowCompleted ? palette.greenPrimary : palette.iconMuted },
                                                    ]}
                                                />
                                                <Text
                                                    style={[
                                                        styles.playlistStatus,
                                                        { color: rowCompleted ? palette.greenPrimary : palette.mutedText },
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {rowStatus}
                                                </Text>
                                            </View>
                                        </View>
                                        {selected ? (
                                            <Ionicons name="play" size={16} color={palette.primary} />
                                        ) : null}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 35,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
        marginBottom: 12,
    },
    headerIconButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
    },

    playerCard: {
        borderWidth: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        height: 220,
        backgroundColor: '#000',
    },
    videoPlaceholder: {
        width: '100%',
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    placeholderText: {
        fontSize: 13,
        fontWeight: '600',
    },
    playerHintRow: {
        paddingHorizontal: 14,
        paddingTop: 10,
    },
    playerHintText: {
        fontSize: 12,
        fontWeight: '600',
    },

    metaBlock: {
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    kicker: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
    metaRow: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    duration: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },

    actionsWrap: {
        marginTop: 14,
        gap: 10,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
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
    actionText: {
        fontSize: 13,
        fontWeight: '700',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        padding: 20,
        justifyContent: 'center',
    },
    modalCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        maxHeight: '80%',
    },
    modalHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    modalClose: {
        width: 34,
        height: 34,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playlistContent: {
        gap: 10,
        paddingBottom: 8,
    },
    playlistRow: {
        borderWidth: 1,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    playlistTextCol: {
        flex: 1,
        paddingRight: 10,
    },
    playlistKicker: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
    playlistTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    playlistMetaRow: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    playlistDuration: {
        fontSize: 12,
        fontWeight: '600',
    },
    playlistStatus: {
        fontSize: 12,
        fontWeight: '700',
    },
});

