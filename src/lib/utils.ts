import type { ChatUserstate } from "tmi.js";

export const parseMessage = (message: string, tags: ChatUserstate) => {
    if( tags.emotes ) {
        const stringReplacements: { stringToReplace: string, replacement: string }[] = [];

        Object.entries(tags.emotes).forEach(([id, positions]) => {
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

        message = stringReplacements.reduce(
            (acc, { stringToReplace, replacement }) => {
                // obs browser doesn't seam to know about replaceAll
                return acc.split(stringToReplace).join(replacement);
            },
            message
        );
    }

    console.log(tags)

    return `<span class="username" style="color: ${tags.color}">${tags.username}:</span> ${message}`;
}