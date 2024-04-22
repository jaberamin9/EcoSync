"use client"
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

function LeafLetMapRouting({ latlng, setMapLoading, alllandfillLocation, setLandfillSelected, setShortestRoute, shortestRoute, popupText, setDistance, setTime, setLandfillName, isClickAble = true }) {

    const [position, setPosition] = useState(latlng ? extractLatLon(String(latlng)) : { lat: 32.3, lng: 23.23 });
    const [routingControl, setRoutingControl] = useState("");
    const [shortestRouteControl, setShortestRouteControl] = useState([]);


    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                setPosition(isClickAble ? e.latlng : (latlng ? position : null));
            },
        });
        //position ? map.flyTo(position, map.getZoom()) : ""
        const customIcon = new Icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconSize: [32, 32]
        });
        const customIconSts = new Icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/8528/8528531.png',
            iconSize: [32, 32]
        });

        const destinationPoints = alllandfillLocation?.map((item) => {
            return L.latLng(item.location[0], item.location[1])
        })

        if (shortestRoute) {
            setMapLoading(true)
            const routesPromises = destinationPoints?.map(destinationPoint => {
                return new Promise(resolve => {
                    L.Routing.control({
                        waypoints: [
                            L.latLng(position?.lat, position?.lng),
                            destinationPoint
                        ],
                        routeWhileDragging: true,
                        addWaypoints: false,
                    }).on('routesfound', function (e) {
                        const routes = e.routes;
                        if (routes.length > 0) {
                            resolve({ route: routes[0], destination: destinationPoint });
                        } else {
                            resolve(null);
                        }
                    }).route()
                });
            });



            Promise.all(routesPromises).then(routes => {
                let shortestRoute = null;
                let shortestDistance = Infinity;

                routes.forEach(({ route, routeLine }) => {
                    if (route && route.summary.totalDistance < shortestDistance) {
                        shortestRoute = route;
                        shortestDistance = route.summary.totalDistance;
                    }
                });

                if (shortestRoute) {
                    if (routingControl) map.removeControl(routingControl)
                    if (shortestRouteControl) {
                        shortestRouteControl.forEach(control => {
                            map.removeControl(control);
                        });
                    }


                    if (map) {
                        const control = L.Routing.control({
                            waypoints: [
                                L.latLng(position?.lat, position?.lng),
                                shortestRoute.waypoints[1].latLng,
                            ],
                            createMarker: function () { return null },
                            routeWhileDragging: true,
                            addWaypoints: false,
                        }).addTo(map);

                        control.hide();
                        const routingControlContainer = control.getContainer()
                        const controlContainerParent = routingControlContainer.parentNode
                        controlContainerParent.removeChild(routingControlContainer)
                        setShortestRouteControl((pre) => [...pre, control])


                        //const polyline = L.polyline(shortestRoute.coordinates).addTo(map);

                        setDistance((shortestRoute.summary.totalDistance / 1000).toFixed(2))
                        setTime(secondsToHhMm(shortestRoute.summary.totalTime))

                        const searchValue = shortestRoute.coordinates[shortestRoute.coordinates.length - 1]
                        const foundValue = alllandfillLocation.find(item => {
                            return isEqualWithTolerance(item.location[0], searchValue?.lat, 0.01)
                                && isEqualWithTolerance(item.location[1], searchValue?.lng, 0.01)
                        })

                        setLandfillName(foundValue.label)
                        setLandfillSelected(foundValue.value)
                        setMapLoading(false)
                    }
                }
            });
            setShortestRoute(false)
        }



        return alllandfillLocation ? (
            <div>
                {alllandfillLocation?.map(item => {
                    const lat = item?.location[0]
                    const lng = item?.location[1]
                    return <Marker key={item.value} position={{ lat, lng }} icon={customIcon} eventHandlers={{
                        click: () => {
                            setMapLoading(true)

                            if (routingControl) map.removeControl(routingControl)
                            if (shortestRouteControl) {
                                shortestRouteControl.forEach(control => {
                                    map.removeControl(control);
                                });
                            }


                            if (map) {
                                const control = L.Routing.control({
                                    waypoints: [
                                        L.latLng(position?.lat, position?.lng),
                                        L.latLng(lat, lng),
                                    ],
                                    createMarker: function () { return null },
                                    routeWhileDragging: true,
                                    addWaypoints: false,
                                }).addTo(map);
                                control.hide();
                                const routingControlContainer = control.getContainer()
                                const controlContainerParent = routingControlContainer.parentNode
                                controlContainerParent.removeChild(routingControlContainer)
                                setRoutingControl(control);
                                setLandfillName(item.label)
                                setLandfillSelected(item.value)
                                control.on('routesfound', function (e) {
                                    var routes = e.routes;
                                    var summary = routes[0].summary;
                                    setDistance((summary.totalDistance / 1000).toFixed(2))
                                    setTime(secondsToHhMm(summary.totalTime))
                                });
                            }
                            setMapLoading(false)
                        },
                    }}>
                    </Marker>
                })}
                <Marker position={position} icon={customIconSts}>
                    {popupText ? <Popup>{popupText}</Popup> : ""}
                </Marker>
            </div>
        ) : null;
    }


    return (
        <MapContainer className='md:w-[350px] md:h-[350px] w-[200px] h-[200px] min-w-[300px] rounded-xl z-40' center={[24.0059596, 90.0944646]} zoom={6} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    )
}

export default LeafLetMapRouting

function extractLatLon(str) {
    const pairs = str.split(/\s*,\s*/);
    const lat = pairs[0];
    const lng = pairs[1];
    return { lat, lng };
}

function secondsToHhMm(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function isEqualWithTolerance(num1, num2, tolerance) {
    return Math.abs(num1 - num2) <= tolerance;
}