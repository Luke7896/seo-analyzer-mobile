import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { authService, type RegisterRequest } from '../api/authService';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const checks = {
        length: password.length >= 12,
        number: /[0-9]/.test(password),
        uppercase: /[A-Z]/.test(password),
        symbol: /[!#$%^&*()<>?, ./\\|~]/.test(password),
        lowercase: /[a-z]/.test(password),
        match: password.length > 0 && password === confirmPassword,
    };

    const handleRegister = async () => {
        setError(null);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!Object.values(checks).every(Boolean)) {
            setError('Please complete all password requirements first.');
            return;
        }

        setIsLoading(true);

        const request: RegisterRequest = {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
        };

        try {
            await authService.register(request);
            router.replace('/login');
        } catch (err: any) {
            console.error('Registration failed', err);
            setError(err.response?.data?.message || 'Failed to create an account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const goToLogin = () => {
        router.replace('/login');
    };

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Register</Text>
                        <Text style={styles.subtitle}>
                            Create your account to improve your SEO Performance
                        </Text>
                    </View>

                    {error && (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.form}>
                        <Field label="First Name" value={firstName} onChangeText={setFirstName} />
                        <Field label="Last Name" value={lastName} onChangeText={setLastName} />
                        <Field
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <Field
                            label="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                        />

                    </View>

                    {/* Password Security Checklist */}
                    <View style={styles.checklistBox}>
                        <Text style={styles.checklistTitle}>PASSWORD SECURITY CHECKLIST</Text>
                        <View style={styles.checklistItems}>
                            <CheckItem label="12+ characters long" valid={checks.length} />
                            <CheckItem label="1 number (0-9)" valid={checks.number} />
                            <CheckItem label="1 uppercase letter (A-Z)" valid={checks.uppercase} />
                            <CheckItem label="1 lowercase letter (a-z)" valid={checks.lowercase} />
                            <CheckItem label="1 symbol (! # $ % ^ & * ( ) < > ? , . / \ | ~)" valid={checks.symbol} />
                            <CheckItem label="Both passwords match" valid={checks.match} />
                        </View>
                    </View>

                    <View style={styles.form}>
                        <Field
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <Field
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <Pressable
                        onPress={handleRegister}
                        disabled={isLoading}
                        style={({ pressed }) => [
                            styles.submitButton,
                            isLoading && styles.submitButtonDisabled,
                            pressed && !isLoading && styles.submitButtonPressed,
                        ]}
                    >
                        <Text style={styles.submitButtonText}>
                            {isLoading ? 'PROCESSING...' : 'SIGN UP'}
                        </Text>
                    </Pressable>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Pressable onPress={goToLogin}>
                            <Text style={styles.footerLink}>Sign In</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

interface FieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
}

function Field({ label, value, onChangeText, secureTextEntry, autoCapitalize, keyboardType }: FieldProps) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize ?? 'sentences'}
                keyboardType={keyboardType ?? 'default'}
                style={styles.input}
                placeholderTextColor="#475569"
            />
        </View>
    );
}

function CheckItem({ label, valid }: { label: string; valid: boolean }) {
    return (
        <View style={styles.checkItem}>
            <Text style={styles.checkDot}>{valid ? '🟢' : '🔴'}</Text>
            <Text style={[styles.checkLabel, valid ? styles.checkLabelValid : styles.checkLabelInvalid]}>
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#020617',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
        justifyContent: 'center',
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(30,41,59,0.8)',
        backgroundColor: '#0f172a',
        padding: 20,
        gap: 20,
    },
    header: {
        alignItems: 'center',
        gap: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
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
        padding: 10,
    },
    errorText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#f87171',
        textAlign: 'center',
    },
    form: {
        gap: 14,
    },
    field: {
        gap: 6,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    input: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1e293b',
        backgroundColor: '#020617',
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#f1f5f9',
    },
    checklistBox: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1e293b',
        backgroundColor: 'rgba(2,6,23,0.6)',
        padding: 14,
        gap: 10,
    },
    checklistTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: '#64748b',
        letterSpacing: 1,
    },
    checklistItems: {
        gap: 8,
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    checkDot: {
        fontSize: 11,
        lineHeight: 18,
    },
    checkLabel: {
        fontSize: 12,
        fontWeight: '700',
        flex: 1,
        lineHeight: 18,
    },
    checkLabelValid: {
        color: '#34d399',
    },
    checkLabelInvalid: {
        color: '#f87171',
        opacity: 0.85,
    },
    submitButton: {
        borderRadius: 12,
        backgroundColor: '#22d3ee',
        paddingVertical: 14,
        alignItems: 'center',
    },
    submitButtonPressed: {
        backgroundColor: '#67e8f9',
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        fontSize: 13,
        fontWeight: '900',
        color: '#020617',
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(30,41,59,0.6)',
    },
    footerText: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '500',
    },
    footerLink: {
        fontSize: 13,
        color: '#38bdf8',
        fontWeight: '700',
    },
});