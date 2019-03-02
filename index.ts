import { rejects } from "assert";
import * as xp from 'express';
import { WallpaperScaler } from './WallpaperScaler';
import { RedditClient } from "./Reddit";
import { Waifu2x } from './Waifu2x';
import * as sharp from 'sharp';
import { writeFile, readFileSync, readdir, rename } from 'fs';
const fetch = require('node-fetch');

import { Credentials } from './RedditCredentials';

let reddit = new RedditClient(
  Credentials.clientId,
  Credentials.secret
);

reddit.callback = (reddit: RedditClient) => {
  const scaler = new WallpaperScaler();
  //Set the instance id for Waifu2x.me here 
  //scaler.waifuInstanceId = '';
  let username = 'moimart'; //Use you username
  scaler.run(reddit,username);
}

/*
async function _() {
  let w = new Waifu2x();
  
  let files = await w.getFiles().catch(err => console.log(err));

  if (files != null) {
    for (let f of files as Array<string>) {
      fetch(f)
          .then(response => response.arrayBuffer())
          .then(async (_buffer) => {
            let buffer = Buffer.from(_buffer);
            let r = Math.random().toString(36).substring(7);
            writeFile('./final-test/' + r + '.' + f.substr(f.length - 4, f.length),buffer, async (err) => {
              err && console.log(err);
            });
          }).catch(err => console.log(err));
    }
  } else {
    console.log('no files');
  }
}

_();
*/
/*
readdir('./test',async (err,files) => {
  for (let file of files) {
    let buffer = readFileSync('./test/' + file);
    
    let image = sharp(buffer);
    const metadata: sharp.Metadata = await image.metadata().catch(err => console.log(err)) as sharp.Metadata;

    if (metadata.width < 3840) {
      let w = new Waifu2x();
      let link = await w.scale(buffer,metadata);
      console.log('LINK ' + link);
    } else {
      rename('./test/' + file, './final/' + file, () => {});
      console.log('MOVED ' + file);
    }
  }
});
*/
