import React from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

// style table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#d1d1d1',
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

//Data Table Sementara
function createData(tanggal, namaKelas, mataPelajaran, jumlahSiswa, buktiKBM, keluhan) {
  return { tanggal, namaKelas, mataPelajaran, jumlahSiswa, buktiKBM, keluhan };
}
  
const rows = [
  createData('02-02-2022', 'Kelas A', 'Pelajaran A', 20, 'gambar', 'tidak ada'),
  createData('02-02-2022', 'Kelas A', 'Pelajaran A', 20, 'gambar', 'tidak ada'),
];
  

function DetailLaporanGuru() {
  return (
    <div style={{display:'flex', flexDirection: 'column', flexGrow:1, alignItems: 'center'}}>
        
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', }}>
            <Typography variant='h6' >Nama Guru</Typography>
            <Typography variant='h6'>NIK</Typography>
            <Button variant='contained' color='primary' style={{ height: '2em', width: '5em', alignSelf: 'end', marginRight: '1em'}}>Eksport</Button>
        </div>

        {/* Table */}
        <div style={{marginTop: '1em'}}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: '63.5em' }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Tanggal</StyledTableCell>
                  <StyledTableCell align="center">Nama Kelas</StyledTableCell>
                  <StyledTableCell align="center">Mata Pelajaran</StyledTableCell>
                  <StyledTableCell align="center">Jumlah Siswa</StyledTableCell>
                  <StyledTableCell align="center">Bukti KBM</StyledTableCell>
                  <StyledTableCell align="center">Keluhan</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.tanggal}>
                    <StyledTableCell component="th" scope="row" align="left">
                      {row.tanggal}
                    </StyledTableCell>
                    <StyledTableCell align="left">{row.namaKelas}</StyledTableCell>
                    <StyledTableCell align="left">{row.mataPelajaran}</StyledTableCell>
                    <StyledTableCell align="center">{row.jumlahSiswa}</StyledTableCell>
                    <StyledTableCell align="center">{row.buktiKBM}</StyledTableCell>
                    <StyledTableCell align="left">{row.keluhan}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
    </div>
  );
}

export default DetailLaporanGuru;
