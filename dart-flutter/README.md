# Dart - Flutter

## Dart
* Dart官网 [官网](https://dart.dev/)
* Dart中文网 [官网](http://dart.goodev.org/)
* Dart中文网dart语法 [官网](http://dart.goodev.org/guides/language/language-tour)

### 创建一个helloworld
* js项目的包管理工具是npm/yarn， 项目依赖的描述文件 package.json
* dart项目的包管理工具是pub，项目依赖的描述文件 pubspec.yaml
* Dart Packages [官网](https://pub.dev/)
* 创建一个helloworld项目
  ```
  pub global activate stagehand
  stagehand console-full
  pub get  #获取依赖库
  ```

* 运行程序
  ```
  pub run bin/main.dart或者dart bin/main.dart
  ```

* 编译程序
  ```
  dart2aot bin/main.dart bin/main.dart.aot
  dartaotruntime bin/main.dart.aot
  ```

* 可执行程序
  * 在pubspec.yaml中添加executables部分

    ```
    executables:包名: main # 要运行的脚本名称，（注意冒号后面的空格）如果有多个脚本，可以添加多个
    
    pub global activate --source path <包路径>
    ```
    
  * 通过pub global activate 包名 全局注册
    

### 创建一个dart web app [官网](https://dart.dev/tutorials/web/get-started)
  * 创建一个简单的webapp项目
    ```
    stagehand web-simple
    ```
  * 创建一个 angular web app，框架语法是angularDart [官网](https://angulardart.dev/)
    ```
    stagehand web-angular
    ```
  * 开发预览 
    ```
    pub global activate webdev
    webdev serve  //打开 localhost：8080
    ```
  * 项目build
    ```
    webdev build
    ```

## flutter 
* flutter官网 [官网](https://flutter.dev/)  

* flutter中文网 [中文官网](https://flutterchina.club/)

* 安装flutter [介绍](https://flutter.dev/docs/get-started/install)

* 运行环境检测
     ```
       flutter doctor 
       flutter doctor -v //更详细
     ```
 ### 创建一个flutter 项目

* 通过编辑器创建

* 命令行创建
  ```
    flutter create xxapp
      //默认Android使用Java，iOS使用Objective-C。
      //如果要指定语言，比如安卓使用Kotlin，iOS使用Swift
    flutter create -i swift -a kotlin xxapp
  ``` 
* 运行flutter项目
  ```
    flutter run
  ```
* 打包成apk安装包
  ```
    flutter build
  ```
  打包后的安装包所在目录  
  ```
    build/app/outputs/apk
  ```
* flutter 生命周期资料

   https://juejin.im/post/5ca81c80e51d4509f8232e9b

* flutter redux状态管理

   https://juejin.im/post/5ba26c086fb9a05ce57697da

* flutter 开源项目

   阿里flutter-go    
   https://github.com/alibaba/flutter-go

   游戏项目Flutter Developer Quest   
   https://github.com/2d-inc/developer_quest


  
  
  