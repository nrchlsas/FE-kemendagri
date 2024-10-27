import React from 'react'

const GrafikAlokasiNasionalDapodik = () => {
  return (
   <React.Fragment>
        <PieChartNew
        dataChart={[]}
        dataColors={'["#2DAED4", "#FCAD24"]'}
        categoryName={[
            "Anggaran Di luar Pendidikan",
            "Anggaran Pendidikan",
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