# Datapack Transmitter
将本地的datapack实时同步到服务器，以便多人在同一服务器开发不同datapack，不会将服务器内容传输至客户端.

## 安装：

1.下载该项目（git clone或直接下载zip并解压）

2.[安装Node.Js（推荐14.x），配置环境变量](https://blog.csdn.net/luckybuling/article/details/81292855)

3.在 解压/clone 后的目录内执行
```
npm i
```

4.按下面的用法运行

## 用法：

### 服务器端:
```
node app -mode server -port [端口号] -folder [根目录]
```

### 客户端
```
node app -mode client -server-ip [服务器IP]:[服务器端口] -token [日志里记录的名字/代号 如：MicroBlock/Ganxiaozhe/HHTC/Hangback] -folder [根目录]
```
