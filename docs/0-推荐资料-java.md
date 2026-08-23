# Java 推荐资料

> 优先使用官方资料核验版本和 API 行为；视频课程仅作为入门讲解的补充。链接在 2026-08 核验，课程页面会持续变化，使用前请确认其示例 JDK 与你的项目版本相同。

## Git 与 GitHub

Git 是第一轮的基础工具：请用它保存每次有意义的代码修改、查看差异并在出现问题时定位变更。第一轮是否要求把代码公开上传到 GitHub，按当届考核通知执行；即使暂时只在本地或私有仓库保存，也应完成本地 `init`、`status`、`add`、`commit`、`log`、`diff` 和分支的基本练习。不要把密钥、个人数据、IDE 缓存或编译产物提交到仓库。

- [Git 与 GitHub 的超容易入门](https://west2-online.feishu.cn/wiki/Lsz9w3CiGinXzgkevtmceHZknrf)：优先阅读，学习本地仓库、提交、远程仓库和 Pull Request 的基本流程。
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)：Git 官方书籍，遇到分支、远程、合并或回退概念不清楚时查阅。
- [GitHub Docs：开始使用 GitHub（中文）](https://docs.github.com/zh/get-started)：账号、仓库、Issue、Pull Request 等 GitHub 功能的官方中文说明。
- [GitHub Docs：使用 Git（中文）](https://docs.github.com/zh/get-started/git-basics)：Git 与 GitHub 的关系，以及通过命令行操作远程仓库的官方说明。

## 第一轮入门

- [黑马程序员 JavaSE（Java 25、IDEA 2025）](https://www.bilibili.com/video/BV163GGz2E8c/)：2025 年发布，适合从环境配置、语法到面向对象逐步学习；只跟随第一轮所需章节，不需要先学 Web 框架。
- [Java 学习平台（dev.java）](https://dev.java/learn/)：官方学习入口，用于查阅语言概念、标准库和示例。
- [在 IntelliJ IDEA 中学习 Java（dev.java）](https://dev.java/learn/intellij-idea/)：官方 IDEA 入门路径；本考核默认使用 IDEA，不推荐再为课程切换到 Eclipse。
- [IntelliJ IDEA 文档](https://www.jetbrains.com/help/idea/getting-started.html)：创建项目、配置 JDK、运行与调试的官方说明。
- [CS 自学指南](https://csdiy.wiki/)：需要补充计算机基础、数据结构或公开课时的检索入口，不替代本轮任务。

## Java 与构建工具官方文档

- [Java SE 25 API 文档](https://docs.oracle.com/en/java/javase/25/docs/api/index.html)：查标准库时以此为准；使用其他 JDK 时切换到相应版本。
- [Java 25 安装指南](https://docs.oracle.com/en/java/javase/25/install/installation-guide.pdf)：JDK 安装与平台差异。
- [Maven in 5 Minutes](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html)：本轮使用 Maven 时的官方入门。
- [Gradle Java Plugin](https://docs.gradle.org/current/userguide/java_plugin.html)：本轮使用 Gradle 时的官方入门。
- [JUnit 5 User Guide](https://docs.junit.org/current/user-guide/)：测试、断言和测试生命周期。

## 后续轮次按需查阅

- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/documentation.html)
- [Spring Cloud](https://spring.io/projects/spring-cloud)
- [MySQL Reference Manual](https://dev.mysql.com/doc/)
- [Docker Docs](https://docs.docker.com/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/docs)
- [Elasticsearch Reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Kubernetes 文档](https://kubernetes.io/zh-cn/docs/home/)

## 常用检索与辅助工具

- [Maven Central](https://central.sonatype.com/)：核对 Maven 依赖坐标和版本。
- [Docker Hub](https://hub.docker.com/)：查找镜像及其官方维护者。
- [JSON Formatter & Validator](https://jsonformatter.curiousconcept.com/)：检查 JSON 格式；不得上传密钥、用户数据或生产数据。
- [regex101](https://regex101.com/)：调试正则；不要粘贴敏感文本。
