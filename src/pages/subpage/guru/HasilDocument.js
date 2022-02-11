import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import loginArtwork from '../../../assets/loginArtwork.png';


//Data Table Sementara
function createData(tanggal, namaKelas, mataPelajaran, jumlahSiswa, buktiKBM, keluhan) {
    return { tanggal, namaKelas, mataPelajaran, jumlahSiswa, buktiKBM, keluhan };
  }
   
  const rows = [
    createData('02-02-2022', 'Kelas A', 'Pelajaran A', 20, 'gambar', 'tidak ada'),
    createData('02-02-2022', 'Kelas A', 'Pelajaran A', 20, 'gambar', 'tidak ada'),
    createData('02-02-2022', 'Kelas A', 'Pelajaran A', 20, 'gambar', 'tidak ada'),
    createData('02-02-2022', 'Kelas A', 'Pelajaran A', 20, 'gambar', 'tidak ada'),
    createData('02-02-2022', 'Kelas A', 'Pelajaran A', 20, 'gambar', 'tidak ada'),
  ];

function HasilDocument() {
  return (
    <div style={{display:'flex', flexDirection: 'column', flexGrow:1, alignItems: 'center', marginTop: '1em'}}>
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
                {rows.map((row, index) => (
                    <TableRow key={row.tanggal} style={{backgroundColor: index % 2 == 0 ? '#e0e0e0' : '#ffffff'}}>
                      <TableCell component="th" scope="row" align="left">
                        {row.tanggal}
                      </TableCell>
                      <TableCell align="left">{row.namaKelas}</TableCell>
                      <TableCell align="left">{row.mataPelajaran}</TableCell>
                      <TableCell align="center">{row.jumlahSiswa}</TableCell>
                      <TableCell align="center">{row.buktiKBM}</TableCell>
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