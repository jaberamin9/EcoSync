import { Bar } from "react-chartjs-2";
export const BarChart = ({ chartData, text }) => {
    return (
        <div className="chart-container">
            <h2 style={{ textAlign: "center" }}></h2>
            <Bar
                data={chartData}
                options={{
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