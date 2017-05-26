# Zuul - 反向代理



## 背景

将系统划分成不同的服务后，每个服务就都有了自己的入口。外部想调用这些服务，就得管理这些入口，很不方便。

为了解决跨域问题，每个服务都得在自己内部做一个处理，重复的事情做很多遍。

为了解决这些问题，之前我们用 Nginx 做反向代理，来为各服务提供统一的入口。但是用 Nginx 做路由转发时，需要我们配置好转发逻辑。

在采用了 Eureka 服务发现组件后，我们的服务地址在注册中心得到了集中管理。那么我们的转发中心能不能根据注册中心中的注册信息提供免配置的路由转发呢？



为此，我们引入了 Spring Cloud 的 Zuul 组件，让它与 Eureka 配合实现上述需求，以及其他更进一步的功能。



## Zuul 简介

根据官方介绍，Zuul 可以看作是所有后台服务的前门。

作为边缘服务，Zuul 提供了动态路由、监控、弹性、安全性等功能。

这些特性得益于 Zuul 覆盖率请求转发各生命周期的诸多过滤器，正是这些过滤器 Zuul 将功能灵活地应用于边缘服务。

- 做反向代理后端服务，并可以配合负载均衡逻辑做动态路由
- 作为所有请求的关卡，Zuul 可以统计所有请求信息，帮助监控状态
- 对请求做安全验证，起到“门卫”的作用
- 静态响应。直接在边缘构建一些响应，而不转发到内部集群

等等……

在这里，我们先用 Zuul 与 Eureka 集成，让它帮助我们做免配置的动态路由。下一章我们还会把它和 Ribbon 集成，从而提供负载均衡特性。

另外，我们还通过其他示例，展示了 Zuul 作为统一入口的其他好处。



## Zuul Demo 搭建

无论是 Spring 官网提供的还是 IDE 集成的 [Spring Initializr](https://start.spring.io/)，都可以帮助我们快速获得 Spring Boot 项目。

1. 初始化 Spring Boot 项目

   通过 Spring Initializr 获得一个 Zuul Server 项目，只要在依赖中勾选 **Zuul** 即可。这里我们要与 Eureka 集成，也勾选 **Eureka Discovery** 依赖。

   ![](\assets\picture\Zuul00.png)

   Spring Initializr 会自动帮我们把 `spring-cloud-starter-zuul` 和 `spring-cloud-starter-eureka` 依赖添加到 `pom.xml` 中。

   ```xml
   <dependency>
     <groupId>org.springframework.cloud</groupId>
     <artifactId>spring-cloud-starter-zuul</artifactId>
   </dependency>
   <dependency>
     <groupId>org.springframework.cloud</groupId>
     <artifactId>spring-cloud-starter-eureka</artifactId>
   </dependency>
   ```

2. 启用 Zuul 服务

   在 Spring Boot 启动类中，通过注解 `@EnableZuulProxy` 启用 Zuul 代理，并通过 `@EnableEurekaClient` 将其标识为 Eureka Client。

   ```java
   package com.hand;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
   import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

   @EnableZuulProxy
   @EnableEurekaClient
   @SpringBootApplication
   public class ZuulServerDemoApplication {

   	public static void main(String[] args) {
   		SpringApplication.run(ZuulServerDemoApplication.class, args);
   	}
   }
   ```

3. 配置 Zuul 服务

   要在 Eureka Server 中注册 Zuul，还需在 `src/main/resources/bootstrap.yml` 中配置 `spring.application.name`（在[《Eureka - 服务发现》章节中介绍过]()）。

   ```yaml
   spring:
     application:
       name: zuul-server
   ```

4. 启动服务

   运行该 Spring Boot 项目，启动该服务。

   ​



## Zuul Demo 测试

在前面的[《Eureka - 服务发现》]()文件中，我们已经启动了 Eureka Server，以及一个注册成功的 Service Demo1。

在本章节中，我们又启动并注册了 Zuul 反向代理服务。现在自动路由的 Zuul 组件有了，发现服务的 Eureka 组件也有了，系统是否可以帮我们自动路由了？接下来我们做一个测试。

如果没有为 Zuul 配置端口，那么它应该使用的是默认的 8080 端口。

我们的 Service Demo1 的所在端口是 8081；注册名称是 service-client；提供的接口是 `/service-instances/{applicationName}`。

在浏览器中输入 `http://localhost:8080/service-client/service-instances/service-client`，如果出现了服务示例信息，则测试通过。

![](\assets\picture\Zuul01.png)

可见，Zuul 和 Eureka 集成后，会把服务根据其注册名称映射在自己的 URL 路径之下。

在本实例中，地址为 `http://localhost:8081` 的 service-client 服务就映射在了 `http://localhost:8080/service-client` 下。

也就是说，想要调用服务，只要知道 Zuul 的位置，以及所求服务的注册名称，就可以啦，Zuul 和 Eureka 会自动帮我们把请求路由到正确的位置！



## Zuul 路由配置

根据前文的介绍，我们知道结合 Eureka，Zuul 可以帮我们自动路由到已注册的服务。

那么对于没有注册到 Eureka 的服务，该如何路由呢？那就需要我们手动配置映射关系了。

接下来，我们尝试把百度主页映射到 Zuul 的 `/baidu` 路径下。

在 `application.yml`（或 `application.properties`）中加入配置项：

```yaml
zuul:
  routes:
    baidu:
      path: /baidu/**
      url: https://www.baidu.com
```

这里我们添加了一个名为 baidu 的配置项，并把前缀为 `/baidu/` 的路径都映射到了百度主页（注意用 https）。

重新启动 Zuul。

在浏览器中输入 `http://localhost:8080/baidu/`，回车搞定：

![](\assets\picture\Zuul02.png)



## Zuul 过滤器

Zuul 支持多种类型的过滤器，可以在路由生命周期的各个节点，让我们做一些额外的处理。

- PRE：请求被路由之前调用
- ROUTING：将请求路由到服务
- POST：请求被路由之后调用
- ERROR：发生错误时调用

作为演示，我们接下来自定义一个 POST 类型的过滤器，帮我们为响应信息添加 `Access-Control-Allow-Origin` 头，以实现跨域访问效果。

1. 创建过滤器

   在 `src/main/java/com/hand/filter/` 路径下创建 `CrossFilter` 类，并继承 `ZuulFilter`。

2. 重载 ZuulFilter 的 4 个方法如下：

   ```java
   package com.hand.filter;

   import com.netflix.zuul.ZuulFilter;
   import com.netflix.zuul.context.RequestContext;

   import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.POST_TYPE;
   import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.SEND_RESPONSE_FILTER_ORDER;

   /**
    * @author Yorke
    */
   public class CrossOriginFilter extends ZuulFilter {
       // 设置过滤器类型为 POST
       @Override
       public String filterType() {
           return POST_TYPE;
       }

       // 过滤器顺序
       @Override
       public int filterOrder() {
           return SEND_RESPONSE_FILTER_ORDER - 1;
       }

       // 是否执行过滤
       @Override
       public boolean shouldFilter() {
           return true;
       }

       // 执行逻辑
       @Override
       public Object run() {
           RequestContext context = RequestContext.getCurrentContext();
           context.addZuulResponseHeader("Access-Control-Allow-Origin", "*");
           return null;
       }
   }
   ```

   代码中的注释已经给出了一般性解释。

   执行逻辑的核心是在 `run()` 方法中。这里我们通过 `RequestContext` 为其添加了一个用于运行跨域访问的消息头。

3. 注册过滤器 Bean

   在 Spring Boot 启动类中，将我们客制化的过滤器注册为 Bean。

   ```java
   @Bean
   public CrossOriginFilter crossOriginFilter() {
   	return new CrossOriginFilter();
   }
   ```

4. 重启项目

   重新启动项目。

   现在，所有经过 Zuul 转发的请求，返回的响应中都会加上 `Access-Control-Allow-Origin` 为 `*` 的信息。

   这样即便后台服务不做任何处理，也不会存在跨域问题了。

   ​

## Zuul Https

Zuul 作为整个微服务的一扇门，可以帮我们方便地为整个集群加持 https。

集群内部不对外开发，所有请求都通过 Zuul 路由，那么只要 Zuul 启用了 https，就可以将整个集群的消息对外加密传输了。

启用 https 的 SSL/TLS，需要服务器配备证书。生产环境需要向证书颁发机构购买证书，用作测试我们就用 keytool 生成一个证书就好。

1. 生成证书

   打开一个终端，输入如下命令：

   ```
   keytool -genkey -alias tomcat -keyalg RSA
   ```

   根据提示信息输入一些信息，即可在你的当前用户目录下找到一个 .keystore 的文件。

   **注意**：在输入名称的时候最好输入你的服务的域名，这里我们就用 localhost 吧。其他的可以随意。另外默认的密码是 changeit。

2. 添加证书

   将生成的 .keystore 证书放到项目的 `src/main/resources/` 目录下即可。

3. 启用 ssl

   在 `application.yml`（或 `application.properties`）中加入配置项：

   ```yaml
   server:
     ssl:
       key-store: classpath:.keystore
       key-password: changeit
       key-store-type: JKS
       key-alias: tomcat
   ```

   这里分别配置了证书的路径、密码、类型、别名。

4. 启动项目

   重新启动项目。然后就可以在浏览器中使用 https 访问服务啦！

   **注意**：由于我们的证书不受信任，所以浏览器会有警报信息。放心，无毒，继续访问就好。

   ![](\assets\picture\Zuul03.png)




## 总结

基于 Spring Boot 的 Zuul 动态路由组件，为我们提供了开箱即用的开发体验。

集成 Eureka 配置反向代理，只要引入 `spring-cloud-starter-zuul` 和 `spring-cloud-starter-eureka` 依赖，并通过 `@EnableZuulProxy` 注解开启代理服务、通过 `@EnableEurekaClient` 注解注册为 Eureka 客户端，即可以免配置地对已注册的服务提供自动路由。

通过额外的配置项还可以对未注册的服务节点提供反向代理。

Zuul 将服务入口收敛到了一处，方便外部调用，也能对微服务集群做一些集中化的管理。

通过其过滤器可以在请求调用的各生命周期中方便地做客制化处理。

配合 Spring Cloud 的其他组件，还可以根据负载均衡逻辑做动态路由等。
