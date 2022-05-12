import React, { useEffect, useState } from 'react'
import {Button, Paper, Typography} from '@mui/material'
import {
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, Title, 
  Tooltip, 
  Legend } from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BACKEND_URL } from '../../../globals';
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title, Tooltip, Legend);

const StudentAttendanceSumsChart = ({attendances}) => {
  attendances = attendances ? attendances : {data: [], dates: []}

  //Line Chart
  const dataLineChart = {
    labels: attendances.dates.map(el => dayjs(el).date()),
    datasets: [
      {
        label: 'Tidak Hadir',
        data: attendances.data.map(el => el.countAbsent),
        fill: false,
        borderColor: 'rgb(255, 100, 0)',
        tension: 0,
      },
      {
        label: 'Hadir',
        data: attendances.data.map(el => el.count),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0,
      }
    ]
  }

  return (
    <Line data={dataLineChart} width='50em' height='25em'/>
  )
}

const AbsencePieChart = ({absences}) => {
  console.log(absences)
  const dataPieChart = {
    labels: ['Tidak Hadir', 'Izin', 'Belum memasukkan dokumentasi', 'Hadir'],
    datasets: [
      {
        data: [absences?.absentSchedule, absences?.ijinSchedule, absences?.notYetSubmitSchedule, absences?.hadirSchedule],
        backgroundColor: [
          'rgba(255, 0, 0, 0.2)',
          'rgba(255, 183, 0, 0.35)',
          'rgba(0, 0, 0, 0.1)',
          'rgba(0, 114, 255, 0.25)',
        ],
        borderColor: [
          'rgba(255, 0, 0, 0.2)',
          'rgba(255, 183, 0, 0.35)',
          'rgba(0, 0, 0, 0.1)',
          'rgba(0, 114, 255, 0.25)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <Pie data={dataPieChart} />
  )
}

const AbsenceRow = ({row, index}) => {
  const [profilePic, setProfilePic] = useState('')

  useEffect(() => {
    fetch(BACKEND_URL + '/profiles/' + row.profilePicture, {
      headers: {
        'access-token': localStorage.getItem('accessToken')
      }
    })
    .then(res => res.blob())
    .then(res => setProfilePic(URL.createObjectURL(res)))
  }, [])

  let backgroundColor
  //zebra coloring on table
  if(index % 2 === 0)
    backgroundColor = '#aecbd6'
  else
    backgroundColor = '#bfd4db'

  return (
    <>
      <TableRow style={{backgroundColor, display: row.jadwal ? null : 'none'}}>
        <TableCell component="th" scope="row" align="center" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
          <Typography>{index + 1}. </Typography>
          <img 
            src={profilePic}
            style={{
              width: '3em',
              borderRadius: '50%',
            }}
            alt=''
          />
        </TableCell>
        <TableCell align="center">
          {row.NIP}
        </TableCell>
        <TableCell align="center">{row.fullName}</TableCell>
      </TableRow>
      <TableRow style={{backgroundColor, padding: 0}}>
        <TableCell colSpan={3} sx={{padding: 0}}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            {
              row.jadwal && row.jadwal.map((el, idx) => (
                <Paper elevation={4} sx={{padding: '0.25em 0em 0.25em 1em', display: 'flex', alignItems: 'center', margin: '1em'}}>

                  <div style={{
                    width: '1em', 
                    height: '1em', 
                    backgroundColor: 'rgba(0,0,0,0.25)', 
                    borderRadius: '0.25em', 
                    marginRight: '2em'}}></div>

                  <Typography>{dayjs(el.date).set('hour', el.dateHour).set('minute', el.dateMinute).format('DD/MM/YYYY HH:mm')} - {el.classroom.className} - {el.mataPelajaran} <b>(Alasan: {el.reason})</b></Typography> 
                </Paper>
              ))
            }
          </div>
        </TableCell>
      </TableRow>
    </>
  )
}

function Dashboard() {
  const [absences, setAbsences] = React.useState(null)
  const [studentAttendance, setStudentAttendance] = React.useState(null)
  const [currentDate, setCurrentDate] = React.useState(dayjs())

  useEffect(() => {
    fetch(BACKEND_URL + '/api/aggregate/getAbsentTeacher2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        date: currentDate.format('YYYY-MM-DD')
      })
    }).then(resp => {
      resp.status === 200 ? 
      resp.json().then(data => {
        console.log(data)
        setAbsences(data.result)
      }) : 
      resp.json().then(data => console.log(data))
    }).catch(err => console.log(err))

    fetch(BACKEND_URL + '/api/aggregate/getAttendanceCount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        date: currentDate.format('YYYY-MM-DD')
      })
    }).then(resp => {
      resp.status === 200 ? 
      resp.json().then(data => setStudentAttendance(data)) : 
      resp.text().then(data => console.log(data))
    }).catch(err => console.log(err))
  }, [currentDate])

  return (
    <div style={{display: 'flex', flexDirection: 'column', width: '58em', marginLeft: 'auto', marginRight: 'auto'}}>
      <div style={{display: 'flex', marginBottom: '1em'}}>
        <Typography variant='h6' style={{fontSize: '1.1em'}}>Dashboard untuk {currentDate.format('dddd, DD/MM/YYYY')}</Typography>

        <div style={{flexGrow: 1}}></div>

        <Button
          variant='outlined'
          style={{
            marginLeft: '1em',
          }}
          onClick={() => setCurrentDate(currentDate.subtract(1, 'day'))}
        >Hari Sebelumnya</Button>
        <Button
          disabled={currentDate.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')}
          variant='outlined'
          style={{
            marginLeft: '1em',
          }}
          onClick={() => setCurrentDate(currentDate.add(1, 'day'))}
        >Hari Selanjutnya</Button>
      </div>
      <div style={{display: 'flex', height: '22em'}}>
        <Paper style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '22em', width: '18em'}}>
          <Typography style={{alignSelf: 'center'}}>Kehadiran Guru Berdasarkan Jadwal</Typography>
          <AbsencePieChart absences={absences}/>
        </Paper>

        <Paper style={{display: 'flex', flexDirection: 'column', width: '39em', marginLeft: '1em', alignItems: 'center', }}>
          <Typography>Total Kehadiran Siswa</Typography>
          <StudentAttendanceSumsChart attendances={studentAttendance}/>
        </Paper>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', marginTop: '1em'}}>
        <Paper>
          <Typography style={{paddingLeft: '1em', alignSelf: 'center', textAlign: 'center'}}>
            Daftar ketidakhadiran guru 
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead style={{backgroundColor: '#78a2cc'}}>
                <TableRow>
                  <TableCell align='center'></TableCell>
                  <TableCell align="center">NIP</TableCell>
                  <TableCell align="center">Nama Guru</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {absences ? absences?.absenceList.map((row, index) => (
                  <AbsenceRow key={row.id} index={index} row={row} />
                )) : <TableRow></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>

    </div>
  )
}

export default Dashboard