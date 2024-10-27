import React from 'react'

const ChartPerbandinganKeluargaSasaranBerisikoDanTidakKabupaten = () => {
  return (
<React.Fragment>
<StackedBarChart
                        dataColors='["#2DAED4", "#57E7B4"]'
                        valueCharts={[]}
                        categoryChart={[]}
                        legendNames={["Berisiko", "Tidak Berisiko"]}
                      />
</React.Fragment>
  )
}

export default ChartPerbandinganKeluargaSasaranBerisikoDanTidakKabupaten
