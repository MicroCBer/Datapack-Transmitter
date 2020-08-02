# Datapack Transmitter
将本地的datapack实时同步到服务器，以便多人在同一服务器开发不同datapack，不会将服务器内容传输至客户端.

##用法：

###服务器端:
```
node app -mode server -port [端口号] -folder [根目录]
```

###客户端
```
node app -mode client -server-ip [服务器IP]:[服务器端口] -token [日志里记录的名字/代号 如：MicroBlock/Ganxiaozhe/HHTC/Hangback] -folder [根目录]
```
