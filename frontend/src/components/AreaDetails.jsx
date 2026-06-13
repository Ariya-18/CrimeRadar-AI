import { useParams } from "react-router-dom";
import { areas } from "../data/areas";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

export default function AreaDetails() {
  const { area } = useParams();

  const areaData =
    areas[area.toLowerCase().replace(/\s/g, "")];

  if (!areaData) {
    return (
      <div
        style={{
          background: "#0f0f0f",
          color: "white",
          minHeight: "100vh",
          padding: "40px",
        }}
      >
        <h1>Area Not Found</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0f0f0f",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <h1
        style={{
          fontSize: "40px",
          marginBottom: "20px",
          textTransform: "capitalize",
        }}
      >
        {area}
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#1a1a1a",
            padding: "20px",
            borderRadius: "12px",
            minWidth: "220px",
          }}
        >
          <h3>Safety Score</h3>
          <h1 style={{ color: "#4ade80" }}>
            {areaData.score}
          </h1>
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "20px",
            borderRadius: "12px",
            minWidth: "220px",
          }}
        >
          <h3>Crime Rate</h3>
          <h2>{areaData.crimeRate}</h2>
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "20px",
            borderRadius: "12px",
            minWidth: "220px",
          }}
        >
          <h3>Risk Level</h3>
          <h2 style={{ color: "#f59e0b" }}>
            {areaData.risk}
          </h2>
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <h2>Recent Crimes</h2>

        <ul>
          {areaData.crimes.map((crime, index) => (
            <li
              key={index}
              style={{
                marginTop: "10px",
                color: "#ccc",
              }}
            >
              {crime}
            </li>
          ))}
        </ul>
      </div>

      <h2 style={{ marginBottom: "15px" }}>
        Area Location
      </h2>

      <MapContainer
        center={[areaData.lat, areaData.lng]}
        zoom={14}
        style={{
          height: "450px",
          width: "100%",
          borderRadius: "12px",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[areaData.lat, areaData.lng]}
        >
          <Popup>
            {area}
            <br />
            Safety Score: {areaData.score}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}