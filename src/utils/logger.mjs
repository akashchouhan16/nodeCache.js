import { log, warn, error } from 'console'


const options = {
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
        let baseOptions = {
            type: this.type,
            message: this.message,
            mode: this.mode,
            behaviour: this.behaviour
        };

        if (options) {
            this.type = options.type ? options.type : this.type;
            this.message = options.message ? options.message : this.message;
            this.mode = options.mode ? options.mode : this.mode;
            this.behaviour = options.behaviour ? options.behaviour : this.behaviour;
        }
        if (typeof value !== 'string') {
            if (typeof value === 'object') value = JSON.stringify(value);
            else value = toString(value);
        }

        if (this.type === 'default' || this.type === 'info') {
            let date = new Date();
            log(`[Info] ${date.toLocaleString('en-US', options)} : ${value ? value : this.message} `);
        } else if (this.type === 'error') {
            let date = new Date();
            error(`[Error] ${date.toLocaleString('en-US', options)} : ${value ? value : this.message} `);
        } else if (this.type === 'warn') {
            let date = new Date();
            warn(`[WARN] ${date.toLocaleString('en-US', options)} : ${value ? value : this.message} `);
        } else if (this.type === 'fatal') {
            let date = new Date();
            if (this.behaviour === "exp") {
                error(`[FATAL] ${date.toLocaleString('en-US', options)} : ${value ? value : this.message} `);
                process.exit(1);
            }
            error(`[FATAL] ${date.toLocaleString('en-US', options)} : ${value ? value : this.message} `);
        }


        this.resetOptions(baseOptions);
    }

    resetOptions(options) {
        this.type = options.type;
        this.message = options.message;
        this.mode = options.mode;
        this.behaviour = options.behaviour;
    }
}