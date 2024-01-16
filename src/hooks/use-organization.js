import { api } from '../libs';
import { useOrganizations } from './use-organizations';
import { useState } from 'react';

const updateOrganization = (update) => api.v1.auth().patch('/organizations', update);
const generateInviteToken = () => api.v1.auth().patch('/organizations/invite-token');

const useOrganization = () => {
    const { organization, setOrganization } = useOrganizations();
    const [inviteToken, setInviteToken] = useState(null);

    const _generateInviteToken = () => {
        generateInviteToken().then((response) => setInviteToken(response.data.data));
    };

    const _updateOrganization = (update) => {
        updateOrganization(update).then((response) => {
            setOrganization(response.data.data);
        });
    };

    return {
        updateOrganization: _updateOrganization,
        inviteToken,
        generateInviteToken: _generateInviteToken,
        organization
    };
};

export { useOrganization };
