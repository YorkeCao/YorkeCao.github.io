# Ribbon - 负载均衡



## 背景

在前面介绍 Eureka 和 Zuul 的章节中，我们已经建立了服务发现和动态路由的功能。但是这些都还是基于单例服务上的。

有时候，为了提高抗压性，我们会在集群中启用多个节点来提供相同的服务，通过负载均衡逻辑，让这些节点可以分担压力。

但是到目前为止，Zuul 路由的时候，只会将请求分配到从注册中心获取到的服务列表中的第一个节点那里，其他节点并不会获得请求，这显然是无法满足上述需求的。

我们需要让路由可以路由到所有提供服务的节点上，并且通过某种逻辑使各节点之间达到负载均衡。



为此，通过 Spring Cloud 的 Ribbon 组件，我们引入了负载均衡机制。



## Ribbon 简介

Ribbon 提供了基于客户端的软件负载均衡。不同于基于硬件的服务端负载均衡，Ribbon 让客户端在请求服务时，采用特定的逻辑从服务列表中挑选出一个服务，然后再做请求。

作为 Spring Cloud 的一员，Ribbon 很容易与其他组件集成。

Ribbon 提供了一些默认的负载均衡算法：

- AvailabilityFilteringRule：会过滤掉已跳闸（可能由于连接或读取失败）和连接数量过多的服务
- BestAvailabl：跳过已跳闸服务，并选择最低并发请求的服务
- RandomRule：随机分配现有服务
- ResponseTimeWeightedRule：根据响应时间加权，并使用“加权轮询”方式获取服务
- RetryRule：可在现有逻辑上添加重试逻辑
- RoundRobinRule：轮询调用服务
- WeightedResponseTimeRule：同 ResponseTimeWeightedRule
- ZoneAvoidanceRule：基于区域和可用性的服务选择策略



我们将用它来与 Eureka 集成，从注册中心自动获取服务列表。

与 Zuul 集成，在做转发时完成负载均衡。



## Ribbon Demo 搭建

前面我们已经将提供动态路由的 Zuul 与提供服务发现的 Eureka 集成在了一起。接下来我们将 Zuul 与 Ribbon 也集成在一起，这样在转发请求时，就可以在多个节点之间实现负载均衡啦。

1. 添加 Ribbon 依赖

   在 Zuul 项目的 `pom.xml` 文件中添加 Spring Boot Ribbon 启动器：

   ```xml
   <dependency>
     <groupId>org.springframework.cloud</groupId>
     <artifactId>spring-cloud-starter-ribbon</artifactId>
   </dependency>
   ```

2. 改写 Service

   之前我们已经在 8081 端口启动了一个名为 service-client 的服务，并注册到了 Eureka。

   当时写这个服务的目的是为了演示服务发现。为了演示负载均衡，我们先改写一下 `MyServiceController`。

   ```java
   package com.hand.web;

   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.web.bind.annotation.PathVariable;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;

   /**
    * @author Yorke
    */
   @RestController
   public class MyServiceController {

       private static Logger log = LoggerFactory.getLogger(MyServiceController.class);

       @RequestMapping(value = "/greeting/{name}")
       public String great(@PathVariable String name) {
           log.info("Access /greeting");

           return "hello, " + name;
       }
   }
   ```

   这里我们简单地提供了一个打印欢迎文字的服务，同时会输出日志。

   在 8081 端口重新启动该服务。

   在 8082 端口启动一个与此完全相同，也叫做 service-client 的服务。这样我们就可测试 Zuul 在集成 Ribbon 后，做动态转发时的行为了。

3. 配置 Ribbon

   回到 Zuul，在其 `application.yml`（或 `application.properties`）中加入 service-client 的负载均衡配置项：

   ```yaml
   service-client:
     ribbon:
       NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RoundRobinRule
   ```

   这里我们指定一个内置的负载均衡策略，作为演示，这里只是使用了一个简单的轮询规则。

4. 启动集成了 Ribbon 的 Zuul 服务

   重新启动该服务。现在，Zuul 做路由时，就可以根据配置的负载均衡逻辑做转发了。



## Ribbon Demo 测试

在浏览器中输入 `https://localhost:8080/service-client/greeting/world`。回车，观察欢迎信息。

![](\assets\picture\Ribbon00.png)

多按几次回车，观察后台日志。

如果两台服务器轮流出现 `Access /greeting` 日志信息，则说明配置的负载均衡逻辑生效了！



## 总结

Ribbon 作为负载均衡组件，可以很容易地和 Spring Cloud 的其他部件集成。

在我们的架构中，将 Ribbon 与 Zuul 集成，可以集中式地管理负载均衡逻辑，以后调用服务只要走 Zuul，就都可以获得负载均衡的好处了。

集成 Ribbon 只需要引入 `spring-cloud-starter-ribbon` 依赖，然后为服务配置好负载均衡逻辑就可以了。

上面的 Demo 中只展示了一条关于负载均衡策略的配置项。事实上，Ribbon 支持丰富的配置项，例如：

- MaxAutoRetries：最大重试次数
- ConnectTimeout：Apache HttpClient 的连接超时时间
- listOfServers：服务节点列表（与 Eureka 集成后会自动获取，所以不用配置）

等等。

更多资料请移步官方文档。

