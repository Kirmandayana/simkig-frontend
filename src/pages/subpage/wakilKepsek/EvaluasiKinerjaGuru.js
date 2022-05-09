import { Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { BACKEND_URL } from '../../../globals'
import EvalPeriodWarningPanel from './EvaluasiKinerjaGuru/EvalPeriodWarningPanel';
import EvaluationDetailPanel from './EvaluasiKinerjaGuru/EvaluationDetailPanel';
import TeachersPickerPanel from './EvaluasiKinerjaGuru/TeachersPickerPanel';

function EvaluasiKinerjaGuru() {
  const [isInEvalPeriod, setIsInEvalPeriod] = React.useState(-1) //-1 means it hasn't checked in backend yet
  const [selectedTeacher, setSelectedTeacher] = React.useState(null)

  const checkIfInEvaluationPeriod = () => 
    fetch(BACKEND_URL + '/api/evaluation/checkIsInEvaluationPeriod', {
      method: 'GET',
      headers: {
        'access-token': localStorage.getItem('accessToken')
      },
    }).then(resp => 
      resp.status === 200 ?
      resp.json().then(data => setIsInEvalPeriod(data.result)) :
      resp.json().then(error => {console.log(error); alert(error);}) 
    )
  
  useEffect(() => checkIfInEvaluationPeriod(), [])

  return (
    <div style={{
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
    }}>
      {
        isInEvalPeriod === -1 ?
        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignSelf: 'center', 
          flexGrow: 1
        }}>
          <Typography variant="h4">Sedang mengecek...</Typography>
        </div> :
        isInEvalPeriod ?
        <>
          {
            !selectedTeacher ? 
              <TeachersPickerPanel {...{selectedTeacher, setSelectedTeacher}}/> :
              <EvaluationDetailPanel/>
          }
        </> :
        <EvalPeriodWarningPanel/>
      }
      
    </div>
  )
}

export default EvaluasiKinerjaGuru