import Toast from "toast"
import Loading from "mobile-Loading"
import hex_md5 from "blueimp-md5"

import {
    Delay,
    throttle,
    param,
    formatAmount,
    routeParam,
    entends,
    $go,
    $replace,
    cn,
    $goPage
} from "fn"
import JSBridge from "JSBridge"
const jsbrage = new JSBridge()
import NodeRSA from "node-rsa"
import { Certificate } from "crypto"
const RSAkey = new NodeRSA({ b: 512 })
RSAkey.importKey(
    `-----BEGIN PUBLIC KEY-----
    MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIi0D0oqn1MzRDmdLYmouByLnj2S+eGq
    jAcododNCgoq1ajkieiPQmP7MVbeZiDcSPWGghZoeCUUx2fMhjl11MMCAwEAAQ==
    -----END PUBLIC KEY-----`,
    "public"
)
const ajaxQueue = {
    arr: [],
    countDone: 0,
    push: function(params) {
        params = params ? params : {}
        let noQueue = params.noQueue
        let noLoading = params.noLoading
        if (!noLoading) {
            Loading.show(true)
        }
        if (noQueue) {
            return fn => {
                fn()
                if (!noLoading) {
                    Loading.hide()
                }
            }
        }

        let t = this.arr.length
        let i = this.arr.push(t) - 1
        return fn => {
            this.arr.splice(i, 1, fn)
            this.countDone++
            if (this.countDone === this.arr.length) {
                while (this.arr.length > 0) {
                    let v = this.arr.shift()
                    this.countDone = this.arr.length
                    try {
                        v()
                    } catch (e) {}
                }
                if (!noLoading) {
                    Loading.hide()
                }
            }
        }
    }
}

/**
 * 超时
 * GET ，跳转超时页面
 * POST ，toast 提示超时
 *
 * 401
 * GET 跳转登录过期页面
 * POST toast 提示登录超时
 *
 * 状态码错误
 * GET 跳转错误页
 * POST toast 提示系统超时
 *
 */
class Http {
    constructor(method, ...arg) {
        let [
            url,
            data,
            noQueue,
            chengeEnctype,
            noSign,
            noToken,
            noLoading,
            noErrorPage
        ] = arg
        data = data || {}
        noSign = noSign || false
        noToken = noToken || false

        const account_type =
            U.routeParam().account_type ||
            (U.getState().router.params.bill_type === "网关支付" ? "02" : "01")

        //添加token appip
        if (!noToken) {
            let options = this.getToken()
            data = { ...options, ...data }
        }

        if (account_type === "02") {
            data = { ...data, account_type }
        }

        if (noQueue === undefined) {
            noQueue = true
        }
        if (!url.startsWith("http")) {
            url = __BASEURL__ + url
        }
        let logData
        if (method === "JSONP") {
            const jsonpTimeOut = 10000
            if (!noLoading) {
                Loading.show(true)
            }
            let [base, search] = url.split("?")
            let obj = routeParam(search)
            let d = +new Date()
            let cb = "jsonpCB" + d
            data.callback = cb
            data.sourcecode = d
            data = { ...obj, ...data }
            if (!noSign) {
                data["timestamp"] = new Date().Format("yyyyMMddhhmmss")
                data["log_key"] = guid()
                data["sign"] = sign(data)
            }
            logData = data
            url = base + "?" + param(data)

            let jsonpScript = document.createElement("script")
            this.promise = new Promise((resolve, reject) => {
                const timeOut = setTimeout(() => {
                    jsonpScript = null
                    delete window[cb]
                    if (!noLoading) {
                        Loading.hide()
                    }
                    if (this.error_fn && typeof this.error_fn === "function") {
                        this.error_fn(json)
                    } else {
                        console.warn("超时: " + url)
                        if (method === "GET") {
                            if (!noErrorPage && !this.error_fn) {
                                __DEV__ || $replace("/timeout")
                            }
                        } else {
                            Toast.show("请求超时")
                        }
                    }
                    reject({ msg: "请求超时" })
                    ba.error({ url: url, data: logData, res: "超时" })
                }, jsonpTimeOut)
                window[cb] = json => {
                    clearTimeout(timeOut)
                    console.groupCollapsed(method, url)
                    // console.log(json)
                    console.groupEnd()
                    if (json.errcode === 0) {
                        this.success_fn && this.success_fn(json, xhr)
                        resolve(json)
                        ba.ajax({ url: url, data: logData, res: json })
                    } else {
                        if (
                            this.error_fn &&
                            typeof this.error_fn === "function"
                        ) {
                            this.error_fn(json)
                        } else {
                            console.warn(json)
                            Toast.show(json.msg)
                        }
                        reject(json)
                        ba.error({ url: url, data: logData, res: json })
                    }
                    jsonpScript = null
                    delete window[cb]
                    if (!noLoading) {
                        Loading.hide()
                    }
                }
            })
            jsonpScript.setAttribute("src", `${url}`)
            document.body.appendChild(jsonpScript)
            return
        }
        let xhr = new XMLHttpRequest()
        let ContentType = "application/x-www-form-urlencoded; charset=UTF-8"
        // url+='.json';
        if (method === "GET") {
            let [base, search] = url.split("?")
            let obj = routeParam(search)
            data = { ...obj, ...data }
            if (!noSign) {
                data["timestamp"] = new Date().Format("yyyyMMddhhmmss")
                data["log_key"] = guid()
                data["sign"] = sign(data)
            }
            logData = data
            url = base + "?" + param(data)
        } else {
            if (!noSign) {
                data["timestamp"] = new Date().Format("yyyyMMddhhmmss")
                data["log_key"] = guid()
                data["sign"] = sign(data)
            }
            if (chengeEnctype) {
                let fd = new FormData()
                Object.keys(data).forEach(v => {
                    // console.log(v, data[v])
                    fd.append(v, data[v])
                })
                data = fd
            } else {
                logData = data
                data = param(data)
            }
        }
        // xhr.withCredentials = true;
        xhr.open(method, url)
        if (!chengeEnctype) {
            xhr.setRequestHeader("Content-type", ContentType)
        }
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
        // xhr.withCredentials = true
        xhr.timeout = 10000
        let runQueue = ajaxQueue.push({
            noQueue: noQueue,
            noLoading: noLoading
        })
        xhr.send(data)

        xhr.ontimeout = () => {
            ba.error({ url: url, data: logData, res: "超时" })
            if (method === "GET") {
                if (!noErrorPage && !this.error_fn) {
                    __DEV__ || $replace("/timeout")
                }
            } else {
                Toast.show("请求超时")
            }
        }
        this.promise = new Promise((resolve, reject) => {
            reject = reject ? reject : () => {} // 兼容promise没有写.catch方法的情况
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return
                }
                runQueue(() => {
                    if (xhr.status === 401 && !this.is_refresh) {
                        //todo tf56 方法
                        const _token = ""
                        if (!_token) {
                            this.is_refresh = true
                            //Toast.show("登录已过期，请重新登录")
                            ba.error({
                                url: url,
                                data: logData,
                                res: xhr.status
                            })
                            if (method === "GET") {
                                if (!noErrorPage || !this.error_fn) {
                                    __DEV__ || $replace("/loginout")
                                }
                            } else {
                                Toast.show("登录已过期，请重新登录")
                            }
                            reject({
                                msg: "登录已过期，请重新登录"
                            })
                            return
                        }
                        $post("/user/refreshToken", {
                            refresh_token: _token
                        })
                            .putRefresh()
                            .success(() => {
                                resolve(new Http(method, ...arg))
                            })
                            .error(() => {
                                //Toast.show("登录已过期，请重新登录")
                                ba.error({
                                    url: url,
                                    data: logData,
                                    res: xhr.status
                                })
                                if (!noErrorPage && method !== "GET") {
                                    __DEV__ || $replace("/loginout")
                                }
                                return false
                            })
                        return false
                    }
                    if (
                        (xhr.status >= 200 && xhr.status < 300) ||
                        xhr.status === 304
                    ) {
                        try {
                            let json = unicodeDecode(xhr.responseText)
                            json = JSON.parse(json)
                            if (!json) throw new Error("not a json")
                            console.groupCollapsed(method, url)
                            console.groupEnd()
                            if (json.errcode === 0) {
                                this.success_fn && this.success_fn(json, xhr)
                                resolve(json)
                                // } else if (json.result === 'error' && (json.msg === '无权限访问' || json.code === 'timeout')) {
                                //U.dispatch({}, 'customer.clear')
                                //location.href = '../index/login.html'
                                ba.ajax({ url: url, data: logData, res: json })
                            } else {
                                if (
                                    this.error_fn &&
                                    typeof this.error_fn === "function"
                                ) {
                                    this.error_fn(json)
                                } else {
                                    console.warn(json)
                                    Toast.show(json.msg || "服务器异常，请重试")
                                }
                                reject(json)
                                ba.error({ url: url, data: logData, res: json })
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    } else {
                        this.error_fn &&
                            this.error_fn(
                                xhr.statusText || null,
                                xhr.status,
                                xhr
                            )
                        reject(xhr.statusText || null)
                        ba.error({
                            url: url,
                            data: logData,
                            res: xhr.statusText
                        })
                        if (method === "GET") {
                            if (!noErrorPage || !this.error_fn) {
                                __DEV__ || $replace("/error")
                            }
                        } else {
                            Toast.show("服务器异常，请重试")
                        }
                    }
                    xhr = null
                })
            }
        })
    }
    is_refresh = false

    success(fn) {
        this.success_fn = fn
        return this
    }

    error(fn) {
        this.error_fn = fn
        return this
    }

    then(...arg) {
        return this.promise.then(...arg)
    }

    putRefresh(v = true) {
        this.is_refresh = v
        return this
    }

    // sign(param) {
    //     //获取签名
    //     let arr = []
    //     for (let key in param) {
    //         arr.push({ k: key, v: param[key] })
    //     }
    //     return getWalletSign(arr)
    // }

    getToken() {
        const options = {
            appid:
                routeParam().appid || U.getState("router").router.params.appid
            //clientdfp: ""
        }
        try {
            if (
                window.tf56 &&
                typeof window.tf56.getWalletClientDfp === "function"
            ) {
                options.clientdfp = window.tf56.getWalletClientDfp()
            }
            if (window.tf56 && typeof window.tf56.getAppStoken === "function") {
                options.app_stoken = window.tf56.getAppStoken()
            } else if (
                window.tf56 &&
                typeof window.tf56.getToken === "function"
            ) {
                options.app_stoken = window.tf56.getToken()
            }
            if (
                window.tf56 &&
                typeof window.tf56.getAppIdentity === "function"
            ) {
                options.appid = window.tf56.getAppIdentity()
            } else if (
                window.tf56 &&
                typeof window.tf56.getLoginInfo === "function"
            ) {
                let loginInfo = window.tf56.getLoginInfo()
                if (loginInfo) {
                    loginInfo = JSON.parse(loginInfo)
                    if (loginInfo) {
                        options.appid = loginInfo.appid
                    }
                }
            }
        } catch (e) {
            ba.error(e.message)
        }
        return options
    }
}

export function $jsonp(...arg) {
    return new Http("JSONP", ...arg)
}

export function $get(...arg) {
    return new Http("GET", ...arg)
}

// export function $post(...arg) {
//     return new Http("POST", ...arg)
// }

const fieldsNeedRSA = [
    "id_no",
    "bank_card_number",
    "bk_card_no",
    "bank_mobile_number",
    "mobile",
    "business_license",
    "name",
    "bank_card_name",
    "bk_card_name",
    "certificate_number"
]

const encrypt = (...arg) => {
    let [, params] = arg
    let rsa_keys = []
    let newParams = { ...params }
    fieldsNeedRSA.forEach(item => {
        if (params[item]) {
            newParams[item] = RSAkey.encrypt(params[item], "base64")
            rsa_keys.push(item)
        }
    })
    if (rsa_keys.length) {
        newParams.rsa_keys = rsa_keys
    }
    arg[1] = newParams
    return arg
}

export function $post(...arg) {
    const encryptedArg = arg.length >= 2 ? encrypt(...arg) : arg

    return new Http("POST", ...encryptedArg)
}

export function $setTitle(title) {
    document.title = title
    location.replace("#_hash_change_title")
}

function getCookie(name) {
    const arr = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]*)(;|$)")
    )
    if (arr !== null) return unescape(arr[2])
    return null
}

/**
 * xss ajax解码,传入josn 类型，返回json类型，用于解析ajax返回的data中的unicode编码解码后的json结果
 *
 * @param str {json} 传入json值
 * @returns {*}
 */
export function unicodeDecode(str) {
    // let str = JSON.stringify(str);
    str = str.replace(/(&#)(\d{1,6});/gi, function($0) {
        return String.fromCharCode(
            parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2"))
        )
    })
    return str
}

/**
 * 倒计数计时器
 *
 * @export
 * @param {object} [elem] DOM对象
 * @param {object} [options] 其他配置  options.endString :结束后的显示的字符串 options.time :倒计时时间
 * @param {function} [clickFun]  可点击情况下触发的事件
 * @param {function}  [callback] 记时结束后的回调
 */
export function timer(elem, options, clickFun, callback) {
    var time, t
    if (!elem.timer || !elem.timer.isRunning) {
        clickFun()
        options = options || {}
        time = options.time || 60
        t = _timer(elem, callback)
        elem["timer"] = {
            over: function() {
                elem.className = "link-font"
                callback && callback()
                if (elem.value) {
                    elem.value = options.endString || "重新发送"
                } else {
                    elem.innerHTML = options.endString || "重新发送"
                }
                this.isRunning = false
                clearInterval(t)
            },
            isRunning: true
        }
    }

    function _timer(elem, callback) {
        elem.className = " "
        let T = setInterval(function() {
            if (time <= 0) {
                elem.className = "link-font"
                elem.timer.isRunning = false
                if (elem.value) {
                    elem.value = options.endString || "重新发送"
                } else {
                    elem.innerHTML = options.endString || "重新发送"
                }
                callback && callback()
                clearInterval(T)
                return false
            }
            if (options.showString) {
                if (elem.value) {
                    elem.value = time + options.showString
                } else {
                    elem.innerHTML = time + options.showString
                }
            } else {
                if (elem.value) {
                    elem.value = time + "s后重新发送"
                } else {
                    elem.innerHTML = time + "s后重新发送"
                }
            }
            time--
        }, 1000)
        return T
    }
}

/**
 * 判断终端类型
 *
 * @returns {string} 终端类型
 */
export const checkClient = () => {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //判断iPhone|iPad|iPod|iOS
        return "IOS"
    } else if (/(Android)/i.test(navigator.userAgent)) {
        //判断Android
        return "Android"
    } else {
        //pc
        return "pc"
    }
}

const $goBackHome = async () => {
    const goLength = history.length - 1
    for (let i = goLength; i > 0; i--) {
        history.go(-i)
        await Delay(10)
    }
}

function isFromNative(fromNative) {
    if (
        history.length === 1 ||
        document.referrer === "" ||
        "true" === fromNative
    ) {
        return true
    } else {
        return false
    }
}

export function getDicByCode(dicType, dicCode) {
    let json =
        (sourceDic[dicType] || {}).find(item => {
            return item.value === dicCode
        }) || {}
    return json
}

export function hideSomeStr(str, begin = 3, count = 4, secretLen = 4) {
    return str.replace(
        str.substr(begin, count),
        Array(secretLen)
            .fill("*")
            .join("")
    )
}

export function encryption(password) {
    // const _KEY = appConfig.merchantWallet
    return hex_md5(password)
}

export function sign(data) {
    let param = Object.assign({}, data)
    delete param["sign"]
    let arr = []
    for (let key in param) {
        param[key] !== undefined &&
            param[key] !== null &&
            arr.push({ k: key, v: param[key] })
    }
    return getWalletSign(arr)
}

/*
 * @paramArr参数
 * paramArr = [{k:"amount",v:"123456"},{k:"k2",v:"v2"}]
 * @依赖MD5.js 调用的时候注意引用
 * */
const getWalletSign = paramArr => {
    const _KEY = appConfig.merchantWallet
    let signStr = "",
        sign = ""
    if (paramArr) {
        paramArr.sort(createComparsionFunction("k")).forEach(function(v) {
            signStr += v.v + ""
        })
        // sign = signStr + _KEY
        sign = hex_md5(signStr + _KEY)
        return sign
    }
}

/**
 * 按照指定的属性对对象排序
 * */
const createComparsionFunction = propertyName => (object1, object2) => {
    let value1 = object1[propertyName]
    let value2 = object2[propertyName]
    if (value1 < value2) {
        return -1
    } else if (value1 > value2) {
        return 1
    } else {
        return 0
    }
}
Date.prototype.Format = function(fmt) {
    //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds()
        //毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        )
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            )
        }
    }
    return fmt
}

/**
 * canvas.toBlob polyfill
 */
if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
        value: function(callback, type, quality) {
            var canvas = this
            setTimeout(function() {
                var binStr = atob(
                        canvas.toDataURL(type, quality).split(",")[1]
                    ),
                    len = binStr.length,
                    arr = new Uint8Array(len)

                for (var i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i)
                }

                callback(new Blob([arr], { type: type || "image/png" }))
            })
        }
    })
}

/**
 * 压缩图片
 * @param obj
 * @returns {Promise<any>}
 */
export function compressedPicture(obj = {}) {
    if (typeof obj !== "object") {
        throw new Error("需要传入一个对象")
    }

    const initConfig = {
        image: null,
        name: "image.png",
        outputFileType: "image/png",
        maxOutputSize: 2048,
        outputWidth: 800
    }
    let configure = { ...initConfig, ...obj }
    return new Promise((resolve, reject) => {
        let _img = new Image()
        _img.src = configure.image.url
        _img.onload = () => {
            try {
                let _imgW = _img.width,
                    _imgH = _img.height
                let scale =
                    _imgW > _imgH
                        ? Math.min(configure.outputWidth / _imgW, 1)
                        : (scale = Math.min(configure.outputWidth / _imgH, 1))
                let canvas = document.createElement("canvas")
                let ctx = canvas.getContext("2d")
                _imgW *= scale
                _imgH *= scale
                canvas.width = _imgW > _imgH ? _imgW : _imgH
                canvas.height = _imgW < _imgH ? _imgW : _imgH
                _imgW < _imgH &&
                    (ctx.translate(_imgH, 0) ||
                        ctx.rotate((90 * Math.PI) / 180))
                ctx.drawImage(_img, 0, 0, _imgW, _imgH)
                canvas.toBlob(function(blob) {
                    resolve({
                        url: URL.createObjectURL(blob),
                        file: new File([blob], configure.name, {
                            type: blob.type,
                            size: blob.size
                        })
                    })
                }, configure.outputFileType)
            } catch (e) {
                resolve(configure.image)
                ba.error(e)
            }
        }
    })
}

const guid = () => {
    return (
        ((new Date().getTime() * Math.random() + Math.random()) * 0x10000) |
        0
    )
        .toString(16)
        .substring(1)
}

export function checkSupportUnionPay() {
    return new Promise((resolve, reject) => {
        try {
            jsbrage.callNative(
                "supportPayType",
                { type: "unionpay" },
                res => {
                    resolve(res)
                },
                () => {
                    resolve({
                        result: "unionFalse"
                    })
                },
                1000
            )
        } catch (e) {
            console.log("error", e)
        }
    })
}
export function checkSupportWxPay() {
    return new Promise((resolve, reject) => {
        try {
            jsbrage.callNative(
                "supportPayType",
                { type: "wxpay" },
                res => {
                    resolve(res)
                },
                () => {
                    resolve({
                        result: "wxpayFalse"
                    })
                },
                500
            )
        } catch (e) {
            console.log("error", e)
        }
    })
}
export function checkSupportAliPay() {
    return new Promise((resolve, reject) => {
        try {
            jsbrage.callNative(
                "supportPayType",
                { type: "alipay" },
                res => {
                    resolve(res)
                },
                () => {
                    resolve({
                        result: "aliPayFalse"
                    })
                },
                500
            )
        } catch (e) {
            console.log("error", e)
        }
    })
}
export function checkSupportAliUrlPay() {
    return new Promise((resolve, reject) => {
        try {
            jsbrage.callNative(
                "supportPayType",
                { type: "alipayUrl" },
                res => {
                    resolve(res)
                },
                () => {
                    resolve({
                        result: "alipayUrlFalse"
                    })
                },
                500
            )
        } catch (e) {
            console.log("error", e)
        }
    })
}
export function checkSupportApplePay() {
    return new Promise((resolve, reject) => {
        try {
            jsbrage.callNative(
                "supportPayType",
                { type: "applepay" },
                res => {
                    resolve(res)
                },
                () => {
                    resolve({
                        result: "applePayFalse"
                    })
                },
                100
            )
        } catch (e) {
            console.log("error", e)
        }
    })
}

export function checkSupportWxpayH5() {
    let ua = window.navigator.userAgent.match(/micromessenger\/[\d.]+/gi)
    let uaVersion = (ua + "").replace(/[^0-9.]/gi, "")
    let uaVersionArr = uaVersion.split(".")
    if (uaVersionArr[0] < 5) {
        return false
    } else {
        return true
    }
}

export {
    $replace,
    $go,
    cn,
    Delay,
    throttle,
    param,
    routeParam,
    entends,
    formatAmount,
    isFromNative,
    guid,
    $goPage
}
