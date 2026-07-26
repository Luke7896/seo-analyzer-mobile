import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { type FullReportDetails } from '../api/reportService';
import HealthRing from './HealthRing';

interface Props {
    report: FullReportDetails;
}

export default function SeoReportDashboard({ report }: Props) {
    const displayHealthScore = Math.min(100, Math.max(0, report.siteHealthScore ?? 0));
    const aiSearchHealthScore = Math.min(
        100,
        Math.max(0, report.aiSearchHealth ?? report.aiSearchScore ?? 0)
    );
    const router = useRouter();

    const siteHealthColor =
        displayHealthScore >= 85
            ? '#10B981'
            : displayHealthScore >= 70
                ? '#F59E0B'
                : displayHealthScore >= 50
                    ? '#F97316'
                    : '#EF4444';

    const aiHealthColor =
        aiSearchHealthScore >= 80 ? '#10B981' : aiSearchHealthScore >= 60 ? '#F59E0B' : '#EF4444';

    const getHealthStatusDetails = (score: number) => {
        if (score >= 85) {
            return { label: 'Excellent Health', desc: 'Your structural and technical optimization is top-tier.' };
        } else if (score >= 70) {
            return {
                label: 'Good Health',
                desc: 'Solid performance baseline, with opportunities to polish technical components.',
            };
        } else if (score >= 50) {
            return {
                label: 'Fair Health',
                desc: 'Structural improvements can be made to lift your optimization rating.',
            };
        } else {
            return {
                label: 'Critical Status',
                desc: 'Immediate technical optimizations are required to fix fundamental health issues.',
            };
        }
    };

    const handleUpgradeAccount = () => {
        // router.push('/upgrade-account');
    };

    const healthDetails = getHealthStatusDetails(displayHealthScore);

    const healthyCount = report.healthyPagesCount ?? 0;
    const issuesCount = report.haveIssuesPagesCount ?? 0;
    const redirectCount = report.redirectPagesCount ?? 0;
    const brokenCount = report.brokenPagesCount ?? 0;
    const totalCrawlCount = healthyCount + issuesCount + redirectCount + brokenCount;

    const totalPagesCrawled = report.totalPagesCrawled ?? totalCrawlCount;
    const hasCrawlData = totalCrawlCount > 0;

    const crawlRows = [
        { name: 'Healthy Pages', value: healthyCount, color: '#10B981' },
        { name: 'Redirect Pages', value: redirectCount, color: '#3B82F6' },
        { name: 'Pages with Issues', value: issuesCount, color: '#F59E0B' },
        { name: 'Broken Pages', value: brokenCount, color: '#EF4444' },
    ];

    const aiHealthSummary =
        aiSearchHealthScore >= 80
            ? 'Strong AI search quality and discoverability.'
            : aiSearchHealthScore >= 60
                ? 'Healthy, with some opportunities to improve visibility.'
                : 'Needs attention to strengthen AI search readiness.';

    return (
        <View style={styles.card}>

            <View style={styles.heroBox}>
                <View style={styles.heroLeft}>
                    <Text style={styles.eyebrow}>SEO PERFORMANCE AUDIT</Text>
                    <Text style={styles.domain} numberOfLines={1}>
                        {report.domain ? report.domain.toUpperCase() : 'UNKNOWN DOMAIN'}
                    </Text>
                </View>

                <View style={styles.heroRight}>
                    <View style={styles.heroRightText}>
                        <Text style={styles.healthLabel}>{healthDetails.label}</Text>
                        <Text style={styles.healthDesc}>{healthDetails.desc}</Text>
                        {report.siteHealthScore === null && (
                            <Text style={styles.estimatedTag}>ESTIMATED</Text>
                        )}
                    </View>

                    <HealthRing score={displayHealthScore} color={siteHealthColor} />
                </View>
            </View>

            <View style={styles.divider} />

            {/* Diagnostic Issues Breakdown */}
            <View style={styles.section}>
                <Text style={styles.sectionLabel}>DIAGNOSTIC ISSUES BREAKDOWN</Text>
                <View style={styles.statRow}>
                    <StatCard label="Errors" value={report.siteErrorsCount} color="#ef4444" />
                    <StatCard label="Warnings" value={report.siteWarningsCount} color="#f59e0b" />
                    <StatCard label="Notices" value={report.siteNoticesCount} color="#38bdf8" />
                </View>
            </View>

            <View style={styles.divider} />

            {/* Crawl Diagnostics */}
            <View style={styles.box}>
                <View style={styles.boxHeader}>
                    <Text style={styles.eyebrowSmall}>INDEX SCOPE VALIDATION</Text>
                    <Text style={styles.boxTitle}>Crawl Diagnostics</Text>
                </View>

                <View style={styles.crawlCountBadge}>
                    <View style={styles.crawlDot} />
                    <Text style={styles.crawlCount}>{totalPagesCrawled}</Text>
                    <Text style={styles.crawlCountLabel}>PAGES CRAWLED</Text>
                </View>

                {hasCrawlData ? (
                    <View style={styles.crawlList}>
                        {crawlRows.map((row) => {
                            const pct = Math.round((row.value / Math.max(totalPagesCrawled, 1)) * 100);
                            return (
                                <View key={row.name} style={styles.crawlItem}>
                                    <View style={styles.crawlItemTop}>
                                        <Text style={styles.crawlItemLabel}>{row.name}</Text>
                                        <Text style={styles.crawlItemValue}>{row.value}</Text>
                                    </View>
                                    <View style={styles.crawlBarTrack}>
                                        <View
                                            style={[
                                                styles.crawlBarFill,
                                                { backgroundColor: row.color, width: `${Math.max(pct, row.value > 0 ? 4 : 0)}%` },
                                            ]}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <View style={styles.noCrawlData}>
                        <Text style={styles.noCrawlDataText}>No crawl data available yet.</Text>
                    </View>
                )}
            </View>

            <View style={styles.divider} />

            {/* AI Search Health */}
            <View style={styles.box}>
                <Text style={styles.eyebrowSmall}>AI SEARCH INTELLIGENCE</Text>
                <Text style={styles.boxTitle}>AI Search Health</Text>
                <Text style={styles.aiDesc}>
                    A quick view of how healthy your AI discoverability signals are across the indexed domain.
                </Text>

                <View style={styles.aiCard}>
                    <View style={styles.aiCardHeader}>
                        <Text style={styles.aiCardLabel}>OVERALL HEALTH</Text>
                        <Text style={styles.aiCardScore}>{aiSearchHealthScore}%</Text>
                    </View>
                    <View style={styles.aiBarTrack}>
                        <View
                            style={[
                                styles.aiBarFill,
                                { width: `${Math.max(aiSearchHealthScore, 4)}%`, backgroundColor: aiHealthColor },
                            ]}
                        />
                    </View>
                    <Text style={styles.aiSummary}>{aiHealthSummary}</Text>
                </View>
            </View>

            {/* Paywall */}
            {report.tier > 0 ? (
                <View style={styles.paidBox}>
                    <Text style={styles.paidText}>PAID INSIGHTS LAYER ACTIVE</Text>
                </View>
            ) : (
                <View style={styles.upsellBox}>
                    <Text style={styles.upsellTitle}>Unlock Page-by-Page Audit Listings</Text>
                    <Text style={styles.upsellDesc}>
                        See the exact URLs triggering your {report.siteErrorsCount} errors and get deep
                        algorithmic position tracking data.
                    </Text>
                    <Pressable
                        onPress={handleUpgradeAccount}
                        style={({ pressed }) => [styles.upsellButton, pressed && styles.upsellButtonPressed]}
                    >
                        <Text style={styles.upsellButtonText}>UPGRADE ACCOUNT TO VIEW DETAILS</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <Text style={[styles.statLabel, { color }]}>{label.toUpperCase()}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: 'rgba(30,41,59,0.8)',
        borderRadius: 16,
        padding: 16,
        gap: 24,
        margin: 16,
    },
    heroBox: {
        backgroundColor: 'rgba(2,6,23,0.5)',
        borderWidth: 1,
        borderColor: 'rgba(30,41,59,0.8)',
        borderRadius: 16,
        padding: 20,
        gap: 16,
    },
    heroLeft: {
        gap: 8,
    },
    eyebrow: {
        fontSize: 10,
        fontWeight: '700',
        color: '#22d3ee',
        letterSpacing: 1.5,
        borderLeftWidth: 2,
        borderLeftColor: '#06b6d4',
        paddingLeft: 8,
    },
    domain: {
        fontSize: 26,
        fontWeight: '900',
        color: 'white',
        letterSpacing: -0.5,
    },
    heroRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: 'rgba(51,65,85,0.5)',
        borderRadius: 12,
        padding: 16,
    },
    heroRightText: {
        flex: 1,
        gap: 4,
    },
    healthLabel: {
        fontSize: 14,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
    },
    healthDesc: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '500',
        lineHeight: 16,
    },
    estimatedTag: {
        fontSize: 9,
        fontWeight: '700',
        color: '#fbbf24',
        backgroundColor: 'rgba(245,158,11,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.2)',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    scoreCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(30,41,59,0.6)',
    },
    section: {
        gap: 12,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
        letterSpacing: 1,
    },
    statRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(2,6,23,0.3)',
        borderWidth: 1,
        borderColor: '#1e293b',
        borderLeftWidth: 4,
        borderRadius: 12,
        padding: 14,
        minHeight: 90,
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    statValue: {
        fontSize: 26,
        fontWeight: '900',
        color: 'white',
    },
    box: {
        backgroundColor: 'rgba(2,6,23,0.2)',
        borderWidth: 1,
        borderColor: '#1e293b',
        borderRadius: 12,
        padding: 20,
        gap: 16,
    },
    boxHeader: {
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(30,41,59,0.8)',
    },
    eyebrowSmall: {
        fontSize: 10,
        fontWeight: '700',
        color: '#22d3ee',
        letterSpacing: 1.5,
        borderLeftWidth: 2,
        borderLeftColor: '#22d3ee',
        paddingLeft: 8,
        marginBottom: 4,
    },
    boxTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: 'white',
    },
    crawlCountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#334155',
        backgroundColor: '#020617',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    crawlDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#38bdf8',
    },
    crawlCount: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
    },
    crawlCountLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#38bdf8',
        letterSpacing: 0.5,
    },
    crawlList: {
        gap: 16,
    },
    crawlItem: {
        gap: 8,
    },
    crawlItemTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    crawlItemLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    crawlSwatch: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    crawlItemLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#cbd5e1',
    },
    crawlItemValue: {
        fontSize: 15,
        fontWeight: '800',
        color: 'white',
    },
    crawlBarTrack: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#020617',
        overflow: 'hidden',
    },
    crawlBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    noCrawlData: {
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#1e293b',
        backgroundColor: 'rgba(15,23,42,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noCrawlDataText: {
        fontSize: 13,
        color: '#94a3b8',
    },
    aiDesc: {
        fontSize: 13,
        color: '#cbd5e1',
        lineHeight: 18,
        marginTop: -4,
    },
    aiCard: {
        borderWidth: 1,
        borderColor: '#1e293b',
        backgroundColor: 'rgba(2,6,23,0.6)',
        borderRadius: 12,
        padding: 16,
    },
    aiCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    aiCardLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
        letterSpacing: 0.5,
    },
    aiCardScore: {
        fontSize: 14,
        fontWeight: '700',
        color: 'white',
    },
    aiBarTrack: {
        marginTop: 12,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#020617',
        borderWidth: 1,
        borderColor: '#1e293b',
        overflow: 'hidden',
    },
    aiBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    aiSummary: {
        marginTop: 12,
        fontSize: 12,
        color: '#cbd5e1',
        lineHeight: 16,
    },
    paidBox: {
        backgroundColor: 'rgba(2,6,23,0.4)',
        borderWidth: 1,
        borderColor: '#1e293b',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    paidText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#cbd5e1',
        letterSpacing: 0.5,
    },
    upsellBox: {
        backgroundColor: '#020617',
        borderWidth: 1,
        borderColor: 'rgba(12,74,110,0.4)',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        gap: 8,
    },
    upsellTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
    },
    upsellDesc: {
        fontSize: 12,
        color: '#cbd5e1',
        textAlign: 'center',
        lineHeight: 16,
        maxWidth: 320,
    },
    upsellButton: {
        marginTop: 8,
        backgroundColor: '#06b6d4',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    upsellButtonPressed: {
        backgroundColor: '#22d3ee',
    },
    upsellButtonText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#020617',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
});