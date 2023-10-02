// Importujeme potřebné moduly
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});
const axios = require("axios");
const moment = require("moment-timezone");
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'changes.txt');
let lastFileContent = null;

// Prefix pro příkazy
const prefix = '!';

// Připojíme se k Discord API
client.on('ready', () => {
    console.log('B.E.L.L.A. je online!');

    client.user.setPresence({
        activities: [{
            name: '!help',
            type: 'PLAYING'
        }],
        status: 'online'
    });
});


// Reakce na zprávy
client.on('messageCreate', async message => {
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
        message.channel.send({ embeds: [embed] });
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
                { name: "!cr", value: "Vypíše mapy černých rytířu na serveru." },
                { name: "!notify", value: "Upozorní uživatele v zadaný čas." },
                { name: "!help", value: "Zobrazí příkazy bota." },
            )
            .setFooter({ text: "Vytvořeno B.E.L.L.A." });

        // Odeslání embed rámečku    // Vyvolání příkazu "help"

        message.channel.send({ embeds: [embed] });
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
        message.channel.send({ embeds: [embed] });
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
        message.channel.send({ embeds: [embed] });
    }

    // Funkce pro zobrazování informací o serveru
    else if (command === 'server') {
        // Načtení vlastníka serveru
        message.guild.fetchOwner().then(owner => {
            const ownerUsername = owner ? owner.user.username : "Neznámý vlastník";
            const region = message.guild.voiceStates.cache.first()?.rtcRegion || "Neznámý";
        
            const serverEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Informace o serveru ${message.guild.name}`)
                .addFields(
                    { name: 'Název', value: message.guild.name, inline: true },
                    { name: 'Vlastník', value: ownerUsername, inline: true },
                    { name: 'Uživatelé', value: message.guild.memberCount.toString(), inline: true },
                    { name: 'Region', value: region, inline: true },
                    { name: 'Vytvořen', value: message.guild.createdAt.toLocaleString(), inline: true }
                );
            message.channel.send({ embeds: [serverEmbed] });
        }).catch(error => {
            console.error("Chyba při načítání vlastníka serveru:", error);
        });
        
    }
    

    // Funkce pro mazání zpráv
   else if (command === 'clear') {
        // Check if user has permission to manage messages
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            // Vytvoření embed zprávy
            const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Clear')
            .setDescription('You don\'t have permission to use this command.')
            .setTimestamp();

            // Odeslání embed zprávy
            message.channel.send({ embeds: [embed] });
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
            message.channel.send({ embeds: [embed] });
        });
      }

      // Zpracování příkazu 'author'
    else if (command === 'author') {
        // Vytvoření embed zprávy
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Autor')
            .setDescription('Jméno autora je <@537639804079308820>.')
            .setTimestamp();

        // Odeslání embed zprávy
        message.channel.send({ embeds: [embed] });
    }

    // blok notify
    else if (command === "notify") {
        const args = message.content.split(" ");
        if (args.length !== 2) {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Notify')
                .setDescription('Invalid format. Use !notify HH:MM')
                .setTimestamp();

                message.channel.send({ embeds: [embed] });
            return;
        }

    const cas = args[1];
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(cas)) {
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Notify')
            .setDescription('Invalid time format. Use format HH:MM')
            .setTimestamp();

            message.channel.send({ embeds: [embed] });
        return;
    }

    const [hodiny, minuty] = cas.split(':');

    // Convert server time to Prague time
    const now = moment().tz('Europe/Prague');
    const scheduledTime = moment().tz('Europe/Prague').hour(hodiny).minute(minuty).second(0);

    if (scheduledTime.isBefore(now)) {
        scheduledTime.add(1, 'days'); // add 24 hours
    }

    const timeDifference = scheduledTime.diff(now);

    setTimeout(() => {
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Notify')
            .setDescription(`Time alert for ${message.author}: ${cas}`)
            .setTimestamp();

            message.channel.send({ embeds: [embed] });
    }, timeDifference);
} // konec bloku notify


else if(command === "cr") {
    const args = message.content.split(" ");
    const page = parseInt(args[1]);

    let dataUrl = "https://www.panhradu.cz/units_serialize.aspx?id_server=";

    if (isNaN(page) || page < 3 || page > 7) {
        const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('ČR')
        .setDescription('Zadejte platné číslo server (3-7).')
        .setTimestamp();

        // Odeslání embed zprávy
        message.channel.send({ embeds: [embed] });
        return;
    }

    dataUrl = dataUrl + page;

    const artifactIds = [49, 50, 51, 52, 53, 54, 55, 56];
    const artifactNames = [
        "Plášť temnoty",
        "Helma nazgůla",
        "Ohnivý meč",
        "Černá zbroj",
        "Amulet života",
        "Štít smrtihlav",
        "Černá kuš",
        "Černé holenice"
    ];
    try {
        const response = await axios.get(dataUrl);
        const dataExport = response.data.split("\n");

        const artifactUnits = dataExport.filter(row => {
            const [x, y, unitType, artifact] = row.split(">");
            const artifactId = parseInt(artifact);
            return artifactIds.includes(artifactId);
        });

        const artifactUnitLocations = artifactUnits.map(row => {
            const [x, y, unitType, artifact] = row.split(">");
            const artifactId = parseInt(artifact);
            const artifactName = artifactNames[artifactId - 49];
            return `[${x},${y}] - ${artifactName}`;
        });

        if (artifactUnitLocations.length > 0) {
            const chunkSize = 10; // velikost každého bloku embed zpráv
            const chunks = [];
            for (let i = 0; i < artifactUnitLocations.length; i += chunkSize) {
                chunks.push(artifactUnitLocations.slice(i, i + chunkSize));
            }

            const embeds = chunks.map((chunk, index) => {
                return new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle(`Nalezení černí rytíři s artefakty - Server ${page}:`)
                .setDescription(chunk.join("\n"))
                .setTimestamp();
            });

            for (const embed of embeds) {
                message.channel.send({ embeds: [embed] });
            }
        } else {
            // Vytvoření embed zprávy
            const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Nalezení černí rytíři s artefakty')
            .setDescription('Nebyly nalezeny žádné jednotky s hledanými artefakty.')
            .setTimestamp();

            // Odeslání embed zprávy
            message.channel.send({ embeds: [embed] });
        }
    } catch (error) {
        console.log(`Chyba při stahování dat: ${error.message}`);
        message.channel.send("Došlo k chybě při zpracování příkazu. Zkuste to prosím později.");
    }
}
});


// Přihlášení k Discord API
client.login('API-KEY');
