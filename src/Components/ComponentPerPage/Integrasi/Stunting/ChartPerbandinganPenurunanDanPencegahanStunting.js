import React from 'react'

const ChartPerbandinganPenurunanDanPencegahanStunting = () => {
  return (
    <React.Fragment>
        <PieChartNew
                        dataChart={[]}
                        dataColors={'["#2DAED4", "#FCAD24"]'}
                        categoryName={[
                          "Bidang Urusan di Luar Kesehatan",
                          "Bidang Urusan Kesehatan",
                        ]}
                        showLegend={false}
                        percentOnly={true}
                        pieChart={false}
                      />
    </React.Fragment>
  )
}

export default ChartPerbandinganPenurunanDanPencegahanStunting