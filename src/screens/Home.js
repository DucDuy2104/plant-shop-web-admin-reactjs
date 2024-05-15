import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto'

const Home = () => {

  const fetchRevenue = async () => {
    try {
      const response = await fetch('http://localhost:7000/orders/revenue?year=2024')
      const result = await response.json()
      if(response.status) {
        setUpChart(result.data)
        return result.data
      }
    } catch (error) {
      console.log('Get revenue err: ', error.message)
    }
  }

  

  useEffect(() => {
    fetchRevenue()
  }, [])

  const setUpChart = async (dataF) => {
    new Chart(
      document.getElementById('acquisitions'),
      {
        type: 'bar',
        data: {
          labels: dataF.map(row => 'Tháng ' + row.month),
          datasets: [
            {
              label: 'Acquisitions by month',
              data: dataF.map(row => row.total)
            }
          ]
        }
      }
    );
  }

  return (
    <div style={{ width: '100%',marginTop: 20, padding: '10 200', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <h1>Doanh thu năm 2024</h1>
      <div style={{width: 1000, marginTop: 20}}>
        <canvas id="acquisitions"></canvas>
      </div>
    </div>
  );
};
export default Home;