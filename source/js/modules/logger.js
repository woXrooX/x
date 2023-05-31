"use strict";

export default class Logger{
    static line(){
        // Check If Debugging Mode Is Enabled Else Exit
        if(window.CONF.default.debug === false) return;

        console.log("==========================================");
    }

    static success(text, force = false){
        Logger.#log(text, "success");
    }
    static info(text, force = false){
        Logger.#log(text, "info");
    }
    static warning(text, force = false){
        Logger.#log(text, "warning");
    }
    static error(text, force = false){
        Logger.#log(text, "error", force);
    }

    static #log(text, type, force = false){
        // Check If Debugging Mode Is Enabled And Force Is False Else Exit
        if(window.CONF.default.debug === false && force === false) return;

        // Setting Type Color
        const color = `color: ${CSS.values.color[type] || 'white'}`;

        // Generating Timestamp
        const now = new Date();
        const timestamp = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        
        // Final Output
        console.log(`%c[${timestamp}][${type.toUpperCase()}] `, color, text);

    }

}

// Log Is Alias To Logger
class Log extends Logger{}

// Make Logger And Log Usable W/O Importing It
window.Logger = Logger;
window.Log = Log;