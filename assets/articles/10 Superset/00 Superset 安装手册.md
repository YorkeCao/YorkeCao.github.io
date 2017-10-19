# Superset 安装手册

系统 Python 版本：2.6.6

virtualenv 虚拟机 Python 版本：Python 2.7.13

Superset 版本：0.18.4

访问地址：http://118.178.226.154:8088/

帐号/密码：admin/admin



## Python 安装

1. 检查 Python 是否安装

   ```
   # python -V
   Python 2.6.6
   ```

   发现是 Python 2.6.* 的一个版本。Superset 官方文档中有如下内容：

   > Superset is tested against Python `2.7` and Python `3.4`. Airbnb currently uses 2.7.* in production. We do not plan on supporting Python `2.6`.

   所以，我们先从 Python 2.7 的安装开始。

2. 升级和安装编译 Python 需要的工具

   ```
   # yum groupinstall "Development tools"
   # yum install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel
   ```

3. 下载 Python

   ```
   # cd /opt
   # wget https://www.python.org/ftp/python/2.7.13/Python-2.7.13.tgz
   # tar -xzvf Python-2.7.13.tgz
   # cd Python-2.7.13
   ```

4. 编译并安装 Python

   ```
   # ./configure --prefix=/usr/local
   # make && make altinstall
   ```




## 安装 Superset

1. 升级和安装编译 Superset 需要的工具

   ```
   # yum upgrade python-setuptools
   # yum install gcc gcc-c++ libffi-devel python-devel python-pip python-wheel openssl-devel libsasl2-devel openldap-devel
   ```

2. 安装 Python 虚拟机

   ```
   # pip install virtualenv
   # cd /opt/
   # virtualenv -p /usr/local/bin/python2.7 venv2.7
   # . ./venv2.7/bin/activate
   (venv2.7)# python -V
   Python 2.7.13
   ```

3. 升级相关包

   ```
   (venv2.7)# pip install --upgrade setuptools pip
   ```

4. 安装 Superset

   ```
   (venv2.7)# pip install superset
   ```

5. 创建 admin 账户

   ```
   (venv2.7)# fabmanager create-admin --app superset
   ```

   这一步会要求输入用户信息，这里我设置的帐号密码为 admin/admin

6. 初始化数据库

   ```
   (venv2.7)# superset db upgrade
   ```

7. 加载示例

   ```
   (venv2.7)# superset load_examples
   ```

8. 加载默认的角色和权限

   ```
   (venv2.7)# superset init
   ```

9. 运行 superset

   ```
   (venv2.7)# superset runserver
   ```




## 运行 Superset

Superset 的默认端口为 8088，在浏览器中直接访问即可。

登录的帐号密码为之前设置的 admin/admin。

可以通过 `nohup` 使之后台运行，并通过 `-p` 指定端口号，如：

```
(venv2.7)# nohup superset runserver -p 9099 &
```

