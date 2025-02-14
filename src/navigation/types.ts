export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Nav: undefined;
};

export type BottomTabParamList = {
  Home: { studentId?: string; email?: string };
  Profile: { userId?: string };
  Report: undefined;
  More: undefined;
};

// Add these type extensions for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}