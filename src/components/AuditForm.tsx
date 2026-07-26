import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';

interface Props {
    onSubmit: (domain: string) => void;
    submitting?: boolean;
}

export default function AuditForm({ onSubmit, submitting = false }: Props) {
    const [domain, setDomain] = useState('');

    const handleSubmit = () => {
        const trimmed = domain.trim();
        if (!trimmed) return;
        onSubmit(trimmed);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Run a New SEO Audit</Text>
            <Text style={styles.subtitle}>
                Enter a website URL to generate a free performance report.
            </Text>

            <TextInput
                value={domain}
                onChangeText={setDomain}
                placeholder="example.com"
                placeholderTextColor="#475569"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                style={styles.input}
            />

            <Pressable
                onPress={handleSubmit}
                disabled={submitting || !domain.trim()}
                style={({ pressed }) => [
                    styles.button,
                    (submitting || !domain.trim()) && styles.buttonDisabled,
                    pressed && styles.buttonPressed,
                ]}
            >
                {submitting ? (
                    <ActivityIndicator color="#020617" />
                ) : (
                    <Text style={styles.buttonText}>RUN AUDIT</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: 'rgba(30,41,59,0.8)',
        borderRadius: 16,
        padding: 24,
        gap: 16,
        margin: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: 'white',
    },
    subtitle: {
        fontSize: 13,
        color: '#94a3b8',
        lineHeight: 18,
        marginTop: -8,
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
    button: {
        borderRadius: 12,
        backgroundColor: '#06b6d4',
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonPressed: {
        backgroundColor: '#22d3ee',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#020617',
        letterSpacing: 0.8,
    },
});