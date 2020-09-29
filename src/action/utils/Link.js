//Link.js//
const {Database} = require("../../database/Database.js");
const discord = require("discord.js");

class Link{
    constructor(message, config, language, client) {
        this.message = message;
        this.args = message.content.slice().split(/ /);
        this.config = config;
        this.prefix = config.discord.prefix;
        this.language = language.link;
        this.db = new Database(config);
        this.client = client;
    }
    selector() {
        if(this.message.author.id !== this.client.user.id) {
            switch (this.args[0].toLowerCase()) {
                case this.prefix + "link":
                    this.link();
                    break;
                case this.prefix + "unlink":
                    this.unlink();
                    break;
            }
        }
    }
    link() {
        this.db.connection().query(`CREATE TABLE IF NOT EXISTS discord_link (discordId VARCHAR(30), ingameId VARCHAR(30))`, (err) => {
            if(err) throw err;
        });
        if(typeof this.args[1] !== "undefined") {
            if(typeof this.args[2] !== "undefined") {
                this.db.connection().query(`SELECT * FROM grpgusers WHERE id = "${this.args[1]}"`, (err, rows) => {
                    if(err) throw err;
                    let userRow = rows;
                    if(rows.length >= 1) {
                        if(rows[0].username === this.args[2]) {
                            // infos verified
                            this.db.connection().query(`CREATE TABLE IF NOT EXISTS discord_gang (discordRoleId VARCHAR(30), gangId VARCHAR(30))`, (err) => {
                                if(err) throw err;
                            });
                            this.db.connection().query(`SELECT * FROM discord_link WHERE ingameId = ${this.args[1]}`, (err, rows) => {
                                if(err) throw err;
                                if(rows.length < 1) {
                                    let user = this.message.guild.member(this.message.author.id);
                                    user.setNickname(userRow[0].username, ["Nickname changed due to link command."]).then(user => {
                                        this.message.delete().then().catch(console.error)
                                        user.send(this.language.link.messageSuccess[0]).then().catch(console.error);
                                        this.db.connection().query(`INSERT INTO discord_link (discordId, ingameId) VALUES ("${this.message.author.id}", "${userRow[0].id}")`, (err) => {
                                            if(err) throw err;
                                        })
                                        this.db.connection().query(`SELECT * FROM discord_gang WHERE gangId = "${userRow[0].gang}"`, (err , rows) => {
                                            if(err) throw err;
                                            if(rows.length >= 1) {
                                                this.message.guild.member(this.message.author.id).roles.add(rows[0].discordRoleId).then().catch(console.error);
                                                this.message.guild.member(this.message.author.id).send(this.language.link.messageSuccess[1]).then().catch(console.error);
                                            } else {
                                                // role does not exists
                                                this.db.connection().query(`SELECT * FROM gangs WHERE id = "${userRow[0].gang}"`, (err, rows) => {
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
                                                            this.db.connection().query(`INSERT INTO discord_gang (discordRoleId, gangId) VALUES ("${role.id}", "${userRow[0].gang}")`, (err) => {
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

                                                            await this.message.guild.member(this.message.author.id).roles.add(role.id).then().catch(console.error);

                                                        }).catch(console.error);
                                                    }
                                                })
                                            }
                                        });
                                    }).catch(console.error);
                                } else {
                                    this.message.delete().then().catch(console.error);
                                    this.message.channel.send(this.language.link.messageError[4]).then(message => message.delete({timeout: 10000})).catch(console.error);
                                }
                            })
                        }
                         else {
                            this.message.delete().then().catch(console.error);
                            this.message.channel.send(this.language.link.messageError[3]).then(message => message.delete({timeout: 10000})).catch(console.error);
                        }
                    } else {
                        this.message.delete().then().catch(console.error);
                        this.message.channel.send(this.language.link.messageError[2]).then(message => message.delete({timeout: 10000})).catch(console.error);
                    }
                });
            } else {
                this.message.delete().then().catch(console.error);
                this.message.channel.send(this.language.link.messageError[1]).then(message => message.delete({timeout: 10000})).catch(console.error);

            }
        } else {
            this.message.delete().then().catch(console.error);
            this.message.channel.send(this.language.link.messageError[0]).then(message => message.delete({timeout: 10000})).catch(console.error);

        }
    }
    unlink() {
        this.db.connection().query(`SELECT * FROM discord_link WHERE discordId = "${this.message.author.id}"`, (err, rows) => {
            if(err) throw err;
            if(rows.length >= 1) {
                this.db.connection().query(`SELECT * FROM grpgusers WHERE id = ${rows[0].ingameId}`, (err, rows) => {
                    if(err) throw err;
                    this.db.connection().query(`SELECT * FROM discord_gang WHERE gangId = ${rows[0].gang}`, (err, rows) => {
                        if(err) throw err;
                        if(rows.length >= 1) {
                           this.message.guild.member(this.message.author.id).roles.remove(rows[0].discordRoleId).then().catch(console.error);
                        }
                        this.db.connection().query(`DELETE FROM discord_link WHERE discordId = "${this.message.author.id}"`, (err) => {
                            if(err) throw err;
                            this.message.delete().then().catch(console.error);
                            this.message.channel.send(this.language.unlink.messageSuccess[0]).then(message => message.delete({timeout: 10000})).catch(console.error);
                        });
                    })
                });
            } else {
                this.message.delete().then().catch(console.error);
                this.message.channel.send(this.language.unlink.messageError[0]).then(message => message.delete({timeout: 10000})).catch(console.error);
            }
        })
    }
}
module.exports = {
    Link
}
