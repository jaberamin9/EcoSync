"use client"
import React from 'react'
import Admin from './admin';
import Chart, { CategoryScale } from 'chart.js/auto';
import LandfillManager from './landfill-manager';
import StsManager from './sts-manager';

Chart.register(CategoryScale);


function page() {
    const role = localStorage.getItem('role');

    if (role == "System Admin") {
        return (
            <Admin />
        )
    } else if (role == "Landfill Manager") {
        return (
            <LandfillManager />
        )
    } else if (role == "STS Manager") {
        return (
            <StsManager />
        )
    } else {
        return (
            <>no data for you</>
        )
    }
}

export default page