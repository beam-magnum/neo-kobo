---
title: 「服务器」docker配置cloudreve并通过dokcer配置的nginx反代https
date: 2022-04-18 11:03:47
tags:
---
# 「服务器」docker配置cloudreve并通过dokcer配置的nginx反代https

### docker一键部署cloudreve
```
docker run -d \
--name=cloudreve \
-p 5212:5212 \
--mount type=bind,source=<path_to_your_config>,target=/cloudreve/conf.ini \
--mount type=bind,source=<path_to_your_db>,target=/cloudreve/cloudreve.db \
-v <path_to_your_uploads>:/cloudreve/uploads \
-v <path_to_your_avatar>:/cloudreve/avatar \
cloudreve/cloudreve:latest
```
部署完成之后打开 http://your-ip:5212 可以进入cloudreve默认页面。
使用`docker logs -f cloudreve`命令获取初始用户信息。

### dokcer配置nginx反代
docker配置nginx时由于mount在我的机器上容易出问题，所以我选择了进入容器内配置nginx的方式，docker命令就比较简单。拉取nginx官方docker image然后`docker run -d --name=<your-name> -p 80:80 -p 443:443 nginx:latest`就结束了。

输入`docker exec -it <your-name> /bin/bash`进入容器内部，默认是root用户。官方镜像里面是没有vim的需要自行`apt update`和`apt install vim`一下。

nginx反代主要是proxy bypass一项，需要设置被反代的对象的地址。由于docker容器之间自己是由本地网络的，用`dokcer inspect cloudreve`查看容器ip。然后在`/etc/nginx/conf.d/`目录下新增`nginx.conf`文件，配置如下：
```
server {
    listen 443 ssl;
	listen [::]:443 ssl;

    server_name <your-domain>;

    # ssl_certificate /etc/nginx/cert/fullchain.pem;
    # ssl_certificate_key /etc/nginx/cert/private.pem;
	ssl_certificate <your-certifate>;
    ssl_certificate_key <your-private-key>;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA';
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;
    add_header Strict-Transport-Security max-age=15768000;

    location / {
        proxy_pass http://容器ip:5212/; # 转发规则
        proxy_set_header Host $proxy_host; # 修改转发请求头，让8080端口的应用可以受到真实的请求
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass_header Server;
        proxy_connect_timeout 3s;
        proxy_read_timeout 10s;
        index  index.html index.htm;
    }
}

server {
    listen *:80;
    listen [::]:80;
    server_name <your-domain>;
    return 301 https://<your-domain>$request_uri;
}
```
其中我是把ssl证书文件都`docker cp`到容器内了，在`/etc/nginx/cert/`目录下。证书为`fullchain.pem`，私钥为`private.pem`。
然后运行：
```
nginx -t
nginx -s reload
```
这里建议在容器内配置的原因还有一个，容器内可以直接重启nginx服务，在容器外修改的话一个不慎可以容器就打不开了，需要重新部署，不过也可以通过docker执行命令，我是感觉直接进去也不麻烦就是了。

有空补几个截图。

#### Reference
[1]https://zhouyuqian.com/2021/07/24/nginx/