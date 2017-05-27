# Config - 配置中心



## 背景

随着服务的增多，对项目项目配置文件的管理变动越来越复杂。

每次修改配置，都需要重新部署/重启服务，很麻烦。



解决这一问题，可以引入 Spring Cloud 的 Config 组件。



## Config 简介

Config 为我们提供了集中化的配置解决方案。

这使得我们可以将配置文件从各个项目中抽离出来，在一个地方进行集中管理。

配置文件更新后，刷新受影响的客户端重新加载配置，而无需重启。

Config 提供基于 Git、SVN 和本地的配置文件管理（默认为 Git）。可以对配置进行版本化管理。



## Config Demo 搭建

在前面的章节中，我们已经搭建了一个 Eureka 注册中心、一个 集成了 Ribbon 负载均衡控制的 Zuul 反向代理，以及两个提供相同服务的节点。

接下来，我们为系统引入 Config 组件。

1. Eureka 集成 Config

   目前为止，Eureka Server 只加了一个注解和少量配置。我打算让它和 Conifg 集成起来，这样减少需要启动的服务数量。

   在 Eureka 的 `pom.xml` 文件中引入 Config 的 Spring Boot 启动器：

   ```xml
   <dependency>
     <groupId>org.springframework.cloud</groupId>
     <artifactId>spring-cloud-config-server</artifactId>
   </dependency>
   ```

2. 启用 Conifg

   在 Eureka 的启动类中，通过 `@EnableConfigServer` 注解，启用 Config 服务：

   ```java
   @EnableConfigServer
   @EnableEurekaServer
   @SpringBootApplication
   public class EurekaServerDemoApplication {

   	public static void main(String[] args) {
   		SpringApplication.run(EurekaServerDemoApplication.class, args);
   	}
   }
   ```

   **注意**：这里我将 Config 注解放到了 Eureka 的注解之前。否则可能无法正常访问 Eureka 的管理页面。

3. 配置 Config

   在 `application.yml`（或 `application.properties`）中加入 Config 配置项：

   ```yaml
   spring:
     profiles:
       active: native
     cloud:
       config:
         server:
           native:
             search-locations: classpath:config/{application}
   ```

   这里我先启用了本地模式（默认为 Git），然后设置了配置文件的搜索路径。

   `{application}` 是应用的名称。稍后，我们将在 config 目录下，创建与服务名称相对应的文件夹，并将与服务相关的配置文件放到对映的路径下。

   使用本地配置，就不能进行版本管理了。想尝试基于 Git 的管理中心，可以查看[官方示例](https://spring.io/guides/gs/centralized-configuration/)

4. 创建配置文件目录

   在 `src/main/resources/` 下面创建上面执行的配置文件路径 `config/`，并在其下面创建 Zuul 和 Service 的路径：`zuul-server/` 和 `service-client/`。

5. 移动配置文件

   将 Zuul 的配置文件 `application.yml` 剪切并粘贴到上一步创建的 Config 目录的 `config/zuul-server/` 路径下。以后客户端的配置文件就到这里拿了。

   为了方便测试，我们注释掉启用 SSL/TLS 的部分，否则稍后在测试刷新配置时，可能会报证书不信任的问题（还记得吗？我们的证书是自己生成的，正规的证书需要向证书颁发商购买）。

   ```yaml
   zuul:
     routes:
       baidu:
         path: /baidu/**
         url: https://www.baidu.com

   #server:
   #  ssl:
   #    key-store: classpath:.keystore
   #    key-password: changeit
   #    key-store-type: JKS
   #    key-alias: tomcat

   service-client:
     ribbon:
       NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RoundRobinRule
   ```

   至于 Service，我们只给他配置了启动端口，就先留在原来的地方吧。

   配置文件被拿走了，客户端怎么知道去哪里拿的？这是接下来要做的事。

6. 客户端引入依赖

   在两个 Service 和 集成了 Zuul-Ribbon 的项目中，引入 Conifg 依赖到 `pom.xml`。

   ```xml
   <dependency>
     <groupId>org.springframework.cloud</groupId>
     <artifactId>spring-cloud-starter-config</artifactId>
   </dependency>
   <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-actuator</artifactId>
   </dependency>
   ```

   这里还引入了一个 actuator 的启动器，我们稍后再介绍。

7. 配置客户端

   拿走了 `application.yml` 配置文件后，客户端中还剩下了一个 `bootstrap.yml` 文件。这是在项目启动的引导时需要加载的配置项。

   之前我们在这里配置了名称，接下来我们在这里指定配置源：

   ```yaml
   spring:
     application:
       name: zuul-server
     cloud:
       config:
         uri: http://localhost:8761
     management:
       security:
         enabled: false
   ```

   我们先指定了配置源的地址。

   Config 默认的端口是 8888，如果是在这个端口上运作的，客户端则无需额外配置（默认会在 8888 上找）。由于我们将 Config 集成到了 Eureka 的 8761 端口，所以这里手动指定一下。

   然后我们关闭了一个安全开关，方便测试。否则稍后刷新配置的时候，会需要身份验证。

8. 设置刷新域

   之前引入的 `Actuator` 为我们的客户端暴露了用于刷新并重新设置的接口。利用其 `/refresh` 接口，当配置发生改变时，我们可以刷新客户端配置，而无需重启服务。

   但是在此之前我们需要通过 `@RefreshScope` 注解来设置刷新域。

   这里，我们直接将它注解到了 Zuul-Ribbon 项目的启动类上，以此来全局刷新。

   ```java
   @EnableZuulProxy
   @EnableEurekaClient
   @RefreshScope
   @SpringBootApplication
   public class ZuulServerDemoApplication {

   	public static void main(String[] args) {
   		SpringApplication.run(ZuulServerDemoApplication.class, args);
   	}

   	@Bean
   	public CrossOriginFilter crossOriginFilter() {
   		return new CrossOriginFilter();
   	}
   }
   ```

9. 启动服务

   依次启动 Eureka-Config 项目、Zuul-Ribbon 项目及两个 Service 项目，启动整个集群。

   ​

## Config Demo 测试

显然，如果 Zuul-Ribbon 还能正常地做路由，并在两个 Service 之间做负载均衡，则说明它成功地从 Config 配置中心中获取到配置了。

在浏览器中输入 `http://localhost:8080/service-client/greeting/world`。

多次回车，验证结果。



可以在 `http://8761/${application-name}/default` 下查看某个项目的配置信息：

![](\assets\picture\Config00.png)



测试配置更改，我们将 Zuul 对 `/baidu` 的路由改为路由到有道（http://www.youdao.com/）。

```yaml
zuul:
  routes:
    baidu:
      path: /baidu/**
      url: http://www.youdao.com/ # 转发到有道
```

**注意**：要去 Eureka-Config 打包后的地方改（如 `target/classes/config/zuul-server` 路径下），不要在 `resources/` 下改。

保存更改后，向 `http://localhost:8080/refresh` 发送一个空的 POST 请求，以刷新配置。

![](\assets\picture\Config01.png)

可以看到，响应中 包含了更改的配置项。

在浏览器中输入 `http://localhost:8080/baidu`，可以看到，已经重定向到有道主页啦！

![](\assets\picture\Config02.png)



## 总结

基于 Spring Boot 的 Config 集中配置组件，为我们提供了开箱即用的开发体验。

配置配置中心，只需引入 `spring-cloud-config-server` 依赖，并通过 `@EnableConfigServer` 注解启用，在配置文件路径即可；

对于客户端，只需引入 `spring-cloud-config-server` 依赖，并配置 Config 源即可。

如果引入了 `spring-boot-starter-actuator` 依赖，还可以使用 `refresh/` 免重启地刷新配置。

结合 Git 或 SVN，还可以对配置进行版本管理。