import React, { useEffect } from 'react';
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
import { useState } from 'react';
const dayjs = require('dayjs')
require('dayjs/locale/id')
const utc = require('dayjs/plugin/utc')
const relativeTime = require('dayjs/plugin/relativeTime')
const {BACKEND_URL} = require('../../../globals')
dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.locale('id')

const getMonthRange = (month, year) => [
  `${year}-${month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}-01`,
  `${year}-${month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}-${new Date(year, month, 0).getDate()}`
]

const fetchTeacherList = (month, year) => new Promise((resolve, reject) => {
  fetch(BACKEND_URL + '/api/document/getDocumentList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access-token': localStorage.getItem('accessToken')
    },
    body: JSON.stringify({
      rangeStart: getMonthRange(month, year)[0],
      rangeEnd: getMonthRange(month, year)[1],
      teachersList: true
    })
  })
  .then(response => 
    response.status === 200 ? 
    response.json().then(data => resolve(data)) : 
    response.json().then(data => reject(data))
  )
})

const FilterBar = ({setTeachersList, month, setMonth, year, setYear}) => {
  const [teacherName, setTeacherName] = useState('')
  
  const filterButtonHandler = () => {
    fetchTeacherList(month, year)
      // .then(data => {console.log(data, month, year); return data;})
      .then(data => setTeachersList(data))
      .catch(err => console.log(err))
  }

  //get teacher's list and find teachers with name that contains the input
  const searchButtonHandler = () => {
    fetch(BACKEND_URL + '/api/user/getTeachersList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('accessToken')
      }
    })
    .then(response =>
      response.status === 200 ?
      response.json().then(data => {
        //find teachers with name that contains the input
        const filteredTeachers = data.value && data.value.filter(teacher => teacher.fullName.toLowerCase().includes(teacherName.toLowerCase()))
        // console.log({type: 'fullList', value: filteredTeachers})
        setTeachersList({type: 'fullList', value: filteredTeachers})
      }) :
      response.json().then(data => console.log(data))
    )
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', width: '100%'}}>
      <TextField 
        id='outline-basic' 
        placeholder='Cari berdasarkan nama guru' 
        style={{width: '20em'}} 
        value={teacherName}
        onChange={(e) => setTeacherName(e.target.value.replace(/[^a-zA-Z ]/g, ''))}/>
      <Button 
        variant='contained' 
        color='primary' 
        style={{ height: '100%', width: '5m', marginLeft: '1em'}}
        onClick={searchButtonHandler}>
        Cari
      </Button>
      {/* select bulan */}
      <div style={{flexGrow: 1}}></div>
      <FormControl style={{width: '10em'}}>
        <InputLabel id="select-bulan">Bulan</InputLabel>
        <Select
          label="Bulan"
          id='select-bulan'
          value={month}
          onChange={(e) => setMonth(e.target.value)}>
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
      {/* input tahun */}
      <TextField
        id='outline-basic'
        placeholder='Tahun'
        value={year}
        onChange={(e) => setYear(e.target.value.replace(/[^0-9]/g, ''))}
        style={{width: '10em', marginLeft: '1em'}} />
      <Button
        variant='contained'
        color='primary'
        style={{height: '100%', width: '5m', marginLeft: '1em'}}
        onClick={filterButtonHandler}>
        Filter
      </Button>
    </div>
  )
}

const DocumentRow = ({row, listType, month, year, parentMethods}) => {
  let fullName, createdAt, user
  console.log(row)

  if (listType === 'latest') {
    fullName = row.User.fullName
    createdAt = row.createdAt
    user = row.User
  } else {
    fullName = row.fullName
    createdAt = row.KBM_Documents[0].createdAt
    user = row
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row" align="center">
        {fullName}
      </TableCell>
      <TableCell align="center">
        {dayjs(createdAt).fromNow()}
      </TableCell>
      <TableCell align="center">
        <Button variant='contained' color='primary' onClick={
          () => {
            parentMethods.setSelectedUser(user)
            parentMethods.setSelectedMonth(month)
            parentMethods.setSelectedYear(year)
          }
        }>Lihat</Button>
      </TableCell>
    </TableRow>
  )
}

function TableLaporanGuru({setSelectedUser, setSelectedMonth, setSelectedYear}) {
  const [teachersList, setTeachersList] = useState({})
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchTeacherList(new Date().getMonth() + 1, new Date().getFullYear())
      // .then(data => {console.log(data); return data;})
      .then(data => setTeachersList(data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center'}}>
        <FilterBar setTeachersList={setTeachersList} month={month} setMonth={setMonth} year={year} setYear={setYear} />

        {/* table */}
        <div style={{marginTop: '1em'}}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: '63.5em' }} aria-label="customized table">
              <TableHead style={{backgroundColor: '#d1d1d1'}}>
                <TableRow>
                  <TableCell align="center">Nama Guru</TableCell>
                  <TableCell align="center">Unggahan Terakhir</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachersList.value && teachersList.value.map((row, index) => (
                  <DocumentRow key={index} row={row} listType={teachersList.type} month={month} year={year} parentMethods={{setSelectedUser, setSelectedMonth, setSelectedYear}}/>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        
    </div>
  );
}

export default TableLaporanGuru;
