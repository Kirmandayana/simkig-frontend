import React from 'react';
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
  FormControl 
} from '@mui/material';
const {BACKEND_URL} = require('../../../globals')

/**
 * @name getMonthRange
 * @description get the first and last day of the month and returns two strings
 * @param {number} month - month number
 * @param {number} year - year number
 * @returns {string[]} - array of two date strings
 * @example getMonthRange(1, 2020) // ['2020-01-01', '2020-01-31']
 */
const getMonthRange = (month, year) => [
  `${year}-${month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}-01`,
  `${year}-${month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}-${new Date(year, month, 0).getDate()}`
]

const FilterBar = ({setData}) => {
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      // backgroundColor: 'red',
      width: '100%',
      marginBottom: '1em'
    }}>
      {/* select bulan */}
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
          if(month && year) {
            console.log(month, year)
          } else {
            alert('Mohon isi bulan dan tahun dengan benar')
            return
          }

          fetch(BACKEND_URL + `/api/document/getDocumentList`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'access-token': localStorage.getItem('accessToken')
            },
            body: JSON.stringify({
              rangeStart: getMonthRange(month, year)[0],
              rangeEnd: getMonthRange(month, year)[1]
            })
          })
          .then(res => res.json())
          .then(res => {
            setData(res)
          })
        }}
      >Tampilkan</Button>
    </div>
  )
}

function HasilDocument() {
  const [data, setData] = useState([])

  return (
    <div style={{display:'flex', flexDirection: 'column', flexGrow:1, alignItems: 'center', marginTop: '1em'}}>
      <FilterBar setData={setData}/>
      <TableContainer component={Paper} style={{flexGrow: 1}}>
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
                  <TableRow key={index} style={{backgroundColor: index % 2 === 0 ? '#e0e0e0' : '#ffffff'}}>
                    <TableCell component="th" scope="row" align="left">
                      {row.date}
                    </TableCell>
                    <TableCell align="left">{row.className}</TableCell>
                    <TableCell align="left">{row.mataPelajaran}</TableCell>
                    <TableCell align="center">{row.jumlahSiswaAktif}</TableCell>
                    <TableCell align="center">{row.photoFilename}</TableCell>
                    <TableCell align="left">{row.keluhan}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
      </TableContainer>
    </div>
  )
}

export default HasilDocument