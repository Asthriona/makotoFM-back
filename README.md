# MakotoFM Backend

Welcome to the backend of my station!  
This app is made to work with the front-end made for it [Asthriona/MakotoFM-front](https://github.com/Asthriona/MakotoFM-front) But can  be used with anything with a bit of reading and code.  
It requires a full Azuracast installation, I have not tested the relays yet, so I don't know it it works or not.  

This API support multiple stations as long as they run on the same instance of Azuracast. You just have to add to the requests the SID of the station.

## Installation:
It requires nodeJS installed on your machine.
(Note: I'm not sure what minimal version of node since I haven't tested yet, but i'm running 20 on my PC, and 18 on the servers.)

```
git clone git@github.com:Asthriona/makotoFM-back.git
sudo yarn global install nodemon
cd makotoFM-back
yarn install
# To start the dev env
yarn dev
```

Before starting set up the config.json file.
```json
{
    "port": 5400,
    "radioAPI": "https://broadcaster.yourstation.com/api",
    "radioHost": "https://broadcaster.yourstation.com"
}
```
Edit the `port` to your liking.  
`radioHost` will be your azuracast instance.  
`radioAPI` is the same as `radioHost` but with the API route. This will be changed in the future.  

## Contribute
Feel free to open PR requests I'll gladly review them and merge if it fits!