import React, { Component, createElement } from "react"

function routeParam(s) {
    let search = s || location.search.substr(1)
    let obj = {}
    if (!search) {
        return obj
    }
    search.split("&").forEach(item => {
        const [key, value] = item.split("=")
        if (key) {
            obj[key] = decodeURIComponent(value)
            obj[key] == "true" && (obj[key] = true)
            obj[key] == "false" && (obj[key] = false)
        }
    })
    return obj
}

class Router extends Component {
    constructor(props,context) {
        super(props,context)
        this.store=context.store
        if (!this.mapRoutes) {
            console.error("must Abstract method mapRoutes")
            return
        }
        this.params = {}
        this.state = {
            component: null
        }
        window.addEventListener(
            "hashchange",
            this.onhashchange.bind(this),
            false
        )
    }
    index = "#/home/welcome"
    NotFind = () => (
        <div>
            <p
                className="t_center"
                style={{ marginTop: "40px", fontSize: "20px" }}
                onClick={() => {
                    console.log(location.href)
                }}
            >
                {"o(>﹏<)o"}
            </p>
            <p
                className="t_center"
                style={{ marginTop: "20px", fontSize: "20px" }}
            >
                很抱歉，您要访问的页面不存在！
            </p>
            <p
                className="t_center"
                style={{ marginTop: "20px", fontSize: "20px" }}
            >
                <a href="javascript:history.back();" style={{ color: "blue" }}>
                    返回上一页!
                </a>
            </p>
        </div>
    )
    onhashchange({ oldURL }) {
        if (location.hash === "#_hash_change_title") {
            history.replaceState(null, document.title, oldURL)
            return
        } else {
            this.router(location.hash)
        }
    }
    willRoute(path) {
        store.dispatch({currentPath:path},"change router one")
        return path
    }
    didRoute(page) {
        
    }
    catchError(error, info) {
        console.error(error, info)
    }
    mapRoutes(v) {
        return import("../page" + v).then(M => M.default)
    }

    componentDidMount() {
        this.router(location.hash)
    }

    componentDidCatch(error, info) {
        this.catchError(error, info)
    }

    async setComponent(page) {
        try {
            const pages = page
                .match(/\/\w+/g)
                .map((v, i, arr) => arr.slice(0, i + 1).join(""))
            const M_arr = await Promise.all(pages.map(this.mapRoutes))
            const M = M_arr.reduceRight((p, c) => {
                return createElement(
                    c,
                    { ...this.props, params: this.params },
                    p
                )
            }, null)
            this.setState({
                component: M
            })
            this.didRoute(page)
        } catch (error) {
            this.catchError(error)
            this.setState({
                component: <this.NotFind />
            })
        }
    }

    router(path) {
        if (!path || path == "#" || path == "#/" || path == "/") {
            path = this.index
        }
        this.hash = path
        path = path.substr(1)
        const arr = path.split("?")
        if (arr[1]) {
            this.params = routeParam(arr[1])
        } else {
            this.params = {}
        }
        path = arr[0]

        let router_path = this.willRoute(path)
        if (router_path) {
            this.setComponent(router_path)
        }
    }

    render() {
        return this.state.component ? this.state.component : null
    }
}

export default Router
