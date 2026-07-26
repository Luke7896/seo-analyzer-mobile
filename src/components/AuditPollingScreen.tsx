import { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';

const SEO_FACTS = [
    "Google processes over 8.5 billion searches every day.",
    "53% of website traffic comes from organic search.",
    "The #1 result in Google gets roughly 27% of all clicks.",
    "Page speed is a confirmed ranking factor. Even a 1 second delay can hurt.",
    "Mobile devices account for over 60% of all web traffic.",
    "Backlinks remain one of the top 3 ranking factors for Google.",
    "75% of users never scroll past the first page of search results.",
    "Title tags are still one of the most important on-page SEO elements.",
    "Websites with a blog tend to have 434% more indexed pages.",
    "Broken links and 404 errors can quietly hurt your site.",
    "Alt text on images helps both accessibility and image search rankings.",
    "Long-form content (1,500+ words) tends to earn more backlinks on average.",
];

const FACT_INTERVAL_MS = 10000;

export default function AuditPollingScreen() {
    const [factIndex, setFactIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start(() => {
                setFactIndex((prev) => (prev + 1) % SEO_FACTS.length);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }).start();
            });
        }, FACT_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [fadeAnim]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#22d3ee" />
            <Text style={styles.title}>Crawling your site...</Text>
            <Text style={styles.subtitle}>
                This usually takes a few minutes. We're fetching and analyzing your website pages now.
            </Text>

            <View style={styles.factBox}>
                <Text style={styles.factLabel}>DID YOU KNOW?</Text>
                <Animated.Text style={[styles.factText, { opacity: fadeAnim }]}>
                    {SEO_FACTS[factIndex]}
                </Animated.Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 32,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
    },
    subtitle: {
        fontSize: 13,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 18,
        maxWidth: 280,
    },
    factBox: {
        marginTop: 20,
        width: '100%',
        maxWidth: 320,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1e293b',
        backgroundColor: '#0f172a',
        padding: 16,
        minHeight: 90,
        justifyContent: 'center',
    },
    factLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#22d3ee',
        letterSpacing: 1,
        marginBottom: 8,
    },
    factText: {
        fontSize: 13,
        color: '#cbd5e1',
        lineHeight: 19,
    },
});