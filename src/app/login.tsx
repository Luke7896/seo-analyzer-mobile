import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { authService, type LoginRequest } from '../api/authService';

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async () => {
        setError(null);
        setIsLoading(true);

        const request: LoginRequest = { identifier, password };

        try {
            const response = await authService.login(request);
            login(response.token);
            router.replace('/dashboard');
        } catch (err: any) {
            console.error('Login failed', err);
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    const goToRegister = () => {
        console.log('go to register called');
        router.push('/register');
    };

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>Login</Text>
                    <Text style={styles.subtitle}>
                        Sign in to access your SEO Performance Audit metrics
                    </Text>
                </View>

                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={identifier}
                            onChangeText={setIdentifier}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                            placeholderTextColor="#475569"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                            placeholderTextColor="#475569"
                        />
                    </View>

                    <Pressable
                        onPress={handleLogin}
                        disabled={isLoading}
                        style={({ pressed }) => [
                            styles.submitButton,
                            isLoading && styles.submitButtonDisabled,
                            pressed && !isLoading && styles.submitButtonPressed,
                        ]}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#020617" />
                        ) : (
                            <Text style={styles.submitButtonText}>SIGN IN</Text>
                        )}
                    </Pressable>
                </View>

                <View style={styles.divider} />

                <View style={styles.registerBox}>
                    <Text style={styles.registerPrompt}>Don't have an account yet?</Text>
                    <Pressable onPress={goToRegister} style={styles.registerButton}>
                        <Text style={styles.registerButtonText}>CREATE NEW ACCOUNT</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#020617',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#1e293b',
        backgroundColor: '#0f172a',
        padding: 24,
        gap: 24,
    },
    header: {
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 13,
        color: '#94a3b8',
        textAlign: 'center',
        fontWeight: '500',
    },
    errorBox: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.2)',
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        padding: 12,
    },
    errorText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#f87171',
        textAlign: 'center',
    },
    form: {
        gap: 18,
    },
    field: {
        gap: 6,
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    input: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1e293b',
        backgroundColor: '#020617',
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#f1f5f9',
    },
    submitButton: {
        borderRadius: 12,
        backgroundColor: '#06b6d4',
        paddingVertical: 12,
        alignItems: 'center',
    },
    submitButtonPressed: {
        transform: [{ scale: 0.98 }],
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#020617',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    divider: {
        height: 1,
        backgroundColor: '#1e293b',
    },
    registerBox: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(2,132,199,0.2)',
        backgroundColor: '#020617',
        padding: 16,
        alignItems: 'center',
        gap: 10,
    },
    registerPrompt: {
        fontSize: 12,
        color: '#cbd5e1',
        fontWeight: '500',
    },
    registerButton: {
        width: '100%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#334155',
        backgroundColor: '#0f172a',
        paddingVertical: 10,
        alignItems: 'center',
    },
    registerButtonText: {
        fontSize: 11,
        fontWeight: '700',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
});