export type BottomTabParamList = {
  Home: { studentId?: string; email?: string };
  Profile: { userId?: string };
  Report: undefined;
  More: undefined;
  Face : undefined;
};
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Nav: undefined;
  FaceAttendance: { eventId: string };  
};



export interface IEvent {
  _id: string;
  name: string;
  description: string;
  registeredStudents: string[];
  startTime: Date | string | number;
  endTime: Date | string | number;
  isClockInAllowed?: boolean;
}
// Add these type extensions for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}