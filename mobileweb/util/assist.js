/**
 * 数据集合拼接
 * @param {any} oldList 原数据集合
 * @param {any} newList 新数据集合
 * @param {any} key 比对key，如id
 * @returns 新的数据集合
 */
export function listCover(oldList, newList, key) {
    let DataList = oldList;
    if (!oldList || !oldList.length) {
        DataList = newList;
    } else {
        let keys = DataList.map(function(info) {
            return info[key];
        });

        for (var item of newList) {
            if (!keys.includes(item[key])) {
                DataList.splice(0, 0, item);
            }
        }
    }
    return DataList;
}

/**
 * 获取年龄
 * @param {String} strBirthday 生日
 * @returns Age
 */
export function getAge(strBirthday) {
    if (!strBirthday || strBirthday === '') return '';

    var birthDate = new Date(strBirthday);
    var bYear = birthDate.getFullYear();
    var bMonth = birthDate.getMonth();
    var bDay = birthDate.getDate();

    var nowDateTime = new Date();
    var nowYear = nowDateTime.getFullYear();
    var nowMonth = nowDateTime.getMonth();
    var nowDay = nowDateTime.getDate();

    var ageDiff = nowYear - bYear; // 年差值
    // 再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (nowMonth < bMonth || (nowMonth === bMonth && nowDay < bDay)) {
        ageDiff--;
    }
    return ageDiff;
}


