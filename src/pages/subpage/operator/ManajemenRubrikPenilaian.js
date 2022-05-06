import React, { useState } from 'react'
import { BACKEND_URL } from '../../../globals'
import AssemblyPanel from './ManajemenRubrikPenilaian/AssemblyPanel'
import TemplatePanel from './ManajemenRubrikPenilaian/TemplatePanel'

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
    }}>
        {
            selectedTemplate ?
            // <AssemblyPanel selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} deleteTemplateButtonHandler/> :
            <AssemblyPanel {...{selectedTemplate, setSelectedTemplate, deleteTemplateButtonHandler}}/> :
            <TemplatePanel {...{setSelectedTemplate}}/>
        }
    </div>
    )
}

export default ManajemenRubrikPenilaian