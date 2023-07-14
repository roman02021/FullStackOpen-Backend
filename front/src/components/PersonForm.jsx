import React from 'react';
import PersonDetail from './PersonDetail';
const PersonForm = ({
  handleSubmit,
  handleNameInput,
  newName,
  handlePhoneInput,
  newPhone,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <PersonDetail onChange={handleNameInput} value={newName} label="name: " />
      <PersonDetail
        onChange={handlePhoneInput}
        value={newPhone}
        label="phone: "
      />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
