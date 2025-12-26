import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../../constants/theme';
import { getUserProfile, UserProfile } from '../api/userData.api';

type PaymentParams = {
    title?: string;
};

const courseBannerImage = require('../../assets/images/medisharkcourse.webp');

export default function PaymentScreen() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const palette = isDarkMode ? Colors.dark : Colors.light;

    const params = useLocalSearchParams<PaymentParams>();
    const courseTitle = typeof params.title === 'string' ? params.title : 'Course';

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    const [couponModalVisible, setCouponModalVisible] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    const priceText = useMemo(() => {
        return appliedCoupon ? '৳ 999 (coupon applied)' : '৳ 999';
    }, [appliedCoupon]);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const data = await getUserProfile();
                if (mounted) setProfile(data);
            } finally {
                if (mounted) setProfileLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, []);

    const applyCoupon = () => {
        const value = couponInput.trim();
        if (!value) return;
        setAppliedCoupon(value);
        setCouponModalVisible(false);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: palette.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={[styles.headerRow, { backgroundColor: palette.background }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.headerIconButton, { backgroundColor: palette.cardBackgroundSoft }]}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chevron-back" size={20} color={palette.surfaceDarkText} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: palette.surfaceDarkText }]} numberOfLines={1}>
                    Payment
                </Text>

                <View style={styles.headerRightSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.summaryCard, { backgroundColor: palette.cardBackground, borderColor: palette.borderSubtle }]}>
                    <View style={[styles.courseBannerWrap, { backgroundColor: palette.cardBackgroundSoft, borderColor: palette.borderSubtle }]}>
                        <Image source={courseBannerImage} style={styles.courseBannerImage} resizeMode="cover" />
                        <View style={styles.courseBannerBottomBar}>
                            <Text style={styles.courseBannerCourseName} numberOfLines={1}>
                                {courseTitle}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: palette.mutedText }]}>Total</Text>
                        <Text style={[styles.totalValue, { color: palette.surfaceDarkText }]}>{priceText}</Text>
                    </View>

                    {appliedCoupon ? (
                        <View style={[styles.appliedRow, { borderColor: palette.borderSubtle, backgroundColor: palette.cardBackgroundSoft }]}>
                            <Ionicons name="pricetag-outline" size={16} color={palette.primary} />
                            <Text style={[styles.appliedText, { color: palette.surfaceDarkText }]} numberOfLines={1}>
                                Coupon: {appliedCoupon}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setAppliedCoupon(null);
                                    setCouponInput('');
                                }}
                                style={styles.appliedRemove}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="close" size={16} color={palette.iconMuted} />
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>

                <View style={styles.formBlock}>
                    <View style={[styles.readonlyCard, { backgroundColor: palette.cardBackground, borderColor: palette.borderSubtle }]}>
                        {profileLoading ? (
                            <View style={styles.loadingRow}>
                                <Ionicons name="hourglass-outline" size={16} color={palette.iconMuted} />
                                <Text style={[styles.loadingText, { color: palette.mutedText }]}>Loading profile…</Text>
                            </View>
                        ) : (
                            <>
                                <ReadonlyRow
                                    label="Full Name"
                                    value={profile?.name ?? '—'}
                                    palette={palette}
                                />
                                <ReadonlyRow
                                    label="Email"
                                    value={'—'}
                                    palette={palette}
                                />
                                <ReadonlyRow
                                    label="Phone Number"
                                    value={profile?.mobile ?? '—'}
                                    palette={palette}
                                />
                                <ReadonlyRow
                                    label="Institution"
                                    value={profile?.medicalCollege ?? '—'}
                                    palette={palette}
                                />
                                <ReadonlyRow
                                    label="Session"
                                    value={profile?.session ?? '—'}
                                    palette={palette}
                                />
                            </>
                        )}
                    </View>
                </View>

                <View style={styles.actionsBlock}>
                    <TouchableOpacity
                        style={[styles.secondaryButton, { backgroundColor: palette.cardBackground, borderColor: palette.borderSubtle }]}
                        activeOpacity={0.9}
                        onPress={() => setCouponModalVisible(true)}
                    >
                        <Ionicons name="pricetag-outline" size={18} color={palette.primary} />
                        <Text style={[styles.secondaryButtonText, { color: palette.surfaceDarkText }]}>Apply coupon</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: palette.primary }]}
                        activeOpacity={0.9}
                        onPress={() => {
                            // Payment integration comes later
                        }}
                    >
                        <Text style={[styles.primaryButtonText, { color: palette.accentTealSofter }]}>Proceed to pay</Text>
                        <Ionicons name="arrow-forward" size={18} color={palette.accentTealSofter} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                transparent
                visible={couponModalVisible}
                animationType="fade"
                onRequestClose={() => setCouponModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalCard, { backgroundColor: palette.cardBackground, borderColor: palette.borderSubtle }]}>
                        <View style={styles.modalHeaderRow}>
                            <Text style={[styles.modalTitle, { color: palette.surfaceDarkText }]}>Apply coupon</Text>
                            <TouchableOpacity
                                onPress={() => setCouponModalVisible(false)}
                                style={[styles.modalClose, { backgroundColor: palette.cardBackgroundSoft }]}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="close" size={18} color={palette.surfaceDarkText} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.modalSubtitle, { color: palette.mutedText }]}>Enter your coupon code</Text>

                        <View style={[styles.inputWrap, { backgroundColor: palette.cardBackgroundSoft, borderColor: palette.borderSubtle }]}>
                            <Ionicons name="key-outline" size={18} color={palette.iconMuted} />
                            <TextInput
                                value={couponInput}
                                onChangeText={setCouponInput}
                                placeholder="e.g. MEDISHARK10"
                                placeholderTextColor={palette.iconMuted}
                                style={[styles.input, { color: palette.surfaceDarkText }]}
                                autoCapitalize="characters"
                            />
                        </View>

                        <View style={styles.modalActionsRow}>
                            <TouchableOpacity
                                onPress={() => setCouponModalVisible(false)}
                                style={[styles.modalSecondary, { backgroundColor: palette.cardBackgroundSoft }]}
                                activeOpacity={0.9}
                            >
                                <Text style={[styles.modalSecondaryText, { color: palette.surfaceDarkText }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={applyCoupon}
                                style={[styles.modalPrimary, { backgroundColor: palette.primary }]}
                                activeOpacity={0.9}
                            >
                                <Text style={[styles.modalPrimaryText, { color: palette.accentTealSofter }]}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

function ReadonlyRow({
    label,
    value,
    palette,
}: {
    label: string;
    value: string;
    palette: typeof Colors.light;
}) {
    return (
        <View style={[styles.readonlyRow, { borderBottomColor: palette.borderSubtle }]}>
            <Text style={[styles.readonlyLabel, { color: palette.mutedText }]}>{label}</Text>
            <Text style={[styles.readonlyValue, { color: palette.surfaceDarkText }]} numberOfLines={2}>
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    headerRow: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
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
        fontSize: 18,
        fontWeight: '700',
    },
    headerRightSpacer: {
        width: 36,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 28,
    },

    summaryCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
    },
    courseBannerWrap: {
        height: 160,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
    },
    courseBannerImage: {
        width: '100%',
        height: '100%',
    },
    courseBannerBottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    courseBannerCourseName: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '800',
    },

    totalRow: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 13,
        fontWeight: '800',
    },

    appliedRow: {
        marginTop: 12,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    appliedText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
    },
    appliedRemove: {
        padding: 4,
    },

    formBlock: {
        borderRadius: 16,
        padding: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    sectionSubtitle: {
        fontSize: 12,
        marginTop: 4,
        marginBottom: 10,
    },

    readonlyCard: {
        borderWidth: 1,
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 12,
    },
    readonlyRow: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    readonlyLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    readonlyValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    loadingRow: {
        paddingHorizontal: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    loadingText: {
        fontSize: 13,
        fontWeight: '600',
    },

    actionsBlock: {
        marginTop: 14,
        gap: 10,
    },
    secondaryButton: {
        borderWidth: 1,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    primaryButton: {
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    primaryButtonText: {
        fontSize: 15,
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
    },
    modalHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
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
    modalSubtitle: {
        fontSize: 12,
        marginBottom: 10,
    },
    inputWrap: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 0,
    },
    modalActionsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    modalSecondary: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    modalSecondaryText: {
        fontSize: 14,
        fontWeight: '700',
    },
    modalPrimary: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    modalPrimaryText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
