const cooperImageURL = 'https://cdn.discordapp.com/avatars/725035445997535253/824672497ce1f76aa350f4c066685101.png';

export default (params) => { return {
    title: params.title,
    color: 0x0099ff,
    author: {
        name: 'The Coop',
        icon_url: cooperImageURL,
        url: 'https://thecoop.group',
    },
    description: params.description,
    thumbnail: {
        url: params.thumbnail || cooperImageURL,
    },
    fields: params.fields || [],
    image: params.image || null,
    timestamp: new Date(),
    footer: {
        text: 'The best server on Discord, because you\'re here!',
        icon_url: cooperImageURL,
    }
}};