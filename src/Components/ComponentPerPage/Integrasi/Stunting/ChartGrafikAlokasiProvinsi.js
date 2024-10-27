import React from 'react'

const ChartGrafikAlokasiProvinsi = () => {
  return (
<React.Fragment>
<BarWithPercentageModifiedStunting
                        valueChart={[]}
                        categoryChart={[]}
                        percentageChart1={[]}
                        percentageChart2={[]}
                        axisY={["Total Anggaran", "Persentase"]}
                        additionalData={[]}
                        dataColors='["#090909", "#2DAED4"]'
                        dataTotal={10}
                      />
</React.Fragment>
  )
}

export default ChartGrafikAlokasiProvinsi
