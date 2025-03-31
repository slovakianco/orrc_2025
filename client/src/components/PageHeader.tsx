import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  bgClassName?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  bgClassName = "bg-gradient-to-br from-primary/90 to-primary-dark" 
}) => {
  return (
    <div className={`w-full py-16 md:py-24 ${bgClassName}`}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4 md:mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;