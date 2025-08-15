import React from 'react';

interface LanguageItem {
  name: string;
  value: number;
}
interface LanguagesProps {
  lang:string;
}

const Languages: React.FC<LanguagesProps> = (lang) => {
  const data: LanguageItem[] = [
    {
      "name": "Portuguese",
      "value": 100
    },
    {
      "name": "English",
      "value": 80
    },
    {
      "name": "Italian",
      "value": 70
    }
  ]
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm h-fit">
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-24 text-sm font-medium text-gray-700">{item.name}</div>
            <div className="flex-1">
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Languages;
