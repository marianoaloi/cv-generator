import { calculateDateDifference, convertDate } from '@/util/componentDate';
import React from 'react';

interface ExperienceProps {
  data: {
    title: string;
    company: string;
    end: string;
    start: string;
    description: string;
  }[];
  lang:string;
}

const Experience: React.FC<ExperienceProps> = ({ data , lang }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2 mb-4">Experience</h2>
      {data.map((item, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-xl font-bold">{item.title}</h3>
          <p className="text-lg font-semibold">{item.company} | {convertDate(item.start)} - {convertDate(item.end)} <span className='text-xs text-gray-500'>({calculateDateDifference(item.start, item.end,lang)})</span></p>
          <p className='text-justify'>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Experience;
