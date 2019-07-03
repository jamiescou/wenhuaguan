const fetch = require('./fetch')
const Qs = require('qs')
const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
const assist = require('../util/assist')
const config = require('../config')
// const Redis = require('ioredis');
var crypto = require('crypto');


class TaskModel {
    constructor() {
        this.result = {}
    }

    /**
     * 
     * @param {*} type  activityForm:活动形式；artistClass：艺术类型；assistProjectType:辅助活动分类
     * cultural:文艺配送分类;education:教育；exhibition：展厅类型；heritageBatch：申报批次；heritageLevel：非遗级别；
     * heritageType：非遗类型；magazineType：出版周期；occupation：职业；political：政治面貌；relation：亲属关系；teamType:志愿者团队类型
     * trainForm:培训形式；venueRoomType：活动室类型；venueType：场馆类型；videoLabel：视频标签；videoType：视频分类；worksType：展品类型;
     * assistProjectType:活动辅助类型
     */
    async fetchCodeTypes(type) {
        let res = await fetch({
            url: '/sys/codetypes/' + type + '/codes',
            method: 'get',
        });
        return res;
    }

    async fetchSysParams(type) {
        let res = await fetch({
            url: '/sys/params/' + type,
            method: 'get',
        });
        return res.value;
    }
    async fetchfigure(type) {
        let res = await fetch({
            url: '/base/looppics/' + type + '/contents?enable=true',
            method: 'get',
        });
        return res;
    }

    async uploadFile(fileInfo, type, headers) {
        let res = await fetch({
            url: '/base/files/',
            method: 'post',
            data: fileInfo,
            headers: headers
        });
        return res;
    }
    //保存文件
    async saveFile(file) {
        try {
            let filePath = file.path;
            let fileType = file.name.split('.')[1];
            let id = uuid.v1();
            let fileName = id + '.' + fileType;
            let pathStr = id.substr(0, 4);
            let relativePath = path.join(pathStr.charAt(0), pathStr.charAt(1), pathStr.charAt(2), pathStr.charAt(3));
            let savePath = path.join(config.multiMediaServer.filePath, relativePath.toString());
            let saveFile = path.join(savePath, fileName);
            assist.mkdirsSync(savePath);
            fs.copyFileSync(file.path, saveFile);
            let p = path.join(relativePath, fileName).toString();
            p = p.replace(/\\/g, '/');
            return {
                url: p,
                success: true
            }
        } catch (ex) {
            return {
                success: false,
                url: ex
            }
        }
    }

    /**
     * 从redis中获取区域树,如果不存在，获取区域后存入redis中
     *
     * @param {int} level 区域级别
     * @param {*} regionCode 起始区域code
     * @returns
     */
    async getRedisRegionTree(regionCode) {
        let regionsTree = await this.getRegionTree(regionCode)
        return regionsTree
        // let connectionResult = await RedisObj.connection()
        // if (connectionResult) {
        //     // 存储相关的地区信息
        //     let regions = [];
        //     let hasRegions = await RedisObj.exists('regions')
        //     if (!hasRegions) {
        //         let rootUnit = await RedisObj.getHashData('pc-cultCenter', 'rootUnit')
        //         rootUnit = JSON.parse(rootUnit)
        //         let regionsTree = await this.getRegionTree(rootUnit.unitRegion)
        //         RedisObj.setData('regions', regionsTree)
        //         regions = regionsTree;
        //     } else {
        //         regions = await RedisObj.getData('regions');
        //     }

        //     let tree = [];
        //     if (level == 1) {
        //         tree = regions;
        //     } else if (level == 2) {
        //         tree = regions.find(x => x.code == regionCode);
        //         tree = tree.children;
        //     }
        //     return tree;
        // } else {
        //     return [];
        // }
    }

    /**
     * 获取区域树形结构
     */
    async getRegionTree(region) {
        let search = 'code~' + this.trimRegionEnd(region) + '%,level<4';
        let regions = await this.getRegions(search, 0, -1); // 当前文化馆的区域范围
        regions = regions.content;
        if (regions.length) {
            let regionList = regions.map((x) => { // 用于前端统一格式,code\value
                delete x.heritBrief
                x.value = x.name;
                return x;
            })
            regions = regionList
        }
        // 区域转换成树形结构
        let directchilds = regions.filter(x => x.parentCode === region); // 区域的直接子级

        // 递归构建区域树
        function generateRegionTree(oneLevels, allData) {
            for (let item of oneLevels) {
                item.children = [];
                let children = allData.filter(x => x.parentCode === item.code);
                if (children.length > 0) {
                    item.children = generateRegionTree(children, allData);
                }
            }
            return oneLevels;
        }
        let regionsTree = generateRegionTree(directchilds, regions);
        return regionsTree;
    }

    async fetchroot() {
        let res = await fetch({
            url: '/sys/units/root',
            method: 'get',
        });
        return res;
    }

    async fetchrootchildren(id) {
        let res = await fetch({
            url: '/sys/units/' + id + '/children',
            method: 'get',
        });
        return res;
    }

    async fetchunitlist(search) {
        let res = await fetch({
            url: '/sys/units?search=' + search,
            method: 'get',
        });
        return res;
    }

    async fetchallchildren(id) {
        let res = await fetch({
            url: '/sys/units/?search=ancestors:' + id + ',type:org',
            method: 'get',
        });
        return res;
    }

    async regiondetail(code) {
        let res = await fetch({
            url: '/sys/regions/' + code,
            method: 'get',
        });
        return res;
    }

    /**
     * 获取区域的所有下级区域（直接、间接下级）
     * @param {String} code 区域code
     */
    async getAllChildRegions(code) {
        let res = await fetch({
            url: '/sys/regions/' + code + '/allchilds',
            method: 'get'
        })
        return res;
    }

    /**
     * 根据区域编码获取区域信息
     */
    async getRegionInfo(code) {
        let res = await fetch({
            url: '/sys/regions/' + code,
            method: 'get'
        })
        return res;
    }

    /**
     *查询区域信息
     */
    async getRegions(search, page, size) {
        let res = await fetch({
            url: '/sys/regions?search=' + search + '&page=' + page + '&size=' + size,
            method: 'get'
        })
        return res;
    }
    /**
     * 获取授权token
     *
     * @param {String} auth 授权信息
     * @param {String} grant 授权类型
     * @returns
     */
    async getToken(auth, grant) {
        const data = await fetch({
            url: '/oauth/token',
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': auth
            },
            data: Qs.stringify({
                grant_type: grant
            }),
            isLogin: true
        });
        return data;
    }
    /**
     * 根据传入的区域，获取该区域的文化馆,然后获取子级馆
     * 
     * @param {any} regionCode 区域Code
     * @returns 文化馆id集合字符串,不存在文化馆，返回默认值“0000”
     */
    async getUnitIdsByRegion(regionCode) {
        let unitid = [];
        let cults = await this.fetchunitlist('type:org,region:' + regionCode);
        let ancestors = [];
        if (cults.content && cults.content.length > 0) {
            ancestors = cults.content.map(x => x.id);
            unitid = ancestors;
            let cultChildren = await this.fetchunitlist('type:org,ancestors:' + ancestors.join('~'));
            if (cultChildren.content.length > 0) {
                let cultChildrenIds = cultChildren.content.map(x => x.id);
                unitid = unitid.concat(cultChildrenIds);
            }
        }
        unitid = unitid.join('~');
        unitid = unitid ? unitid : '0000'; //如果选择的地市没有文化馆，则应查不到数据
        return unitid;
    }
    /**
     * 获取推荐版块内容
     */
    async getRecommands(search, page, size) {
        let res = await fetch({
            url: '/base/recommends?search=' + search + '&page=' + page + '&size=' + size,
            method: 'get'
        })
        return res;
    }

    /**
     * @aes192解密模块
     * @param str string 要解密的字符串
     * @param secret string 要使用的解密密钥(要和密码的加密密钥对应,不然就解不了密啦)
     * @retrun string 解密后的字符串
     * */
    getDecAse192(str, secret) {
        var decipher = crypto.createDecipher("aes192", secret);
        var dec = decipher.update(str, "hex", "utf8"); //编码方式从hex转为utf-8;
        dec += decipher.final("utf8"); //编码方式从utf-8;
        return dec;
    }

    /**
     * @aes192加密模块
     * @param str string 要加密的字符串
     * @param secret string 要使用的加密密钥(要记住,不然就解不了密啦)
     * @retrun string 加密后的字符串
     * */
    getEncAse192(str, secret) {
        var cipher = crypto.createCipher("aes192", secret); //设置加密类型 和 要使用的加密密钥
        var enc = cipher.update(str, "utf8", "hex"); //编码方式从utf-8转为hex;
        enc += cipher.final("hex"); //编码方式从转为hex;
        return enc; //返回加密后的字符串
    }

    /**
     * 按省、市、区、街道截取编码末尾的0；除街道按3位截取外，其他两位截；
     *   43  01 00 000--》4301
     *   43  01 10 000--》430110
     * @param {*} code 区域编码
     */
    trimRegionEnd(code) {
        if (!code) return code;
        if (code.length == 9) { //街道编码
            if (code.substr(6, 3) == '000') {
                return this.trimRegionEnd(code.substr(0, 6))
            } else {
                return code;
            }
        } else if (code.length < 9) {
            if (code.substr(code.length - 2, 2) == '00') {
                return this.trimRegionEnd(code.substr(0, code.length - 2))
            } else {
                return code
            }
        } else { return code }
    }

    // 根据域名获取机构信息
    async getUintByDomain(domain) {
        let res = await fetch({
            url: '/sys/units/pc/domain/' + domain,
            method: 'get'
        });
        return res;
    }

}
module.exports = new TaskModel()
