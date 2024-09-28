import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import useURLPosition from '../hooks/useURLPosition';
import Message from './Message';
import Spinner from './Spinner';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { useCities } from '../context/CityCTX';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();
  const [lat, lng] = useURLPosition();

  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState('');
  const [geocodingError, setGeocodingError] = useState('');

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);

  useEffect(() => {
    if (!lat && !lng) return;
    const fetchCityData = async () => {
      try {
        setIsLoadingGeocoding(true);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lat}`);
        const data = await res.json();
        if (!data.countryCode) {
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else 🙃"
          );
        }
        setCityName(data.city || date.locality || '');
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
        console.log(data);
      } catch (error) {
        console.log(error);
        setGeocodingError(error.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    };

    fetchCityData();
  }, [lat, lng]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await createCity(newCity);
    navigate('/app/cities');
  };

  if (isLoadingGeocoding) return <Spinner />;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`}>
      <div className={styles.row}>
        <label htmlFor='cityName'>{country}</label>
        <input
          id='cityName'
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        <DatePicker
        wrapperClassName='datePicker'
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat='dd/MM/yyyy'
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button onclick={handleSubmit} type='primary'>
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
