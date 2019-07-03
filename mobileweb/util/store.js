/**
 * localStorage存储信息
 *
 * @export
 * @param {any} id 存储ID
 * @param {any} key 存储内容key
 * @param {any} value 存储内容
 */
export function saveToLocal(id, key, value) {
    let auth = window.localStorage.__auth__;
    if (!auth) {
        auth = {};
        auth[id] = {};
    } else {
        auth = JSON.parse(auth);
        if (!auth[id]) {
            auth[id] = {};
        }
    }
    auth[id][key] = value;
    window.localStorage.__auth__ = JSON.stringify(auth);
};

/**
 * localStorage读取信息
 *
 * @export
 * @param {any} id 存储ID
 * @param {any} key 存储内容key
 * @param {any} def 默认值
 */
export function loadFromLocal(id, key, def) {
    let auth = window.localStorage.__auth__;
    if (!auth) {
        return def;
    }
    auth = JSON.parse(auth)[id];
    if (!auth) {
        return def;
    }
    let ret = auth[key];
    return ret || def;
};

/**
 * localStorage移除信息
 *
 * @export
 * @param {any} id 存储ID
 * @param {any} key 存储内容key
 * @param {any} def 默认值
 */
export function removeFromLocal(id, key) {
    let auth = window.localStorage.__auth__;
    if (auth) {
        auth = JSON.parse(auth);
        if (auth[id]) {
            delete auth[id][key];
        }
        window.localStorage.__auth__ = JSON.stringify(auth);
    }
};
