import React, { useEffect, useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import loginArtwork from '../../../assets/loginArtwork.png';
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const {BACKEND_URL} = require('../../../globals')
dayjs.extend(utc)

const getMonthRange = (month, year) => [
  `${year}-${month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}-01`,
  `${year}-${month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}-${new Date(year, month, 0).getDate()}`
]

const monthNumber = {
  1: 'Januari',
  2: 'Februari',
  3: 'Maret',
  4: 'April',
  5: 'Mei',
  6: 'Juni',
  7: 'Juli',
  8: 'Agustus',
  9: 'September',
  10: 'Oktober',
  11: 'November',
  12: 'Desember'
}

// const getDocumentList = (userId, month, year) => new Promise((resolve, reject) => {
//   fetch(BACKEND_URL + `/api/document/getDocumentList`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'access-token': localStorage.getItem('accessToken')
//     },
//     body: JSON.stringify({
//       rangeStart: getMonthRange(month, year)[0],
//       rangeEnd: getMonthRange(month, year)[1],
//       teacherId: userId
//     })
//   })
//   .then(response => 
//     response.status === 200 ? 
//     response.json().then(data => resolve(data)) : 
//     response.json().then(data => reject(data))
//   )
//   .catch(err => reject(err))
// })

const DocumentRow = ({row, index}) => {
  const [img, setImg] = useState('')
  
  useEffect(() => {
    if(row.photoFilename)
      fetch(BACKEND_URL + `/uploads/${row.photoFilename}`, {
        headers: {
          'access-token': localStorage.getItem('accessToken')
        }
      })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        setImg(url)
      })
  }, [])

  let backgroundColor

  //zebra coloring on table
  if(index % 2 === 0)
    if(!row.photoFilename) backgroundColor = '#ffcccc'
    else backgroundColor = '#e0e0e0'
  else
    if(!row.photoFilename) backgroundColor = '#ffb8b8'
    else backgroundColor = '#ffffff'

  return (
    <TableRow style={{backgroundColor, display: !row.photoFilename && 'none'}}>
      <TableCell component="th" scope="row" align="left">
        {dayjs(row.date).format('YYYY-MM-DD HH:mm')}
      </TableCell>
      {
        row.photoFilename ?
        <>
          <TableCell align="left">{row.className}</TableCell>
          <TableCell align="left">{row.mataPelajaran}</TableCell>
          <TableCell align="center">{row.jumlahSiswaAktif}</TableCell>
          <TableCell align="center">
            <img src={img} style={{height: '4em'}} />
          </TableCell>
          <TableCell align="left">{row.keluhan}</TableCell>
        </>
        :
        <>
          <TableCell align="center" colSpan={5}>BELUM DI ISI</TableCell>
        </>
      }
    </TableRow>
  )
}

function DetailLaporanGuru({selectedUser, selectedMonth, selectedYear, setSelectedUser}) {
  const [data, setData] = useState([])

  const exportDocumentButtonHandler = () => {
    fetch(BACKEND_URL + `/api/document/exportDocument`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        rangeStart: getMonthRange(selectedMonth, selectedYear)[0],
        rangeEnd: getMonthRange(selectedMonth, selectedYear)[1],
        teacherId: selectedUser.id
      })
    })
    .then(response => 
      response.status === 200 ? 
      response.blob()
      .then(blob => {
        //set correct filename
        const filename = `Laporan_Guru_${selectedUser.username}_${monthNumber[selectedMonth]}_${selectedYear}.docx`
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }) : 
      response.json().then(data => console.log(data))
    )
    .catch(err => console.log(err))
  }

  useState(() => {
    //fetch the data for current month upon mounting
    fetch(BACKEND_URL + `/api/document/getDocumentList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        rangeStart: getMonthRange(selectedMonth, selectedYear)[0],
        rangeEnd: getMonthRange(selectedMonth, selectedYear)[1],
        teacherId: selectedUser.id
      })
    })
    .then(res => {
      if(res.status === 200)
        return res.json().then(res => setData(res))
      else
        return res.json().then(msg => console.log(msg))
    })
    
  }, [])

  return (
    <div style={{display:'flex', flexDirection: 'column', flexGrow:1, alignItems: 'center'}}>
        
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', paddingLeft:'2em' }}>
          <Button variant='contained' color='primary' style={{width: '5em', marginBottom: '1em'}}
            onClick={() => setSelectedUser(undefined)}
          >Kembali</Button>
          <Typography variant='h6' >Nama Guru: {selectedUser.fullName}</Typography>
          <Typography variant='h6' >Laporan KBM Bulan {monthNumber[selectedMonth]} Tahun {selectedYear}</Typography>
          <Button 
            variant='contained' 
            color='primary' 
            style={{ height: '2em', width: '5em', alignSelf: 'end', marginRight: '2em'}}
            onClick={exportDocumentButtonHandler}
          >Ekspor</Button>
        </div>

        {/* Table */}
        <div style={{marginTop: '1em'}}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: '63.5em' }} aria-label="simple table">
              <TableHead style={{backgroundColor: '#d1d1d1'}}>
                <TableRow>
                  <TableCell align="center">Tanggal</TableCell>
                  <TableCell align="center">Nama Kelas</TableCell>
                  <TableCell align="center">Mata Pelajaran</TableCell>
                  <TableCell align="center">Jumlah Siswa</TableCell>
                  <TableCell align="center">Bukti KBM</TableCell>
                  <TableCell align="center">Keluhan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <DocumentRow key={index} row={row} index={index}/>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

    </div>
  );
}

export default DetailLaporanGuru;
