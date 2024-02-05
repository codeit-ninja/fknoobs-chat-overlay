<script lang="ts">
    import { parseMessage } from '$lib/utils';
    import { env } from '$env/dynamic/public';
    import tmi from 'tmi.js';

    const messages = $state<string[]>([])
    const client = new tmi.Client({
        options: { debug: false },
        channels: [env.PUBLIC_BROADCASTER_NAME]
    })

    client.connect().catch(console.log)
    client.on('message', (channel, tags, message) => messages.push( parseMessage( message, tags ) ))
</script>

<div class="container">
    <div class="chat">
        {#each messages as message}
            <div class="chat--message animate__animated animate__fadeIn">
                {@html message}
            </div>
        {/each}
    </div>
</div>