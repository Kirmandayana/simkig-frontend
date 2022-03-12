import React, { useEffect, useState } from 'react'
import {Paper, Typography} from '@mui/material'
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
    datasets: [{
      label: 'Total Kehadiran Siswa',
      data: attendances.data.map(el => el.count),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }

  return (
    <Line data={dataLineChart} width='50em' height='25em'/>
  )
}

const AbsencePieChart = ({absences}) => {
  absences = absences ? absences : {absentList: [], teachersCount: 0}

  const dataPieChart = {
    labels: ['Tidak Hadir', 'Hadir'],
    datasets: [
      {
        data: [absences.absentList.length, absences.teachersCount - absences.absentList.length],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
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
    <TableRow style={{backgroundColor: backgroundColor}}>
      <TableCell component="th" scope="row" align="center">
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
  )
}

function Dashboard() {
  const [absences, setAbsences] = React.useState(null)
  const [studentAttendance, setStudentAttendance] = React.useState(null)

  useEffect(() => {
    fetch(BACKEND_URL + '/api/aggregate/getAbsentTeachers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        date: Date.now()
      })
    }).then(resp => {
      resp.status === 200 ? 
      resp.json().then(data => setAbsences(data)) : 
      resp.json().then(data => console.log(data))
    }).catch(err => console.log(err))

    fetch(BACKEND_URL + '/api/aggregate/getAttendanceCount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        date: Date.now()
      })
    }).then(resp => {
      resp.status === 200 ? 
      resp.json().then(data => setStudentAttendance(data)) : 
      resp.text().then(data => console.log(data))
    }).catch(err => console.log(err))
  }, [])

  return (
    <div style={{display: 'flex', flexDirection: 'column', width: '58em', marginLeft: 'auto', marginRight: 'auto'}}>
    
      <div style={{display: 'flex', height: '22em'}}>
        <Paper style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '22em', width: '18em'}}>
          <Typography style={{alignSelf: 'center'}}>Kehadiran Guru hari ini</Typography>
          <AbsencePieChart absences={absences}/>
        </Paper>

        <Paper style={{display: 'flex', width: '39em', marginLeft: '1em', alignItems: 'center', }}>
          <StudentAttendanceSumsChart attendances={studentAttendance}/>
        </Paper>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', marginTop: '1em'}}>
        <Paper>
          <Typography style={{paddingLeft: '1em', alignSelf: 'center', textAlign: 'center'}}>
            Daftar guru-guru yang tidak hadir
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
                {absences ? absences.absentList.map((row, index) => (
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