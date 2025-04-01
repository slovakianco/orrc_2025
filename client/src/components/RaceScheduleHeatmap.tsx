import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Activity } from "lucide-react";

// Define event intensity levels
const INTENSITY_LEVELS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

// Define color scale for intensity
const getIntensityColor = (intensity: number) => {
  switch (intensity) {
    case INTENSITY_LEVELS.LOW:
      return '#8dd1e1'; // Light blue
    case INTENSITY_LEVELS.MEDIUM:
      return '#82ca9d'; // Green
    case INTENSITY_LEVELS.HIGH:
      return '#ff8042'; // Orange
    default:
      return '#8884d8'; // Default purple
  }
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <Card className="p-2 shadow-lg border-0 bg-white">
        <CardContent className="p-2">
          <p className="font-bold text-primary">{data.name}</p>
          <p className="text-sm">
            <Clock className="inline-block w-4 h-4 mr-1" />
            {`${data.time} ${t('program.events.timeUnit')}`}
          </p>
          <p className="text-sm">
            <Users className="inline-block w-4 h-4 mr-1" />
            {t('heatmap.expectedParticipants')}: {data.participants}
          </p>
          <p className="text-sm">
            <Activity className="inline-block w-4 h-4 mr-1" />
            {t('heatmap.intensityLevel')}: {t(`heatmap.intensity.${data.intensityLabel}`)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};

// Define event data structure
interface EventData {
  id: number;
  name: string;
  day: number; // 1 for day 1, 2 for day 2
  time: string;
  hour: number; // Hour of day (0-24)
  intensity: number;
  intensityLabel: 'low' | 'medium' | 'high';
  participants: number;
  description?: string;
}

const RaceScheduleHeatmap: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Event data based on our program schedule, with added intensity metrics
  const eventData: EventData[] = [
    // Day 1 (July 4) - Friday
    {
      id: 1,
      name: t('program.events.kitPickup.title'),
      day: 1,
      time: "10:00 - 20:00",
      hour: 15, // Middle point of the time range
      intensity: INTENSITY_LEVELS.MEDIUM,
      intensityLabel: 'medium',
      participants: 250,
    },
    {
      id: 2,
      name: t('program.events.technicalMeeting.title'),
      day: 1,
      time: "18:00",
      hour: 18,
      intensity: INTENSITY_LEVELS.LOW,
      intensityLabel: 'low',
      participants: 150,
    },
    {
      id: 3,
      name: t('program.events.pastaParty.title'),
      day: 1,
      time: "18:30",
      hour: 18.5,
      intensity: INTENSITY_LEVELS.MEDIUM,
      intensityLabel: 'medium',
      participants: 300,
    },
    
    // Day 2 (July 5) - Saturday
    {
      id: 4,
      name: t('program.events.kitPickup.title'),
      day: 2,
      time: "06:00 - 08:00",
      hour: 7, // Middle point of the time range
      intensity: INTENSITY_LEVELS.HIGH,
      intensityLabel: 'high',
      participants: 200,
    },
    {
      id: 5,
      name: t('program.events.raceStart33k.title'),
      day: 2,
      time: "08:30",
      hour: 8.5,
      intensity: INTENSITY_LEVELS.HIGH,
      intensityLabel: 'high',
      participants: 350,
    },
    {
      id: 6,
      name: t('program.events.raceStart11k.title'),
      day: 2,
      time: "09:30",
      hour: 9.5,
      intensity: INTENSITY_LEVELS.HIGH,
      intensityLabel: 'high',
      participants: 450,
    },
    {
      id: 7,
      name: t('program.events.finishMeal.title'),
      day: 2,
      time: "11:00 - 16:00",
      hour: 13.5, // Middle point of the time range
      intensity: INTENSITY_LEVELS.MEDIUM,
      intensityLabel: 'medium',
      participants: 800,
    },
    {
      id: 8,
      name: t('program.events.awards.title'),
      day: 2,
      time: "15:00",
      hour: 15,
      intensity: INTENSITY_LEVELS.HIGH,
      intensityLabel: 'high',
      participants: 500,
    },
    {
      id: 9,
      name: t('program.events.banquet.title'),
      day: 2,
      time: "18:30",
      hour: 18.5,
      intensity: INTENSITY_LEVELS.MEDIUM,
      intensityLabel: 'medium',
      participants: 350,
    },
  ];

  // Filter data by selected day
  const filteredData = selectedDay 
    ? eventData.filter(event => event.day === selectedDay) 
    : eventData;

  // Legend items for intensity
  const intensityLegend = [
    { value: INTENSITY_LEVELS.LOW, label: 'heatmap.intensity.low', color: getIntensityColor(INTENSITY_LEVELS.LOW) },
    { value: INTENSITY_LEVELS.MEDIUM, label: 'heatmap.intensity.medium', color: getIntensityColor(INTENSITY_LEVELS.MEDIUM) },
    { value: INTENSITY_LEVELS.HIGH, label: 'heatmap.intensity.high', color: getIntensityColor(INTENSITY_LEVELS.HIGH) },
  ];

  // Format for X-axis (hours)
  const formatXAxis = (hour: number) => {
    const hourFloor = Math.floor(hour);
    const minutes = (hour - hourFloor) * 60;
    return `${hourFloor}:${minutes === 0 ? '00' : minutes}`;
  };

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {t('heatmap.title')}
        </CardTitle>
        <div className="mt-2">
          <p className="text-sm text-neutral-gray mb-4">
            {t('heatmap.description')}
          </p>
          <div className="flex space-x-2">
            <Button 
              variant={selectedDay === null ? "default" : "outline"} 
              onClick={() => setSelectedDay(null)}
              className="text-sm"
            >
              {t('heatmap.allDays')}
            </Button>
            <Button 
              variant={selectedDay === 1 ? "default" : "outline"} 
              onClick={() => setSelectedDay(1)}
              className="text-sm"
            >
              {t('program.dayTitles.day1')}
            </Button>
            <Button 
              variant={selectedDay === 2 ? "default" : "outline"} 
              onClick={() => setSelectedDay(2)}
              className="text-sm"
            >
              {t('program.dayTitles.day2')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <XAxis 
                type="number" 
                dataKey="hour" 
                name="Time" 
                domain={[6, 20]} 
                tickFormatter={formatXAxis}
                label={{ value: t('heatmap.timeOfDay'), position: 'bottom', offset: 0 }}
              />
              <YAxis 
                type="number" 
                dataKey="day" 
                name="Day" 
                domain={[0.5, 2.5]} 
                tickCount={2}
                tickFormatter={(value) => value === 1 ? t('heatmap.day1Short') : t('heatmap.day2Short')}
                label={{ value: t('heatmap.day'), angle: -90, position: 'left' }}
              />
              <ZAxis 
                type="number" 
                dataKey="participants" 
                range={[60, 400]} 
                name="Participants" 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={50}
                content={(props) => (
                  <div className="flex justify-center mb-4">
                    {intensityLegend.map((item) => (
                      <div key={item.value} className="flex items-center mx-2">
                        <div 
                          className="w-3 h-3 mr-1 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-xs">{t(item.label)}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Scatter name="Events" data={filteredData}>
                {filteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getIntensityColor(entry.intensity)} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-sm text-neutral-gray">
          {t('heatmap.note')}
        </div>
      </CardContent>
    </Card>
  );
};

export default RaceScheduleHeatmap;