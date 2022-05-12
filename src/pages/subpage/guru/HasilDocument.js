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

const TABLE_FONT_SIZE = 0.9

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
    throw new Error(await response.json().then(err => {console.log(err.result); return err.result}))
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

const DocumentRow = ({row, index, removeDocumentButtonHandler, removeAbsentButtonHandler}) => {
  const [img, setImg] = useState('')
  
  useEffect(() => {
    if(row.document?.photoFilename)
      fetch(BACKEND_URL + `/uploads/${row.document?.photoFilename}`, {
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
  const isLate = dayjs(row.date).diff(dayjs(), 'day') < -2

  //zebra coloring on table
  if(index % 2 === 0) {
    if(!row.document) {
      //if it's 3 days late from today
      if(isLate) {
        backgroundColor = '#ffcccc'
      } else {
        backgroundColor = '#ffe1b3'
      }
    } else {
      backgroundColor = '#aecbd6'
    }

    if(row.absent) {
      backgroundColor = '#ffe1b3'
    }
  } else {
    if(!row.document) {
      //if it's 3 days late from today
      if(isLate) {
        backgroundColor = '#ffb8b8'
      } else {
        backgroundColor = '#ffd391'
      }
    } else {
      backgroundColor = '#bfd4db'
    }

    if(row.absent) {
      backgroundColor = '#ffd391'
    }
  }

  return (
    <TableRow style={{backgroundColor}}>
      <TableCell component="th" scope="row" align="left">
        {/* {dayjs(row.date).format('YYYY-MM-DD')}{row.photoFilename && ' '+row.dateHour.toLocaleString('en-US', {minimumIntegerDigits: 2})+':'+row.dateMinute.toLocaleString('en-US', {minimumIntegerDigits: 2})} */}
        <Typography style={{fontSize: TABLE_FONT_SIZE + 'em'}}>{dayjs(row.date).format('YYYY-MM-DD')}</Typography>
        <Typography style={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em', color: 'rgba(0, 0, 0, 0.75)'}}>
          ({row.dateHour.toString().length < 2 ? '0' + row.dateHour : row.dateHour}.{row.dateMinute.toString().length < 2 ? '0' + row.dateMinute : row.dateMinute} -
          {row.dateEndHour.toString().length < 2 ? '0' + row.dateEndHour : row.dateEndHour}.{row.dateEndMinute.toString().length < 2 ? '0' + row.dateEndMinute : row.dateEndMinute})
        </Typography>
      </TableCell>
      {
        row.document ?
        <>
          <TableCell align="left" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>{row.document.className}</TableCell>
          <TableCell align="left" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>{row.document.mataPelajaran}</TableCell>
          <TableCell align="left" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>{row.document.topik}</TableCell>
          {/* <TableCell align="center" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>{row.document.jumlahSiswaKelas}</TableCell> */}
          <TableCell align="center" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>{row.document.jumlahSiswaAktif}</TableCell>
          <TableCell align="center" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>{row.document.jumlahSiswaSakit}</TableCell>
          <TableCell align="center" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>{row.document.jumlahSiswaIzin}</TableCell>
          <TableCell align="center">
            <img src={img} style={{height: '4em'}} />
          </TableCell>
          <TableCell align="left" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>{row.document.keluhan}</TableCell>
          <TableCell align="center">
            <Button
              variant='contained'
              color='error'
              onClick={() => removeDocumentButtonHandler(row)}
              style={{
                fontSize: TABLE_FONT_SIZE + 'em',
              }}
            >Hapus</Button>
          </TableCell>
        </>
        :
        row.absent ?
        <>
          <TableCell align="center" colSpan={8} sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>
            Izin - ({row.absent.reason})
          </TableCell>
          <TableCell>
            <Button
              variant='contained'
              onClick={() => removeAbsentButtonHandler(row)}
              style={{
                fontSize: TABLE_FONT_SIZE + 'em',
              }}
            >Hapus</Button>
          </TableCell>
        </> :
        <TableCell align="center" colSpan={9} sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>{isLate ? 'Tidak diisi' : 'Belum diisi'} ({row.mataPelajaran} - {row.classroom?.className})</TableCell>
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
      body: JSON.stringify({documentId: row.document.id})
    })
    .then(res => {
      if(res.status === 200) return res.json().then(res => alert(res?.result))
      else return res.json().then(msg => alert(msg?.result))
    })
    .then(() => getDocumentList(getMonthRange(month, year)[0], getMonthRange(month, year)[1]).then(res => setData(res)))
  }

  const removeAbsentButtonHandler = row => {
    if(!window.confirm('Apakah anda yakin ingin menghapus izin ini?'))
      return

    fetch(BACKEND_URL + '/api/absence/deleteAbsence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({absenceId: row.absent.id})
    })
    .then(res =>
      res.status === 200 ?
      (() => {
        alert('Izin berhasil dihapus')

        getDocumentList(getMonthRange(month, year)[0], getMonthRange(month, year)[1]).then(res => setData(res))
      })() :
      res.json().then(error => {console.log(error); alert(error.toString())})
    )
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
                {
                  [
                    ['Tanggal','8.9em'],
                    ['Nama Kelas',],
                    ['Mata Pelajaran',],
                    ['Topik / Materi', '1em'],
                    // ['Jumlah Siswa Kelas', '1em'],
                    ['Hadir', '1em'],
                    ['Sakit', '1em'],
                    ['Izin', '1em'],
                    ['Bukti KBM',],
                    ['Keluhan', '1em'],
                    ['Aksi', '1em'],
                  ].map((el, idx) => (
                    <TableCell align="left" sx={{fontSize: TABLE_FONT_SIZE + 'em', paddingLeft: 0, paddingRight: 0, width: el.length > 1 ? el[1] : null}}>
                      <div style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
                        {el[0]}
                      </div>
                    </TableCell>  
                  ))
                }
                {/* <TableCell align="left" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>Tanggal</TableCell>
                <TableCell align="left" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>Nama Kelas</TableCell>
                <TableCell align="left" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>Mata Pelajaran</TableCell>
                <TableCell align="left" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>Topik / Materi</TableCell>
                <TableCell align="center" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>Jumlah Siswa Kelas</TableCell>
                <TableCell align="center" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>Hadir</TableCell>
                <TableCell align="center" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>Sakit</TableCell>
                <TableCell align="center" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>Izin</TableCell>
                <TableCell align="center" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>Bukti KBM</TableCell>
                <TableCell align="left" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>Keluhan</TableCell>
                <TableCell align="center" sx={{fontSize: TABLE_FONT_SIZE * 0.8 + 'em'}}>Aksi</TableCell> */}
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
                  {...{
                    removeDocumentButtonHandler,
                    removeAbsentButtonHandler,
                  }}
                />
              )}
            </TableBody>
          </Table>
      </TableContainer>
    </div>
  )
}

export default HasilDocument