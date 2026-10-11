
import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LocationPicker.css";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapCenter({ position }) {
  const map = useMap();

  React.useEffect(() => {
    map.flyTo(position, 14);
  }, [map, position]);

  return null;
}

export default function LocationPicker({
  title = "Choose Location",
  initialPosition = [17.385, 78.4867],
  onLocationSelect,
}) {
  const [position, setPosition] = useState(null);
  const [search, setSearch] = useState("");
  const activePosition = position
    ? [position.lat, position.lng]
    : initialPosition;

  const selectLocation = (location) => {
    setPosition(location);
    onLocationSelect?.(location);
  };

  const searchPlace = async (event) => {
    event.preventDefault();

    if (!search.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          search
        )}`
      );

      if (!response.ok) {
        throw new Error("Location search failed");
      }

      const results = await response.json();

      if (!results.length) {
        alert("Location not found. Try another search.");
        return;
      }

      selectLocation({
        lat: Number(results[0].lat),
        lng: Number(results[0].lon),
      });
    } catch (error) {
      alert("Unable to search for this location.");
    }
  };

  return (
    <div className="location-picker">
      <h2>{title}</h2>
      <p>Search for a place or click anywhere on the map.</p>

      <form className="location-search" onSubmit={searchPlace}>
        <input
          type="text"
          placeholder="Search area, city, or address"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="location-map">
        <MapContainer
          center={initialPosition}
          zoom={12}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onSelect={selectLocation} />
          <MapCenter position={activePosition} />

          {position && (
            <Marker position={activePosition} icon={markerIcon} />
          )}
        </MapContainer>
      </div>

      {position && (
        <div className="selected-location">
          <strong>Selected Location</strong>
          <span>Latitude: {position.lat.toFixed(6)}</span>
          <span>Longitude: {position.lng.toFixed(6)}</span>
        </div>
      )}
    </div>
  );
}
