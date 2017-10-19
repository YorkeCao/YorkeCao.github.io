# 使用 Redis 做 Superset 的缓存

配置 Superset 的缓存后端，只需在其配置文件中提供一个 `CACHE_CONFIG` 常量即可。

而对于 Redis，我们还需要一个运行一个 Redis 服务，以及安装一个 redis-py 库（Redis 的 Python 接口）。



## 安装 Redis

当前 Redis 最新版为 3.2.8，在 `/opt/` 目录下安装并启动：

```
cd /opt/
wget http://download.redis.io/releases/redis-3.2.8.tar.gz
tar xzvf redis-3.2.8.tar.gz
cd redis-3.2.8/
make
cd src/
./redis-server
```



## 安装 redis-py

在 Superset 所在虚拟环境中安装 redis-py：

```
pip install redis
```



## 配置使用 Redis 做缓存

在 Superset 的 config.py 中，做如下配置：

```python
import redis
...
CACHE_DEFAULT_TIMEOUT = 500 # 默认超时时间
CACHE_CONFIG = {
    'CACHE_TYPE': 'redis', # 使用 Redis
    'CACHE_REDIS_HOST': 'localhost', # 配置域名
    'CACHE_REDIS_PORT': 6379, # 配置端口号
    'CACHE_REDIS_URL': 'redis://localhost:6379' # 配置 URL
}
```



## 测试

重新启动 Superset

打开任意 Dashboard，观察后台打印情况：

![](\assets\picture\Superset\cache_redis.png)

配置成功！
