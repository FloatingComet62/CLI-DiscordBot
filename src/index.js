#!/usr/bin/env node

import discord from 'discord.js'
import chalk from 'chalk'
import fs from 'fs'
import cli from './cli.js'
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))

const Client = new discord.Client({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES'
    ]
})
let currentChannel = config.default_channel

async function sendMessage(){
    const response = await cli.Question(">")
    if (response == "EXIT") process.exit(0)
    else if (response == "CHANGE CHANNEL"){
        await changeChannel()
        return "CHANNEL CHANGED"
    }
    else return response
}
async function changeChannel(){
    let channelName = await cli.Question("Which Channel? >")
    channelName = channelName.split(' ').join('-')
    const channelList = Client.channels.cache.filter(channel => channel.name.includes(channelName))
    const channelList_Name = channelList.map(channel => channel.name)
    const channelList_Guild = channelList.map(channel => channel.guild)
    const channelList_Id = channelList.map(channel => channel.id)
    let channelListPathed = []
    for(let i = 0;i<channelList_Id.length;i++){
        channelListPathed.push(`${channelList_Guild[i]}/${channelList_Name[i]} [${channelList_Id[i]}]`)
    }
    const selectedChannel = await cli.askWtihOptions("Choose which channel?", channelListPathed)
    const selectedChannel_Id = channelList_Id[channelListPathed.indexOf(selectedChannel)]
    currentChannel = selectedChannel_Id
}

Client.on('ready', async()=>{
    console.log(`Bot is online!`)

    while(true){
        const response = await sendMessage()
        const channel = Client.channels.cache.find(channel => channel.id == currentChannel)
        if (response != "CHANNEL CHANGED"){
            channel.send(response)
        }
    }
})

Client.on('messageCreate', async(message)=>{
    let output = ""

    if (message.channel.id != currentChannel) return
    if (message.author.bot) output += chalk.red("{BOT} ")
    if (message.author.system) output += chalk.red("{SYSTEM} ")
    output += chalk.cyan(`[${message.author.username}] `)
    output += chalk.yellow(`${message.content}`)

    if (message.author.id != Client.user.id) console.log(output)
})

Client.login(config.token)