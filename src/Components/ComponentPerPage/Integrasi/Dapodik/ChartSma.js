import React from 'react'

const ChartSma = () => {
  return (
    <React.Fragment>
        <VerticalBarChart
            valueChart={[]}
            categoryChart={[
                "Kelas 10",
                "Kelas 11",
                "Kelas 12",
                "kelas 13",
            ]}
            dataColors='["#808080"]'
            />
    </React.Fragment>
  )
}

export default ChartSma