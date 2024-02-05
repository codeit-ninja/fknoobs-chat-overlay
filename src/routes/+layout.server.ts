import type { LayoutServerLoad } from './$types';
import { AppTokenAuthProvider } from '@twurple/auth';
import { ApiClient, HelixChatBadgeSet } from '@twurple/api';
import { PUBLIC_CLIENT_ID, PUBLIC_CLIENT_SECRET, PUBLIC_BROADCASTER_NAME } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ( { fetch } ) => {
    const authProvider = new AppTokenAuthProvider(PUBLIC_CLIENT_ID, PUBLIC_CLIENT_SECRET)
    const client = new ApiClient({ authProvider })
    
    const broadcaster = await client.users.getUserByName(PUBLIC_BROADCASTER_NAME);

    if ( ! broadcaster ) {
		error(500, 'Could not find a broadcaster with name ' + PUBLIC_BROADCASTER_NAME)
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

export const prerender = true