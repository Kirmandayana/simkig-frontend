import React, { useEffect } from 'react'
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
    <Line data={dataLineChart} />
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
    <Pie data={dataPieChart} style={{paddingBottom:'1em'}} />
  )
}

const AbsenceRow = ({row, index}) => {
  return (
    <TableRow key={index}>
      <TableCell component="th" scope="row" align="center">
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
    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
    
      <div style={{display: 'flex', height: '28em'}}>
        <Paper style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '25em'}}>
          <Typography style={{paddingLeft: '1em', alignSelf: 'center'}}>Kehadiran Guru hari ini</Typography>
          <AbsencePieChart absences={absences}/>
        </Paper>

        <Paper style={{display: 'flex', flexGrow: 1, marginLeft: '1em', alignItems: 'center'}}>
          <StudentAttendanceSumsChart attendances={studentAttendance}/>
        </Paper>
      </div>

      <div style={{display: 'flex', flexDirection: 'row', marginTop: '1em'}}>
        <Paper style={{display: 'flex', flexDirection: 'column', width: '41em', marginRight: '1.25em', paddingTop: '2em'}}>
          <Typography style={{paddingLeft: '1em', alignSelf: 'center', textAlign: 'center'}}>
            Tabel berikut menunjukkan <br/>
            daftar guru-guru yang tidak hadir pada hari ini
          </Typography>
        </Paper>

        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead style={{backgroundColor: '#d1d1d1'}}>
              <TableRow>
                <TableCell align="center">NIP</TableCell>
                <TableCell align="center">Nama Guru</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {absences ? absences.absentList.map((row, index) => (
                <AbsenceRow key={index} row={row} />
              )) : <TableRow></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div>
  )
}

export default Dashboard