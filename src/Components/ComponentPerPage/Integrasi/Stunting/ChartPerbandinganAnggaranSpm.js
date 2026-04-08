import React from 'react'

const ChartPerbandinganAnggaranSpm = () => {
  return (
    <React.Fragment>
        <PieChartNew                        
                        dataChart={[]}
                        dataColors={'["#FCAD24","#2DAED4"]'}
                        categoryName={[
                          "Anggaran Stunting yang termasuk ke dalam SPM",
                          "Anggaran Stunting di Luar SPM",
                        ]}                        
                        fitContent={true}
                        pieChart={false}                        
                        showLegend={true}
                        percentOnly={true}                      
                      />
    </React.Fragment>
  )
}

export default ChartPerbandinganAnggaranSpm