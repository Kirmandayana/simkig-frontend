import React, { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../../../globals';
import { Typography, FormControl, RadioGroup, Radio, FormControlLabel, Paper, Button } from '@mui/material'
import dayjs from 'dayjs';

const createChoices = (start, end) => {
    let choices = []

    for(let i=start; i<=end; i++)
        choices.push(i)
    
    return choices
}

const getIdentifier = () => {
    const accessToken = localStorage.getItem('accessToken')

    if(!accessToken)
        return null

    const identifier = accessToken.split('.')[0]
    return JSON.parse(atob(identifier)).identifier
}

const IndicatorRow = ({indicator, setEvaluationPoint, evaluationMode}) => {
    const choices = createChoices(indicator.minIndicatorValue, indicator.maxIndicatorValue)

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0em 0em 0em 2em',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            margin: '0.5em 1em 0.5em 1em',
            borderRadius: '1em'
        }}>
            <Typography style={{width: '26em'}}>
                {indicator.indicatorName}
            </Typography>
            <div style={{flexGrow: 1}}></div>
            <FormControl>
                <RadioGroup
                    row
                    value={indicator.indicatorValue}
                    onChange={(e, val) => setEvaluationPoint(indicator.id, parseInt(val))}
                >
                {
                    choices.map((choice, idx) => (
                        <FormControlLabel
                            disabled={evaluationMode === 'view' ? true : false}
                            key={idx}
                            value={choice}
                            control={<Radio />}
                            label={choice}
                            labelPlacement='top'
                        />
                    ))
                }
                </RadioGroup>
            </FormControl>
        </div>
    )
}

const RubricRow = ({rubric, setEvaluationPoint, evaluationMode}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '0.5em',
            marginTop: '0.25em'
        }}>
            <Paper sx={{padding: '1em'}}>
                <Typography>
                    {rubric.parentIndicatorName}
                </Typography>
            </Paper>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                {
                    rubric.indicators.map((el, idx) => (
                        <IndicatorRow 
                            key={idx} 
                            indicator={el} 
                            setEvaluationPoint={(indicatorId, value) => setEvaluationPoint(rubric.id, indicatorId, value)}
                            evaluationMode={evaluationMode}
                        />
                    ))
                }
            </div>
        </div>
    )
}

function EvaluationDetailPanel({setSelectedTeacher, selectedTeacher, selectedPerformanceReview, evaluationMode, setSelectedPerformanceReview}) {
    const [evaluationRubric, setEvaluationRubric] = useState({})
    const [performanceReview, setPerformanceReview] = useState(null)

    const getEvaluationRubric = () => {
        fetch(BACKEND_URL + '/api/evaluation/getActiveTemplateListing', {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
            },
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                let zeroInitializedRubrics = {...data.result}

                zeroInitializedRubrics.rubrics = zeroInitializedRubrics.rubrics.map(rubric => ({
                    ...rubric,
                    indicators: rubric.indicators.map(indicator => ({
                        ...indicator,
                        indicatorValue: indicator.minIndicatorValue,
                    }))
                }))

                setEvaluationRubric(zeroInitializedRubrics)
            }) :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )
    }

    const setEvaluationPoint = (rubricId, indicatorId, value) => {
        setEvaluationRubric(prevState => {
            let newState = {...prevState}

            newState.rubrics = newState.rubrics.map(el => {
                if(el.id === rubricId) {
                    let newRubricState = {...el}

                    newRubricState.indicators = newRubricState.indicators.map(indicatorEl => {
                        if(indicatorEl.id === indicatorId) {
                            indicatorEl.indicatorValue = value
                            return indicatorEl
                        } else {
                            return indicatorEl
                        }
                    })

                    return newRubricState
                } else {
                    return el
                }
            })

            return newState
        })
    }

    const submitEvaluation = () => {
        fetch(BACKEND_URL + '/api/evaluation/submitEvaluation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-token': localStorage.getItem('accessToken'),
            },
            body: JSON.stringify({
                teacherId: selectedTeacher.id,
                evaluatorId: getIdentifier().id,
                evaluationData: JSON.stringify(evaluationRubric),
            }),
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                alert("Evaluasi berhasil di submit")
                setSelectedTeacher(null)
            }) :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )
    }

    const deleteEvaluation = () => {
        if(!window.confirm("Apakah anda yakin akan menghapus evaluasi ini?"))
            return

        fetch(BACKEND_URL + '/api/evaluation/deleteEvaluation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-token': localStorage.getItem('accessToken'),
            },
            body: JSON.stringify({
                performanceReviewId: selectedPerformanceReview.id,
            }),
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                alert("Evaluasi berhasil di hapus")
                setSelectedPerformanceReview(null)
                setSelectedTeacher(null)
            }) :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )
    }

    const getPerformanceReviewById = () => {
        fetch(BACKEND_URL + '/api/evaluation/getPerformanceReviewById', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-token': localStorage.getItem('accessToken'),
            },
            body: JSON.stringify({
                reviewId: selectedPerformanceReview.id,
            }),
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                setPerformanceReview(data.result)
                setEvaluationRubric(data.result.data)
            }) :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )
    }

    const exportDocBtnHandler = () => {
        fetch(BACKEND_URL + '/api/evaluation/exportEvaluation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-token': localStorage.getItem('accessToken'),
            },
            body: JSON.stringify({
                reviewId: selectedPerformanceReview.id,
            }),
        }).then(resp =>
            resp.status === 200 ?
            // resp.json().then(data => {console.log(data)}) :
            resp.blob().then(blob => {
                console.log(selectedTeacher)
                const filename = `Evaluasi_Guru_${selectedTeacher.username}_${dayjs().format('MMMM')}_${dayjs().format('YYYY')}.docx`
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', filename)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }) :
            resp.json().then(err => {console.log(err); alert(err.result)})
        )
    }

    useEffect(() => {
        if(evaluationMode === 'eval') {
            getEvaluationRubric()
        } else if(evaluationMode === 'view') {
            getPerformanceReviewById()
        }
    }, [])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
        }}>
            <Button
                variant='contained'
                onClick={() => {
                    if(evaluationMode === 'eval') {
                        setSelectedTeacher(null)
                    } else if(evaluationMode === 'view') {
                        setSelectedPerformanceReview(null)
                        setSelectedTeacher(null)
                    }
                }}
                style={{
                    width: '10em',
                    marginBottom: '1em'
                }}
            >
                Kembali
            </Button>
            <Paper elevation={4} sx={{padding: '0.5em', marginBottom: '1em'}}>
                <Typography variant='h6'>
                    Rubrik Penilaian
                </Typography>
                {
                    evaluationRubric?.rubrics?.map((el, idx) => (
                        <RubricRow key={idx} rubric={el} {...{setEvaluationPoint, evaluationMode}}/>
                    ))
                }
            </Paper>

            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button
                    variant='contained'
                    onClick={evaluationMode === 'view' ? deleteEvaluation : submitEvaluation}
                    color={evaluationMode === 'view' ? 'error' : 'primary'}
                    style={{
                        width: '8em',
                    }}
                >
                    {evaluationMode === 'view' ? 'Hapus' : 'Selesai'}
                </Button>
                <Button
                    variant='contained'
                    style={{
                        marginLeft: '1em',
                        display: evaluationMode === 'view' ? null : 'none'
                    }}
                    onClick={exportDocBtnHandler}
                >
                    Ekspor
                </Button>
            </div>
        </div>
    )
}

export default EvaluationDetailPanel