import React, { createContext, useState, useContext, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { useFeedbackModal } from '../utils/useFeedbackModal';
interface Location {
    lat: number;
    lng: number;
  }
  
  interface LocationContextType {
    location: Location | null;
    address: string;
    loading: boolean;
    error: string | null;
    fetchLocation: () => Promise<void>;
  }
const LocationContext = createContext<LocationContextType | undefined>(undefined);


const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || 'Address not found';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Failed to fetch address';
    }
  };


  export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [address, setAddress] = useState<string>('Fetching location...');
    const [error, setError] = useState<string | null>(null);
  
    // Modal state
    const { showModal, ModalComponent } = useFeedbackModal()
  
    const getLocation = async (): Promise<Location> => {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: parseFloat(position.coords.latitude.toFixed(5)),
              lng: parseFloat(position.coords.longitude.toFixed(5)),
            });
          },
          (error) => {
            switch (error.code) {
              case 1:
                showModal('Permission denied', 'error');
                reject('Permission denied');
                break;
              case 2:
                showModal('Please enable live location', 'error');
                reject('GPS is turned off or unavailable');
                break;
              case 3:
                reject('Location request timed out');
                break;
              default:
                reject('Unknown location error');
            }
          }
        );
      });
    };
  
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const currentLocation = await getLocation();
        setLocation(currentLocation);
  
        const fetchedAddress = await fetchAddress(
          currentLocation.lat,
          currentLocation.lng
        );
        setAddress(fetchedAddress);
        setError(null); // Clear error on success
      } catch (error) {
        setError(typeof error === 'string' ? error : 'Unknown error occurred');
        showModal("Unknown error occurred","error");

      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchLocation();
    }, []);

    return (
        <LocationContext.Provider value={{ location, address, loading, error, fetchLocation }}>
          {children}
          {ModalComponent}
        </LocationContext.Provider>
      );
    };
    export const useLocation = () => {
        const context = useContext(LocationContext);
        if (!context) {
          throw new Error('useLocation must be used within a LocationProvider');
        }
        return context;
      };
