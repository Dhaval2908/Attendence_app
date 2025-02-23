export type BottomTabParamList = {
  Home: { studentId?: string; email?: string };
  Profile: { userId?: string };
  Report: undefined;
  More: undefined;
  Camera : undefined;
};
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Nav: BottomTabParamList;
};



// Add these type extensions for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}