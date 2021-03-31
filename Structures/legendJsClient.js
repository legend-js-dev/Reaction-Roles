const Discord = require('discord.js');
const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { prefix } = require('../config.json');

module.exports = class legendJsClient extends Client {
	constructor(options) {
		super(options);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.prefix = prefix;
	}

	loadCommands() {
    const client = this;
		readdirSync('./commands/').forEach(dir => {
			const commands = readdirSync(`./commands/${dir}/`).filter(file =>
				file.endsWith('.js')
			);
			for (let file of commands) {
				let pull = require(`../commands/${dir}/${file}`);

				if (pull.name) {
					client.commands.set(pull.name, pull);
					console.log(`[${pull.name.toUpperCase()}]: loaded!`);
				} else {
					console.log(`[${file.toUpperCase()}]: Error`);
					continue;
				}

				if (pull.aliases && Array.isArray(pull.aliases))
					pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
			}
		});
		console.log('-------------------------------------');
		console.log('[INFO]: Commands Loaded!');
	}
};
