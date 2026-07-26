import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import Toolbar from '../components/Toolbar';
import SeoReportDashboard from '../components/SeoReportDashboard';
import AuditForm from '../components/AuditForm';
import AuditPollingScreen from '../components/AuditPollingScreen';
import { useAuth } from '../context/AuthContext';
import { useAuditPolling } from '../hooks/useAuditPolling';

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const { state, report, error, startAudit, reset, stopPolling } = useAuditPolling();

    useEffect(() => stopPolling, [stopPolling]);

    if (authLoading) {
        return (
            <View style={styles.centeredScreen}>
                <ActivityIndicator color="#94a3b8" style={{ marginBottom: 12 }} />
                <Text style={styles.loadingText}>LOADING WORKSPACE...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.centeredScreen}>
                <View style={styles.deniedCard}>
                    <Text style={styles.deniedTitle}>Access Denied</Text>
                    <Text style={styles.deniedText}>
                        You must be logged in to access this data reporting profile.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Toolbar />
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                {state === 'idle' && (
                    <AuditForm onSubmit={(domain) => startAudit(domain)} />
                )}

                {state === 'polling' && <AuditPollingScreen />}

                {state === 'error' && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                        <Pressable style={styles.retryButton} onPress={reset}>
                            <Text style={styles.retryButtonText}>TRY AGAIN</Text>
                        </Pressable>
                    </View>
                )}

                {state === 'ready' && report && (
                    <>
                        <SeoReportDashboard report={report} />
                        <Pressable style={styles.newAuditButton} onPress={reset}>
                            <Text style={styles.newAuditButtonText}>RUN ANOTHER AUDIT</Text>
                        </Pressable>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    centeredScreen: {
        flex: 1,
        backgroundColor: '#020617',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    loadingText: { color: '#94a3b8', fontSize: 13, fontWeight: '600', letterSpacing: 1 },
    deniedCard: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#0f172a',
        padding: 24,
        maxWidth: 320,
        alignItems: 'center',
        gap: 8,
    },
    deniedTitle: { fontSize: 14, fontWeight: '700', color: 'white' },
    deniedText: { fontSize: 12, color: '#94a3b8', textAlign: 'center' },
    main: { flex: 1, backgroundColor: 'rgba(15,23,42,0.4)' },
    mainContent: { padding: 16, flexGrow: 1 },
    errorBox: {
        margin: 16,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.2)',
        backgroundColor: 'rgba(239,68,68,0.1)',
        alignItems: 'center',
        gap: 12,
    },
    errorText: { color: '#f87171', fontSize: 13, textAlign: 'center' },
    retryButton: {
        backgroundColor: '#06b6d4',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    retryButtonText: { color: '#020617', fontSize: 11, fontWeight: '700' },
    newAuditButton: {
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#334155',
        paddingVertical: 12,
        alignItems: 'center',
    },
    newAuditButtonText: { color: '#cbd5e1', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});