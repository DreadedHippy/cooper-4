import axios from 'axios';

const clientID = '4a7e3b1215db7f1';
const clientSecret = '7e3aca3ec854dcdcead25da190e26cc3a88e6756';

export default class CDNManager {

    static accessToken = 'fdc810de5be1b2acfd88b0f1a99312b5bae19fce';
    static refreshToken = 'd1e2e50db0496d76183094dc85e9884e29237b17';
     
    static async start() {
        const config = {
            method: 'post',
            url: 'https://api.imgur.com/oauth2/token',
            data: {
                'refresh_token': this.refreshToken,
                'client_id': clientID,
                'client_secret': clientSecret,
                'grant_type': 'refresh_token'
            }
        };

        try {            
            const response = await axios(config);
            const { access_token, refresh_token } = response.data;

            this.accessToken = access_token;
            this.refreshToken = refresh_token;

        } catch(e) {
            console.error(e);
        }
    }

    static async share(imageData) {
        const config = {
            method: 'post',
            url: `https://api.imgur.com/3/gallery/image/${imageData.id}`,
            headers: { 
                'Authorization': `Bearer ${this.accessToken}`
            },
            data: {
                title: imageData.title,
                terms: 1
            }
        };

        try {            
            const response = await axios(config);
            console.log(response);

        } catch(e) {
            console.error(e);
        }
    }

    static async upload(url) {

        const config = {
            method: 'post',
            url: 'https://api.imgur.com/3/image',
            headers: { 
                'Authorization': `Bearer ${this.accessToken}`
            },
            data: {
                image: url,
                title: 'some random testtttttt',
            }
        };

        try {            
            const response = await axios(config);
            let data = null;

            if (typeof response.data !== 'undefined' && typeof response.data.data !== 'undefined') {
                data = response.data.data;
                await this.share(data);
            }

        } catch(e) {
            console.error(e);
        }
    }
}
