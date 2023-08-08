import { useEffect, useState } from 'react';
import { OrganizationContext } from './organization-context';
import { api } from '../../libs';
import { useAuth } from '../../hooks';

const getOrganizations = () => api.v1.auth().get('/organizations/my');
const select = (organization) => api.v1.auth().get(`/organizations/${organization}/select`);
const getInvites = () => api.v1.auth().get('/organizations/invites');
const acceptInvite = (invitationId) => api.v1.auth().post('/organizations/accept-invite', { invitationId });
const declineInvite = (invitationId) => api.v1.auth().post('/organizations/decline-invite', { invitationId });
const createOrganization = (title) => api.v1.auth().post('/organizations', { title });
const joinOrganization = (token) => api.v1.auth().patch('/organizations/join', { token });

function OrganizationProvider({ children }) {
    const [isNeedToUpdate, setIsNeedToUpdate] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [invites, setInvites] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { isSignedIn } = useAuth();

    const selectOrganization = async (organization) => {
        console.log('before', organization);

        if (organization) {
            await select(organization._id);
        }

        console.log('after');

        setOrganization(organization);
    };

    const _acceptInvite = (invitationId) => {
        acceptInvite(invitationId).then(() => setIsNeedToUpdate(!isNeedToUpdate));
    };

    const _declineInvite = (invitationId) => {
        declineInvite(invitationId).then(() => setIsNeedToUpdate(!isNeedToUpdate));
    };

    const onRefresh = () => {
        setIsRefreshing(true);
        setIsNeedToUpdate(!isNeedToUpdate);
    };

    const _createOrganization = async (title) => {
        const organization = await createOrganization(title);

        await selectOrganization(organization.data.data);
    };

    const _joinOrganization = async (token) => {
        const organization = await joinOrganization(token);

        console.log('organization', organization);

        await selectOrganization(organization.data.data);
    };

    useEffect(() => {
        if (!isSignedIn) return;

        Promise
            .all([
                getOrganizations().then(({ data }) => setOrganizations(data.data)),
                getInvites().then(({ data }) => setInvites(data.data))
            ])
            .then(() => {
                setIsRefreshing(false);
            });
    }, [isSignedIn, isNeedToUpdate])

    return (
        <OrganizationContext.Provider 
            value={{
                organization,
                selectOrganization,
                organizations,
                invites,
                acceptInvite: _acceptInvite,
                declineInvite: _declineInvite,
                isRefreshing,
                onRefresh,
                createOrganization: _createOrganization,
                setOrganization,
                joinOrganization: _joinOrganization
            }}
        >
            {children}
        </OrganizationContext.Provider>
    )
}

export { OrganizationProvider };
