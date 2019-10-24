const Discord = require('discord.js')
const bot = new Discord.Client()
bot.commands = new Discord.Collection()
const tokenfile = require('./token.json')
const fs = require('fs')
const botconfig = require("./botconfig.json")
let prefix = botconfig.prefix
let cooldown = new Set()
let cdseconds = 5
fs.readdir('./commands', (err, files)=>{
    if(err)console.log(err)
    let jsfile = files.filter(f=>f.split(".").pop() ==="js")
    if(jsfile.length <= 0){
        console.log('Geen commands gevonden')
        return
    }


    jsfile.forEach((f, i)=>{
        let props = require(`./commands/${f}`)
        console.log(`${f} loaded!`)
        bot.commands.set(props.help.name, props)
    })
})

bot.on('ready', ready=>{
    console.log(`Bot is online on ${bot.guilds.size} servers`)
})




bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return
    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"))
    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefixes: botconfig.prefix
        }
    }
    let prefix = prefixes[message.guild.id].prefixes
    if (!message.content.startsWith(prefix)) return
    if (cooldown.has(message.author.id)) {
        message.delete()
        return message.reply("Je moet 5 seconden wachten voordat ik weer zin heb")
    }

    if (!message.member.hasPermission("ADMINISTRATOR")) {
        cooldown.add(message.author.id)
    }


    let messageArray = message.content.split(" ")
    let cmd = messageArray[0]
    let args = messageArray.slice(1)

    let commandfile = bot.commands.get(cmd.slice(prefix.length))
    if (commandfile) commandfile.run(bot, message, args)

    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, cdseconds * 1000)


})



bot.on('message', message=>{
    if(message.content === prefix +
'ping'){
        message.reply('pong')
    }
})

bot.login(tokenfile.token)