# koa 入门

### Koa  是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序 

> 1.安装：(Koa 依赖 node v7.6.0 或 ES2015及更高版本和 async 方法支持)
    
        npm i koa  

> 2.hello world

```
    const Koa = require('koa');
    const app = new Koa();
    app.use((ctx next)=>{
        ctx.body="hello world"
    })
    app.listen(3000);
```
```
    不用框架写法
    let http = require('http')
    let server = http.createServer((req, res) => {
        res.end('hello world')
    })

    server.listen(4000)
```

#### 通过比较发现，koa多了两个实例上的use、listen方法，和use回调中的ctx、next两个参数。这四个不同，几乎就是koa的全部了，也是这四个不同让koa如此强大。
#### listen http的语法糖，实际上还是用了http.createServer()，然后监听了一个端口。
#### ctx 利用 上下文(context) 机制，将原来的req,res对象合二为一，并进行了大量拓展,使开发者可以方便的使用更多属性和方法，大大减少了处理字符串、提取信息的时间，免去了许多引入第三方包的过程。(例如ctx.query、ctx.path等)
#### use koa的核心 —— 中间件（middleware）。解决了异步编程中回调地狱的问题，基于Promise，利用 洋葱模型 思想，使嵌套的、纠缠不清的代码变得清晰、明确，并且可拓展，可定制，借助许多第三方中间件，可以使精简的koa更加全能（例如koa-router，实现了路由）。其原理主要是一个极其精妙的 compose 函数。在使用时，用 next() 方法，从上一个中间件跳到下一个中间件


> 3.get请求

```
    app.use( ctx => {
        let url = ctx.url;

        //从request中获取GET请求
        let request = ctx.request;
        let req_query = request.query;
        let req_querystring = request.querystring;

        //从上下文中直接获取
        let ctx_query = ctx.query;
        let ctx_querystring = ctx.querystring;

        ctx.body = {
            url,
            req_query,
            req_querystring,
            ctx_query,
            ctx_querystring
        };
    });
```

> 4.post请求  使用koa-bodyparser中间件

```
    app.use( ctx => {
        //当请求时GET请求时，显示表单让用户填写
        if (ctx.url === "/" && ctx.method === "GET") {
            let html = `
                    <h1>Koa request post demo</h1>
                    <form method="POST"  action="/">
                        <p>userName</p>
                        <input name="userName" /> <br/>
                        <p>age</p>
                        <input name="age" /> <br/>
                        <p>webSite</p>
                        <input name='webSite' /><br/>
                        <button type="submit">submit</button>
                    </form>
                `;
            ctx.body = html;
            //当请求时POST请求时
        } else if (ctx.url === "/" && ctx.method === "POST") {
            let postdata =ctx.request.body;
            ctx.body = postdata;
        } else {
            //其它请求显示404页面
            ctx.body = "<h1>404!</h1>";
        }
    });
```

> 5.路由 const route = require('koa-route');

```
    const router = new Router();
    

    router.get("/", function(ctx, next) {
        ctx.body = "<h1>Home</h1>";
    });
    router.get("/Page", (ctx, next) => {
        ctx.body = "<h2>Page</h2>";
    });
    
    router.get("/:category/:page/:id", function(ctx, next) {
        ctx.body = ctx.params;//动态路由参数
    });
    app.use(router.routes());
```

```
    层级路由
    const router = new Router({
        prefix:'/money'  //前缀
    })

    let home = new Router();
    home.get("/teacher", async ctx => {
        ctx.body = "Home teacher";
    });
    home.get("/student", async ctx => {
        ctx.body = "Home student";
    });

    let page = new Router();
    page.get("/teacher", async ctx => {
        ctx.body = "Page teacher";
    });
    page.get("/student", async ctx => {
        ctx.body = "Page student";
    });

    //装载所有子路由
    let router = new Router();
    router.use("/home", home.routes());
    router.use("/page", page.routes());

    //加载路由中间件
    app.use(router.routes());
```
> 6.cookie   读： ctx.cookies.get(name,[optins])；写：ctx.cookies.set(name,value,[options])

```
    app.use(async ctx => {
        if (ctx.url === "/index") {
            ctx.cookies.set("name", "xiaohong",{
                omain: "localhost", // 写cookie所在的域名
                path: "/demo/cookie", // 写cookie所在的路径
                maxAge: 1000 * 60 * 60 * 24, // cookie有效时长
                expires: new Date("2019-12-31"), // cookie失效时间
                httpOnly: false, // 是否只用于http请求中获取
                overwrite: false // 是否允许重写
            });
            ctx.body = "cookie is ok";
        } else {
            if (ctx.cookies.get("name")) {
                ctx.body = ctx.cookies.get("name");
            } else {
                ctx.body = "Cookie is none";
            }
        }
    });
```

> 7.模板 koa-views中间件 ejs模板

```
    app.use(
        views(path.join(__dirname, "./demo"), {
            extension: "ejs"
        })
    );

    app.use(async ctx => {
        let title = "hello koa";
        await ctx.render("index", {
            title
        });
    });
```

> 8.koa-static静态资源中间件

```
    const staticPath = "./static";

    app.use(static(path.join(__dirname, staticPath)));
    app.use(async ctx => {
        ctx.body = "hello world";
    });

```

> 9.中间件middleware 第一个参数是 Context 对象，第二个参数是next函数,调用next函数，就可以把执行权转交给下一个中间件

```
    const one = (ctx, next) => {
        console.log('>> one');
        next();
        console.log('<< one');
    }

    const two = (ctx, next) => {
        console.log('>> two');
        next();
        console.log('<< two');
    }

    const three = (ctx, next) => {
        console.log('>> three');
        next();
        console.log('<< three');
    }

    app.use(one);
    app.use(two);
    app.use(three);
```