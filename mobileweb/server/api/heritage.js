import fetch from './http';

// 获取非遗展厅列表
export async function heritageExhibits(search, page, size) {
    let res = await fetch({
        url: '/heritage/exhibits?' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

// 获取非遗展厅单元列表
export async function heritageUnit(search, page, size) {
    let res = await fetch({
        url: '/heritage/units?' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

// 获取非遗展厅单元详情
export async function heritageUnitInfo(id) {
    let res = await fetch({
        url: '/heritage/units/' + id,
        method: 'get'
    });
    return res;
}

// 获取非遗展厅单元作品列表
export async function heritageWorks(search, page, size) {
    let res = await fetch({
        url: '/heritage/works?' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

// 非遗名录列表
export async function heritageProjects(search, page, size) {
    let res = await fetch({
        url: '/heritage/projects?search=' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

/**
 * 非遗传承人列表
 * @param {*} search 
 * @param {*} page 
 * @param {*} size 
 */
export async function heritageSuccessors(search, page, size) {

    let res = await fetch({
        url: '/heritage/successors?search=' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

/**
 * 非遗名录详情
 */
export async function projectsDetail(id) {
    let res = await fetch({
        url: '/heritage/projects/' + id,
        method: 'get'
    });
    return res;
}

/**
 * 非遗传承人详情
 * @param {*} id 
 */
export async function successorsDetail(id) {
    let res = await fetch({
        url: '/heritage/successors/' + id,
        method: 'get'
    });
    return res;
}

//非遗保护区
export async function heritageProtections(search, page, size) {
    let res = await fetch({
        url: '/heritage/protections?search=' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

// 获取保护区详情
export async function protectionDetail(id) {
    let res = await fetch({
        url: '/heritage/protections/' + id,
        method: 'get'
    });
    return res;
}

// 获取非遗地图统计项目
export async function mapStatisticProject(code) {
    let res = await fetch({
        url: '/heritage/stat/project?region=' + code,
        method: 'get'
    });
    return res;
}

//获取非遗地图统计传承人
export async function mapStatisticSuccessor(code) {
    let res = await fetch({
        url: '/heritage/stat/successor?region=' + code,
        method: 'get'
    });
    return res;
}

// 获取非遗展览列表
export async function heritageExhibitsList(type) {
    let res = await fetch({
        url: '/issue/exhibits/' + type,
        method: 'get'
    });
    return res;
}
