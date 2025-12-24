import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const [loading, setLoading] = useState(false);

    // Dummy sign-in: simulate a network/login delay and navigate with a fake user
    const signInWithGoogle = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            const userInfo = {
                user: {
                    name: 'Demo User',
                    email: 'demo@example.com',
                },
            };
            navigation.replace('Home', { user: userInfo });
        }, 800);
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/medishark.png')}
                style={styles.logoLarge}
                resizeMode="contain"
            />

            <Text style={styles.title}>MediShark</Text>
            <Text style={styles.welcomeText}>Welcome back — Login NOW</Text>
            <Text style={styles.subtitle}>Smart medical learning companion</Text>

            <TouchableOpacity
                style={styles.googleCard}
                onPress={signInWithGoogle}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#0872fc" />
                ) : (
                    <>
                        <Image
                            source={{ uri: 'https://www.google.com/favicon.ico' }}
                            style={styles.googleIcon}
                        />
                        <Text style={styles.googleCardText}>Continue with Google</Text>
                    </>
                )}
            </TouchableOpacity>

            <Text style={styles.termsText}>
                This is a demo login — no external services used.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6fbff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '88%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 6,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 8,
    },
    logoLarge: {
        width: 160,
        height: 160,
        marginBottom: 12,
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0872fc',
        marginTop: 6,
        marginBottom: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0b1220',
        marginTop: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 20,
        textAlign: 'center',
    },
    googleCard: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 14,
        width: '88%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    googleIcon: {
        width: 22,
        height: 22,
        marginRight: 8,
    },
    googleCardText: {
        color: '#0b1220',
        fontSize: 16,
        fontWeight: '700',
    },
    termsText: {
        marginTop: 18,
        fontSize: 12,
        color: '#9aa1ac',
        textAlign: 'center',
        paddingHorizontal: 12,
    },
});

export default LoginScreen;