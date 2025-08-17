import React from 'react';

interface SkillItem {
  skillName: string;
  skillLevel: number;
}
interface SkillsProps {
  data: SkillItem[];
}

const Skills: React.FC<SkillsProps> = ({ data }) => {
  data.sort((a, b) =>  a.skillName.localeCompare(b.skillName)  );
  data.sort((a, b) =>  b.skillLevel - a.skillLevel  );

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm h-fit">
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-24 text-sm font-medium text-gray-700">{item.skillName}</div>
            <div className="flex-1">
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.skillLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
