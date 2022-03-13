import { Application } from "typedoc";
import fetch from "node-fetch";

interface IDiscordDocEntry{
    name: string;
    description: string;
}

interface IDiscordExtEntry{
    name: string;
    see: string[];
}

interface IDiscordDoc {
    classes: IDiscordDocEntry[];
    typedefs: IDiscordDocEntry[];
    externals: IDiscordExtEntry[];
}

export async function load(app: Application) {
    const response = await fetch("https://raw.githubusercontent.com/discordjs/docs/main/discord.js/stable.json");
    const discord_doc = await response.json() as IDiscordDoc;

    const DocBaseURL = "https://discord.js.org/#/docs/discord.js/stable";
    app.renderer.addUnknownSymbolResolver("discord.js", (name) => {
        if(discord_doc.classes.find(c => c.name === name)){
            return `${DocBaseURL}/class/${name}`;
        }
        if(discord_doc.typedefs.find(c => c.name === name)){
            return `${DocBaseURL}/typedef/${name}`;
        }
        let ext = discord_doc.externals.find(c => c.name === name);
        if(ext){
            let match = ext.see[0]?.match(/{@link (.*)}/);
            return match ? match[1] : undefined;
        }
        return;
    });
}
