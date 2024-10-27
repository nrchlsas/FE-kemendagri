import React from 'react'

const GrafikAlokasiNasionalDapodik = () => {
  return (
   <React.Fragment>
    <BarWithPercentageModified
        valueChart={[]}
        categoryChart={[]}
        percentageChart1={[]}
        percentageChart2={[]}
        axisY={["Total Anggaran", "Persentase"]}
        additionalData={[]}
        seProv={true}                        
        dataColors='["#2DAED4", "#090909"]'
        />
   </React.Fragment>
  )
}

export default GrafikAlokasiNasionalDapodik