# Spring Cloud 架构概述

随着后台功能的增多，我们将独立的业务功能拆分成了独立的模块，模块之间通过轻量级的 RESTful API 相互通信。

再加上前后端分离引起的项目数量增多，传统的架构已经越来越成为限制系统运作的瓶颈。

为解决模块增多带来的一系列问题，我们研究了一些分布式架构，并对 Spring Cloud 微服务架构做了重点研究。



本章节作为概述，简单介绍了我们目前研究到的 Spring Cloud 组件，及其解决的问题。

之后还有针对各个组件的一系列章节，重点介绍其功能，并演示了这些组件的快速搭建和集成步骤。

示例项目已经上传到了 dmp 项目的 `dmp-system/dmp-spring-cloud` 中。



先看下总的架构图：

![](\assets\picture\架构图.png)



### Eureka

服务发现组件。

维护一个注册中心，其他服务要作为 Client，在启动时注册到 Eureka Server 中，并通过心跳机制保持长链接，以供 Eureka 检查节点状态。

注册中心会把已注册的服务列表缓存到各客户端。当客户端需要调用某个服务时，直接根据服务名称在已注册的列表中寻址，并通信。

如果有节点宕机，注册中心会通知客户端。



### Zuul

动态路由组件。

作为各服务的反向代理，路由各服务请求。

可以与 Eureka 集成，自动路由；也可以手动配置路由规则。

Zuul 可以作为系统的门户，配合做访问控制。



### Ribbon

负载均衡组件。

当有多个节点提供相同的服务时，可以根据负载均衡策略，选取最终处理请求的服务。

与 Eureka、Zuul 集成，可以在请求转发时处理负载均衡。

Ribbon 默认提供了一些负载均衡的策略。也可以使用自定义的负载均衡规则。



## 请求流程

根据上面的架构图：

1. 所有的用户都通过 Zuul 作为入口来请求服务
2. Zuul 会从 Eureka 中获取注册的服务列表
3. Ribbon 根据负载均衡策略选取一个服务节点
4. 请求转发到选取的服务节点，收到响应后再转回给用户
5. 其他的 Web 应用也可以通过 Zuul 代理，统一接口
6. 作为唯一的入口，Zuul 可以与访问控制中心集成
