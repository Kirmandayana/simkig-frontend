import React from 'react';
import { TextField, Button, Paper } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';



//Data Table Sementara
function createData(NIK, namaGuru, keterangan) {
  return { NIK, namaGuru, keterangan };
}

const rows = [
  createData(1234567890, 'Guru A', <Button variant='contained' color='primary'>Lihat Detail Laporan</Button>),
  createData(1234567890, 'Guru A', <Button variant='contained' color='primary'>Lihat Detail Laporan</Button>),
  
];

function TableLaporanGuru() {
  
  return (
    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row'}}>
          <TextField id='outline-basic' placeholder='Cari berdasarkan NIK' style={{width: '20em', flexGrow: 1}} />
          <Button variant='contained' color='primary' style={{ height: '2em', width: '5m', marginLeft: '1em'}}>Cari</Button>
          {/* select bulan */}
          <TextField id='outline-select-currency' select style={{width: '10em', marginLeft:'10em'}} />
          {/* select tahun */}
          <TextField id='outline-select-currency' select style={{width: '10em', marginLeft: '3em'}} />
          <Button variant='contained' color='primary' style={{ height: '2em', width: '5m', marginLeft: '1em'}}>Filter</Button>
        </div>

        {/* table */}
        <div style={{marginTop: '1em'}}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: '63.5em' }} aria-label="customized table">
              <TableHead style={{backgroundColor: '#d1d1d1'}}>
                <TableRow>
                  <TableCell align="center">NIK</TableCell>
                  <TableCell align="center">Nama Guru</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.NIK}>
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
  );
}

export default TableLaporanGuru;
