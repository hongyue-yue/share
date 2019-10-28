import axios from "axios"

class Http {
    constructor(method, ...arg) {
        let [url, data, headers = {}, chengeEnctype] = arg
        let contentType = {}
        if (!chengeEnctype) {
            contentType = {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        let obj = {
            data: data
        }
        if (method == "get")
            obj = {
                params: data
            }

        this.promise = new Promise((resolve, reject) => {
            axios({
                url: url,
                method: method,
                headers: {
                    ...contentType,
                    ...headers,
                    "X-Requested-With": "XMLHttpRequest"
                },
                timeout: 3000,
                ...obj,
                transformResponse: [
                    data => {
                        //在传递给 then/catch 前，允许修改响应数据
                        return data
                    }
                ]
            })
                .then(res => {
                    if (res == "sucess") resolve(res)
                    else reject(res)
                })
                .catch(res => {
                    reject(res)
                })
        })
    }
    then(...arg) {
        return this.promise.then(...arg)
    }
}
export function $get(...arg) {
    return new Http("GET", ...arg)
}
export function $post(...arg) {
    return new Http("POST", ...arg)
}

export function route_param(s) {
    let search = s || location.search.substr(1)
    search = decodeURIComponent(search)
    let obj = {}
    if (!search) {
        return obj
    }
    let arr = search.split("&").forEach(item => {
        const [key, value] = item.split("=")
        obj[key] = value
    })
    return obj
}
export function param(obj) {
    let arr = []
    for (var key in obj) {
        let value = obj[key]
        if (typeof key == "function") value = value()
        if (value instanceof Array) value = value.join(",")
        if (value == null) value = ""
        arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(value))
    }
    return arr.join("&")
}
export const $go = (url, params, re = false) => {
    let url_param = {}
    if (url.indexOf("?") >= 0) {
        var [u, s] = url.split("?")
        url_param = route_param(s)
    } else {
        var u = url
    }
    if (params) {
        url_param = entends(url_param, params)
    }
    let go_url = url_param ? u + "?" + param(url_param) : u
    if (re) {
        return go_url
    }
    window.location.hash = go_url
}

export const entends =
    Object.assign ||
    function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i]
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }

        return target
    }


