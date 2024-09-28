import { useNavigate } from 'react-router-dom';
import styles from './Map.module.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCities } from '../context/CityCTX';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from '../components/Button';
import useURLPosition from '../hooks/useURLPosition';

const Map = () => {
  const { cities } = useCities();
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [mapPosition, setMapPosition] = useState([
    40 , 0,
  ]);
  const [lat, lng] = useURLPosition();

  useEffect(() => {
    if (lat && lng) {
      setMapPosition([lat, lng]);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (geolocationPosition)
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);
  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type='position' onclick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use your position'}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={10}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
};

const ChangeCenter = ({ position }) => {
  const map = useMap();
  map.setView(position);
  return null;
};

const DetectClick = () => {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
};
export default Map;
