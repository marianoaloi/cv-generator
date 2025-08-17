import React from 'react';

interface PersonalInfoProps {
  data: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
  };
  lang:string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data , lang }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold">Mariano Aloi</h1>
      <div className='text-xs flex justify-between items-center gap-2'>
        <span>Technical Leader</span>	 <span>📍 Udine</span> 
<span>☎️ +39 378 091 4635</span>
	<a href='mailto:mariano@aloi.adv.br'>📬 mariano@aloi.adv.br</a>

      </div>
    </div>
  );
};

export default PersonalInfo;
