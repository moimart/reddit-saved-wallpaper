import {writeFile} from 'fs';
import * as sharp from 'sharp';
const fetch = require('node-fetch');
import {Post, RedditClient} from './Reddit';
import {Waifu2x} from './Waifu2x';

export class WallpaperScaler {
    private path: string = './test';  //'/Users/moimart/wp';
    async saveFromUrl(url: string): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            fetch(url)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => resolve(Buffer.from(arrayBuffer)))
                .catch(err => reject(null))
        });
    }

    saveToDisk(resolve, buffer: Buffer, reddit: RedditClient, post: Post, filePath: string) {
        writeFile(filePath, Buffer.from(buffer), async (err) => {
            err && console.log(err);
            await reddit.unsavePost(post.post['data']['name']).catch(() => console.log('could not unsave'));
            !err && resolve(filePath);
        });
    }

    async saveImage(reddit: RedditClient, post: Post): Promise<string> {

        return new Promise<string>(async (resolve, reject) => {
            let buffer = await this.saveFromUrl(post.url);

            let image = sharp(buffer);
            const metadata: sharp.Metadata = await image.metadata().catch(err => reject(err)) as sharp.Metadata;

            let r = Math.random().toString(36).substring(7);
            let filePath = this.path + '/' + r + '.' + metadata.format;

            if (metadata.width >= 3840) {
                this.saveToDisk(resolve, buffer, reddit, post, filePath);
            } else if (metadata.width > metadata.height) {
                resolve('not scaled');
                return;
                let waifu2x = new Waifu2x();

                let res = await waifu2x.scale(Buffer.from(buffer), metadata).catch(err => console.log(err));
                if (!res) {
                    return reject('waifu2x: not ok');
                }

                /*
                setTimeout(async () => {
                    buffer = await this.saveFromUrl(res as string);

                    this.saveToDisk(resolve, buffer, reddit, post, filePath);
                },20000);
                */
               resolve(res as string);
                
            }/* else {
                resolve('not ok');
            }*/
        });
    }
    async run(reddit: RedditClient) {
        try {
            let _array = await reddit.getSaved();

            for (let post of _array) {
                let file = await this.saveImage(reddit, post);
                console.log(file);
            }

        } catch (e) {
            console.log('does not work\n' + e);
        }
    }
};