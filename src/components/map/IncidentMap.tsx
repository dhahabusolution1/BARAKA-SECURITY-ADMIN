import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '../common/Badge';
import { AudioPlayer } from '../common/AudioPlayer';
import { Button } from '../common/Button';
import { Phone, Shield } from 'lucide-react';

export type MapIncident = {
  id: string;
  latitude: number;
  longitude: number;
  statut: string;
  priorite: string;
  adresseApproximative?: string | null;
  messageTexte?: string | null;
  declencheeAt: string;
  citoyen: {
    nom: string;
    prenom?: string | null;
    telephone?: string | null;
  };
  equipe?: {
    nom: string;
  } | null;
  audios?: Array<{
    id: string;
    url: string;
    dureeSecondes?: number | null;
  }>;
};

type Props = {
  incidents: MapIncident[];
  onSelectIncident?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
};

// Create custom colored markers with HTML icons
function createMarkerIcon(statut: string, priorite: string) {
  const isCritical = priorite === 'CRITIQUE' || statut === 'NOUVELLE';
  const color = isCritical
    ? '#dc2626'
    : statut === 'EQUIPE_EN_ROUTE'
    ? '#eab308'
    : statut === 'EN_COURS'
    ? '#f59e0b'
    : '#22c55e';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        ${
          isCritical
            ? `<div style="position: absolute; inset: -6px; border-radius: 50%; background-color: ${color}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
            : ''
        }
        <div style="width: 22px; height: 22px; border-radius: 50%; background-color: ${color}; border: 3px solid #000; box-shadow: 0 0 10px ${color}; display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; border-radius: 50%; background-color: #fff;"></div>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

export const IncidentMap: React.FC<Props> = ({
  incidents,
  onSelectIncident,
  center = [-4.325, 15.322],
  zoom = 12,
  height = '500px',
}) => {
  const defaultCenter: [number, number] =
    incidents.length > 0
      ? [incidents[0].latitude, incidents[0].longitude]
      : center;

  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-[var(--color-brand-border)] relative">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.latitude, incident.longitude]}
            icon={createMarkerIcon(incident.statut, incident.priorite)}
          >
            <Popup className="custom-popup" maxWidth={320}>
              <div className="p-1 flex flex-col gap-2.5 text-xs text-[var(--color-brand-cream)]">
                <div className="flex items-center justify-between border-b border-[var(--color-brand-border)] pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={incident.statut} size="sm" />
                    <Badge variant={incident.priorite} size="sm" />
                  </div>
                  <span className="text-[11px] text-[var(--color-brand-muted)]">
                    {new Date(incident.declencheeAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-sm text-[var(--color-brand-cream)]">
                    {incident.citoyen.prenom} {incident.citoyen.nom}
                  </div>
                  {incident.citoyen.telephone && (
                    <a
                      href={`tel:${incident.citoyen.telephone}`}
                      className="text-[var(--color-brand-gold)] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      {incident.citoyen.telephone}
                    </a>
                  )}
                </div>

                {incident.adresseApproximative && (
                  <div className="text-[11px] text-[var(--color-brand-muted)] bg-[var(--color-brand-elevated)] p-1.5 rounded">
                    📍 {incident.adresseApproximative}
                  </div>
                )}

                {incident.messageTexte && (
                  <p className="italic text-[11px] text-neutral-300">
                    "{incident.messageTexte}"
                  </p>
                )}

                {incident.equipe && (
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium">
                    <Shield className="w-3.5 h-3.5" />
                    Équipe : {incident.equipe.nom}
                  </div>
                )}

                {incident.audios && incident.audios.length > 0 && (
                  <div className="mt-1">
                    <AudioPlayer
                      url={incident.audios[0].url}
                      durationSeconds={incident.audios[0].dureeSecondes}
                    />
                  </div>
                )}

                {onSelectIncident && (
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full mt-1"
                    onClick={() => onSelectIncident(incident.id)}
                  >
                    Voir Détails Complets
                  </Button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
