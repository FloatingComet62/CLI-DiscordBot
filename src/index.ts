#!/usr/bin/env node

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string
            DEFAULT_CHANNEL: string
        }
    }
}

import { ChannelType, Client, Collection, TextChannel, Channel } from 'discord.js'
import chalk from 'chalk'
import cli from './cli.js'
import { config } from 'dotenv'
config()

const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'MessageContent'
    ]
})
let currentChannel = process.env.DEFAULT_CHANNEL
let channel: TextChannel | null = null

client.on('ready', async () => {
    console.log(`Bot is online!`)
    updateChannel()

    while (true) {
        const response = await cli.Question(">")
        if (response == "EXIT") process.exit(0)
        else if (response == "CHANGE CHANNEL") {
            await changeChannel()
            continue
        }
        if (!channel) {
            console.log(chalk.redBright('Channel not found'))
            process.exit(0)
        }

        channel.send(response)
    }
})

client.on('messageCreate', async (message) => {
    if (message.author.id == client.user!.id) return
    if (message.channel.id != currentChannel) return

    let output = ""

    if (message.author.bot) output += chalk.red("{BOT} ")
    if (message.author.system) output += chalk.red("{SYSTEM} ")
    output += chalk.cyan(`[${message.author.username}] `)
    output += chalk.yellow(message.content)

    console.log(output)
})
async function changeChannel(): Promise<void> {
    let channelName = await cli.Question("Which Channel? >")
    channelName = channelName.split(' ').join('-')
    const channelList = client.channels.cache.filter((channel: Channel) => channel.type === ChannelType.GuildText && channel.name.includes(channelName)) as Collection<string, TextChannel>
    const channelList_Name = channelList.map(channel => channel.name)
    const channelList_Guild = channelList.map(channel => channel.guild)
    const channelList_Id = channelList.map(channel => channel.id)
    let channelListPathed: string[] = []

    for (let i = 0; i < channelList_Id.length; i++)
        channelListPathed.push(`${channelList_Guild[i]}/${channelList_Name[i]} [${channelList_Id[i]}]`)

    const selectedChannel = await cli.askWtihOptions("Choose which channel?", channelListPathed)
    const selectedChannel_Id = channelList_Id[channelListPathed.indexOf(selectedChannel)]
    currentChannel = selectedChannel_Id
    updateChannel()
}
async function updateChannel(): Promise<void> {
    channel = client.channels.cache.get(currentChannel) as TextChannel || null
}

client.login(process.env.TOKEN)