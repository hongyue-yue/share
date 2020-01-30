# linux 常用命令:Ubuntu

[linux命令大全](https://www.runoob.com/linux/linux-command-manual.html)

## 系统命令

-   关机：poweroff
-   重启：reboot
-   查看用户系统信息    `lsb_release -a`

## ssh 登录

-   远程登录：

```
ssh -p 22(默认端口号) root(用户名)@108.10.1.2(ip地址)
ssh -i [私钥本地文件地址] root(用户名)@108.10.1.2(ip地址)　//ssh使用密钥进入远程
```

-   免密码登录

```
//本机生成密钥
ssh-keygen -t rsa

//拷贝到远程计算机
ssh-copy-id -i ./.ssh/id_rsa.pub root@10.50.67.12
```

## scp 
- Linux scp 命令用于 Linux 之间复制文件和目录。
- scp 是 secure copy 的缩写, scp 是 linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令。
- scp 是加密的，rcp 是不加密的，scp 是 rcp 的加强版。

简易写法:

```
scp [可选参数] file_source file_target 
```

选项与参数：
- -1： 强制scp命令使用协议ssh1
- -2： 强制scp命令使用协议ssh2
- -4： 强制scp命令只使用IPv4寻址
- -6： 强制scp命令只使用IPv6寻址
- -B： 使用批处理模式（传输过程中不询问传输口令或短语）
- -C： 允许压缩。（将-C标志传递给ssh，从而打开压缩功能）
- -p：保留原文件的修改时间，访问时间和访问权限。
- -q： 不显示传输进度条。
- -r： 递归复制整个目录。
- -v：详细方式显示输出。scp和ssh(1)会显示出整个过程的调试信息。这些信息用于调试连接，验证和配置问题。
- -c cipher： 以cipher将数据传输进行加密，这个选项将直接传递给ssh。
- -F ssh_config： 指定一个替代的ssh配置文件，此参数直接传递给ssh。
- -i identity_file： 从指定文件中读取传输时使用的密钥文件，此参数直接传递给ssh。
- -l limit： 限定用户所能使用的带宽，以Kbit/s为单位。
- -o ssh_option： 如果习惯于使用ssh_config(5)中的参数传递方式，
- -P port：注意是大写的P, port是指定数据传输用到的端口号
- -S program： 指定加密传输时所使用的程序。此程序必须能够理解ssh(1)的选项。

使用密钥
```
 scp -i [密钥地址] file_source file_target 
```
[scp命令详解](https://www.runoob.com/linux/linux-comm-scp.html)

## 解压缩文件

### zip

当前文件压缩
```
zip -r name.zip ./*
-r:遍历所有
```
[zip命令详解](https://www.runoob.com/linux/linux-comm-zip.html)

解压文件

```
unzip [.zip文件] [-d <目录>]
```
[unzip命令详解](https://www.runoob.com/linux/linux-comm-unzip.html)

### tar

```
 tar [-j|-z] [cv] [-f 创建的档名] filename... <==打包与压缩
 tar [-j|-z] [tv] [-f 创建的档名]             <==察看档名
 tar [-j|-z] [xv] [-f 创建的档名] [-C 目录]   <==解压缩
```
[tar命令详解](https://www.runoob.com/linux/linux-comm-tar.html)

## 用户设置

### 账号管理
-   设置密码 `passwd`
-   添加新用户 `useradd -m(自动创建home文件) [username] ` 
-   切换用户 `su [username]`

### 权限管理

```
ls -l

-rwxr--r--  1 root root 3107 May  8 10:30 .bashrc
1234567890  A   B   C     D       E        F

1 :"-"不是目录, "d"目录,"l"快捷方式 等
[234]:所属用户权限（r:可读(4), w:可写(2), x:可执行(1)）
[567]:所属同组用户权限
[890]:其他组用户权限

A:有多少档名连结到此节点
B:所属用户
C:所属用户组
D:文件大小（bt）
E:修改时间
F:文件签名（带点是隐藏文件）
```
#### 修改

-   chgrp:改变文件所属组
    ```
    chgrp [新的组名称] [文件名称]
    ```
-   chown:改变文件所属用户
    ```
    chown [用户名] [文件名]
    ```
-   chmod:改变文件权限
    ```
    chmod [权限值] [文件名]
    chmod 777 .bashrc //修改成所有用户都有全部权限
    ```

 权限值： [-rwxr-xr--],表示：

 -   所属用户：rwx = 4+2+1 =7
 -   所属用户组用户：r-x = 4+0+1 =5
 -   其他组用户：r-- = 4+0+0 =4


## 文件系统
重要的系统目录

-   `/bin`: 一般全部用户可调用指令`cat`、`chmod`、`mv`、 `mkdir`等
-   `/boot`:系统开机的主要文件
-   `/dev`:访问设备的接口
-   `/etc`:系统配置文件,比如：`hosts`
-   `/lib`:系统依赖的函数库
-   `/root`:root 用户的家目录
-   `/home`:系统默认用户的家目录
-   `/tmp`:存放程序执行的临时文件
-   `/sbin`:root 用户可执行的指令：`fdisk`、`shutdown`、`mount`
-   `/var`:系统执行中经常会发生变化的文件：系统日志(`var/log`,`var/message`)、程序或启动服务（`var/run`）
-   `/usr`:应用程序存放的目录 应用程序`/usr/bin/`

## 进程管理

-   查询正在运行的进程 `ps -ef`
-   杀死进程 `kill -9 [进程编号]` -9:强制

## vim 常用命令

-   v 第一次按 选择开始，第二下选择结束
-   V 选择整行
-   d 剪切
-   y 复制
-   p 粘帖
-   dd 删除整行

-   i　插入模式　插入到光标前面
-   Esc 关闭插入模式
-   :wq 保存并退出
-   :q  关闭（已保存）
-   :q! 强制关闭

[vim常用命令](http://pizn.github.io/2012/03/03/vim-commonly-used-command.html)


