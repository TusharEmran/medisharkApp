import React, { useEffect, useState, useRef } from 'react';
import { Stack } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { AppState, AppStateStatus } from 'react-native';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import AnimatedSplash from './splash';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/theme';

export default function RootLayout() {
    const [showSplash, setShowSplash] = useState(true);
    const [appStateChanged, setAppStateChanged] = useState(false);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        ExpoSplashScreen.preventAutoHideAsync().catch(() => { });
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        setAppStateChanged(true);
        appState.current = nextAppState;
    };

    const handleFinish = async () => {
        try {
            await ExpoSplashScreen.hideAsync();
        } catch (e) {
        }
        setShowSplash(false);
    };

    return (
        <ThemeProvider>
            <SystemUiThemeBridge />
            {showSplash && !appStateChanged ? (
                <AnimatedSplash onFinish={handleFinish} />
            ) : (
                <ThemedStack />
            )}
        </ThemeProvider>
    );
}

function SystemUiThemeBridge() {
    const { isDarkMode } = useTheme();
    const backgroundColor = isDarkMode ? Colors.dark.background : Colors.light.background;

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(backgroundColor).catch(() => {
        });
    }, [backgroundColor]);

    return <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={backgroundColor} translucent={false} />;
}

function ThemedStack() {
    const { isDarkMode } = useTheme();
    const backgroundColor = isDarkMode ? Colors.dark.background : Colors.light.background;

    return (
        <Stack
            screenOptions={{
                animation: 'slide_from_right',
                headerShown: false,
                contentStyle: {
                    backgroundColor,
                },
            }}
        >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
                name="lesssonPacks/AllExamPacks"
                options={{
                    animation: 'none',
                }}
            />
            <Stack.Screen name="lesssonPacks/SubmodulePacks" />
            <Stack.Screen name="lesssonPacks/SubmoduleDetail" />
        </Stack>
    );
}
