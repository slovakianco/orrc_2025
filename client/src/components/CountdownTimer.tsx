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
  
  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-bold mb-3 text-center">{t('countdown.title')}</h3>
      <div className="flex justify-center space-x-4">
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold bg-alpine text-white w-16 h-16 flex items-center justify-center rounded-lg shadow-lg">
            {countdown.days}
          </div>
          <span className="mt-2 text-sm font-medium text-slate-gray">{t('countdown.days')}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold bg-sky-blue text-white w-16 h-16 flex items-center justify-center rounded-lg shadow-lg">
            {countdown.hours}
          </div>
          <span className="mt-2 text-sm font-medium text-slate-gray">{t('countdown.hours')}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold bg-sunset-orange text-white w-16 h-16 flex items-center justify-center rounded-lg shadow-lg">
            {countdown.minutes}
          </div>
          <span className="mt-2 text-sm font-medium text-slate-gray">{t('countdown.minutes')}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold bg-sunrise-yellow text-white w-16 h-16 flex items-center justify-center rounded-lg shadow-lg">
            {countdown.seconds}
          </div>
          <span className="mt-2 text-sm font-medium text-slate-gray">{t('countdown.seconds')}</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;