"use client"
import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet';

function LeafLetMap({ setLatlng, latlng, popupText, isClickAble = true }) {

    const [position, setPosition] = useState(latlng ? extractLatLon(String(latlng)) : null);

    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                setPosition(isClickAble ? e.latlng : (latlng ? position : null));
            },
        });
        position ? map.flyTo(position, map.getZoom()) : ""
        const customIcon = new Icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconSize: [32, 32]
        });
        return position ? (
            <Marker position={position} icon={customIcon}>
                {popupText ? <Popup>{popupText}</Popup> : ""}
            </Marker>
        ) : null;
    }

    isClickAble ? setLatlng(position?.lat ? position?.lat + "," + position?.lng : latlng ? latlng : "") : ""

    return (
        <MapContainer className='md:w-[350px] md:h-[350px] w-[200px] h-[200px] min-w-[300px] mt-5 rounded-xl' center={[24.0059596, 90.0944646]} zoom={6} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    )
}

export default LeafLetMap

function extractLatLon(str) {
    const pairs = str.split(/\s*,\s*/);
    const lat = pairs[0];
    const lng = pairs[1];
    return { lat, lng };
}