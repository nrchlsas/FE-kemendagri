import React from 'react'

const ChartUrusanPemerintahUntukPencegahanStunting = () => {
  return (
    <React.Fragment>
        <HorizontalBarChart
                    dataZoom ={true}
                    dataTotal={5}
                    breakWord = {true}
                    dataColors='["#FCAD24"]'
                    trillion={true}                    
                    valueChart={[]}
                    categoryChart={[]}
                  />
    </React.Fragment>
  )
}

export default ChartUrusanPemerintahUntukPencegahanStunting