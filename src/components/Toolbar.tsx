import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Toolbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleAccountManagement = () => {
        setIsOpen(false);

    };

    const handleAdmin = () => {
        setIsOpen(false);

    };

    const handleDashboard = () => {
        setIsOpen(false);
        router.push('/dashboard');
    };

    const handleLogout = () => {
        setIsOpen(false);
        logout();
    };

    const avatarLetter = user?.firstName?.[0] || user?.email?.[0] || 'U';

    return (
        <View style={styles.header}>
            <Pressable onPress={handleDashboard} style={styles.brand}>
                <Text style={styles.brandGray}>SEO</Text>
                <Text style={styles.brandCyan}> ANALYZER</Text>
            </Pressable>

            <Pressable
                onPress={() => setIsOpen(true)}
                style={({ pressed }) => [styles.accountButton, pressed && styles.accountButtonPressed]}
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{avatarLetter}</Text>
                </View>
                <Text style={styles.accountLabel}>{user?.firstName || 'My Account'}</Text>
            </Pressable>


            <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>

                <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
                    <View style={styles.menu}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuRole}>{user?.role?.replace('ROLE_', '') || 'User'}</Text>
                            <Text style={styles.menuEmail} numberOfLines={1}>
                                {user?.email || 'No email profile'}
                            </Text>
                        </View>


                        <MenuItem label="Dashboard" onPress={handleDashboard} />
                        <Divider />
                        <MenuItem label="Log Out" onPress={handleLogout} danger />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

function MenuItem({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
        >
            <Text style={[styles.menuItemText, danger && styles.menuItemTextDanger]}>{label}</Text>
        </Pressable>
    );
}

function Divider() {
    return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 64,
        backgroundColor: '#020617',
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    brand: {
        flexDirection: 'row',
    },
    brandGray: {
        fontSize: 13,
        fontWeight: '900',
        color: '#94a3b8',
        letterSpacing: 1,
    },
    brandCyan: {
        fontSize: 13,
        fontWeight: '900',
        color: '#22d3ee',
        letterSpacing: 1,
    },
    accountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1e293b',
        backgroundColor: '#0f172a',
    },
    accountButtonPressed: {
        backgroundColor: '#1e293b',
    },
    avatar: {
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(34,211,238,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(34,211,238,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#22d3ee',
        textTransform: 'uppercase',
    },
    accountLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#e2e8f0',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'flex-end',
        paddingTop: 70,
        paddingRight: 16,
    },
    menu: {
        width: 224,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1e293b',
        backgroundColor: '#020617',
        padding: 6,
    },
    menuHeader: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(15,23,42,0.6)',
        marginBottom: 4,
    },
    menuRole: {
        fontSize: 10,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    menuEmail: {
        fontSize: 12,
        fontWeight: '600',
        color: '#cbd5e1',
        marginTop: 2,
    },
    menuItem: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    menuItemPressed: {
        backgroundColor: '#0f172a',
    },
    menuItemText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#cbd5e1',
    },
    menuItemTextDanger: {
        color: '#f87171',
    },
    divider: {
        height: 1,
        backgroundColor: '#0f172a',
        marginVertical: 4,
    },
});