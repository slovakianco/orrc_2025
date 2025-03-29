import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

const CountdownTimer = ({ targetDate, className = '' }: CountdownTimerProps) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setCountdown({ days, hours, minutes, seconds });
      }
    };
    
    // Calculate immediately
    calculateTimeLeft();
    
    // Set up interval
    const timerId = setInterval(calculateTimeLeft, 1000);
    
    // Clean up
    return () => clearInterval(timerId);
  }, [targetDate]);
  
  // Format the number to always have two digits
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };
  
  // Calculate percentages for circular progress
  const getHoursProgress = () => (countdown.hours / 24) * 100;
  const getMinutesProgress = () => (countdown.minutes / 60) * 100;
  const getSecondsProgress = () => (countdown.seconds / 60) * 100;
  
  return (
    <div className={`${className}`}>
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {/* Days - Yellow accent */}
        <div className="countdown-item">
          <div className="relative w-16 md:w-24 aspect-square">
            {/* Outer circle (dark border) */}
            <div className="absolute inset-0 rounded-full border-4 md:border-[6px] border-slate-gray"></div>
            
            {/* Color accent */}
            <div className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 bg-sunrise-yellow rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Inner content */}
            <div className="absolute inset-1 md:inset-2 bg-stone-beige rounded-full flex flex-col items-center justify-center">
              <span className="text-lg md:text-3xl font-bold text-slate-gray">{formatNumber(countdown.days)}</span>
              <span className="text-[8px] md:text-xs uppercase font-medium text-slate-gray/80">{t('countdown.days')}</span>
            </div>
          </div>
        </div>
        
        {/* Hours - Blue accent with progress */}
        <div className="countdown-item">
          <div className="relative w-16 md:w-24 aspect-square">
            {/* Outer circle (dark border) */}
            <div className="absolute inset-0 rounded-full border-4 md:border-[6px] border-slate-gray"></div>
            
            {/* Progress circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="50%" 
                cy="50%" 
                r="calc(50% - 2px - 4px)" 
                strokeWidth="8" 
                stroke="#4A90BF" 
                fill="none" 
                strokeDasharray="100" 
                strokeDashoffset={100 - getHoursProgress()}
                className="transition-all duration-500"
              />
            </svg>
            
            {/* Inner content */}
            <div className="absolute inset-1 md:inset-2 bg-stone-beige rounded-full flex flex-col items-center justify-center">
              <span className="text-lg md:text-3xl font-bold text-slate-gray">{formatNumber(countdown.hours)}</span>
              <span className="text-[8px] md:text-xs uppercase font-medium text-slate-gray/80">{t('countdown.hours')}</span>
            </div>
          </div>
        </div>
        
        {/* Minutes - Green accent with progress */}
        <div className="countdown-item">
          <div className="relative w-16 md:w-24 aspect-square">
            {/* Outer circle (dark border) */}
            <div className="absolute inset-0 rounded-full border-4 md:border-[6px] border-slate-gray"></div>
            
            {/* Progress circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="50%" 
                cy="50%" 
                r="calc(50% - 2px - 4px)" 
                strokeWidth="8" 
                stroke="#7AB55C" 
                fill="none" 
                strokeDasharray="100" 
                strokeDashoffset={100 - getMinutesProgress()}
                className="transition-all duration-500"
              />
            </svg>
            
            {/* Inner content */}
            <div className="absolute inset-1 md:inset-2 bg-stone-beige rounded-full flex flex-col items-center justify-center">
              <span className="text-lg md:text-3xl font-bold text-slate-gray">{formatNumber(countdown.minutes)}</span>
              <span className="text-[8px] md:text-xs uppercase font-medium text-slate-gray/80">{t('countdown.minutes')}</span>
            </div>
          </div>
        </div>
        
        {/* Seconds - Teal accent with progress */}
        <div className="countdown-item">
          <div className="relative w-16 md:w-24 aspect-square">
            {/* Outer circle (dark border) */}
            <div className="absolute inset-0 rounded-full border-4 md:border-[6px] border-slate-gray"></div>
            
            {/* Progress circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="50%" 
                cy="50%" 
                r="calc(50% - 2px - 4px)" 
                strokeWidth="8" 
                stroke="#5DC0B5" 
                fill="none" 
                strokeDasharray="100" 
                strokeDashoffset={100 - getSecondsProgress()}
                className="transition-all duration-500"
              />
            </svg>
            
            {/* Inner content */}
            <div className="absolute inset-1 md:inset-2 bg-stone-beige rounded-full flex flex-col items-center justify-center">
              <span className="text-lg md:text-3xl font-bold text-slate-gray">{formatNumber(countdown.seconds)}</span>
              <span className="text-[8px] md:text-xs uppercase font-medium text-slate-gray/80">{t('countdown.seconds')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;