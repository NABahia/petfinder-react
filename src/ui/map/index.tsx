import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import css from "./index.css";

interface MapSelectorProps {
  lat: number;
  lng: number;
  locationText?: string;
  onChange: (coords: { lat: number; lng: number; addressHint?: string }) => void;
}

const DEFAULT_LAT = -34.6037; // Buenos Aires por defecto
const DEFAULT_LNG = -58.3816;

export function MapSelector({
  lat,
  lng,
  locationText = "",
  onChange,
}: MapSelectorProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState(locationText);
  const [searching, setSearching] = useState(false);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    if (locationText && !searchQuery) {
      setSearchQuery(locationText);
    }
  }, [locationText]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.9.4/dist/images/";

    const startLat = lat !== 0 ? lat : DEFAULT_LAT;
    const startLng = lng !== 0 ? lng : DEFAULT_LNG;

    const map = L.map(mapContainerRef.current).setView([startLat, startLng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const marker = L.marker([startLat, startLng], {
      draggable: true,
    }).addTo(map);

    marker.on("dragend", (e) => {
      const pos = (e.target as L.Marker).getLatLng();
      onChange({ lat: pos.lat, lng: pos.lng });
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Si cambian lat/lng desde afuera (ej. al cargar datos de mascota para editar)
  useEffect(() => {
    if (
      mapInstanceRef.current &&
      markerRef.current &&
      lat !== 0 &&
      lng !== 0
    ) {
      const current = markerRef.current.getLatLng();
      if (
        Math.abs(current.lat - lat) > 0.0001 ||
        Math.abs(current.lng - lng) > 0.0001
      ) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.setView([lat, lng], 14);
      }
    }
  }, [lat, lng]);

  async function handleSearchPlace() {
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true);
    setStatusText("Buscando dirección en el mapa...");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          q
        )}`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const foundLat = parseFloat(data[0].lat);
        const foundLng = parseFloat(data[0].lon);
        const displayName = data[0].display_name
          ?.split(",")
          .slice(0, 2)
          .join(",")
          .trim();

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([foundLat, foundLng], 15);
          markerRef.current.setLatLng([foundLat, foundLng]);
        }
        onChange({
          lat: foundLat,
          lng: foundLng,
          addressHint: displayName || q,
        });
        setStatusText("✅ Punto ubicado en el mapa");
      } else {
        setStatusText("No encontramos esa dirección, probá marcando en el mapa.");
      }
    } catch {
      setStatusText("No se pudo buscar la dirección automáticamente.");
    } finally {
      setSearching(false);
    }
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setStatusText("Tu navegador no soporta geolocalización.");
      return;
    }
    setStatusText("Obteniendo ubicación GPS...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([userLat, userLng], 15);
          markerRef.current.setLatLng([userLat, userLng]);
        }
        onChange({ lat: userLat, lng: userLng });
        setStatusText("✅ Ubicación GPS capturada");
      },
      () => {
        setStatusText("Habilitá el permiso de ubicación o hacé clic en el mapa.");
      }
    );
  }

  return (
    <div className={css.wrapper}>
      <div className={css.searchBar}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearchPlace();
            }
          }}
          placeholder="Buscar calle, barrio o ciudad (ej: Palermo, Buenos Aires)"
          className={css.searchInput}
        />
        <button
          type="button"
          onClick={handleSearchPlace}
          disabled={searching}
          className={css.searchBtn}
        >
          {searching ? "..." : "Buscar"}
        </button>
      </div>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className={css.gpsBtn}
      >
        📍 Capturar mi ubicación actual
      </button>

      <div ref={mapContainerRef} className={css.mapBox} />

      <p className={css.helper}>
        Buscá un punto de referencia en el mapa. Podés hacer clic o arrastrar el
        marcador azul.
      </p>

      {(statusText || (lat !== 0 && lng !== 0)) && (
        <div className={css.coordsBadge}>
          {statusText ||
            `Coordenadas seleccionadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`}
        </div>
      )}
    </div>
  );
}
