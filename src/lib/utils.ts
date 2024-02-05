import type { ChatUserstate } from "tmi.js";
import { page } from '$app/stores';
import { browser } from "$app/environment";
import { get } from "svelte/store";

export type TokenData = {
    access_token: string;
    expires_in: number;
    token_type: string;
}

export const parseMessage = (message: string, tags: ChatUserstate) => {
    if( ! browser ) {
        return message;
    }

    let badges: string[] = [];
    const { data } = get( page )

    if( tags.emotes ) {
        message = parseEmotes( message, tags.emotes )
    }

    if( tags.badges ) {
        Object.keys(tags.badges).forEach(key => {
            badges.push( data.badges[key][tags.badges![key]!] )
        })
    }

    return `
        <span class="user">
            ${badges.map(badge => `<img src="${badge}" />`).toString().replaceAll(',', '')}
            <span class="username" style="color: ${tags.color}">${tags.username}:</span>
        </span>
        <span class="message">
            ${message}
        </span>
    `;
}

export const parseEmotes = ( message: string, emotes:{ [emoteid: string]: string[] } ) => {
    const stringReplacements: { stringToReplace: string, replacement: string }[] = [];

    Object.entries(emotes).forEach(([id, positions]) => {
        const position = positions[0];
        const [start, end] = position.split("-");
        const stringToReplace = message.substring(
            parseInt(start, 10),
            parseInt(end, 10) + 1
        );

        stringReplacements.push({
            stringToReplace: stringToReplace,
            replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/3.0">`,
        });
    });

    return stringReplacements.reduce(
        (acc, { stringToReplace, replacement }) => {
            // obs browser doesn't seam to know about replaceAll
            return acc.split(stringToReplace).join(replacement);
        },
        message
    );
}