import React from 'react'
import { Typography } from '@mui/material';
import homeArtWork from '../../../assets/homeArtWork.png';

function Dashboard() {
  return (
    <div style={{display:'flex', flexDirection: 'row', flexGrow:1}}>
      <div style={{paddingLeft: '3em', marginTop: 'auto', marginBottom: 'auto'}}>
        <Typography variant='h3'>Selamat Datang di Sistem Informasi Manajemen Kinerja Guru</Typography>
        <Typography variant='h5' style={{paddingTop: '1em'}}>
          Pada Sistem ini, anda dapat mengunggah hasil dokumentasi kegiatan belajar mengajar dikelas, 
          dan juga dapat melihat daftar laporan yang sudah dikirim maupun yang belum dikirim.
        </Typography>
      </div>

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '10em'}}>
        <img src={homeArtWork} style={{width: '20em', margin: 'auto', paddingRight:'4em'}}/>
      </div>
    </div>
  )
}

export default Dashboard