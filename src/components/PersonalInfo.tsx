import React from 'react';

interface PersonalInfoProps {
  data: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
  };
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold">{data.name}</h1>
      <p className="text-lg">{data.email} | {data.phone} | {data.linkedin}</p>
    </div>
  );
};

export default PersonalInfo;
