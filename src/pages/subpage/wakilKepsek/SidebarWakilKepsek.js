import React from 'react'
import {Typography } from '@mui/material'
import documentIcon from '../../../assets/documentIcon.png'
import logOutIcon from '../../../assets/logOutIcon.png'

function Sidebar() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', margin: '0em 1em 0em 1em', paddingTop: '1em'}}>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em'}}>
            {/* <img src={homeIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/> */}
            <Typography>Dashboard</Typography>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em'}}>
            <img src={documentIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
            <Typography>Lihat Laporan</Typography>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em'}}>
            <img src={logOutIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
            <Typography>Keluar</Typography>
        </div>
    </div>
  )
}

export default Sidebar