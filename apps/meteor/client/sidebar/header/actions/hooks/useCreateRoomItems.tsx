import { useTranslation, useSetting, useAtLeastOnePermission } from '@rocket.chat/ui-contexts';

import CreateDiscussion from '../../../../components/CreateDiscussion';
import type { GenericMenuItemProps } from '../../../../components/GenericMenuItem';
import { useIsEnterprise } from '../../../../hooks/useIsEnterprise';
import CreateChannelWithData from '../../CreateChannel';
import CreateDirectMessage from '../../CreateDirectMessage';
import CreateTeam from '../../CreateTeam';
import MatrixFederationSearch from '../../MatrixFederationSearch';
import { useCreateRoomModal } from '../../hooks/useCreateRoomModal';

const CREATE_CHANNEL_PERMISSIONS = ['create-c', 'create-p'];
const CREATE_TEAM_PERMISSIONS = ['create-team'];
const CREATE_DIRECT_PERMISSIONS = ['create-d'];
const CREATE_DISCUSSION_PERMISSIONS = ['start-discussion', 'start-discussion-other-user'];

export const useCreateRoomItems = (): GenericMenuItemProps[] => {
	const t = useTranslation();
	const discussionEnabled = useSetting('Discussion_enabled');

	const canCreateChannel = useAtLeastOnePermission(CREATE_CHANNEL_PERMISSIONS);
	const canCreateTeam = useAtLeastOnePermission(CREATE_TEAM_PERMISSIONS);
	const canCreateDirectMessages = useAtLeastOnePermission(CREATE_DIRECT_PERMISSIONS);
	const canCreateDiscussion = useAtLeastOnePermission(CREATE_DISCUSSION_PERMISSIONS);

	const createChannel = useCreateRoomModal(CreateChannelWithData);
	const createTeam = useCreateRoomModal(CreateTeam);
	const createDiscussion = useCreateRoomModal(CreateDiscussion);
	const createDirectMessage = useCreateRoomModal(CreateDirectMessage);
	const searchFederatedRooms = useCreateRoomModal(MatrixFederationSearch);

	const { data } = useIsEnterprise();
	const isMatrixEnabled = useSetting('Federation_Matrix_enabled') && data?.isEnterprise;

	const createChannelItem: GenericMenuItemProps = {
		id: 'channel',
		content: t('Channel'),
		icon: 'hashtag',
		onClick: () => {
			createChannel();
		},
	};
	const createTeamItem: GenericMenuItemProps = {
		id: 'team',
		content: t('Team'),
		icon: 'team',
		onClick: () => {
			createTeam();
		},
	};
	const createDirectMessageItem: GenericMenuItemProps = {
		id: 'direct',
		content: t('Direct_Messages'),
		icon: 'balloon',
		onClick: () => {
			createDirectMessage();
		},
	};
	const createDiscussionItem: GenericMenuItemProps = {
		id: 'discussion',
		content: t('Discussion'),
		icon: 'discussion',
		onClick: () => {
			createDiscussion();
		},
	};
	const matrixFederationSearchItem: GenericMenuItemProps = {
		id: 'matrix-federation-search',
		content: t('Federation_Search_federated_rooms'),
		icon: 'magnifier',
		onClick: () => {
			searchFederatedRooms();
		},
	};

	return [
		...(canCreateChannel ? [createChannelItem] : []),
		...(canCreateTeam ? [createTeamItem] : []),
		...(canCreateDirectMessages ? [createDirectMessageItem] : []),
		...(canCreateDiscussion && discussionEnabled ? [createDiscussionItem] : []),
		...(isMatrixEnabled ? [matrixFederationSearchItem] : []),
	];
};
