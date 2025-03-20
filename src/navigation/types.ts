export type BottomTabParamList = {
  Home: { studentId?: string; email?: string };
  Profile: { userId?: string };
  Report: { events: IEvent[] };
  More: undefined;
  Face : undefined;
};
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Nav: undefined;
  FaceAttendance: { eventId: string };  
  Face: undefined;
};



export interface IEvent {
  _id: string;
  name: string;
  description: string;
  registeredStudents: string[];
  startTime: Date | string | number;
  endTime: Date | string | number;
  isClockInAllowed?: boolean;
  hasClockedIn?: boolean; 
  attendanceStatus : string;  
}
// Add these type extensions for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}