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
    <div className="mb-8">
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-32 font-medium">{item.skillName}</div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
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
