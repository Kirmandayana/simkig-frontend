import React from 'react'
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

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title, Tooltip, Legend);

// Pie Char Data Sementara
export const dataPieChart = {
  labels: ['Tidak Hadir', 'Hadir'],
  datasets: [
    {
      data: [12, 19],
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
};

//Line Chart
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const dataLineChart = {
  labels: labels,
  datasets: [{
    label: 'Kehadiran Siswa',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

//Data Table Sementara
function createData(NIK, namaGuru, keterangan) {
  return { NIK, namaGuru, keterangan };
}

const rows = [
  createData(1234567890, 'Guru A', 'Sakit'),
  createData(1234567890, 'Guru B', 'Izin'),
  createData(1234567890, 'Guru C', 'Sakit'),
  createData(1234567890, 'Guru D', 'Izin'),
  createData(1234567890, 'Guru E', 'Sakit'),
];

function Dashboard() {
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
    
      <div style={{display: 'flex'}}>
        <Paper>
          <Typography style={{paddingLeft: '1em'}}>Kehadiran Guru</Typography>
          <Pie data={dataPieChart} style={{paddingBottom:'1em'}} />
        </Paper>

        <Paper style={{flexGrow: 1}}>
          <Line data={dataLineChart} />
        </Paper>
      </div>

      <div style={{marginTop: '1em'}}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: '63.5em' }} aria-label="customized table">
            <TableHead style={{backgroundColor: '#d1d1d1'}}>
              <TableRow>
                <TableCell align="center">NIK</TableCell>
                <TableCell align="center">Nama Guru</TableCell>
                <TableCell align="center">Keterangan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row" align="left">
                    {row.NIK}
                  </TableCell>
                  <TableCell align="left">{row.namaGuru}</TableCell>
                  <TableCell align="center">{row.keterangan}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div>
  )
}

export default Dashboard