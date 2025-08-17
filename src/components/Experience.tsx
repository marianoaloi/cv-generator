import { calculateDateDifference, convertDate } from '@/util/componentDate';
import { identParagraph } from '@/util/componentString';
import React from 'react';

interface ExperienceProps {
  data: {
    title: string;
    company: string;
    end: string;
    start: string;
    description: string;
    technologies: string[];
  }[];
  lang: string;
}

const Experience: React.FC<ExperienceProps> = ({ data, lang }) => {
  data.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2 mb-4">{lang === 'it' ? 'Esperienza Professionale' : 'Professional Experience'}</h2>
      {data.map((item, index) => (

        <div key={index} className="mb-4">
          <h3 className="text-xl font-bold">{item.title}</h3>
          <p className="text-lg font-semibold">{item.company} | {convertDate(item.start)} - {item.end ? convertDate(item.end) : lang === 'it' ? 'Presente' : 'Present'} <span className='text-xs text-gray-500'>({calculateDateDifference(item.start, item.end, lang)})</span></p>
          <div className='text-justify' dangerouslySetInnerHTML={{ __html: identParagraph(item.description) }} />
          <div className="flex flex-wrap justify-between gap-2 mt-2">
            {
              item.technologies
                .sort((a, b) => a.localeCompare(b))
                .map((tech, index) =>
                  <span 
                    key={index} 
                    className="inline-block px-3 py-1 border border-gray-300 rounded-md text-black text-sm bg-white shadow-sm"
                  >
                    {tech}
                  </span>
                )
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default Experience;
