module.exports.run =async(bot, message, args)=>{
    message.delete()
    let botmessage = args.join(" ")
    message.channel.send(botmessage)
}

module.exports.help ={
    name: "say"
}