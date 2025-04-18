import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const initialLabels = Array.from({ length: 20 }, (_, i) => `${i}s`);

const LiveIOTChart = forwardRef((props, ref) => {
  const [chartData, setChartData] = useState({
    labels: initialLabels,
    datasets: [
      {
        label: "Energy Usage (W)",
        data: Array(20).fill(0),
        borderColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 700, 0);
          gradient.addColorStop(0, "#3DC787");
          gradient.addColorStop(0.5, "#55C923");
          gradient.addColorStop(1, "#3DC787");
          return gradient;
        },

        backgroundColor: "rgba(75, 252, 140, 0.2)",
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.1, // 0.4 is nice and curvy, 0.5 is very smooth
      },
    ],
  });

  const countRef = useRef(20);

  const plotNewPoint = (newAvg) => {
    setChartData((prev) => {
      const newData = [
        ...prev.datasets[0].data.slice(1),
        newAvg
      ];
      const newLabels = [...prev.labels.slice(1), `${countRef.current++}s`];

      return {
        ...prev,
        labels: newLabels,
        datasets: [
          {
            ...prev.datasets[0],
            data: newData,
          },
        ],
      };
    })
  }

  useImperativeHandle(ref, () => ({
    plotNewPoint,
  }));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    animation: {
      duration: 500,
      easing: "easeOutCubic",
    },
    scales: {
      x: {
        ticks: { color: "#aaa" },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: { color: "#aaa" },
        grid: {
          display: false,
          drawBorder: false,
        },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ccc",
          font: { family: "Quicksand" },
        },
      },
      tooltip: {
        enabled: true, // shows tooltip on hover
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 4,
        titleFont: { family: "Quicksand", weight: "bold" },
        bodyFont: { family: "Quicksand" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
});

export default LiveIOTChart;
