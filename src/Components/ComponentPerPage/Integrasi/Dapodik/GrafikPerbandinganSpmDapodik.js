import React from 'react'

const GrafikAlokasiNasionalDapodik = () => {
  return (
   <React.Fragment>
    <PieChartNew
        dataChart={[]}
        dataColors={'["#2DAED4", "#57E7B4"]'}
        categoryName={[
        "SPM Di Luar Bidang Pendidikan",
        "SPM Bidang Pendidikan",
        ]}
        pieChart={false}
        showLegend={true}
        percentOnly={true}
        legendHorizontal={false}
        heightChart="350px"
    />
   </React.Fragment>
  )
}

export default GrafikAlokasiNasionalDapodik