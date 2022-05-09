import { Typography, TextField, Button, Tabs, Tab, Dialog, Paper, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import React, { createRef, useEffect } from 'react';
import { useState } from 'react';
import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Collapse from '@mui/material/Collapse';
import { DatePicker, DateTimePicker } from '@mui/lab';
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const {BACKEND_URL} = require('../../../../globals')
dayjs.extend(utc)

function EvaluationPeriodPanel() {
    const [evalStartDate, setEvalStartDate] = useState(null)
    const [evalEndDate, setEvalEndDate] = useState(null)

    const getEvaluationPeriod = () =>
        fetch(BACKEND_URL + '/api/evaluation/getEvaluationPeriod', {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
            },
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                setEvalStartDate(data.result.evaluationStartDate)
                setEvalEndDate(data.result.evaluationEndDate)
            }) :
            resp.json().then(err => {console.log(err.result); alert(err.result.toString())})
        )
    
    const setEvaluationPeriod = () => {
        //check if the dates are valid
        if(!evalStartDate)
            return alert('Tanggal mulai evaluasi tidak boleh kosong')
        
        if(!evalEndDate)
            return alert('Tanggal akhir evaluasi tidak boleh kosong')
        
        if(dayjs(evalStartDate).isAfter(evalEndDate))
            return alert('Tanggal mulai evaluasi tidak boleh lebih besar dari tanggal akhir evaluasi')

        fetch(BACKEND_URL + '/api/evaluation/setEvaluationPeriod', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-token': localStorage.getItem('accessToken'),
            },
            body: JSON.stringify({
                startDate: evalStartDate,
                endDate: evalEndDate
            })
        }).then(resp =>
            resp.status === 200 ?
            (() => {
                alert('Period evaluasi berhasil diubah')
                getEvaluationPeriod()
            })() :
            resp.json().then(err => {console.log(err.result); alert(err.result.toString())})
        )
    }

    useEffect(() => {
        getEvaluationPeriod()
    }, [])

    return (
        <div style={{
            display: 'flex',
        }}>
            <LocalizationProvider dateAdapter={DateAdapter}>
                <DatePicker
                    value={evalStartDate}
                    onChange={newVal => {
                        setEvalStartDate(newVal)
                    }}
                    renderInput={params =>
                        <TextField
                            style={{width: '10em', flexGrow: 1, marginRight: '1em'}}
                            {...params}
                            label="Tanggal Mulai"
                        />
                    }
                />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={DateAdapter}>
                <DatePicker
                    value={evalEndDate}
                    onChange={newVal => {
                        setEvalEndDate(newVal)
                    }}
                    renderInput={params =>
                        <TextField
                            style={{width: '10em', flexGrow: 1, marginRight: '1em'}}
                            {...params}
                            label="Tanggal Selesai"
                        />
                    }
                />
            </LocalizationProvider>

            <Button
                variant='contained'
                onClick={setEvaluationPeriod}
            >
                Terapkan
            </Button>
        </div>
    )
}

export default EvaluationPeriodPanel