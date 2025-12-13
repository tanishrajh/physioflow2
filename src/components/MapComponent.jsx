import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { PHYSIOTHERAPISTS } from '../data/mockData';
import L from 'leaflet';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
    return (
        <div style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Centered on SIT Tumkur */}
            <MapContainer center={[13.3269, 77.1261]} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {PHYSIOTHERAPISTS.map(pt => (
                    <Marker key={pt.id} position={pt.location}>
                        <Popup>
                            <strong>{pt.name}</strong><br />
                            <span style={{ fontSize: '0.85em', color: '#666' }}>{pt.specialty}</span><br />
                            <div style={{ margin: '5px 0', fontSize: '0.9em' }}>
                                📞 <a href={`tel:${pt.contact.phone}`} style={{ textDecoration: 'none', color: '#007bff' }}>{pt.contact.phone}</a><br />
                                📧 <a href={`mailto:${pt.contact.email}`} style={{ textDecoration: 'none', color: '#007bff' }}>{pt.contact.email}</a>
                            </div>
                            ⭐ {pt.rating} ({pt.reviews} reviews)
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
