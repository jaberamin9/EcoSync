import { Bar } from "react-chartjs-2";
export const BarChart = ({ chartData, text }) => {
    return (
        <div className="chart-container h-full">
            <h2 style={{ textAlign: "center" }}></h2>
            <Bar
                className="h-[400px] w-[200px]"
                data={chartData}
                options={{
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: text
                        },
                        legend: {
                            display: false
                        }
                    }
                }}
            />
        </div>
    );
};