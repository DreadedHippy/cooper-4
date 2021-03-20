
// import KEY_MESSAGES from '../../../core/config/keymessages.json';

import RolesHelper from "../../../../core/entities/roles/rolesHelper";

export default class AnnouncementOpts {

    static keyInfoToggle(reaction, user) {
        RolesHelper.toggle(user.id, 'KEY_INFO');
    }
    static newsletterToggle(reaction, user) {
        // console.log('newsletterToggle', reaction.message.id, user.username);
        // return 1;

        // Prompt user to give email in Cooper DM to get the role

        // If turn off, delete email.
    }
    static announcementSubToggle(reaction, user) {
        RolesHelper.toggle(user.id, 'SUBSCRIBER');
    }
    static privacyBomb(reaction, user) {
        console.log('privacyBomb', reaction.message.id, user.username);
        return 1;
    }
    
}