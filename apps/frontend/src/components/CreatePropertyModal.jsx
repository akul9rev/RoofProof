import React from 'react';
import CreatePropertyForm from './CreatePropertyForm';

export default function CreatePropertyModal({ landlord, onClose, onSuccess }) {
  return (
    <CreatePropertyForm
      landlord={landlord}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}
