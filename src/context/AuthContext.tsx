import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/types';
import { NavigationProp } from '@react-navigation/native';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: { token: string; User: User }) => Promise<void>;
  logout: (navigation: NavigationProp<RootStackParamList>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
//   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  useEffect(() => {
    const loadUserData = async () => {
      const savedUser = await AsyncStorage.getItem('user');
      const savedToken = await AsyncStorage.getItem('token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    };
    loadUserData();
  }, []);

  const login = async (data: { token: string; User: User }) => {
    setUser(data.User);
    setToken(data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.User));
    await AsyncStorage.setItem('token', data.token);
  };

  const logout = async (navigation: NavigationProp<RootStackParamList>) => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
