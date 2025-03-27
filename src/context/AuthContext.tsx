import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/types';
import { NavigationProp } from '@react-navigation/native';
import {jwtDecode }from "jwt-decode";
import { Animated, Easing } from 'react-native';
import { useFeedbackModal } from '../utils/useFeedbackModal';

interface User {
  id: string;
  email: string;
  role: string;
  
}
interface DecodedToken {
  exp: number; // Expiry timestamp (in seconds)
  [key: string]: any;
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
  // Modal state
  const { showModal, ModalComponent } = useFeedbackModal()
  useEffect(() => {
    const loadUserData = async () => {
        const savedUser = await AsyncStorage.getItem('user');
        const savedToken = await AsyncStorage.getItem('token');
  
        if (!savedUser || !savedToken) {
            await AsyncStorage.multiRemove(['user', 'token']);
            setUser(null);
            setToken(null);
            return;
        }
  
        try {
            const decodedToken: DecodedToken = jwtDecode(savedToken);  
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  
            if (decodedToken.exp < currentTime) {
                console.warn(" Token expired. Logging out...");
                await AsyncStorage.multiRemove(['user', 'token']);
                setUser(null);
                setToken(null);
                return;
            }
  
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        } catch (error) {
            console.error(" Error decoding token:", error);
            await AsyncStorage.multiRemove(['user', 'token']);
            setUser(null);
            setToken(null);
        }
    };
  
    loadUserData();
  }, [token]); // Re-run effect if the token changes
  

const login = async (data: { token: string; User: User }) => {
  try {
      const decodedToken: DecodedToken = jwtDecode(data.token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
          console.warn(" Login token expired. Rejecting login.");
          showModal("Session Expired, Please log in again.","error");
          return;
      }

      setUser(data.User);
      setToken(data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.User));
      await AsyncStorage.setItem('token', data.token);
  } catch (error) {
      console.error(" Error decoding token during login:", error);
      showModal( "Failed to login, please try again.","error");
  }
};


  const logout = async (navigation: NavigationProp<RootStackParamList>) => {
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.multiRemove(['user', 'token']);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
      {ModalComponent}
    </AuthContext.Provider>
  );
};
