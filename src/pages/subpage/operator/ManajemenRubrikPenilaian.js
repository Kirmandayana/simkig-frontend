import React, { useState } from 'react'
import { BACKEND_URL } from '../../../globals'
import AssemblyPanel from './ManajemenRubrikPenilaian/AssemblyPanel'
import TemplatePanel from './ManajemenRubrikPenilaian/TemplatePanel'
import EvaluationPeriodPanel from './ManajemenRubrikPenilaian/EvaluationPeriodPanel'
import { Typography, Paper } from '@mui/material'

function ManajemenRubrikPenilaian() {
    const [selectedTemplate, setSelectedTemplate] = useState(null)

    const deleteTemplateButtonHandler = templateId =>
        fetch(BACKEND_URL + '/api/evaluation/deleteTemplate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-token': localStorage.getItem('accessToken'),
            },
            body: JSON.stringify({
                templateId
            })
        }).then(resp =>
            resp.status === 200 ?
            alert('Template berhasil dihapus') :
            resp.json().then(err => {console.log(err.result); alert(err.result.toString())})
        )
    
    return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        minWidth: '60em'
    }}>
        <Paper elevation={3} sx={{padding: '0.25em', marginBottom: '1em'}}>
            <Typography variant='h6'>Kelola Waktu Evaluasi</Typography>
            <EvaluationPeriodPanel/>

        </Paper>
        <Paper elevation={3} sx={{padding: '0.25em'}}>
            <Typography variant='h6'>Kelola Template dan Rubrik Penilaian</Typography>
            {
                selectedTemplate ?
                // <AssemblyPanel selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} deleteTemplateButtonHandler/> :
                <AssemblyPanel {...{selectedTemplate, setSelectedTemplate, deleteTemplateButtonHandler}}/> :
                <TemplatePanel {...{setSelectedTemplate}}/>
            }
        </Paper>
    </div>
    )
}

export default ManajemenRubrikPenilaian