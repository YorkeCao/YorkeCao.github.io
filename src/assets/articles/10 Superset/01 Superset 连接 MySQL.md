# Superset 连接 Mysql



## 安装 mysqlclient

1. 安装必须的库

   - debian / Ubuntu：

     ```
     sudo apt-get install python-dev libmysqlclient-dev
     ```

   - Red Hat / CentOS：

     ```
     sudo yum install python-devel mysql-devel
     ```

   如果使用 Python 3，需要安装如下库：

   - debian / Ubuntu：

     ```
     sudo apt-get install python3-dev
     ```

   - Red Hat / CentOS：

     ```
     sudo yum install python3-devel
     ```

     ​

2. 安装 mysqlclient

   ```
   pip install mysqlclient
   ```




##配置 Superset

进入添加 Database 的页面。

1. 在 Database 条目中任意起一个名字，如：MySQLDB
2. 在 SQLAlchemy URI 中输入连接串，如：mysql://username:password@localhost:3306/datasource
3. 单击 **Test Connection** 测试链接
4. 测试成功后，点击 **Save** 保存