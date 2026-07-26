import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type User } from '../api/authService';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string ) => void;
    logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

    const [user, setUser] = useState<User| null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

        const verifyToken = async ( explicitToken?: string ) => {

            const token = explicitToken || await SecureStore.getItemAsync( "token" );

            
            if ( !token ) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {

                const userData = await authService.getCurrentUser();
                setUser(userData);
                
            } catch(error) {
                await SecureStore.deleteItemAsync( 'token' );
                setUser(null);
            } finally {
                setLoading(false);
            }

        };

    useEffect(() => {
        verifyToken();
    }, []);

    const login = async ( token: string ) => {
        setLoading(true);
        SecureStore.setItemAsync('token', token);
        await verifyToken( token );
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync( 'token' );
        setUser( null );
        router.replace( '/login' );
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be wrapped within an AuthProvider");
    return context; 
}


