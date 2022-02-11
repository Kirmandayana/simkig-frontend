import React from 'react'
import {Typography } from '@mui/material'
import homeIcon from '../../../assets/homeIcon.png'
import documentIcon from '../../../assets/documentIcon.png'
import logOutIcon from '../../../assets/logOutIcon.png'
import uploadDocumentIcon from '../../../assets/uploadDocumentIcon.png'

function Sidebar({handleSidebarClick, handleLogout}) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', margin: '0em 1em 0em 1em', paddingTop: '1em'}}>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em', cursor: 'pointer'}} onClick={() => handleSidebarClick('Dashboard')}>
            <img src={homeIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
            <Typography>Beranda</Typography>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em', cursor: 'pointer'}} onClick={() => handleSidebarClick('UploadDocument')}>
            <img src={uploadDocumentIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
            <Typography>Unggah Dokumen</Typography>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', height: '2.7em', cursor: 'pointer'}} onClick={() => handleSidebarClick('HasilDocument')}>
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