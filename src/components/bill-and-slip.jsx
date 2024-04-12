"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"




function formatDate(dateVal) {
    var newDate = new Date(dateVal);
    var sMonth = padValue(newDate.getMonth() + 1);
    var sDay = padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = padValue(newDate.getMinutes());
    var sAMPM = "AM";
    var iHourCheck = parseInt(sHour);
    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }
    sHour = padValue(sHour);
    const date = sMonth + "/" + sDay + "/" + sYear + " "
    const time = sHour + ":" + sMinute + " " + sAMPM
    return [date, time];
}
function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

export function BillAndSlip({ open, setOpen, data }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>Bill info</DialogTitle>
                </DialogHeader>

                <div className="w-auto flex items-center gap-24 font-bold">
                    <p className="text-[14px]">Time: {data ? formatDate(data.time) : ""}</p>
                    <p className="text-[14px]">Total Fuel: {data ? data.totalFuel : ""}L</p>
                </div>
                <div className="w-auto flex items-center gap-24 font-bold">
                    <p className="text-[14px]">Volume Disposed: {data ? data.volumeDisposed : ""}T</p>
                </div>
                <div className="w-auto items-center gap-24 font-semibold">
                    <p className="text-[14px]">Vehic Details:</p>
                    <p className=" ms-5 text-[13px]">Id: {data ? data.truckDetails.vehicleId : ""}</p>
                    <p className=" ms-5 text-[13px]">Type: {data ? data.truckDetails.type : ""}</p>
                    <p className=" ms-5 text-[13px]">Capacity: {data ? data.truckDetails.capacity : ""}</p>
                    <p className=" ms-5 text-[13px]">Fuel cost loaded: {data ? data.truckDetails.fuelcostLoaded : ""}৳</p>
                    <p className=" ms-5 text-[13px]">Fuel cost unloaded: {data ? data.truckDetails.fuelcostUnloaded : ""}৳</p>
                </div>
                <div className="w-auto flex items-center gap-24 font-bold">
                    <p className="text-[14px]">Total Fuel Cost: {data ? Math.round(data.totalFuelCost) : ""}৳</p>
                </div>
            </DialogContent>
        </Dialog >
    )
}