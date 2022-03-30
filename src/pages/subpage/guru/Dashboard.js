import React, { useEffect, useState } from 'react'
import { fabClasses, Paper, Typography } from '@mui/material';
import homeArtWork from '../../../assets/homeArtWork.png';
import Warning from '../../../assets/warningIconWhite.png'
import {BACKEND_URL} from '../../../globals'

const WarningCard = () => {
  return (
    <Paper sx={{borderRadius: '1em', display: 'flex', overflow: 'hidden', marginTop: '2em'}} elevation={8}>
      <div style={{backgroundColor: 'orange', width: '5em', display: 'flex', justifyContent: 'center'}}>
        <img src={Warning} style={{height: '2.5em', aspectRatio: 1/1, marginTop: '1em'}} alt=''/>
      </div>
      <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '1em'}}>
        <Typography style={{fontWeight: 'bold'}}>Peringatan!</Typography>
        <Typography>Anda belum mengirimkan <br/> dokumentasi hasil KBM untuk hari ini</Typography>
      </div>
    </Paper>
  )
}

function Dashboard() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    //request data dari API Endpoint
    fetch(BACKEND_URL + '/api/document/checkHasUploadedToday', {
      method: 'GET',
      headers: {
        'access-token': localStorage.getItem('accessToken'),
      }
    })
    .then(resp => { //response
      if(resp.status === 200) {
        return resp.json()
      } else {
        resp.json().then(err => console.log(err))
      }
    })
    .then(data => {
      if(data.length < 1) {
        setShowWarning(true)
      } else {
        setShowWarning(false)
      }
    })
    .catch(err => {
      console.log(err)
    })
  })

  return (
    <div style={{display:'flex', flexDirection: 'row', flexGrow:1}}>
      <div style={{paddingLeft: '9em', marginTop: 'auto', marginBottom: 'auto'}}>
        <Typography style={{fontSize: '1.5em', fontWeight: 'bold'}}>Selamat Datang di SIMKIG KBM</Typography>
        <Typography style={{paddingTop: '1em'}}>
          Pada Sistem ini, anda dapat mengunggah hasil dokumentasi kegiatan belajar mengajar dikelas, 
          dan juga dapat melihat daftar laporan yang sudah dikirim maupun yang belum dikirim.
        </Typography>
        {showWarning && <WarningCard/>}
      </div>

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '5em'}}>
        <img src={homeArtWork} style={{width: '15em', paddingRight:'8em'}} alt=''/>
      </div>
    </div>
  )
}

export default Dashboard