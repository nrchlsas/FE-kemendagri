import React from 'react'
import './ProgressArrowBar.scss'

const ProgressArrowBar = () => {
  return (
    <React.Fragment>
    <div className="step-container">
        <div className="step-item">Persiapan</div>
        <div className="step-item">Ranwal</div>
        <div className="step-item">Rancangan</div>
        <div className="step-item">Musrenbang</div>
        <div className="step-item">Rankhir</div>
        <div className="step-item">Penetapan</div>
    </div>
    </React.Fragment>

  )
}

export default ProgressArrowBar
