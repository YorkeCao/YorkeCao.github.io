# Eureka - 服务发现



## 背景

我们将系统按照业务划分成了独立的项目（服务）。这些项目可以独立的开发、部署。

项目通过 RESTful 风格的接口对外提供服务。服务之间相互调用，也是通过此接口完成。

随着系统内服务的增多，由于服务地址的增多，服务之间的相互调用会变得越来越难以管理。

在通过扩展服务节点数量以提高服务压力，并提供负载均衡的条件下，传统的硬编码调用方式更是应接不暇。



为此，通过 Spring Cloud 的 Eureka 组件，我们引入了新的服务发现机制。



## Eureka 简介

在使用 Eureka 进行服务发现的系统中，主要有 2 类节点：Eureka Server 和 Eureka Client。

### Eureka Server

Eureka Server 作为注册中心，会记录系统中存在的服务节点，并通过心跳机制与服务提供者维持长链接，以监控服务节点的状态。

Eureka Server 会将服务的注册表缓存到 Eureka Client，以供后者获取其所需服务的位置。

当系统中的某个服务节点宕机后，Eureka Server 会通知给 Eureka Client。

### Eureka Client

Eureka Client 会在启动时向 Eureka Server 注册自己的位置。

Eureka Client 也可通过 Eureka Server 获取其他已注册的节点的位置。



## Eureka Demo 搭建

无论是 Spring 官网提供的还是 IDE 集成的 [Spring Initializr](https://start.spring.io/)，都可以帮助我们快速获得 Spring Boot 项目。

### Eureka Server Demo

1. 初始化 Spring Boot 项目

   通过 Spring Initializr 获得一个 Eureka Server 项目，只要在依赖中勾选 **Eureka Server** 即可。

   ![](\assets\picture\Eureka00.png)

   Spring Initializr 会自动帮我们把 `spring-cloud-starter-eureka-server` 依赖添加到 `pom.xml` 中。

   ```xml
   <dependency>
     <groupId>org.springframework.cloud</groupId>
     <artifactId>spring-cloud-starter-eureka-server</artifactId>
   </dependency>
   ```

2. 启用 Eureka 服务

   在 Spring Boot 启动类中，通过注解 `@EnableEurekaServer` 启用 Eureka Server。

   ```java
   package com.hand;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

   @EnableEurekaServer // 启用 Eureka Server
   @SpringBootApplication
   public class EurekaServerDemoApplication {

   	public static void main(String[] args) {
   		SpringApplication.run(EurekaServerDemoApplication.class, args);
   	}
   }
   ```

3. 配置 Eureka Server

   在 `application.yml`（或 `application.properties`）中加入配置项：

   ```yaml
   server:
     port: 8761
   eureka:
     client:
       register-with-eureka: false
       fetch-registry: false
   logging:
     level:
       com:
         netflix:
           eureka: off
           discovery: off
   ```

   - 将端口设为 8761。这是注册中心的默认端口，Eureka Client 默认会在此端口获取注册位置。如果采用其他端口，需要在 Eureka Client 配置正确的注册中心位置。
   - 默认情况下，注册中心也会试图注册自己。通常不需要注册中心提供其他服务，所以在这里禁用掉。
   - 在生产环境，我们会需要多个注册中心，作为容错副本。在我们的演示应用中，我们的 Eureka Server 以单例模式运行，所以我们禁用掉相关日志，以免它抱怨找不到副本节点。

4. 启动 Eureka

   运行该 Spring Boot 项目，注册中心就跑起来了。


### Eureka Client Demo

1. 初始化 Spring Boot 项目

   通过 Spring Initializr 获得一个 Eureka Client 项目，只要在依赖中勾选 **Eureka Discovery** 即可。当然作为服务节点，同时也勾选 **Web** 依赖。

   ![](\assets\picture\Eureka01.png)

   Spring Initializr 会自动帮我们把 `spring-cloud-starter-eureka` 和 `spring-boot-starter-web` 依赖添加到 `pom.xml` 中。

   ```xml
   <dependency>
     <groupId>org.springframework.cloud</groupId>
     <artifactId>spring-cloud-starter-eureka</artifactId>
   </dependency>
   <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-web</artifactId>
   </dependency>
   ```

2. 启用 Eureka 客户端

   在 Spring Boot 启动类中，通过注解 `@EnableEurekaClient` 启用 Eureka Client。

   ```java
   package com.hand;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

   @EnableEurekaClient
   @SpringBootApplication
   public class ServiceDemo1Application {

   	public static void main(String[] args) {
   		SpringApplication.run(ServiceDemo1Application.class, args);
   	}
   }
   ```

3. 配置 Eureka Client

   在 `application.yml`（或 `application.properties`）中配置服务启动端口。不同的服务需运行在不同的端口上。

   ```yaml
   server:
     port: 8081
   ```

   在 `src/main/resources/bootstrap.yml` 中配置 `spring.application.name`。服务将用此名称作为标识，将自己注册到注册中心。这条配置是用在服务引导时的，所以按照惯例配置在 `bootstrap.yml` 中。

   ```yaml
   spring:
     application:
       name: service-client
   ```

4. 编写 RESTful 服务

   既然是服务提供者，我们这里编写一个简单的服务接口供外部调用。

   新建 `src/main/java/com/hand/web/MyServiceController` 类，拷贝如下代码：

   ```java
   package com.hand.web;

   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.cloud.client.ServiceInstance;
   import org.springframework.cloud.client.discovery.DiscoveryClient;
   import org.springframework.web.bind.annotation.PathVariable;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;

   import java.util.List;

   /**
    * @author Yorke
    */
   @RestController
   public class MyServiceController {

       @Autowired
       private DiscoveryClient discoveryClient;

       @RequestMapping(value = "/service-instances/{applicationName}")
       public List<ServiceInstance> serviceInstancesByApplicationName(@PathVariable String applicationName) {
           return this.discoveryClient.getInstances(applicationName);
       }
   }
   ```

   这是一个来自官方指南的例子。该接口可以通过服务名称，从注册中心中获取相应的服务列表。稍后我们会用它来从注册中心中获取它自己（因为目前我们只注册了这一个服务）。作为演示，这可以说明我们的服务的确在 Eureka Server 中注册成功了。

5. 启动服务

   运行该 Spring Boot 项目，启动该服务。





## Eureka Demo 测试

按照上面介绍的步骤，依次启动 Eureka Server 和 Eureka Client，即可开始测试啦。

在浏览器中输入 `http://localhost:8081/service-instances/service-client`，如果出现了服务示例信息，则测试通过。

![](\assets\picture\Eureka02.png)



## 总结

基于 Spring Boot 的 Eureka 服务发现组件，为我们提供了开箱即用的开发体验。

配置注册中心，只需要引入 `spring-cloud-starter-eureka-server` 依赖，并通过 `@EnableEurekaServer` 注解启用，再配置少许配置项（如端口等）即可；

配置客户端注册到 Eureka，只需引入 `spring-cloud-starter-eureka` 依赖，并通过 `@EnableEurekaClient` 注解启用，再配置服务名称即可。

之后，当代码中服务需要相互调用时，我们不需要再人为管理各种服务的地址，也无需用硬编码写死在代码/配置文件中，只需要记住服务的名称，然后去注册中心获取服务即可。配合 Spring Cloud 的其他组件，还可以对多节点服务提供负载均衡等特性。
