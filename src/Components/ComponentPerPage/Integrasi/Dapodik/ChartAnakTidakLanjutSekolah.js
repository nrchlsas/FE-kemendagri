import React from 'react'

const ChartAnakTidakLanjutSekolah = () => {
  return (
    <React.Fragment>
        <HorizontalBarChart
            valueChart={[]}
            categoryChart={["SMP", "SMA"]}
            dataColors='["#7CCCE4", "#B0B0B0"]'
        />
    </React.Fragment>
  )
}

export default ChartAnakTidakLanjutSekolah