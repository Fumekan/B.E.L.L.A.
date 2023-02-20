// Importujeme potřebné moduly
const Discord = require('discord.js');
const client = new Discord.Client();

// Prefix pro příkazy
const prefix = '!';

// Připojíme se k Discord API
client.on('ready', () => {
    console.log('B.E.L.L.A. je online!');
    client.user.setStatus('available')
    client.user.setPresence({
        activity: {
          name: '!help',
          type: 'PLAYING'
        },
        status: 'online'
      })   
});

// Reakce na zprávy
client.on('message', message => {
    // Loguji vstup
    var date=new Date();  
    var s=date.getSeconds();
    var m=date.getMinutes();
    var h=date.getHours();
    var day=date.getDate();  
    var month=date.getMonth()+1;  
    var year=date.getFullYear();   
    console.log(year + '/' + month + '/' + day + ' - ' + h + ':' + m + ':' + s + '|' + message.guild.name + '|' + message.channel.name + '|' + message.author.username + ': ' + message.content);

    // Pokud zpráva nezačíná prefixem, nic se nestane
    if (!message.content.startsWith(prefix)) return;
    // Rozdělíme zprávu na jednotlivé slova
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // Vyhodnotíme příkaz
    if (command === 'ping') {
        // Vytvoříme embed zprávu
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Pong!')
            .setDescription(`Čas odezvy: ${Math.round(client.ws.ping)}ms`);
  
        // Odešleme embed zprávu
        message.channel.send(embed);
    }

    // Vyvolání příkazu "help"
    else if (command === "help") {
        // Vytvoření embed rámečku s popisem funkcí
        const embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("B.E.L.L.A. Help")
            .setDescription("Následující příkazy jsou k dispozici:")
            .addFields(
                { name: "!ping", value: "Vrátí čas odezvy bota." },
                { name: "!say <text>", value: "B.E.L.L.A. bude říkat zadaný text." },
                { name: "!user", value: "Vrátí informace o uživateli, který příkaz odeslal." },
                { name: "!server", value: "Vrátí informace o serveru, na kterém je běží." },
                { name: "!clear <počet>", value: "Vymaže zadaný počet předchozích zpráv." },
                { name: "!author", value: "Vrátí informace o autorovi tohoto bota." },
                { name: "!help", value: "Zobrazí příkazy bota." },
            )
            .setFooter("Vytvořeno B.E.L.L.A.");

        // Odeslání embed rámečku
        message.channel.send(embed);
    } 
    
    // Funkce say
    else if (command === 'say') {
        // Získáme text, který má být odeslán
        const text = args.join(' ');
  
        // Vytvoříme embed zprávu
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setDescription(text);
  
        // Odešleme embed zprávu
        message.channel.send(embed);
    }

    // Kontrola, jestli bylo zadáno příkaz 'user'
    else if (command === "user") {
        // Vytvoř embed rámeček
        const embed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`Informace o uživateli ${message.author.username}`)
        .setDescription(`ID: ${message.author.id}`)
        .addFields(
            { name: "Nick", value: message.author.username },
            { name: "Tag", value: message.author.tag },
            { name: "Zobrazované jméno", value: message.member.displayName },
            { name: "Bot", value: message.author.bot }
        );

        // Odešli odpověď v embed rámečku
        message.channel.send(embed);
    }

    // Funkce pro zobrazování informací o serveru
    else if (command === 'server') {
        const serverEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Informace o serveru ${message.guild.name}`)
            .addFields(
                { name: 'Název', value: message.guild.name, inline: true },
                { name: 'Vlastník', value: message.guild.owner.user.username, inline: true },
                { name: 'Uživatelé', value: message.guild.memberCount, inline: true },
                { name: 'Region', value: message.guild.region, inline: true },
                { name: 'Vytvořen', value: message.guild.createdAt.toLocaleString(), inline: true }
            );
        message.channel.send(serverEmbed);
    }

    // Funkce pro mazání zpráv
   else if (command === 'clear') {
        // Check if user has permission to manage messages
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            // Vytvoření embed zprávy
            const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Clear')
            .setDescription('You don\'t have permission to use this command.')
            .setTimestamp();

            // Odeslání embed zprávy
            message.channel.send(embed);
        }
    
        // Check if number of messages to delete is specified
        if (!args.length) {
            // Vytvoření embed zprávy
            const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Clear')
            .setDescription('Please specify the number of messages to delete.')
            .setTimestamp();

            // Odeslání embed zprávy
            message.channel.send(embed);
        }
    
        // Delete specified number of messages
        message.channel.bulkDelete(args[0]).catch(error => {
          console.error(error);
          // Vytvoření embed zprávy
            const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Clear')
            .setDescription('Please specify the number of messages to delete.')
            .setTimestamp();

            // Odeslání embed zprávy
            message.channel.send(embed);
        });
      }

      // Zpracování příkazu 'author'
    else if (command === 'author') {
        // Vytvoření embed zprávy
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Autor')
            .setDescription('Jméno autora je Jiří Krahula.')
            .setTimestamp();

        // Odeslání embed zprávy
        message.channel.send(embed);
    }
});

// Přihlášení k Discord API
client.login('YOUR-TOKEN-HERE');
