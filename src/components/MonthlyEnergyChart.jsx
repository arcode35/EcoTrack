import React, { useRef, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MonthlyEnergyChart = () => {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 400);
    grad.addColorStop(0, "#55C923");
    grad.addColorStop(1, "#3DC787");
    setGradient(grad);
  }, []);

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Energy (kWh)",
        data: [320, 280, 340, 300, 360, 400, 420, 390, 370, 350, 310, 330],
        backgroundColor: gradient ?? "#55C923",
        borderRadius: { topLeft: 10, topRight: 10 },
        borderColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 700, 0);
          gradient.addColorStop(0, "#3DC787");
          gradient.addColorStop(0.5, "#55C923");
          gradient.addColorStop(1, "#3DC787");
          return gradient;
        },

        borderSkipped: false,
        barThickness: 10,
        hoverBackgroundColor: "#88FF4D",
        hoverBorderColor: "#55C923",
        hoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: "easeInOutCubic",
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#55C923",
          font: {
            size: 14,
            family: "Quicksand, sans-serif",
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "#111",
        titleColor: "#55C923",
        bodyColor: "#fff",
        borderColor: "#55C923",
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          family: "Quicksand, sans-serif",
        },
        bodyFont: {
          family: "Quicksand, sans-serif",
        },
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#bbb",
          font: {
            family: "Quicksand, sans-serif",
          },
        },
        grid: {
          color: "#222",
        },
      },
      y: {
        ticks: {
          color: "#bbb",
          font: {
            family: "Quicksand, sans-serif",
          },
        },
        grid: {
          color: "#222",
        },
      },
    },
  };

  return <Bar ref={chartRef} data={data} options={options} />;
};

export default MonthlyEnergyChart;