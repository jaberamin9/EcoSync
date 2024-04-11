import React from "react";
import GoogleMapReact from 'google-map-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function Map({ location, open, setOpen, noLocation = false }) {
    const defaultProps = {
        center: {
            lat: location[0],
            lng: location[1]
        },
        zoom: 11
    };
    let url
    if (noLocation)
        url = `https://www.google.com/maps/@23.7953844,90.9511541,7.25z?entry=ttu`
    else
        url = `http://maps.google.com/maps?q=${location[0]},${location[1]}&z=10&output=embed`

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>Map</DialogTitle>
                </DialogHeader>
                {/* //payment issue */}
                {/* <div style={{ height: '400px', width: '400px' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: `${process.env.NEXT_PUBLIC_MAP_API_KEY}` }}
                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                    >
                        <AnyReactComponent
                            lat={59.955413}
                            lng={30.337844}
                            text="My Marker"
                        />
                    </GoogleMapReact>
                </div> */}
                <iframe src={url} height="400px" width="400px"></iframe>
            </DialogContent>
        </Dialog >

    );
}