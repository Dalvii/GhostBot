# GhostBot
A Discord.JS program to access your bot servers and DMs in a dedicated Discord server

Dedicated server view:

<img src="https://github.com/Dalvii/GhostBot/blob/main/images/dm.PNG?raw=true" width="70%"></img>

<img src="https://github.com/Dalvii/GhostBot/blob/main/images/channels.PNG?raw=true" width="70%"></img> 

User view:

<img src="https://github.com/Dalvii/GhostBot/blob/main/images/dm2.png?raw=true" width="30%"></img>

<img src="https://github.com/Dalvii/GhostBot/blob/main/images/server.PNG?raw=true" width="50%"></img>

## :ledger: Index

- [About](#beginner-about)
- [Run](#electric_plug-installation)
- [Configuration](#configuration)
  - [Pre-Requisites](#pre-requisites)
  - [Config File](#wrench-config-file)
- [To do](#nut_and_bolt-to-do)
- [FAQ](#question-faq)

##  :electric_plug: Run
- To run the program, simply type this command, or open `windows_start.bat` if you're on windows.

```
$ node ./main.js
```

##  Configuration
First, you need to configure `./config.json`:

If you wish setup manualy by editing the config file, set `"setup": 1`, otherwise
during first startup, the program will ask you requiered information

###  Pre-Requisites

First you need to create a new server that will be used as the alternative Bot client.

Then create 3 mandatory channels that you need to specify in the [config file](#Config-File):
- Config channel

![Menu Channel](https://github.com/Dalvii/GhostBot/blob/main/images/menu.PNG?raw=true)
- DM category

![DM category](https://github.com/Dalvii/GhostBot/blob/main/images/dm_menu.PNG?raw=true)
- Channel category

![DM category](https://github.com/Dalvii/GhostBot/blob/main/images/channels_menu.PNG?raw=true)

###  :wrench: Config File

| Option | Default | Explanation
|------------|-------|------|
| `lang` | `FR` | Program language, you can choose between `FR` (French\Français) and `EN` (English).
| `token` | `XXXX` | Your Discord Bot token.
| `serverID` | `225367516356788704` | Your dedicated Discord server ID.
| `ServerCatID` | `225367516356788704` | Your dedicated Discord server Channels category.
| `DMcatID` | `225367516356788704` | Your dedicated Discord server DM category.
| `autoDM` | `1` | If yes (1) or no (0), the bot will add a new channel when a completely new DM is recieved.
| `configChannelID` | `225367516356788704` | Your dedicated Discord server Config channel ID.
| `setup` | `0` | whether if you choose to configure the program by yourself or the program will ask you requiered infos while startup.

##  :nut_and_bolt: To do
- Add more languages
- Ability to modify/delete messages by the alternative server
- Ability to add and recieve reaction
- Add an option to choose if deleted messages are keeped in the Bot server or not
- Add audio support

## :question: FAQ
Discord? : Yes `Dalvi#3682`, maybe I'll do a Discord server 