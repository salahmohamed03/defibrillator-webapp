"use client";

import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const RealTimePlot = ({ isArrhythmia, setIsArrhythmia }: { isArrhythmia: boolean, setIsArrhythmia: (value: boolean) => void }) => {
    const [data, setData] = useState<number[]>([]);

    const ecgPattern = [
        0, 0.1, 0.3, 0.2, -0.1, 0, // P wave
        0.2, 0.4, 0.6, 1.2, 0.8, 0.2, // QRS complex
        -0.1, 0, 0.05, 0.1, 0.15, 0.1, 0, // T wave
    ];

    // Define Arrhythmia pattern (example values, adjust as needed)
    const arrhythmiaPattern = [
        0, 1, 0.5, 2, 1.5, 0, // Example of irregular rhythm
        0, 0.7, 1.2, 0.3, -0.5, 0, // Random changes
        1, 0, 0.5, 1, 0.8, 0, // Further variation
    ];

    useEffect(() => {
        let index = 0;
        const currentPattern = !isArrhythmia ? arrhythmiaPattern : ecgPattern; // Choose pattern based on state
        
        const intervalId = setInterval(() => {
            const newValue = currentPattern[index];
            setData(prevData => [...prevData.slice(-49), newValue]); // Keep last 50 values
            
            index = (index + 1) % currentPattern.length; // Loop through the selected pattern
        }, 100);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [isArrhythmia]); // Re-run effect when pattern changes

    const chartData = {
        labels: data.map((_, i) => i),
        datasets: [
            {
                label: 'ECG Simulation',
                data: data,
                borderColor: 'rgba(10,100,200,1)',
                fill: false,
                pointRadius: 0, // Remove circles on the line
            },
        ],
    };

    const options = {
        scales: {
            x: { display: false }, // Hide x-axis if not needed
        },
    };

    return (
        <div>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default RealTimePlot;
