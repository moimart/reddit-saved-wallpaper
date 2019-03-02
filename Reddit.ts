const btoa = require('btoa');
const fetch = require('node-fetch');
const opn = require('opn');
import * as xp from 'express';

export interface Post {
    url: string,
    post: object
}

export type RedditFunction = (RedditClient:RedditClient) => void;

export class RedditClient {
    public token: string = '';
    public clientId:string = '';
    private secret:string = '';
    private app = xp();
    public code:string = '';
    public redirectUri = "";

    public callback:RedditFunction = null;

    constructor(clientId:string = "", secret:string = "", redirectUri:string = "") {
        this.clientId = clientId;
        this.secret = secret;
        this.redirectUri = redirectUri;

        this.app.get('/', async (req, res) => {
            res.send("OK");

            this.code = req.query.code;
            await this.auth();
            
            if (this.callback != null) {
                this.callback(this);
            }
        });

        this.app.listen(8080, () => {
            console.log('script started at 8080');
        });

        opn(`https://www.reddit.com/api/v1/authorize?client_id=${this.clientId}&response_type=code&state=pepe&redirect_uri=${this.redirectUri}&duration=permanent&scope=history+save`)
            .then(() => {});
    }

    async auth(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fetch('https://www.reddit.com/api/v1/access_token', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.secret),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body:
                    'grant_type=authorization_code&code=' + this.code + '&redirect_uri=' + this.redirectUri
            })
                .then((response) => response.json())
                .then((jsonResponse) => {
                    this.token = jsonResponse.access_token;
                    resolve(jsonResponse.access_token);
                })
                .catch(err => reject('notoken'));
        });
    }

    async getSaved(): Promise<Array<Post>> {
        return new Promise<Array<Post>>((resolve, reject) => {

            if (this.token == "") {
                return reject();
            }

            fetch('https://oauth.reddit.com/user/moimart/saved?limit=100&count=100', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.token
                }
            })
                .then((response) => response.json())
                .then((jsonResponse) => {
                    let urls = new Array<Post>();

                    for (let post of jsonResponse.data.children) {
                        if (post.data.url && post.data.url.match(/\.png|\.jpg/)) {
                            urls.push({ url: post.data.url, post: post });
                        }
                    }

                    resolve(urls);
                })
                .catch(err => reject(new Array<string>()));
        });
    }

    async unsavePost(id: string) {
        console.log('Post to unsave ' + id);
        return new Promise<void>((resolve, reject) => {
            fetch('https://oauth.reddit.com/api/unsave?id=' + id, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.token
                }
            })
                .then(response => response.json())
                .then(responseJson => { console.log(responseJson); resolve(); })
                .catch(err => reject(err));
        });
    }
};
