// Response to redemption offer accepted.
try {
    if (msg.channel.type !== 'dm') await msg.reply('Redeeeeeeeeeeeeemed.');
    await msg.direct('You have been approved for The Coop, and now have full access as a member!');
    
} catch(err) {
    console.log('Unable to send user approval DM.')
}