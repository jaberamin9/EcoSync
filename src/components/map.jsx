import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import LeafLetMap from "./leaf-let-map";


export default function Map({ location, open, setOpen, popupText }) {
    const [locations, setLocations] = useState(location)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>Map</DialogTitle>
                </DialogHeader>
                <LeafLetMap setLatlng={setLocations} latlng={locations} popupText={popupText} isClickAble={false}></LeafLetMap>
            </DialogContent>
        </Dialog >

    );
}