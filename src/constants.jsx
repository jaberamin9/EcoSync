'use client';
import { Icon } from '@iconify/react';


export let SIDENAV_ITEMS

const role = localStorage.getItem('role');

if (role == "System Admin") {
    SIDENAV_ITEMS = [
        {
            title: 'Dashboard',
            path: '/ui/dashboard',
            icon: <Icon icon="ic:outline-space-dashboard" width="24" height="24" />,
        }, {
            title: 'STS',
            path: '/ui/dashboard/sts',
            icon: <Icon icon="solar:square-transfer-vertical-broken" width="24" height="24" />,
            submenu: true,
            subMenuItems: [
                { title: 'STS Operation', path: '/ui/dashboard/sts' },
                { title: 'STS-wce', path: '/ui/dashboard/sts/operation' },

            ]
        },
        {
            title: 'Landfill',
            path: '/ui/dashboard/landfill',
            icon: <Icon icon="material-symbols:landscape-2-outline" width="24" height="24" />,
            submenu: true,
            subMenuItems: [
                { title: 'Landfill Operation', path: '/ui/dashboard/landfill' },
                { title: 'Incoming', path: '/ui/dashboard/landfill/incoming' },
                { title: 'Arrived', path: '/ui/dashboard/landfill/arrived' },
            ],
        }, {
            title: 'Vehicles',
            path: '/ui/dashboard/vehicles',
            icon: <Icon icon="streamline:transfer-van" width="24" height="24" />,
        },
        {
            title: 'User',
            path: '/ui/dashboard/users',
            icon: <Icon icon="mingcute:user-2-line" width="24" height="24" />,

        }, {
            title: 'RBAC',
            path: '/ui/dashboard/rbac',
            icon: <Icon icon="oui:app-users-roles" width="24" height="24" />,
            submenu: true,
            subMenuItems: [
                { title: 'Role', path: '/ui/dashboard/rbac' },
                { title: 'Permission', path: '/ui/dashboard/rbac/permissions' },
            ],
        },
    ];
} else if (role == "STS Manager") {
    SIDENAV_ITEMS = [
        {
            title: 'Dashboard',
            path: '/ui/dashboard',
            icon: <Icon icon="ic:outline-space-dashboard" width="24" height="24" />,
        }, {
            title: 'STS-wce',
            path: '/ui/dashboard/sts/operation',
            icon: <Icon icon="jam:station" width="24" height="24" />,
        },
    ];
} else if (role == "Landfill Manager") {
    SIDENAV_ITEMS = [
        {
            title: 'Dashboard',
            path: '/ui/dashboard',
            icon: <Icon icon="ic:outline-space-dashboard" width="24" height="24" />,
        },
        {
            title: 'Incoming',
            path: '/ui/dashboard/landfill/incoming',
            icon: <Icon icon="icon-park-outline:incoming" width="24" height="24" />,
        }, {
            title: 'Arrived',
            path: '/ui/dashboard/landfill/arrived',
            icon: <Icon icon="icon-park-outline:outgoing" width="24" height="24" />,
        }
    ];
} else {
    SIDENAV_ITEMS = [
        {
            title: 'Dashboard',
            path: '/ui/dashboard',
            icon: <Icon icon="ic:outline-space-dashboard" width="24" height="24" />,
        },
    ];
}

