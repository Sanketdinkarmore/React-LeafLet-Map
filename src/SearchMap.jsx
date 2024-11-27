import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const App = () => {
  const [position, setPosition] = useState([19.0760, 72.8777]); 
  const [locationName, setLocationName] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);

  const mapRef = useRef();


  const fetchCoordinates = async (location) => {
    const apiKey = 'df821a69ea674f9cb5f4988e9ef5d3a6 '; 
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      location
    )}&key=${apiKey}`

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setPosition([lat, lng]); 
        setMarkerPosition([lat, lng]); 
        setLocationName(data.results[0].formatted); 
        moveToLocation(lat, lng); 
      } else {
        alert('Location not found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      alert('Error fetching location. Please try again.');
    }
  };

  const moveToLocation = (lat, lng) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([lat, lng], 13);
    }
  };


  const MapHandler = () => {
    const map = useMap();
    mapRef.current = map; 
    return null;
  };

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ padding: '10px', zIndex: 1000 }}>
        <input
          type="text"
          placeholder="Enter a location"
          style={{ width: '300px', padding: '5px', marginRight: '10px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') fetchCoordinates(e.target.value); 
          }}
        />
        <button
          onClick={() => {
            const input = document.querySelector('input');
            if (input.value) fetchCoordinates(input.value);
          }}
          style={{ padding: '5px 10px' }}
        >
          Search
        </button>
      </div>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapHandler /> 
        {markerPosition && (
          <Marker position={markerPosition} icon={new L.Icon.Default()}>
            <Popup>{locationName || 'Unknown location'}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default App;
