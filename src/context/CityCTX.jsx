import { useState, useEffect, createContext, useContext } from 'react';
const BASE_URL = 'http://localhost:3000';

const CitiesContext = createContext();

const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (error) {
        alert('There was an error loading data...');
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  const getCity = id => {
     const fetchCities = async () => {
       setIsLoading(true);
       try {
         const res = await fetch(`${BASE_URL}/cities/${id}`);
         const data = await res.json();
         setCurrentCity(data);
       } catch (error) {
         alert('There was an error loading data...');
         console.log(error);
       } finally {
         setIsLoading(false);
       }
     };

     fetchCities()

  }
  const createCity = city => {
     const fetchCities = async () => {
       setIsLoading(true);
       try {
         const res = await fetch(`${BASE_URL}/cities`, {
          method: 'POST',
          body: JSON.stringify(city),
          headers: {
            "Content-Type": "application/json"
          }
         });
         const data = await res.json(); 
         setCities(old => [...old, data])
         
         console 
       } catch (error) {
         alert('There was an error loading data...');
         console.log(error);
       } finally {
         setIsLoading(false);
       }
     };

     fetchCities()

  }
  const deleteCity = id => {
     const fetchCities = async () => {
       setIsLoading(true);
       try {
         const res = await fetch(`${BASE_URL}/cities/${id}`, {
          method: 'DELETE', 
         }); 
         setCities(old => old.filter(city => city.id != id))
       } catch (error) {
         alert('There was an error deleting city...');
         console.log(error);
       } finally {
         setIsLoading(false);
       }
     };

     fetchCities()

  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        setCurrentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error('CitiesContext was called outside CitiesContextProvider');

  return context;
};

export { CitiesProvider, useCities };
