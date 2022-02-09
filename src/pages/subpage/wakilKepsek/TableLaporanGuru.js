import React from 'react';
import { TextField, Button, Paper } from '@mui/material';
import { Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';


// style table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
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
function createData(NIK, namaGuru, keterangan) {
  return { NIK, namaGuru, keterangan };
}


const rows = [
  createData(1234567890, 'Guru A', <Button>Lihat Detail Laporan</Button>),
  createData(1234567890, 'Guru A', <Button>Lihat Detail Laporan</Button>),
  
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
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">NIK</StyledTableCell>
                  <StyledTableCell align="center">Nama Guru</StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.NIK}>
                    <StyledTableCell component="th" scope="row" align="left">
                      {row.NIK}
                    </StyledTableCell>
                    <StyledTableCell align="left">{row.namaGuru}</StyledTableCell>
                    <StyledTableCell align="center">{row.keterangan}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
    </div>
  );
}

export default TableLaporanGuru;
