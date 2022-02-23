import React from 'react'
import {Typography } from '@mui/material'
import homeIcon from '../../../assets/homeIcon.png'
import logOutIcon from '../../../assets/logOutIcon.png'
import userIcon from '../../../assets/userIcon.png'
import serverIcon from '../../../assets/serverIcon.png'

function SidebarOperator({handleSidebarClick, handleLogout}) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', margin: '0em 1em 0em 1em', paddingTop: '1em'}}>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em', cursor: 'pointer'}} onClick={() => handleSidebarClick('Dashboard')}>
            <img src={homeIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
            <Typography>Beranda</Typography>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em', cursor: 'pointer'}} onClick={() => handleSidebarClick('ManajemenUser')}>
            <img src={userIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
            <Typography>Manajemen User</Typography>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em', cursor: 'pointer'}} onClick={() => handleSidebarClick('ManajemenServer')}>
            <img src={serverIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
            <Typography>Manajemen Server</Typography>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em', cursor: 'pointer'}} onClick={() => handleLogout()}>
            <img src={logOutIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
            <Typography>Keluar</Typography>
        </div>
    </div>
  )
}

export default SidebarOperator