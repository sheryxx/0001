const Discord = require('discord.js')
const bot = new Discord.Client()
bot.commands = new Discord.Collection()
const tokenfile = require('./token.json')
let prefix ='>'

bot.on('ready', ready=>{
    console.log(`Bot is online on ${bot.guilds.size} servers`)
})

bot.on('message', message=>{
    if(message.content === prefix + 'ping'){
        message.reply('pong')
    }
})

bot.login(tokenfile.token)