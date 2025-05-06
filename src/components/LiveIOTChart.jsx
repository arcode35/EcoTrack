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

const initialLabels = Array.from({ length: 20 }, (_, i) => `Day ${i}`);

//define as forward ref to basicallly allow parent (the main page) to see certain parts of the child (aka this component)
const LiveIOTChart = forwardRef((props, ref) => {
  //setting initial state
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  const [chartData, setChartData] = useState({
    labels: initialLabels,
    datasets: [
      {
        label: "Sampled Energy Usage from IOT(W)",
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
        tension: 0.4, // 0.4 is nice and curvy, 0.5 is very smooth
      },
      {
        label: "Predicted Future Energy Usage from IOT(W)",
        data: Array(20).fill(0),
        borderColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 700, 0);
          gradient.addColorStop(0, "#D32F2F");
          gradient.addColorStop(0.5, "#C2185B");
          gradient.addColorStop(1, "#7B1FA2");
          return gradient;
        },

        backgroundColor: "rgba(75, 252, 140, 0.2)",
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.4, // 0.4 is nice and curvy, 0.5 is very smooth
      }
    ],
  });

  //funciton that takes in the new average and current second we setting that average to, sets it
  const plotNewPoint = (newAvg, currentSecond, predictedValue) => {
    
    setChartData((prev) => {
      let newData = ""
      let newLabels = ""

      let chosenDataset = predictedValue ? 1 : 0

      //if past 20 seconds, we know start shifting out the previous values. Technically they still there
      if(currentSecond >= 20)
      {
        newLabels = [...prev.labels.slice(1), `Day ${currentSecond}`];
        //this way if we're now predicting values, we're modifying the dataset at index 1, otherwise we're modifying the dataset at index 0
        newData = [
          ...prev.datasets[chosenDataset].data.slice(1),
          newAvg
        ];
      }
      //otherwise, just replace the current one with the new average.
      else
      {
        newData = prev.datasets[0].data
        newData[currentSecond] = newAvg
        //keep labels the same
        newLabels = prev.labels
      }

      setMin(Math.min(...newData))
      setMax(Math.max(...newData))

      return {
        ...prev,
        labels: newLabels,
        datasets: [
          {
            ...prev.datasets[0],
            //this way if we're predicting values now keep same dataset for this version, and otherwise update the data
            data: predictedValue ? 
            //so if we're predicting value, we want the sampled value to go away over time
            [...prev.datasets[0].data.slice(1), 0] : 
            newData
          },
          {
            ...prev.datasets[1],
            data: predictedValue ?
            newData :
            prev.datasets[1].data  
          }
        ],
      };
    })
  }

  //makes the plotNewPoint function visible to the parent of this component (the dashboard page)
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
        min: (min == 0) ?  50 :min - 10,
        max: (max == 0)? 10 : max + 10,
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
