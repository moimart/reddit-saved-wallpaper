reddit-saved-wallpaper
======

TypeScript tool to access reddit and create 4k wallpapers out of your "saved" wallpapers. 

For scaling it relies on the paid instances of https://waifu2x.me -- You'll have to get access to that yourself and 
provide the proper instance id to the scaler.

Play with the code, build it, run it and improve it.

You will need to create a personal script at https://www.reddit.com/prefs/apps/ 

Take note of the clientId and secret as you will also need to add a RedditCredentials.ts file (not included) 
exporting an instance of the following class like this:

```
class RedditCredentials {
    clientId: string = 'your client Id';
    secret: string = 'your secret';
}

export var Credentials = new RedditCredentials();
```

# BUILD AND RUN

```
$ npm run build
$ npm run start
```

A browser window will open requesting authorisation. Check your terminal output

# TO-DO (WORK IN PROGRESS)

This is very much work in progress and it is not automatically saving the scaled images yet.

