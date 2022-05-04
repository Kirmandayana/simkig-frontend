import React, { useState } from 'react'
import AssemblyPanel from './ManajemenRubrikPenilaian/AssemblyPanel'
import TemplatePanel from './ManajemenRubrikPenilaian/TemplatePanel'

function ManajemenRubrikPenilaian() {
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    
    return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    }}>
        {
            selectedTemplate ?
            <AssemblyPanel selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}/> :
            <TemplatePanel setSelectedTemplate={setSelectedTemplate}/>
        }
    </div>
    )
}

export default ManajemenRubrikPenilaian