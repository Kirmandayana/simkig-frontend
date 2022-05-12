import React, { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../../../globals';
import { Typography, FormControl, RadioGroup, Radio, FormControlLabel, Paper, Button } from '@mui/material'
import dayjs from 'dayjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar} from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

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
            <Paper sx={{padding: '1em', display: 'flex'}}>
                <Typography>
                    {rubric.parentIndicatorName}
                </Typography>
                <div style={{flexGrow: 1}}></div>
                <Typography>
                    Bobot ({rubric.valueWeight})
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
    const [lagAndLeadData, setLagAndLeadData] = useState(null)

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
                console.log(data)
                setPerformanceReview(data.result)
                setEvaluationRubric(data.result.data)
            }) :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )
    }

    const getLagNLeadIndicator = () => {
        fetch(BACKEND_URL + '/api/evaluation/getLagAndLeadIndicator', {
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
                console.log(data)
                console.log(Object.values(data.result.thisUser))
                setLagAndLeadData(data.result)
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
            getLagNLeadIndicator()
        }
    }, [])

    const barOptions = {
        responsive: true,
        plugins: {
                legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Lag and Lead',
            },
        },
    };

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

            {
                evaluationMode === 'view' && performanceReview &&
                <>
                    <Paper elevation={4} sx={{display: 'flex', padding: '0.5em', backgroundColor: '#18A0FB', marginBottom: '1em'}}>
                        <Paper sx={{display: 'flex', flexDirection: 'column', padding: '1em', marginRight: '1em', width: '11em'}}>
                            <Typography variant='h6'>Informasi Evaluasi</Typography>
                            <Typography>
                                Anda sedang melihat hasil penilaian kinerja dari seorang Guru.
                            </Typography>
                        </Paper>

                        <Paper sx={{display: 'flex', flexDirection: 'column', padding: '1em'}}>
                            <Typography variant='h6'>Guru</Typography>
                            <Typography>Nama: {performanceReview.targetTeacher?.fullName}</Typography>
                            <Typography>NIP: {performanceReview.targetTeacher?.NIP}</Typography>
                            <Typography>Jabatan: {performanceReview.targetTeacher?.occupation}</Typography>
                        </Paper>

                        <Paper sx={{display: 'flex', flexDirection: 'column', padding: '1em', marginLeft: '1em'}}>
                            <Typography variant='h6'>Penilai</Typography>
                            <Typography>Nama: {performanceReview.evaluator?.fullName}</Typography>
                            <Typography>NIP: {performanceReview.evaluator?.NIP}</Typography>
                            <Typography>Jabatan: {performanceReview.evaluator?.occupation}</Typography>
                        </Paper>

                        <Paper sx={{display: 'flex', flexDirection: 'column', padding: '1em', marginLeft: '1em'}}>
                            <Typography variant='h6'>Evaluasi</Typography>
                            <Typography>Tanggal: {dayjs(performanceReview.date).format('DD-MM-YYYY')}</Typography>
                            <Typography>Waktu mulai evaluasi: {dayjs(performanceReview.evaluationStartDate).format('DD-MM-YYYY')}</Typography>
                            <Typography>Batas akhir evaluasi: {dayjs(performanceReview.evaluationEndDate).format('DD-MM-YYYY')}</Typography>
                        </Paper>
                    </Paper>

                    {
                        lagAndLeadData &&
                        <Paper elevation={4} sx={{display: 'flex', marginBottom: '1em'}}>
                            <Bar options={barOptions} data={{
                                labels: Object.keys(lagAndLeadData?.other),
                                datasets: [
                                    {
                                        label: 'Rata-rata',
                                        data: Object.values(lagAndLeadData?.other).map(el => el?.valAvg),
                                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                    },
                                    {
                                        label: selectedTeacher ? selectedTeacher.fullName : 'Guru ini',
                                        data: Object.values(lagAndLeadData?.thisUser).map(el => el?.valAvg),
                                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                    }
                                ]
                            }}/>
                        </Paper>
                    }
                </>
            }

            {
                evaluationMode === 'eval' &&
            <>
                <Paper elevation={4} sx={{display: 'flex', padding: '0.5em', backgroundColor: '#18A0FB', marginBottom: '1em'}}>
                    <Paper sx={{display: 'flex', flexDirection: 'column', padding: '1em', marginRight: '1em', width: '29em'}}>
                        <Typography variant='h6'>Informasi Evaluasi</Typography>
                        <Typography>
                            Anda sedang mengisi evaluasi kinerja dari seorang Guru. <br/>
                            Perlu diperhatikan, pada pengisian nilai indikator, <br/>
                            semakin tinggi angkanya semakin tinggi nilai yang diberikan.
                        </Typography>
                    </Paper>
                </Paper> 
            </>
            }

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

            <div style={{display: getIdentifier().accessLevel === 2 ? 'none' : 'flex', justifyContent: 'flex-end'}}>
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