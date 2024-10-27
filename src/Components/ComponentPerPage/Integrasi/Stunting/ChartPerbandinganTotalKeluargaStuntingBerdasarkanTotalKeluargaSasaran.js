import React from 'react'

const ChartPerbandinganTotalKeluargaStuntingBerdasarkanTotalKeluargaSasaran = () => {
  return (
<React.Fragment>
<PieChartNew
                    dataChart={[]}
                    categoryName={[
                      "Keluarga Tidak Berisiko Stunting",
                      "Keluarga Berisiko Stunting",
                    ]}                    
                    dataColors={'["#57E7B4", "#2DAED4"]'}
                  />
</React.Fragment>
  )
}

export default ChartPerbandinganTotalKeluargaStuntingBerdasarkanTotalKeluargaSasaran
