"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let prefix = '';
const perfPrefix = '[perf]';
const perfBuffer = [];
const levels = {
    error: true,
    warn: false,
    info: false,
    log: false,
    perf: true
};
function applyLogLevel(newLevels) {
    return Object.assign(levels, newLevels);
}
function parseLogLevel(logLevelStr) {
    const levelsStrs = logLevelStr.split(',');
    const newLevels = {};
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
        }
        else if (levelStr.startsWith('-')) {
            newLevels[levelStr.substring(1)] = false;
        }
    });
    return newLevels;
}
function setLogLevel(logLevelStr) {
    const newLevels = parseLogLevel(logLevelStr);
    applyLogLevel(newLevels);
    return steno;
}
function readLogLevelFromArgs() {
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
function readLogLevelFromEnv() {
    if (!process || !process.env) {
        return null;
    }
    return process.env.LOG_LEVEL || null;
}
function readInitialLogLevel() {
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
function initSteno(namespace, logLevel) {
    prefix = `[${namespace}]`;
    if (logLevel) {
        setLogLevel(logLevel);
    }
    return steno;
}
function error(...args) {
    if (levels.error) {
        console.error(prefix, ...args);
    }
    return steno;
}
function warn(...args) {
    if (levels.warn) {
        console.warn(prefix, ...args);
    }
    return steno;
}
function info(...args) {
    if (levels.info) {
        console.info(prefix, ...args);
    }
    return steno;
}
function log(...args) {
    if (levels.log) {
        console.log(prefix, ...args);
    }
    return steno;
}
function perf(...args) {
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
const steno = {
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
exports.default = steno;
//# sourceMappingURL=steno.js.map