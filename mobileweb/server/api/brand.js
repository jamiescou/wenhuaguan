import fetch from './http';

//品牌列表
export async function brandList(str, page, size) {
    let res = await fetch({
        url: '/issue/brands?' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

//品牌详情
export async function brandDetail(id) {
    let res = await fetch({
        url: '/issue/brands/' + id,
        method: 'get'
    });
    return res;
}

export async function newsList(id, page, size) {
    let res = await fetch({
        url: '/issue/brands/' + id + '/infos',
        method: 'get'
    });
    return res;
}

export async function digitalList(id, page, size) {
    let res = await fetch({
        url: '/issue/brands/' + id + '/digitals',
        method: 'get'
    });
    return res;
}
