
# nginx配置

## cmd常用命令

-c：使用指定的配置文件而不是conf目录下的nginx.conf 。
-t：测试配置文件是否正确，在运行时需要重新加载配置的时候，此命令非常重要，用来检测所修改的配置文件是否有语法错误。
-s: start 启动
-s：reload 重载
-s：stop 停止

## 配置文件
```
########### 每个指令必须有分号结束。#################
#user administrator administrators;  #配置用户或者组，默认为nobody nobody。
#worker_processes 2;  #允许生成的进程数，默认为1
#pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址
error_log log/error.log debug;  #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
events {
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    #最大连接数，默认为512
}
http {
    include       mime.types;   #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
    #access_log off; #取消服务日志    
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
    access_log log/access.log myFormat;  #combined为日志格式的默认值
    sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。

    upstream mysvr {   
      server 127.0.0.1:7878;
      server 192.168.10.121:3333 backup;  #热备
    }
    error_page 404 https://www.baidu.com; #错误页
    server {
        keepalive_requests 120; #单连接请求上限次数。
        listen       4545;   #监听端口
        server_name  127.0.0.1;   #监听地址       
        location  ~*^.+$ {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           #root path;  #根目录
           #index vv.txt;  #设置默认页
           ＃proxy_set_header　＃重新定义或添加字段传递给代理服务器的请求头
           ＃proxy_redirect　＃重定向
           ＃alias　＃别名路径
           proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
           deny 127.0.0.1;  #拒绝的ip
           allow 172.18.5.54; #允许的ip           
        } 
    }
}
```

## 常用配置
#### 静态HTTP服务器
```

server {
    listen80; # 端口号
    location / {
        root /usr/share/nginx/html; # 静态文件路径
    }

```
### 反向代理服务器
```

server {
    listen80;
    location / {
        proxy_pass http://127.0.0.1:8080; # 应用服务器HTTP地址
    }
    location ^~/a/ {
        rewrite ^/a/(.*)$ /$1 break; #改变路径
        proxy_pass http://127.0.0.1:8080; # 应用服务器HTTP地址
    }
}
```
### 负载均衡
```

upstream myapp {

    ip_hash; # 根据客户端IP地址Hash值将请求分配给固定的一个服务器处理

    server192.168.20.1:8080; # 应用服务器1
    server192.168.20.2:8080; # 应用服务器2
}
server {
    listen80;
    location / {
        proxy_pass http://myapp;
    }

```

### 虚拟主机
```

server {
    listen80 default_server;
    server_name _;
    return444; # 过滤其他域名的请求，返回444状态码
}
server {
    listen80;
    server_name www.aaa.com; # www.aaa.com域名
    location / {
        proxy_pass http://localhost:8080; # 对应端口号8080
    }
}
server {
    listen80;
    server_name www.bbb.com; # www.bbb.com域名
    location / {
        proxy_pass http://localhost:8081; # 对应端口号8081
    }
}
```