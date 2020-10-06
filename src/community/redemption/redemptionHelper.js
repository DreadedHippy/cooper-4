export default class RedemptionHelper {
    static async handleRedemptionEmbed(msg, targetUser, reqVotes) {
        const avatarURL = UsersHelper.avatar(targetUser);
    
        // Create redemption embed, with democratic vote.
        const content = embedHelper({
        title: `${targetUser.username}, you are being considered for approval!`,
        description: `
            To gain entry, you require ${reqVotes} (2.5%) of the community members to consent.
    
            Tips for acquiring votes:
            - Post an intro
            - Pretend you're a good egg
            - ||Bribes||
            - Chicken puns
    
            Approval Voting (Via Emoji Reactions)
            - Approve -> ${forEmoji}
            - Reject -> ${againstEmoji}
    
            ||Note: If user is not approved within ${votingDuration} minutes, they will be automatically removed.||
        `,
        thumbnail: avatarURL
        });
        
        const embedMessage = await msg.embed(content);
    
        setTimeout(() => { embedMessage.react(forEmoji) }, 333);
        setTimeout(() => { embedMessage.react(againstEmoji) }, 666);
    
        return embedMessage
    }
}