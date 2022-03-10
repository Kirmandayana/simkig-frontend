import React from 'react'
import homeIcon from '../../../assets/homeIcon.png'
import documentIcon from '../../../assets/documentIcon.png'
import uploadDocumentIcon from '../../../assets/uploadDocumentIcon.png'
import userIcon from '../../../assets/userIcon.png'
import Sidebar from '../../../components/Sidebar'

function SidebarGuru({handleSidebarClick, currentPage, handleLogout}) {
    const routes = [
        {
            name: 'Beranda',
            img: homeIcon,
            route: 'Dashboard'
        },
        {
            name: 'Unggah Dokumen',
            img: uploadDocumentIcon,
            route: 'UploadDocument'
        },
        {
            name: 'Lihat Laporan',
            img: documentIcon,
            route: 'HasilDocument'
        },
        {
            name: 'Profil',
            img: userIcon,
            route: 'Profil'
        },
    ]

    return (
        <Sidebar routes={routes} currentPage={currentPage} handleSidebarClick={handleSidebarClick} handleLogout={handleLogout} />
    )
}

export default SidebarGuru