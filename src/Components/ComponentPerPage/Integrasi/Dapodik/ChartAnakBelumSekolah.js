import React from 'react'

const ChartAnakBelumSekolah = () => {
  return (
   <React.Fragment>
    <HorizontalBarChart
        valueChart={[]}
        categoryChart={[
            "Usia 8",
            "Usia 9",
            "Usia 10",
            "Usia 11",
            "Usia 12",
            "Usia 13",
            "Usia 14",
            "Usia 15",
            "Usia 16",
            "Usia 17",
            "Usia 18",
            "Usia 19",
            "Usia 20",
            "Usia 21",
        ]}
        dataColors='["#57E7B4"]'
    />
   </React.Fragment>
  )
}

export default ChartAnakBelumSekolah