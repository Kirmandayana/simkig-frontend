import React from 'react'
import { Typography } from '@mui/material';
import homeArtWork from '../../../assets/homeArtWork.png';

function Dashboard() {
  return (
    <div style={{display:'flex', flexDirection: 'row', flexGrow:1}}>
      <div style={{paddingLeft: '9em', marginTop: 'auto', marginBottom: 'auto'}}>
        <Typography style={{fontSize: '1.5em', fontWeight: 'bold'}}>Selamat Datang di SIMKIG KBM</Typography>
      </div>

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '5em'}}>
        <img src={homeArtWork} style={{width: '15em', paddingRight:'8em'}} alt=''/>
      </div>
    </div>
  )
}

export default Dashboard