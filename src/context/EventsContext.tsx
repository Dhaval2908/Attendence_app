import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Config from "react-native-config";
import { AuthContext } from "./AuthContext";
import { IEvent } from "../navigation/types"; 

interface EventsContextType {
  events: IEvent[];   
  refreshEvents: () => Promise<void>;
  loading: boolean;
}

export const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useContext(AuthContext)!;
  const [events, setEvents] = useState<IEvent[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 

  const fetchEvents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
  
    try {
      const response = await fetch(`${Config.BASE_URL}/api/events/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: IEvent[] = await response.json();
  
      if (Array.isArray(data)) {
        const eventIds = data.map(event => event._id);
  
        const statusResponse = await fetch(`${Config.BASE_URL}/api/attendance/status/multiple`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ eventIds }),
        });
  
        const { statusMap } = await statusResponse.json();
  
        const eventsWithStatus = data.map(event => ({
          ...event,
          attendanceStatus: statusMap[event._id] || "pending",  // Default to "pending"
        }));
  
        setEvents(eventsWithStatus);
      }
    } catch (error) {
      console.error(" Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <EventsContext.Provider
      value={{
        events,
        refreshEvents: fetchEvents,
        loading,  
      }}
    >
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
