import React from 'react'
import documentIcon from '../../../assets/documentIcon.png'
import dashboardIcon from '../../../assets/dashboardIcon.png'
import Sidebar from '../../../components/Sidebar'
import userIcon from '../../../assets/userIcon.png'
import clipboardIcon from '../../../assets/clipboardIcon.png'

const SidebarWakilKepsek = ({handleSidebarClick, currentPage, handleLogout}) => {
  const routes = [
    {
      name: 'Dashboard',
      img: dashboardIcon,
      route: 'Dashboard'
    },
    {
      name: 'Lihat Laporan',
      img: documentIcon,
      route: 'LihatLaporan'
    },
    {
      name: 'Evaluasi Kinerja Guru',
      img: clipboardIcon,
      route: 'EvaluasiKinerjaGuru'
    },
    {
      name: 'Profil',
      img: userIcon,
      route: 'Profil'
    }
  ]

  return (
    <Sidebar routes={routes} currentPage={currentPage} handleSidebarClick={handleSidebarClick} handleLogout={handleLogout} />
  )
}

export default SidebarWakilKepsek