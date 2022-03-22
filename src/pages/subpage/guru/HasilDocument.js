import React, { useEffect } from 'react';
import {useState} from 'react'
import { 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  Typography
} from '@mui/material';
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const {BACKEND_URL} = require('../../../globals')
dayjs.extend(utc)

const getUserInfoFromAccessToken = () => {
  //convert access token from jwt to json
  const jwt = localStorage.getItem('accessToken')
  const jwtParts = jwt.split('.')
  const jwtBody = JSON.parse(atob(jwtParts[0]))
  return jwtBody
}

const getDocumentList = async (rangeStart, rangeEnd) => {
  const response = await fetch(BACKEND_URL + `/api/document/getDocumentList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('accessToken')
    },
    body: JSON.stringify({
      rangeStart,
      rangeEnd,
      teacherId: getUserInfoFromAccessToken().identifier.id
    })
  })

  if(response.status === 200)
    return await response.json().then(res => res.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date))))
  else
    throw new Error(await response.json().then(err => {console.log(err); return err}))
}


const getMonthRange = (month, year) => [
  `${year}-${month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}-01`,
  `${year}-${month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}-${new Date(year, month, 0).getDate()}`
]

const FilterBar = ({setData, month, setMonth, year, setYear}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      // backgroundColor: 'red',
      width: '100%',
      marginBottom: '1em'
    }}>
      {/* select bulan */}
      <Typography variant='h6' style={{alignSelf: 'center', marginLeft: '1em'}}>Daftar Laporan KBM</Typography>
      <div style={{flexGrow: 1}}></div>
      <FormControl style={{width: '10em'}}>
        <InputLabel id="select-bulan">Bulan</InputLabel>
        <Select 
          label="Bulan" 
          id='select-bulan'
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <MenuItem value={1}>Januari</MenuItem>
          <MenuItem value={2}>Februari</MenuItem>
          <MenuItem value={3}>Maret</MenuItem>
          <MenuItem value={4}>April</MenuItem>
          <MenuItem value={5}>Mei</MenuItem>
          <MenuItem value={6}>Juni</MenuItem>
          <MenuItem value={7}>Juli</MenuItem>
          <MenuItem value={8}>Agustus</MenuItem>
          <MenuItem value={9}>September</MenuItem>
          <MenuItem value={10}>Oktober</MenuItem>
          <MenuItem value={11}>November</MenuItem>
          <MenuItem value={12}>Desember</MenuItem>
        </Select>
      </FormControl>
      {/* select tahun */}
      <div style={{width: '1em'}}></div>
      <TextField 
        label="Tahun"
        onChange={e => setYear(e.target.value.replace(/[^0-9]/g, ''))}
        value={year}
      />
      {/* button filter */}
      <div style={{width: '1em'}}></div>
      <Button 
        variant='contained' 
        color='primary' 
        style={{height: '100%'}}
        onClick={() => {
          //make sure month and year is valid
          if(!month || !year) return alert('Mohon isi bulan dan tahun dengan benar')

          getDocumentList(getMonthRange(month, year)[0], getMonthRange(month, year)[1])
          .then(res => {console.log(res); setData(res)})
          .catch(err => {console.log(err); alert(err?.result)})
        }}
      >Tampilkan</Button>
    </div>
  )
}

const DocumentRow = ({row, index, removeDocumentButtonHandler}) => {
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
    if(!row.photoFilename && !row.reason) backgroundColor = '#ffcccc'
    else backgroundColor = '#aecbd6'
  else
    if(!row.photoFilename && !row.reason) backgroundColor = '#ffb8b8'
    else backgroundColor = '#bfd4db'

  return (
    <TableRow style={{backgroundColor}}>
      <TableCell component="th" scope="row" align="left">
        {dayjs(row.date).format('YYYY-MM-DD')}{row.photoFilename && ' '+row.dateHour.toLocaleString('en-US', {minimumIntegerDigits: 2})+':'+row.dateMinute.toLocaleString('en-US', {minimumIntegerDigits: 2})}
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
          <TableCell align="center">
            <Button
              variant='contained'
              color='error'
              onClick={() => removeDocumentButtonHandler(row)}
            >Hapus</Button>
          </TableCell>
        </>
        :
        <TableCell align="center" colSpan={6}>Belum diisi</TableCell>
      }
    </TableRow>
  )
}

function HasilDocument() {
  const [data, setData] = useState([])
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const removeDocumentButtonHandler = (row) => {
    let confirmDelete = window.confirm('Apakah anda yakin ingin menghapus laporan ini?')

    if(!confirmDelete) return

    fetch(BACKEND_URL + `/api/document/removeDocument`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({documentId: row.id})
    })
    .then(res => {
      if(res.status === 200) return res.json().then(res => alert(res?.result))
      else return res.json().then(msg => alert(msg?.result))
    })
    .then(() => getDocumentList(getMonthRange(month, year)[0], getMonthRange(month, year)[1]).then(res => {console.log(res); setData(res)}))
  }

  useState(() => {
    //fetch the data for current month upon mounting
    getDocumentList(
      getMonthRange(new Date().getMonth() + 1, new Date().getFullYear())[0],
      getMonthRange(new Date().getMonth() + 1, new Date().getFullYear())[1],
    )
    .then(res => {console.log(res); setData(res)})
    .catch(err => {console.log(err); alert(err?.result)})
  }, [])

  return (
    <div style={{display:'flex', flexDirection: 'column', flexGrow:1, alignItems: 'center', marginTop: '1em'}}>
      <FilterBar setData={setData} month={month} setMonth={setMonth} year={year} setYear={setYear}/>
      <TableContainer component={Paper} style={{flexGrow: 1}}>
          <Table sx={{ minWidth: '50em' }} aria-label="simple table">
            <TableHead style={{backgroundColor: '#78a2cc'}}>
              <TableRow>
                <TableCell align="left">Tanggal</TableCell>
                <TableCell align="left">Nama Kelas</TableCell>
                <TableCell align="left">Mata Pelajaran</TableCell>
                <TableCell align="center">Jumlah Siswa</TableCell>
                <TableCell align="center">Bukti KBM</TableCell>
                <TableCell align="left">Keluhan</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.sort((a, b) => 
                dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
              ).map((row, index) => 
                <DocumentRow 
                  row={row} 
                  key={row.id} 
                  index={index} 
                  removeDocumentButtonHandler={removeDocumentButtonHandler}
                />
              )}
            </TableBody>
          </Table>
      </TableContainer>
    </div>
  )
}

export default HasilDocument