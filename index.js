const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const settings = require("./settings.js");
const logger = require("./utils/logger.js");
const { printBanner } = require("./utils/banner.js");
const { loadCommands } = require("./handlers/commandHandler.js");
const { loadEvents } = require("./handlers/eventHandler.js");
const { loadPrefixCommands } = require("./handlers/prefixCommandHandler.js");
const { setupMusic } = require("./utils/music.js");

printBanner();

if (!settings.token || settings.token === "MASUKKAN_TOKEN_BOT_DISINI") {
    logger.error("Token bot belum diisi! Buka settings.js dan isi 'token' dengan token bot kamu.");
    process.exit(1);
}
if (!settings.clientId || settings.clientId === "MASUKKAN_CLIENT_ID_DISINI") {
    logger.error("Client ID belum diisi! Buka settings.js dan isi 'clientId' dengan Application ID bot kamu.");
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Channel, Partials.Message, Partials.GuildMember, Partials.Reaction, Partials.User]
});

client.commands = new Collection();
client.pendingBroadcasts = new Collection();

loadCommands(client);
loadEvents(client);
loadPrefixCommands();
setupMusic(client);

process.on("unhandledRejection", (err) => {
    logger.error(`Unhandled promise rejection: ${err?.stack || err}`);
});
process.on("uncaughtException", (err) => {
    logger.error(`Uncaught exception: ${err?.stack || err}`);
});

client.login(settings.token).catch((err) => {
    logger.error(`Gagal login: ${err.message}`);
    process.exit(1);
});

module.exports = client;
