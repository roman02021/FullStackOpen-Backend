import React from 'react';

const Person = ({ onChange, value, label }) => {
  return (
    <div>
      {label} <input onChange={onChange} value={value} />
    </div>
  );
};

export default Person;
