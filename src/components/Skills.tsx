import React from 'react';

interface SkillsProps {
  data: string[];
}

const Skills: React.FC<SkillsProps> = ({ data }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2 mb-4">Skills</h2>
      <ul className="list-disc list-inside">
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Skills;
