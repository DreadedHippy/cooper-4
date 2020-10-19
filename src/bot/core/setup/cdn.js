import axios from 'axios';

const clientID = '4a7e3b1215db7f1';
const clientSecret = '7e3aca3ec854dcdcead25da190e26cc3a88e6756';

export default class CDNManager {

    static accessToken = '4dadcbdc55dc0d5f2b36a33d783af2783a951a4d';
    static refreshToken = '9b98f4b7a6183c8c4d5f669eff731bd8b668b0e7';

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

            console.log(access_token, refresh_token);

            this.accessToken = access_token;
            this.refreshToken = refresh_token;

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
                album: '75YZf6k'
            }
        };

        try {            
            const response = await axios(config);
            console.log(response);
        } catch(e) {
            console.error(e);
        }
          
    }
}
