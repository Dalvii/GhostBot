const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'USER', 'REACTION'] });
const { MessageAttachment } = require('discord.js')
const readline = require('readline');
const fs = require('fs')
const path = require('path')
const configJson = 'config.json';
const config = require('./config.json');
const lang = require('./lang.json');
const delay = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
const Commando = require('discord.js-commando')

if (!config.setup) {
    fs.readFile(configJson, 'utf8', function readFileCallback(err, data){
        configJsonData = JSON.parse(data);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(lang.lang_ask, (lang_anwser) => {
            console.log(lang_anwser === 'EN' ? lang.lang_EN.lang_set : lang.lang_FR.lang_set);
            configJsonData.lang = lang_anwser === 'EN' ? 'EN' : 'FR';

            rl.question(lang_anwser === 'EN' ? lang.lang_EN.token_ask : lang.lang_FR.token_ask , (token) => {
                console.log(lang_anwser === 'EN' ? lang.lang_EN.token_set+'**********' : lang.lang_FR.token_set+'**********');
                configJsonData.token = token;

                rl.question(lang_anwser === 'EN' ? lang.lang_EN.serverID_ask : lang.lang_FR.serverID_ask , (serverID) => {
                    console.log(lang_anwser === 'EN' ? lang.lang_EN.serverID_set+serverID : lang.lang_FR.serverID_set+serverID);
                    configJsonData.serverID = serverID;

                    rl.question(lang_anwser === 'EN' ? lang.lang_EN.serverCategory_ask : lang.lang_FR.serverCategory_ask , (serverCatID) => {
                        console.log(lang_anwser === 'EN' ? lang.lang_EN.serverCategory_set+serverCatID : lang.lang_FR.serverCategory_set+serverCatID);
                        configJsonData.ServerCatID = serverCatID;

                        rl.question(lang_anwser === 'EN' ? lang.lang_EN.DMcategory_ask : lang.lang_FR.DMcategory_ask , (DMcatID) => {
                            console.log(lang_anwser === 'EN' ? lang.lang_EN.DMcategory_set+DMcatID : lang.lang_FR.DMcategory_set+DMcatID);
                            configJsonData.DMcatID = DMcatID;

                            rl.question(lang_anwser === 'EN' ? lang.lang_EN.autoDM_ask : lang.lang_FR.autoDM_ask , (autoDM) => {
                                console.log(lang_anwser === 'EN' ? lang.lang_EN.autoDM_set : lang.lang_FR.autoDM_set);
                                configJsonData.autoDM = autoDM === 'y' || 'Y' ? 1 : 0;

                                rl.question(lang_anwser === 'EN' ? lang.lang_EN.settingsChannel_ask : lang.lang_FR.settingsChannel_ask , (configChannelID) => {
                                    console.log(lang_anwser === 'EN' ? lang.lang_EN.settingsChannel_set+configChannelID : lang.lang_FR.settingsChannel_set+configChannelID);
                                    configJsonData.configChannelID = configChannelID
                                    configJsonData.setup = 1
                                    fs.writeFile(configJson, JSON.stringify(configJsonData, null, 2), 'utf8', function readFileCallback(err, data){})
                                    rl.close();
                                    return console.log('Restart')
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

if (config.setup) {

const DMcategory = config.DMcatID;
const ServCategory = config.ServerCatID;
const adminServer = config.serverID;
const menuChannel = config.configChannelID;
const lang_conf = config.lang;
const autoDM = config.autoDM;


client.on('ready', async () => {
    console.log(`bot running ${client.user.tag}!`);
    while (client && client.token) {
        statusUpdate()
        await delay(Number(120) * 1000).catch(console.error);
    }
});

client.on('message', async message => {

    if (message.channel.type === 'dm' && !message.author.bot) {         // Message DM -> #Channel DM (+ creer channel, webhook)
        const DMusername = message.author.tag;
        const DMusernameChannel = '🟤'+DMusername.toString().toLowerCase().replace(/ +/g,'_').replace('#','♯')
        console.log('PM from '+ DMusername);
        if (client.channels.cache.find(c => c.topic === message.author.id) == null) {
            if (autoDM === 1) {
                console.log('Channel not existing -> creating...');
                client.guilds.cache.get(adminServer).channels.create(DMusernameChannel, {type: 'text'})
                    .then(channel => channel.setParent(DMcategory))
                    .then(channel => channel.setTopic(message.author.id))
                    .then(channel => channel.createWebhook(message.author.username, {avatar: message.author.avatarURL()}))
                    .then(webhook => sendDMchannel(webhook))
                    .catch(console.error);
            } else {
                console.log((lang_conf === 'EN' ? lang.lang_EN.autoDM_0_err: lang.lang_FR.autoDM_0_err));
            }
        } else {
            const channel = client.channels.cache.find(c => c.topic == message.author.id);
            const webhooks = await channel.fetchWebhooks();
            const webhook = webhooks.first();
            await sendDMchannel(webhook)
        }
        async function sendDMchannel(webhook) {
            console.log('Channel webhook send...')
            await webhook.send(message.content === '' ? '**  **' : message.content);
            if (message.attachments.size > 0) {
                const embed = new Discord.MessageEmbed().setImage(message.attachments.first().url)
                webhook.send(embed);
            }
        }
    }

    if (message.channel.type != 'dm' && message.channel.parent.id === DMcategory && !message.webhookID && !message.author.bot) {            // Message: #Channel DM -> DM
        if (message.attachments.size > 0) {
            const attachment = new MessageAttachment(message.attachments.first().url);
            client.users.cache.find(u => u.id == message.channel.topic).send(message.content, attachment);
        } else {
            client.users.cache.find(u => u.id == message.channel.topic).send(message.content)
        }
    }

    if (message.channel.type != 'dm' && message.channel.parent.id === ServCategory && !message.webhookID && !message.author.bot) {          // Message: #Channel Serv -> Bot Msg dans Serveur correspondant
        if (message.attachments.size > 0) {
            const attachment = new MessageAttachment(message.attachments.first().url);
            client.channels.cache.find(c => c.name === message.channel.name.toString().substring(2)).send(message.content, attachment);
        } else {
            client.channels.cache.find(c => c.name === message.channel.name.toString().substring(2)).send(message.content)
        }
    }

    if (message.channel.type != 'dm' && message.guild.id != adminServer && !message.webhookID && !message.author.bot) {         // Message: Autre serv -> Webhook dans #channel correspondant
        const channelServer = client.guilds.cache.get(message.guild.id).name;
        if (client.channels.cache.find(c => c.name === channelServer.substring(-channelServer.length, 1).toLowerCase()+'_'+message.channel.name)) {
            const webhooks = await client.channels.cache.find(c => c.name === channelServer.substring(-channelServer.length, 1).toLowerCase()+'_'+message.channel.name).fetchWebhooks();
            const webhook = webhooks.first();
            console.log(webhook.name)
            const msg = message.content === '' ? '**  **' : message.content
            webhook.edit({
                name: message.author.username,
                avatar: message.author.avatarURL()
            })
            .then(webhook => webhook.send(msg), message.attachments.size > 0 ? webhook.send(new Discord.MessageEmbed().setImage(message.attachments.first().url)) : console.log('pas dimg'))
            .catch(console.error);
        }
    }

    if (message.channel.id === menuChannel && !message.author.bot) {            // MENU Channel
        const command = message.content.split(/ +/g);

        if (command[0] === 'dm') {      // Commande 'DM'
            try {
                const userToDM = client.users.cache.find(u => u.tag === command[1].replace(/\^/g,' '))
                const ChannelUser = '🟤'+userToDM.username.toString().toLowerCase().replace(/ +/g,'_').replace('#','♯')
                if (client.channels.cache.find(c => c.name === ChannelUser) == null) {
                    client.guilds.cache.get(adminServer).channels.create(ChannelUser, {type: 'text'})
                        .then(channel => channel.setParent(DMcategory))
                        .then(channel => channel.setTopic(userToDM.id))
                        .then(channel => channel.createWebhook(userToDM.tag, {avatar: userToDM.avatarURL()}))
                        .then(() => message.channel.send((lang_conf === 'EN' ? lang.lang_EN.channelCreated: lang.lang_FR.channelCreated) + String((String(client.channels.cache.find(c => c.name === ChannelUser))))))
                        .catch(console.error);
                } else {
                    console.log('User deja existant')
                    message.channel.send((lang_conf === 'EN' ? lang.lang_EN.channelExisting: lang.lang_FR.channelExisting)+ String((String(client.channels.cache.find(c => c.name === ChannelUser)))))
                }
                
            } catch (e) {
                message.channel.send('Utilisateur introuvable') // A MODIF
            }
        }

        if (command[0] === 'channel') {     // Commande 'Channel'
            if (command[1] === undefined) {
                serverSearch(client, message)
            }
            else if (command[2] === undefined) {
                channelSearch(client, message, command[1].replace(/\^/g,' '))
            }
            else if (command[2] === 'add') {
                if (command[3] === 'text') {
                    serverSearch(client, message)
                } else if (command[3] === 'text') {

                } else {
                    //message.
                }
            }
            else {
                client.guilds.cache.forEach(server => {
                    if (command[1].replace(/\^/g,' ') === server.name) {
                        let success;
                        server.channels.cache.forEach(channel => {
                            if (channel.name === command[2]) {
                                const clientAdminServer = client.guilds.cache.get(adminServer)
                                const channelName = server.name.toString().substring(-server.name.toString().length, 1).toLowerCase()+'_'+command[2]
                                if (clientAdminServer.channels.cache.find(c => c.name === channelName) === undefined) {
                                    console.log('Channel inexistant -> creation... ');
                                    clientAdminServer.channels.create(channelName, {type: 'text'})
                                        .then(channel => channel.setTopic(server.name))
                                        .then(channel => channel.setParent(ServCategory))
                                        .then(channel => channel.createWebhook(channel.name, message.channel.send((lang_conf === 'EN' ? lang.lang_EN.channelCreated: lang.lang_FR.channelCreated) + String((String(channel))))))
                                } else {
                                    message.channel.send((lang_conf === 'EN' ? lang.lang_EN.channelExisting: lang.lang_FR.channelExisting)+ String((String(clientAdminServer.channels.cache.find(c => c.name === channelName)))))
                                }
                                success = 1;
                            }
                        })
                        if (success != 1) {
                            message.channel.send(lang_conf === 'EN' ? lang.lang_EN.channelNull: lang.lang_FR.channelNull)
                        }
                    }
                })
            }
        }

        if (command[0] === 'text') {      // Commande 'DM'
            if (command[1] === undefined) {
                serverSearch(client, message)
            }
            else if (command[2] === undefined) {
                channelSearch(client, message, command[1])
            } else {}
        }
    }

    // if (message.member.voice.channelID) {
    //     client.channels.cache.get(message.member.voice.channelID).join().then(connection => {
    //         connection.play(path.join(__dirname, 'i will add this in the future.mp3'))
    //     })
    // }
})

function statusUpdate() {
    const clientAdminServer = client.guilds.cache.get(adminServer)
    clientAdminServer.channels.cache.forEach(c => {
        if (c.parent == null) return
        if (c.parent.id != null && c.parent.id == DMcategory) {
            try {
                const user = client.users.cache.get(c.topic)
                const userState = user.presence.status === 'online' ? '🟢' : user.presence.status === 'idle' ? '🟠' : user.presence.status === 'dnd' ? '🔴' : user.presence.status === 'invisible' ? '⚫' : user.presence.status === 'offline' ? '⚫' : '🟤'
                c.setName(c.name.replace(/^./g, userState))
            } catch (e) {}
        }
    })
}


function serverSearch(client, message) {
    let field = [];
    const channelEmbed = new Discord.MessageEmbed().setTitle(lang_conf === 'EN' ? lang.lang_EN.serversList: lang.lang_FR.serversList)
    client.guilds.cache.forEach(server => {
        field.push(server.name)
    })
    channelEmbed.setDescription(field)
    message.channel.send(channelEmbed)
}

function channelSearch(client, message, serverToSearch) {
    let field = [];
    client.guilds.cache.forEach(server => {
        if (serverToSearch === server.name) {
            const channelEmbed = new Discord.MessageEmbed()
            .setTitle(server.name)
            server.channels.cache.forEach(channel => {
                if (channel.type === 'text') field.push(channel.name);
            })
            channelEmbed.setDescription(field)
            message.channel.send(channelEmbed)
        }
    })
}




client.on('typingStart', (channel,user) => {        // Typing retranscrption
    if (channel.type != 'dm' && channel.parent.id === ServCategory && !user.bot) {
        const channelSearchName = client.channels.cache.get(channel.id).name
        const channelName = client.channels.cache.find(c => c.name === channelSearchName.substring(2)).id
        client.channels.cache.get(channelName).startTyping()
        client.channels.cache.get(channelName).stopTyping()
    }
    if (channel.type === 'dm' && !user.bot) {
        const userDM = user.tag.toString().toLowerCase().replace('#','-').replace(' ','_').replace(' ','_');
        try {
            const channelDM = client.channels.cache.find(c => c.name === userDM).id
            client.channels.cache.get(channelDM).startTyping()
            client.channels.cache.get(channelDM).stopTyping()
        } catch {console.log('(startTyping) utilisateur na pas encore cree de channel')}
    }
  });

   

client.login(config.token)

}