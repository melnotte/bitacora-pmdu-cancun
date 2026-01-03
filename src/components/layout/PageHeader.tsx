import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div 
      className="w-full mb-10" 
      style={{ 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        marginTop: '2rem'
      }}
    >
      <h1 
        className="font-bold text-[#333] mb-3 leading-tight"
        style={{ fontSize: '2.5rem' }} 
      >
        {title}
      </h1>
      
      {description && (
        <p 
          className="text-[#666] mx-auto leading-relaxed"
          style={{ 
            fontSize: '1.1rem', 
            maxWidth: '700px',
            marginBottom: '3rem'
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;