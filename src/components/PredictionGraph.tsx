// PredictionGraph.tsx (temporarily disabled for GitHub push)
// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// type Props = {
//   data: { over: number; runs: number; predicted?: number }[];
// };

// const PredictionGraph: React.FC<Props> = ({ data }) => {
//   return (
//     <div style={{ width: "100%", height: 300 }}>
//       <ResponsiveContainer>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="over" label={{ value: "Overs", position: "insideBottomRight", offset: -5 }} />
//           <YAxis label={{ value: "Runs", angle: -90, position: "insideLeft" }} />
//           <Tooltip />
//           <Line type="monotone" dataKey="runs" stroke="#1d4ed8" strokeWidth={2} name="Actual Runs" />
//           <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 2" name="Predicted" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default PredictionGraph;
