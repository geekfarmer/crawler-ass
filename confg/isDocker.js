'use strict';
import fs from 'fs'
var isDocker;

const hasDockerEnv = () => {
    try {
        fs.statSync('/.dockerenv');
        return true;
    } catch (err) {
        return false;
    }
}

const hasDockerCGroup = () => {
    try {
        return fs.readFileSync('/proc/self/cgroup', 'utf8').indexOf('docker') !== -1;
    } catch (err) {
        return false;
    }
}

/**
 *
 *
 * @returns
 */
const check = () => {
    return hasDockerEnv() || hasDockerCGroup();
}

//check service is running on docker or not
const ifDocker = () => {
    if (isDocker === undefined) {
        isDocker = check();
    }

    return isDocker;
};

export default ifDocker;
