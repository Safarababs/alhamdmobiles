import React from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

const Chart = ({ type, data, options, title }) => {
  let ChartType;
  switch (type) {
    case "Pie":
      ChartType = Pie;
      break;
    case "Bar":
      ChartType = Bar;
      break;
    case "Line":
      ChartType = Line;
      break;
    default:
      ChartType = Pie;
      break;
  }

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ChartType data={data} options={options} />
    </div>
  );
};

export const pieChartData = {
  labels: ["Total Profit"],
  datasets: [
    {
      label: "Total Profit",
      data: [1000], // Example data, replace with actual data
      backgroundColor: ["#ff6384"],
      borderColor: ["#ff6384"],
      borderWidth: 1,
    },
  ],
};

export const barChartData = {
  labels: ["Total Sales"],
  datasets: [
    {
      label: "Total Sales",
      data: [2000], // Example data, replace with actual data
      backgroundColor: ["#36a2eb"],
      borderColor: ["#36a2eb"],
      borderWidth: 1,
    },
  ],
};

export const lineChartData = {
  labels: ["Total Loss"],
  datasets: [
    {
      label: "Total Loss",
      data: [500], // Example data, replace with actual data
      backgroundColor: "rgba(255, 205, 86, 0.2)",
      borderColor: "#ffcd56",
      borderWidth: 1,
      fill: true,
    },
  ],
};

export const chartOptions = {
  responsive: true,
  plugins: {
    tooltip: {
      enabled: true,
    },
    legend: {
      position: "top",
      labels: {
        font: {
          size: 14,
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default Chart;
