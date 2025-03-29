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
  
  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-4 gap-3">
        {/* Days */}
        <div className="flex flex-col items-center">
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 w-full aspect-square flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {formatNumber(countdown.days)}
            </span>
            <span className="text-xs md:text-sm text-white/70 uppercase tracking-wider mt-1">
              {t('countdown.days')}
            </span>
          </div>
        </div>
        
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 w-full aspect-square flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {formatNumber(countdown.hours)}
            </span>
            <span className="text-xs md:text-sm text-white/70 uppercase tracking-wider mt-1">
              {t('countdown.hours')}
            </span>
          </div>
        </div>
        
        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 w-full aspect-square flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {formatNumber(countdown.minutes)}
            </span>
            <span className="text-xs md:text-sm text-white/70 uppercase tracking-wider mt-1">
              {t('countdown.minutes')}
            </span>
          </div>
        </div>
        
        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 w-full aspect-square flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-sunset/20 transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></div>
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white relative z-10">
              {formatNumber(countdown.seconds)}
            </span>
            <span className="text-xs md:text-sm text-white/70 uppercase tracking-wider mt-1 relative z-10">
              {t('countdown.seconds')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;