import { connect } from "@/dbConnection/dbConnection";
import Wce from "@/models/wce";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/get-data-from-token";
import Sts from "@/models/sts";
import Vehicle from "@/models/vehicle";
import Landfill from "@/models/landfill";

connect()


export async function GET(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        //only access System Admin and STS Manager
        if (logedInUser.role === "Landfill Manager") {
            const wce = await Wce.find({ "running": { "$eq": true } }).select("-__v")
                .populate({ path: 'stsId', select: '-__v', model: Sts }).populate({ path: 'vehicleId', select: '-__v', model: Vehicle })
                .populate({ path: 'landfillId', select: '-__v', model: Landfill, match: { manager: { $eq: logedInUser.id } } })
                .sort({ 'departureTime': 1 });

            const newWce = wce.filter((item) => {
                return item.landfillId != null && item.stsId != null && item.vehicleId != null
            })

            return NextResponse.json({
                success: true,
                data: newWce,
            }, { status: 200 })
        }

        if (logedInUser.role === "STS Manager") {
            const wce = await Wce.find().select("-__v")
                .populate({ path: 'stsId', select: '-__v', model: Sts, match: { manager: { $eq: logedInUser.id } } }).populate({ path: 'vehicleId', select: '-__v', model: Vehicle })
                .populate({ path: 'landfillId', select: '-__v', model: Landfill })
                .sort({ 'departureTime': 1 });

            const newWce = wce.filter((item) => {
                return item.landfillId != null && item.stsId != null && item.vehicleId != null
            })

            return NextResponse.json({
                success: true,
                data: newWce,
            }, { status: 200 })
        }


        const userType = String(req.nextUrl.searchParams)
        const { key, value } = extractKeyValue(userType);
        let query
        if (key == "pre") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - Number(value));
            const result = await Wce.aggregate([
                {
                    $match: {
                        createdAt: { $gte: sevenDaysAgo }
                    }
                },
                {
                    $addFields: {
                        dayOfWeek: { $dayOfWeek: '$createdAt' }
                    }
                },
                {
                    $group: {
                        _id: '$dayOfWeek', // Group by day of week
                        volumeCollection: { $sum: '$volumeCollection' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        day: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$_id', 1] }, then: 'Sunday' },
                                    { case: { $eq: ['$_id', 2] }, then: 'Monday' },
                                    { case: { $eq: ['$_id', 3] }, then: 'Tuesday' },
                                    { case: { $eq: ['$_id', 4] }, then: 'Wednesday' },
                                    { case: { $eq: ['$_id', 5] }, then: 'Thursday' },
                                    { case: { $eq: ['$_id', 6] }, then: 'Friday' },
                                    { case: { $eq: ['$_id', 7] }, then: 'Saturday' }
                                ]
                            }
                        },
                        volumeCollection: 1
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            return NextResponse.json({
                success: true,
                data: result
            }, { status: 200 })
        }

        const wce = await Wce.find(query).select("-__v")
            .populate({ path: 'stsId', select: '-__v', model: Sts }).populate({ path: 'vehicleId', select: '-__v', model: Vehicle })
            .populate({ path: 'landfillId', select: '-__v', model: Landfill });

        return NextResponse.json({
            success: true,
            data: wce
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

export async function POST(req) {
    try {

        const logedInUser = await getDataFromToken(req);
        //only access System Admin and STS Manager
        if (logedInUser.role === "Landfill Manager") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()
        const { stsId, vehicleId, landfillId, volumeCollection, arrivalTime, departureTime, totlaKiloMeter } = reqBody

        if (!stsId || !vehicleId || !landfillId || !volumeCollection || !arrivalTime || !departureTime || !totlaKiloMeter) {
            return NextResponse.json({ success: false, message: "field are missing" }, { status: 400 })
        }

        const isInsertMany = reqBody.insertMany || false

        if (isInsertMany) {
            let data = []
            vehicleId.forEach(element => {
                let newWce = {
                    stsId,
                    vehicleId: element.id,
                    landfillId,
                    volumeCollection: element.wasteCollect,
                    arrivalTime,
                    departureTime,
                    totlaKiloMeter
                }
                data.push(newWce)
            });
            const result = await Wce.insertMany(data);
            return NextResponse.json({
                success: true,
                message: "WCE add successfully",
                data: result
            }, { status: 201 })
        } else {
            let newWce = new Wce({
                stsId,
                vehicleId,
                landfillId,
                volumeCollection,
                arrivalTime,
                departureTime,
                totlaKiloMeter
            })
            const savedWce = await newWce.save()
            return NextResponse.json({
                success: true,
                message: "WCE add successfully",
                data: savedWce
            }, { status: 201 })
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}


function extractKeyValue(str) {
    // Remove curly braces and split by '=>'
    const pairs = str.replace(/\+/g, ' ').split(/\s*=\s*/);
    // Extract key and value
    const key = pairs[0];
    const value = pairs[1];
    return { key, value };
}