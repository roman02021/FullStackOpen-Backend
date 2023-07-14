import React from 'react';

const Filter = ({ handlePersonFilter, personFilter }) => {
  return (
    <div>
      filter shown with
      <input onChange={handlePersonFilter} value={personFilter} />
    </div>
  );
};

export default Filter;
