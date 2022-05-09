import { Paper, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import warningIconWhite from '../../../../assets/warningIconWhite.png'
import { BACKEND_URL } from '../../../../globals'
const dayjs = require('dayjs')

function EvalPeriodWarningPanel() {
    const [evalPeriod, setEvalPeriod] = React.useState(null)

    const fetchEvalPeriod = () =>
        fetch(BACKEND_URL + '/api/evaluation/getEvaluationPeriod', {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken')
            }
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => setEvalPeriod(data.result)) :
            resp.json().then(error => {console.log(error); alert(error);})
        )

    useEffect(() => fetchEvalPeriod(), [])
    
    return (
        <div style={{display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Paper elevation={8} sx={{borderRadius: '2em', overflow: 'hidden', display: 'flex', boxSizing: 'border-box', width: '35em'}}>
            <div style={{display: 'flex', flexDirection: 'column', width: '7em', backgroundColor: 'orange', alignItems: 'center', marginRight: '2em', boxSizing: 'border-box'}}>
                <img src={warningIconWhite} alt="warning" style={{width: '2.5em', marginTop: '1em', boxSizing: 'border-box'}}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', margin: '1.5em 1.5em 1.5em 0em', boxSizing: 'border-box',}}>
                <Typography variant="h6" style={{marginBottom: '1em'}}>
                    Anda tidak sedang berada dalam periode evaluasi guru.
                </Typography>
                <Typography>
                    Periode evaluasi guru dilakukan pada tanggal <b>{dayjs(evalPeriod?.evaluationStartDate).format('DD-MM-YYYY')}</b> sampai dengan
                    <b> {dayjs(evalPeriod?.evaluationEndDate).format('DD-MM-YYYY')}</b>.
                </Typography>
            </div>
        </Paper>
        </div>
  )
}

export default EvalPeriodWarningPanel