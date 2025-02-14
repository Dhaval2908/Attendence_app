// navigation/types.ts
export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    // Nav: { studentId?: string; email?: string; userId?: string };
    Nav: undefined;
  };
  
  export type BottomTabParamList = {
    Home: { studentId?: string; email?: string };
    Profile: { userId?: string };
    Report: undefined;
    More: undefined;
  };