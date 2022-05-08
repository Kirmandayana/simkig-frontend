import React, { useEffect, useState } from 'react'
import { fabClasses, Paper, Typography } from '@mui/material';
import homeArtWork from '../../../assets/homeArtWork.png';
import Warning from '../../../assets/warningIconWhite.png'
import {BACKEND_URL} from '../../../globals'
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const daysAgoToStringMapping = [
  'Hari ini',
  'Kemarin',
  'Dua hari yang lalu',
  'Tiga hari yang lalu',
  'Empat hari yang lalu',
  'Lima hari yang lalu',
]

const WarningCard = ({
  incompleteSchedules
}) => {
  //group by day
  const restructured = incompleteSchedules.reduce((accumulator, currVal) => {
    const daysFromNow = daysAgoToStringMapping[Math.abs(dayjs(currVal.date).diff(dayjs(), 'day'))]

    accumulator[daysFromNow] = accumulator[daysFromNow] || []
    accumulator[daysFromNow].push(currVal)

    return accumulator
  }, {})

  return (
    <Paper sx={{borderRadius: '1em', display: 'flex', overflow: 'hidden', marginTop: '2em'}} elevation={8}>
      <div style={{backgroundColor: 'orange', width: '2em', display: 'flex', justifyContent: 'center'}}>
        <img src={Warning} style={{height: '1em', aspectRatio: 1/1, marginTop: '0.5em'}} alt=''/>
      </div>
      <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '1em'}}>
        <Typography style={{fontWeight: 'bold', fontSize: '0.8em'}}>Peringatan!</Typography>
        <Typography style={{fontSize: '0.8em'}}>Anda belum mengirimkan <br/> dokumentasi hasil KBM untuk: </Typography>
        <div style={{maxHeight: '7em', overflowY: 'scroll'}}>
        {/* {
          incompleteSchedules.map(schedule => 
            <Typography key={schedule.id} style={{fontWeight: 'bold', fontSize: '0.8em'}}>
               > {schedule.mataPelajaran}&nbsp;
              (
                {schedule.dateHour}.{schedule.dateMinute.toString() < 2 ? '0' + schedule.dateMinute : schedule.dateMinute} - 
                {schedule.dateEndHour}.{schedule.dateEndMinute.toString() < 2 ? '0' + schedule.dateEndMinute : schedule.dateEndMinute}
              )</Typography>
          )
        }   */}
        {
          Object.keys(restructured).map(key =>
            <>
              <Typography key={key} style={{fontWeight: 'bold', fontSize: '0.8em'}}>
                {key} :
              </Typography>
              {
                restructured[key].map(schedule =>
                  <Typography key={schedule.id} style={{fontSize: '0.8em'}}>
                    > {schedule.mataPelajaran}&nbsp;
                    (
                      {schedule.dateHour}.{schedule.dateMinute.toString() < 2 ? '0' + schedule.dateMinute : schedule.dateMinute} -
                      {schedule.dateEndHour}.{schedule.dateEndMinute.toString() < 2 ? '0' + schedule.dateEndMinute : schedule.dateEndMinute}
                    )
                  </Typography>
                )
              }
            </>
          )
        }
        </div>
      </div>
    </Paper>
  )
}

function Dashboard() {
  const [incompleteSchedules, setIncompleteSchedules] = useState([])

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
      setIncompleteSchedules(data)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <div style={{display:'flex', flexDirection: 'row', flexGrow:1}}>
      <div style={{paddingLeft: '3em', marginTop: 'auto', marginBottom: 'auto'}}>
        <Typography style={{fontSize: '1.5em', fontWeight: 'bold'}}>Selamat Datang di SIMKIG KBM</Typography>
        <Typography style={{paddingTop: '1em'}}>
          Pada Sistem ini, anda dapat mengunggah hasil dokumentasi kegiatan belajar mengajar dikelas, 
          dan juga dapat melihat daftar laporan yang sudah dikirim maupun yang belum dikirim.
        </Typography>
        {incompleteSchedules.length > 0 && <WarningCard {...{incompleteSchedules}}/>}
      </div>

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '5em'}}>
        <img src={homeArtWork} style={{width: '15em', paddingRight:'8em'}} alt=''/>
      </div>
    </div>
  )
}

export default Dashboard