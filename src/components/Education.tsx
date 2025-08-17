import { convertDate } from '@/util/componentDate';
import React from 'react';

interface EducationProps {
  data: {
    degree: string;
    school: string;
    start: string;
    end: string;
  }[];
}

const Education: React.FC<EducationProps> = ({ data }) => {

  data.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  return (
    <div className="mb-8">
      {data.map((item, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-xl font-bold">{item.degree}</h3>
          <p className="text-xs font-semibold">{item.school} | {convertDate(item.start)} - {convertDate(item.end)}</p>
        </div>
      ))}
    </div>
  );
};

export default Education;
