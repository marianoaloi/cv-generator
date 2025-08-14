import React from 'react';

interface EducationProps {
  data: {
    degree: string;
    university: string;
    date: string;
  }[];
}

const Education: React.FC<EducationProps> = ({ data }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2 mb-4">Education</h2>
      {data.map((item, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-xl font-bold">{item.degree}</h3>
          <p className="text-lg font-semibold">{item.university} | {item.date}</p>
        </div>
      ))}
    </div>
  );
};

export default Education;
