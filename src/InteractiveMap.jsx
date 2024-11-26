import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationMarker = ({ setLocationName }) => {
  const [position, setPosition] = useState(null);
  const [popupText, setPopupText] = useState("Loading location...");

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

    
      const apiKey = "df821a69ea674f9cb5f4988e9ef5d3a6 "; 
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("Clicked coordinates:", lat, lng); 
        console.log("API Response:", data); 

        if (data && data.results && data.results.length > 0) {
          const locationName = data.results[0].formatted;
          setLocationName(locationName);  
          setPopupText(locationName);
        } else {
          setLocationName("Unknown location");
          setPopupText("Unknown location");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setLocationName("Error fetching location");
        setPopupText("Error fetching location");
      }
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>{popupText}</Popup>
    </Marker>
  ) : null;
};


const App = () => {
  const [locationName, setLocationName] = useState("");

  return (
    <div style={{ height: "100vh" }}>
      <h1 style={{ textAlign: "center", margin: "10px 0" }}>
        Interactive Map with Location Name
      </h1>
      <MapContainer
        center={[19.0760, 72.8777]} 
        zoom={10}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker setLocationName={setLocationName} />
      </MapContainer>
      {locationName && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <strong>Selected Location:</strong> {locationName}
        </div>
      )}
    </div>
  );
};

export default App;
