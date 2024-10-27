import React from 'react'

const ChartSasaranMenurutPeringkatKesejahteraan = () => {
  return (
<React.Fragment>
<StackedBarChart
                    dataTotal={10}
                    dataZoom={true}
                    breakWord={true}
                    dataColors='["#695FF3", "#63A9ED", "#5BE9F3", "#99FFE7"]'
                    valueCharts={[]}
                    categoryChart={[]}
                    legendNames={[
                      "Kesejahteraan 1",
                      "Kesejahteraan 2",
                      "Kesejahteraan 3",
                      "Kesejahteraan 4",
                    ]}
                  />
</React.Fragment>
  )
}

export default ChartSasaranMenurutPeringkatKesejahteraan
