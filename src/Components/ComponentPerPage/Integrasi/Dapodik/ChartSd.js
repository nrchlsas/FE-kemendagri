import React from 'react'

const ChartSd = () => {
  return (
    <React.Fragment>
        <VerticalBarChart
        valueChart={[]}
        categoryChart={[
            "Kelas 1",
            "Kelas 2",
            "Kelas 3",
            "Kelas 4",
            "Kelas 5",
            "Kelas 6",
        ]}
        dataColors='["#F35F52"]'
        />
    </React.Fragment>
  )
}

export default ChartSd