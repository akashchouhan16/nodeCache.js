import { log, warn, error } from 'console'


const formatOptions = {
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: true,
};

export default class Logger {
    constructor(options = {}) {
        this.type = options.type ? options.type : "info";
        this.message = options.message ? options.message : "";
        this.mode = options.mode ? options.mode : "default";
        this.behaviour = options.behaviour ? options.behaviour : "std";
        // [std : standard logging, exp : explicit causes the process to exit/terminate in case of fatal errors]
    }
    setType(type) {
        if (!type) return;
        this.type = type;
    }
    setMessage(message) {
        if (!message) return;
        this.message = message;
    }
    setMode(mode) {
        if (!mode) return;
        this.mode = mode;
    }

    log(value, options = {}) {
        const mergedOptions = {
            type: this.type,
            message: this.message,
            mode: this.mode,
            behaviour: this.behaviour,
            ...options
        };

        if (typeof value !== 'string') {
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            } else {
                value = String(value);
            }
        }

        const date = new Date().toLocaleString('en-US');

        switch (mergedOptions.type) {
            case 'default':
            case 'info':
                console.log(`[Info] ${date}: ${value || mergedOptions.message}`);
                break;
            case 'error':
                console.error(`[Error] ${date}: ${value || mergedOptions.message}`);
                break;
            case 'warn':
                console.warn(`[WARN] ${date}: ${value || mergedOptions.message}`);
                break;
            case 'fatal':
                console.error(`[FATAL] ${date}: ${value || mergedOptions.message}`);
                if (mergedOptions.behaviour === 'exp') {
                    process.exit(1);
                }
                break;
            default:
                break;
        }
    }
}