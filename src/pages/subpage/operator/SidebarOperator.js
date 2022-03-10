import React from 'react'
import homeIcon from '../../../assets/homeIcon.png'
import userIcon from '../../../assets/userIcon.png'
import Sidebar from '../../../components/Sidebar'
// import serverIcon from '../../../assets/serverIcon.png'

function SidebarOperator({handleSidebarClick, currentPage, handleLogout}) {
    const routes = [
        {
            name: 'Dashboard',
            img: homeIcon,
            route: 'Dashboard'
        },
        {
            name: 'Manajemen User',
            img: userIcon,
            route: 'ManajemenUser'
        },
        // {
        //     name: 'Manajemen Server',
        //     img: serverIcon,
        //     route: 'ManajemenServer'
        // },
    ]

    return (
        <Sidebar routes={routes} currentPage={currentPage} handleSidebarClick={handleSidebarClick} handleLogout={handleLogout} />
    )
}

export default SidebarOperator