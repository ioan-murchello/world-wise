import styles from './CountryList.module.css';
import Spinner from './Spinner'; 
import CountryItem from './CountryItem'
import Message from './Message';
import { useCities } from '../context/CityCTX';


const CountriesList = () => {
   const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message='Add your first city by clicking on a city on the map' />
    );

    const countries = cities.reduce((acc, cur) => {
        if(!acc.map(el => el.country).includes(cur.country)){
            return [...acc, {country: cur.country, emoji: cur.emoji}]
        }else{
            return acc
        }
    },[])

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => {
        return <CountryItem key={country.id} country={country} />;
      })}
    </ul>
  );
};
export default CountriesList;
