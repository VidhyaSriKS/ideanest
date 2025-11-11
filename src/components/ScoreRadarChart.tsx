import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface ScoreRadarChartProps {
  innovation: number;
  feasibility: number;
  scalability: number;
}

export function ScoreRadarChart({ innovation, feasibility, scalability }: ScoreRadarChartProps) {
  const data = [
    {
      subject: 'Innovation',
      score: innovation,
      fullMark: 10,
    },
    {
      subject: 'Feasibility',
      score: feasibility,
      fullMark: 10,
    },
    {
      subject: 'Scalability',
      score: scalability,
      fullMark: 10,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#f8fafc', fontSize: 14 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 10]} 
          tick={{ fill: '#94a3b8', fontSize: 12 }}
        />
        <Radar
          name="Scores"
          dataKey="score"
          stroke="#38bdf8"
          fill="#38bdf8"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
