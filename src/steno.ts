interface ILogLevel {
    error: boolean;
    warn: boolean;
    info: boolean;
    log: boolean;
    perf: boolean;
}

interface ISteno {
    initSteno(namespace: string, logLevel?: string): ISteno;
    setLogLevel(logLevelStr: string): ISteno;
    flush(): ISteno;
    error(args: any[]): ISteno;
    warn(args: any[]): ISteno;
    info(args: any[]): ISteno;
    log(args: any[]): ISteno;
    perf(args: any[]): ISteno;
}

let prefix: string = '';
const perfPrefix: string = '[perf]';
const perfBuffer: any[] = [];
const levels: ILogLevel = {
    error: true,
    warn: false,
    info: false,
    log: false,
    perf: true
};

function applyLogLevel(newLevels: ILogLevel): ILogLevel {
    return Object.assign(levels, newLevels);
}

function parseLogLevel(logLevelStr: string): ILogLevel {
    const levelsStrs = logLevelStr.split(',');
    const newLevels: any = {};
    const disableAll = levelsStrs[0] === 'none';
    const enableAll = levelsStrs[0] === 'all';

    if (disableAll || enableAll) {
        Object.keys(levels).forEach((level) => {
            newLevels[level] = enableAll || false;
        });

        return newLevels;
    }

    levelsStrs.forEach((levelStr) => {
        if (levelStr.startsWith('+')) {
            newLevels[levelStr.substring(1)] = true;
        } else if (levelStr.startsWith('-')) {
            newLevels[levelStr.substring(1)] = false;
        }
    });

    return newLevels;
}

function setLogLevel(logLevelStr: string): ISteno {
    const newLevels = parseLogLevel(logLevelStr);

    applyLogLevel(newLevels);

    return steno;
}

function readLogLevelFromArgs(): string | null {
    if (!process || !process.argv) {
        return null;
    }

    const processLogLevelParam = process.argv.find(arg => arg.startsWith('--logLevel'));

    if (!processLogLevelParam) {
        return null;
    }

    const [, processLogLevel] = processLogLevelParam.split('=');

    return processLogLevel || null;
}

function readLogLevelFromEnv(): string | null {
    if (!process || !process.env) {
        return null;
    }

    return process.env.LOG_LEVEL || null;
}

function readInitialLogLevel(): ISteno {
    const envLogLevel = readLogLevelFromEnv();

    if (envLogLevel) {
        return setLogLevel(envLogLevel);
    }

    const argsLogLevel = readLogLevelFromArgs();

    if (argsLogLevel) {
        return setLogLevel(argsLogLevel);
    }

    return steno;
}

function initSteno(namespace: string, logLevel?: string) {
    prefix = `[${namespace}]`;

    if (logLevel) {
        setLogLevel(logLevel);
    }

    return steno;
}

function error(...args: any[]) {
    if (levels.error) {
        console.error(prefix, ...args);
    }

    return steno;
}

function warn(...args: any[]) {
    if (levels.warn) {
        console.warn(prefix, ...args);
    }

    return steno;
}

function info(...args: any[]) {
    if (levels.info) {
        console.info(prefix, ...args);
    }

    return steno;
}

function log(...args: any[]) {
    if (levels.log) {
        console.log(prefix, ...args);
    }

    return steno;
}

function perf(...args: any[]) {
    if (levels.perf) {
        perfBuffer.push(args);
    }

    return steno;
}

function flush() {
    if (!perfBuffer.length) {
        return;
    }

    while (perfBuffer.length) {
        console.log(prefix, perfPrefix, ...perfBuffer.shift());
    }

    return steno;
}

const steno: ISteno = {
    initSteno,
    setLogLevel,
    flush,
    error,
    warn,
    info,
    log,
    perf
};

// read and set initial values
readInitialLogLevel();

export default steno;
