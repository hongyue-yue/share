# commander 

## version

设置版本信息
```
.version("1.0.0")
```

## option

设置启动参数格式 `commander.options(参数,["端口号"],正则或者fn,"默认值")`

- 参数值为bool
```
.option("-s,--show","isShow?")
```

- 参数为需要输入的具体个值

```
.option("-n,--name<name>","name")
```

- 对输入的值进行设置,并且在设置默认值（在输入值不在限定范围中,而不是不需要输入）

```
.option("-n,--name<name>","name",/^(xiaoming|xiaohong)$/i,"xiaoming")

```

- 对输入的值进行处理,`val`(输入都值),`设置都默认值`(mon)

```
.option("-a--arr<arr>","arr",(val,mon)=>{
    mon.push(val)
    return mon
},[])
```
## command

可以自定义命令

```
.command("start <dir> [otherOption...]")
.alias("st") //短命令
.description("描述")
.action((dir,otherOption)=>{
    console.log("dir:%s\n",dir);
    console.log("otherOption:%j\n",otherOption);
})
.on("--help",()=>{ //在 --help 时添加自定义输出
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('  $ start ../dir');
    console.log('  $ st ../dir otherOption  otherOption otherOption');
})
```

## arguments

获取未定义的命令 和 参数。可以用来对错误输入进行正确引导
```
program
  .version('0.1.0')
  .arguments('<cmd> [env]')
  .action(function (cmd, env) {
     cmdValue = cmd;
     envValue = env;
  });

```

## on 

#### 自定义 定义全局的  `--help 输出`
```
program.on('--help', function(){
  console.log('')
  console.log('Examples:');
  console.log('  $ custom-help --help');
  console.log('  $ custom-help -h');
});
```

### 监听退出 `exit`

```
process.on('exit', () => {
  console.log()
})
```

## usage 

设置usage值


