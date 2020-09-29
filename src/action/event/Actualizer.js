//Actualizer.js//
const {Database} = require("../../database/Database.js");
const discord = require("discord.js");
let start = 0;

class Actualizer {
    constructor(message, config, language, client) {
        this.message = message;
        this.args = message.content.slice().split(/ /);
        this.config = config;
        this.prefix = config.discord.prefix;
        this.db = new Database(config);
        this.client = client;
    }

    createChannels(gangId) {
        this.db.connection().query(`SELECT * FROM gangs WHERE id = "${gangId}"`, (err, rows) => {
            if(err) throw err;
            if(rows.length >= 1) {
                // no gang, create the role
                this.message.guild.roles.create({
                    data: {
                        name: rows[0].name,
                        color: "BLUE",
                        mentionable: true
                    },
                    reason: `Created for the gang ${rows[0].name}`
                }).then(async role => {
                    // query discord_gang
                    this.db.connection().query(`INSERT INTO discord_gang (discordRoleId, gangId) VALUES ("${role.id}", "${gangId}")`, (err) => {
                        if(err) throw err;
                    });
                    await this.message.guild.channels.create(rows[0].name, {
                        type: "category",
                        permissionOverwrites: [
                            {
                                id: this.message.guild.roles.cache.find(role => role.name === "@everyone").id,
                                deny: ["VIEW_CHANNEL"]
                            },
                            {
                                id: role.id,
                                allow: [
                                    "VIEW_CHANNEL",
                                    "SEND_MESSAGES",
                                    "ATTACH_FILES",
                                    "READ_MESSAGE_HISTORY",
                                    "ADD_REACTIONS",
                                    'EMBED_LINKS'
                                ]
                            }
                        ]
                    }).then(async channel => {
                        await this.message.guild.channels.create("general", {
                            type: "text",
                            parent: channel.id,
                            permissionOverwrites: [
                                {
                                    id: this.message.guild.roles.cache.find(role => role.name === "@everyone").id,
                                    deny: ["VIEW_CHANNEL"]
                                },
                                {
                                    id: role.id,
                                    allow: [
                                        "VIEW_CHANNEL",
                                        "SEND_MESSAGES",
                                        "ATTACH_FILES",
                                        "READ_MESSAGE_HISTORY",
                                        "ADD_REACTIONS",
                                        'EMBED_LINKS'
                                    ]
                                }
                            ]
                        }).then().catch(console.error);

                        await this.message.guild.channels.create("market", {
                            type: "text",
                            parent: channel.id,
                            permissionOverwrites: [
                                {
                                    id: this.message.guild.roles.cache.find(role => role.name === "@everyone").id,
                                    deny: ["VIEW_CHANNEL"]
                                },
                                {
                                    id: role.id,
                                    allow: [
                                        "VIEW_CHANNEL",
                                        "SEND_MESSAGES",
                                        "ATTACH_FILES",
                                        "READ_MESSAGE_HISTORY",
                                        "ADD_REACTIONS",
                                        'EMBED_LINKS'
                                    ]
                                }
                            ]
                        }).then().catch(console.error);

                        await this.message.guild.channels.create("war-room", {
                            type: "text",
                            parent: channel.id,
                            permissionOverwrites: [
                                {
                                    id: this.message.guild.roles.cache.find(role => role.name === "@everyone").id,
                                    deny: ["VIEW_CHANNEL"]
                                },
                                {
                                    id: role.id,
                                    allow: [
                                        "VIEW_CHANNEL",
                                        "SEND_MESSAGES",
                                        "ATTACH_FILES",
                                        "READ_MESSAGE_HISTORY",
                                        "ADD_REACTIONS",
                                        'EMBED_LINKS'
                                    ]
                                }
                            ]
                        }).then().catch(console.error);
                    }).catch(console.error);
                }).catch(console.error);
            }
        })
    }

    command() {
        if(this.message.channel.type !== "dm" && this.message.author.id !== this.client.user.id) {
            if(this.message.guild.member(this.message.author.id).hasPermission("ADMINISTRATOR") && start === 0) {
                if(this.args[0] === this.prefix + "start") {
                    setInterval(() => {
                        this.db.connection().query(`SELECT * FROM gangs`, (err, rows) => {
                            if(err) throw err;
                            let gangsTable = rows;
                            this.db.connection().query(`SELECT * FROM discord_gang`, (err, rows) => {
                                if(err) throw err;
                                let discordGangs = [];

                                for(let i = 0; rows.length > i; i++) {
                                    discordGangs.push(rows[i].gangId)
                                }

                                for(let i = 0; gangsTable.length > i; i++) {
                                    if(!discordGangs.includes(`${gangsTable[i].id}`)) {
                                        // not on the server.
                                        this.createChannels(gangsTable[i].id);
                                    }
                                }
                            });
                        });
                    }, 10000);
                }
            }
        }
    }
}
module.exports = {
    Actualizer
}
