import type { LayoutServerLoad } from './$types';
import { AppTokenAuthProvider } from '@twurple/auth';
import { ApiClient, HelixChatBadgeSet } from '@twurple/api';
import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ( { fetch } ) => {
    const authProvider = new AppTokenAuthProvider(env.PUBLIC_CLIENT_ID, env.PUBLIC_CLIENT_SECRET)
    const client = new ApiClient({ authProvider })
    
    const broadcaster = await client.users.getUserByName(env.PUBLIC_BROADCASTER_NAME);

    if ( ! broadcaster ) {
		error(500, 'Could not find a broadcaster with name ' + env.PUBLIC_BROADCASTER_NAME)
	}

    const globalBadgesRaw = await client.chat.getGlobalBadges()
    const channelBadgesRaw = await client.chat.getChannelBadges(broadcaster)

    const badges: Record<string, any> = {}
    
    const parseBadges = ( set: HelixChatBadgeSet[] ) => {
        set.forEach(badge => {
            badges[badge.id] = {}
    
            badge.versions.forEach(version => {
                badges[badge.id][version.id] = version.getImageUrl(4)
            })
        })
    }

    parseBadges( globalBadgesRaw )
    parseBadges( channelBadgesRaw )

    return {
        badges
    }
}