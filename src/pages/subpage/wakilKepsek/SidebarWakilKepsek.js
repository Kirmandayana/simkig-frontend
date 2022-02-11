import React from 'react'
import {Typography } from '@mui/material'
import documentIcon from '../../../assets/documentIcon.png'
import logOutIcon from '../../../assets/logOutIcon.png'
import dashboardIcon from '../../../assets/dashboardIcon.png'

function Sidebar({handleSidebarClick, handleLogout}) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', margin: '0em 1em 0em 1em', paddingTop: '1em'}}>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em', cursor: 'pointer'}} onClick={() => handleSidebarClick('Dashboard')}>
            <img src={dashboardIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
            <Typography>Dashboard</Typography>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em', cursor: 'pointer'}} onClick={() => handleSidebarClick('LihatLaporan')}>
            <img src={documentIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
            <Typography>Lihat Laporan</Typography>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em', cursor: 'pointer'}} onClick={() => handleLogout()}>
            <img src={logOutIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
            <Typography>Keluar</Typography>
        </div>
    </div>
  )
}

export default Sidebar