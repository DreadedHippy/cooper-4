export default (discordClient) => {
    discordClient
        .on('error', console.error)
        .on('warn', console.warn)
        .on('debug', console.log)
        .on('ready', () => { console.log(`Logged in as ${discordClient.user.username}`); })
        .on('disconnect', () => { console.warn('Disconnected!'); })
        .on('reconnecting', () => { console.warn('Reconnecting...'); });
}
