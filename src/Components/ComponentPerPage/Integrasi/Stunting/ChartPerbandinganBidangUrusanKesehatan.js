import React from 'react'

const ChartPerbandinganBidangUrusanKesehatan = () => {
  return (
    <React.Fragment>
        <PieChartNew
                        dataChart={[]}
                        dataColors={'["#2DAED4", "#FCAD24"]'}
                        categoryName={[
                          "Anggaran Untuk Lainnya",
                          "Anggaran Penurunan dan Pencegahan Stunting",
                        ]}                        
                        pieChart={false}
                        showLegend={false}
                        percentOnly={true}
                      />
    </React.Fragment>
  )
}

export default ChartPerbandinganBidangUrusanKesehatan