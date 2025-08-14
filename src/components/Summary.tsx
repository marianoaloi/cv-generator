import React from 'react';

interface SummaryProps {
  data: string;
}

const Summary: React.FC<SummaryProps> = ({ data }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2 mb-4">Summary</h2>
      <p>{data}</p>
    </div>
  );
};

export default Summary;
