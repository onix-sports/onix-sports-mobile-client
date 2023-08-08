import { useContext } from 'react';
import { OrganizationContext } from '../contexts';

const useOrganizations = () => {
  return useContext(OrganizationContext);
};

export { useOrganizations };
