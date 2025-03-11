import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Config from "react-native-config";
import { AuthContext } from "./AuthContext";
import { IEvent } from "../navigation/types"; 
interface EventsContextType {
  events: IEvent[];   
  refreshEvents: () => Promise<void>;
}

export const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user,token } = useContext(AuthContext)!;
  const [events, setEvents] = useState<IEvent[]>([]); 

  const fetchEvents = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`${Config.BASE_URL}/api/events/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: IEvent[] = await response.json();  
      if (Array.isArray(data)) {
        const filteredEvents = data.filter(event => event.registeredStudents.includes(user.id));
        setEvents(filteredEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [user, token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <EventsContext.Provider value={{ events, refreshEvents: fetchEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};
