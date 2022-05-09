import React, { useEffect, useState } from 'react';
import { TextField, Button, Paper, Typography, ThemeProvider, createTheme } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import loginArtwork from '../../../assets/loginArtwork.png';
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const {BACKEND_URL} = require('../../../globals')
dayjs.extend(utc)

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff'
    }
  }
})

const getMonthRange = (month, year) => [
  `${year}-${month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}-01`,
  `${year}-${month.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}-${new Date(year, month, 0).getDate()}`
]

const getIdentifier = () => {
  const accessToken = localStorage.getItem('accessToken')

  if(accessToken) {
    const identifier = accessToken.split('.')[0]
    return JSON.parse(atob(identifier)).identifier
  } else {
    return null
  }
}

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
  // if(index % 2 === 0)
  //   if(!row.photoFilename && !row.reason) backgroundColor = '#ffcccc'
  //   else backgroundColor = '#aecbd6'
  // else
  //   if(!row.photoFilename && !row.reason) backgroundColor = '#ffb8b8'
  //   else backgroundColor = '#bfd4db'
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
        <Typography>{dayjs(row.date).format('YYYY-MM-DD')}</Typography>
        <Typography style={{fontSize: '0.7em', color: 'rgba(0, 0, 0, 0.75)'}}>
          ({row.dateHour.toString().length < 2 ? '0' + row.dateHour : row.dateHour}.{row.dateMinute.toString().length < 2 ? '0' + row.dateMinute : row.dateMinute} -
          {row.dateEndHour.toString().length < 2 ? '0' + row.dateEndHour : row.dateEndHour}.{row.dateEndMinute.toString().length < 2 ? '0' + row.dateEndMinute : row.dateEndMinute})
        </Typography>
      </TableCell>
      {
        row.document ?
        <>
          <TableCell align="left">{row.document.className}</TableCell>
          <TableCell align="left">{row.document.mataPelajaran}</TableCell>
          <TableCell align="left">{row.document.topik}</TableCell>
          <TableCell align="center">{row.document.jumlahSiswaKelas}</TableCell>
          <TableCell align="center">{row.document.jumlahSiswaAktif} / {row.document.jumlahSiswaSakit} / {row.document.jumlahSiswaIzin}</TableCell>
          <TableCell align="center">
            <img src={img} style={{height: '4em'}} />
          </TableCell>
          <TableCell align="left">{row.document.keluhan}</TableCell>
        </>
        :
        row.absent ?
        <>
          <TableCell align="center" colSpan={7}>
            Izin - ({row.absent.reason})
          </TableCell>
        </> :
        <>
          {/* <TableCell align="center" colSpan={5}>Belum diisi</TableCell> */}
          <TableCell align="center" colSpan={7}>{isLate ? 'Tidak diisi' : 'Belum diisi'} ({row.mataPelajaran} - {row.classroom?.className})</TableCell>
        </>
      }
    </TableRow>
  )
}

function DetailLaporanGuru({selectedUser, selectedMonth, selectedYear, setSelectedUser}) {
  const [data, setData] = useState([])
  const [teacherProfilePic, setTeacherProfilePic] = useState('')

  const exportDocumentButtonHandler = () => {
    //kirim request ke API Endpoint
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
      //cek status response
      response.status === 200 ?
      //jika kode status 200, konversi response menjadi binary/blob agar dapat di download
      response.blob()
      .then(blob => {
        //nama file dari server ternyata tidak tembus sampai ke client (hasilnya tetap nama random)
        //jadi kita buat lagi format nama filenya di client sebelum di download
        const filename = `Laporan_Guru_${selectedUser.username}_${monthNumber[selectedMonth]}_${selectedYear}.docx`
        const url = URL.createObjectURL(blob) //buat objectURL dari response yang sudah kita rubah menjadi blob
        //baris code dibawah diambil dari https://stackoverflow.com/a/63965930 (how to download file in react js)
        const link = document.createElement('a') //buat elemen html a (elemen link)
        link.href = url //atur agar elemen a tadi merujuk ke url yang merupakan objectURL yang kita buat
        link.setAttribute('download', filename) //atur attribut download dari elemen tersebut menjadi nama file kita
        document.body.appendChild(link) //tambahkan elemen a ke dalam dokumen html kita
        link.click() //simulasikan klik user pada elemen a tersebut
        document.body.removeChild(link) //hapus elemen a dari dokumen html kita
      }) : 
      //jika kode status tidak 200, log errornya ke console
      response.json().then(data => console.log(data))
    )
    .catch(err => console.log(err))
  }

  useEffect(() => {
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
        return res.json().then(res => {
          res.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1)

          setData(res)
        })
      else
        return res.json().then(msg => console.log(msg))
    })

    fetch(BACKEND_URL + `/profiles/${selectedUser.profilePicture}`, {
      headers: {
        'access-token': localStorage.getItem('accessToken')
      }
    })
    .then(res => res.blob())
    .then(blob => setTeacherProfilePic(URL.createObjectURL(blob)))
  }, [])

  return (
    <div style={{display:'flex', flexDirection: 'column', flexGrow:1, alignItems: 'center'}}>
        
        {/* <div style={{display: 'flex', flexDirection: 'column', width: '100%', paddingLeft:'2em' }}>
          <Button variant='contained' color='primary' style={{width: '5em', marginBottom: '1em'}}
            onClick={() => setSelectedUser(undefined)}
          >Kembali</Button>
          <Typography variant='h6' >Nama Guru: {selectedUser.fullName}</Typography>
          <Typography variant='h6' >Laporan KBM Bulan {monthNumber[selectedMonth]} Tahun {selectedYear}</Typography>
          {
            getIdentifier().accessLevel !== 2 &&
            <Button 
              variant='contained' 
              color='primary' 
              style={{ height: '2em', width: '5em', alignSelf: 'end', marginRight: '2em'}}
              onClick={exportDocumentButtonHandler}
            >Ekspor</Button>
          }
        </div> */}
        <div style={{display: 'flex'}}>
          <Paper style={{overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#18A0FB', padding: '1em', flex: getIdentifier().accessLevel !== 2 ? 1 : 0.5}} elevation={9}>
            <ThemeProvider theme={theme}>
              <Typography style={{fontWeight: 'bold', marginBottom: '1em'}}>Detail Laporan</Typography>
              <Typography style={{flex: 1}}>Anda sedang melihat detail laporan KBM dari seorang guru. Tekan tombol Kembali untuk berpindah ke daftar guru
                {getIdentifier().accessLevel !== 2 && <span>, dan tombol Ekspor untuk mengekspor laporan dalam bentuk file <i>.docx</i></span>}
              </Typography>
              <Button 
                variant='outlined'
                onClick={() => setSelectedUser(undefined)}
                style={{
                  marginTop: '1em',
                  width: '15.37em',
                  marginLeft: 'auto'
                }}
              >
                Kembali ke Daftar Guru
              </Button>
              {
                getIdentifier().accessLevel !== 2 &&
                  <Button 
                    variant='contained'
                    color='secondary'
                    elevation={10}
                    onClick={exportDocumentButtonHandler}
                    style={{
                      marginTop: '1em',
                      width: '15.37em',
                      marginLeft: 'auto'
                    }}
                  >
                    Ekspor Laporan
                  </Button>
              }
            </ThemeProvider>
          </Paper>

          <div style={{width: '1em'}}></div>

          <Paper style={{overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '1em', flex: 1.25}} elevation={9}>
            {/* <ThemeProvider theme={theme}> */}
              <Typography color='primary' style={{fontWeight: 'bold', marginBottom: '1em'}}>Informasi Guru dan Laporan</Typography>
              <div style={{display: 'flex', flexGrow: 1}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 0.75}}>
                  <img src={teacherProfilePic} style={{width: '100%', borderRadius: '50%', padding: '1em', boxSizing: 'border-box'}} alt=''/>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', flex: 2}}>
                  <Typography style={{fontWeight: 'bold', flex: 1}}>Guru</Typography>
                  <div style={{display: 'flex', padding: '0em 0em 0.75em 0em'}}>
                    <Typography style={{flex: 1}}>Nama Lengkap</Typography>
                    <Typography style={{flex: 0.125}}>:</Typography>
                    <Typography style={{flex: 1}}>{selectedUser.fullName}</Typography>
                  </div>
                  <div style={{display: 'flex', padding: '0em 0em 0.75em 0em'}}>
                    <Typography style={{flex: 1}}>NIP</Typography>
                    <Typography style={{flex: 0.125}}>:</Typography>
                    <Typography style={{flex: 1}}>{selectedUser.NIP}</Typography>
                  </div>
                  <div style={{height: '0.0625em', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}></div>
                  <Typography style={{fontWeight: 'bold', flex: 1}}>Laporan KBM</Typography>
                  <div style={{display: 'flex', padding: '0em 0em 0.75em 0em'}}>
                    <Typography style={{flex: 1}}>Bulan</Typography>
                    <Typography style={{flex: 0.125}}>:</Typography>
                    <Typography style={{flex: 1}}>{monthNumber[selectedMonth]}</Typography>
                  </div>
                  <div style={{display: 'flex', padding: '0em 0em 0.75em 0em'}}>
                    <Typography style={{flex: 1}}>Tahun</Typography>
                    <Typography style={{flex: 0.125}}>:</Typography>
                    <Typography style={{flex: 1}}>{selectedYear}</Typography>
                  </div>
                </div>
              </div>
            {/* </ThemeProvider> */}
          </Paper>
        </div>

        {/* Table */}
        <div style={{marginTop: '1em', width: '100%'}}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead style={{backgroundColor: '#78a2cc'}}>
                <TableRow>
                  <TableCell align="center">Tanggal</TableCell>
                  <TableCell align="center">Nama Kelas</TableCell>
                  <TableCell align="center">Mata Pelajaran</TableCell>
                  <TableCell align="center">Materi / Topik</TableCell>
                  <TableCell align="center">Jumlah Siswa</TableCell>
                  <TableCell align="center">Hadir / Sakit / Izin</TableCell>
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
