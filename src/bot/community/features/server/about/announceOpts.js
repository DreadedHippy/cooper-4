
// import KEY_MESSAGES from '../../../core/config/keymessages.json';

export default class AnnouncementOpts {

    static keyInfoToggle(reaction, user) {

        try {
            console.log('keyInfoToggle', reaction.message.id, user.username);
        } catch(e) {
            console.log('Error with key info pings toggle.');
            console.error(e);
        }
    }
    static newsletterToggle(reaction, user) {
        console.log('newsletterToggle', reaction.message.id, user.username);
        return 1;
    }
    static announcementSubToggle(reaction, user) {
        console.log('announcementSubToggle', reaction.message.id, user.username);
        return 1;
    }
    static privacyBomb(reaction, user) {
        console.log('privacyBomb', reaction.message.id, user.username);
        return 1;
    }
    
}