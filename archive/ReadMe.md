# 無蜂王授粉網頁
## 環境設定
本網頁使用 React+ node.js 進行開發，請安裝好 npm 或 yarn 進行 node_modules 相關安裝，相關安裝方式請參閱 [React 環境架設](https://eyesofkids.gitbooks.io/react-basic-zh-tw/content/day14_react_env/)，下面的設定以 yarn 為教學，若要轉成 npm 指令請自己轉

## Run the project

1. backend
```bash
cd backend
node src/main.js
```
2. frontend
```bash
cd frontend
yarn start
```

## 建立專案
1. 建立資料夾
   1. 建立一個工作資料夾，資料夾內部放入前端（frontend）與後端（backend）兩個資料夾
   ```
   mkdir bee-web
   cd bee-web
   yarn init -y  # 建立一個新專案
   create-react-app frontend # 建立frontend
   mkdir backend # 建立backend
   ```
   2. 在 bee-web 資料夾內的“package.json” 裡頭加入這幾⾏，即可用 yarn start 指令開啟前端， yarn server 指令開啟後端
   
   ```
   "scripts": {
   "start": "cd frontend && yarn start",
   "server": "cd backend && yarn server"
   }
   ```

   3. 到 “backend” ⽬錄，⽤ ”yarn init -y” 建立⼀個專案
   4. 安裝⼀些需要⽤到的套件 (如果在執⾏ app 時遇到缺少套件的 error, 請⾃⾏增加)：
    ```
    yarn add -D nodemon
    ```
   5. 把壓縮檔的內容解壓縮後的 frontend 資料夾中的 src 複製取代 bee-web 中的 frontend 內部的 src，壓縮檔內的 backend 資料夾中所有內容可以複製貼到 bee-web 中的 backend 中
   
   6.  分別執行前端與後端指令，如果運行正常，可以在 http://localhost:4000/ 中找到網頁，即建立完畢，如果有錯誤的話看有什麼缺失套件就 “yarn add XXX ”加入
    第一個terminal

   ```bash=
   cd bee-web
   yarn server
   ```
   第二個terminal
   ```bash=
   cd bee-web
   yarn start
   ```

## deployment
deploy在 http://140.112.94.126/ 上，需要先在本地端建立 docker image ，再透過遠端桌面的方式，透過 VM 部署

### 建立 docker image
1. 進入 bee-web/frontend/src/api.js 內，把 baseURL 改成 http://140.112.94.126:4000/
2. 進入 frontend 資料夾，將前端文檔轉成機械碼輸出
```bash=
   cd bee-web/frontend
   yarn build
```
3. build 完後的檔案會儲存在 frontend/public 中，將 public 內的文件全部複製取代到 backend\pubic 內
4. 進入 backend 中建立docker image (名字可以自己取，我這邊取node_app:0.11)，後轉成 tar 檔案傳到 deploy 位置(也可以用docker hub 分享，你方便就好)，此時應該會生成 tar 檔案，再把它分享到雲端讓遠端桌面下載
```bash=
   cd bee-web/backend
   docker build -t node_app:0.11 . 
   docker save -o node_app:0.11.tar node_app:0.11
```
5. 進入遠端桌面，遠端桌面的 ip 是 140.112.94.126，帳號是 Lab303-1 ，密碼是 *03033030&lab303，不會用的話請洽瑋哥
6. 打開 Oracle VM virtualBox ，裡面有一個虛擬機是 default ，先把它重新開機
7. 打開 Docker QuickStart Terminal ，如果有順利開啟虛擬機，則會出現他連線至 192.168.99.101 的提示，此時就代表虛擬機有順利開啟，如果沒有那就重開 Oracle VM virtualBox，確保虛擬機運作正常
8. 在Docker QuickStart Terminal load 剛剛生成的 docker image ，並且讓他順利運作在 http://140.112.94.126:4000 上
```bash=
   docker load -i node_app_0.11.tar
   docker run -d -p 4000:4000 node_app:0.11
```
9. 在本地端電腦連線 http://140.112.94.126:4000 ，確定網頁運作正常

## 資料庫管理
資料庫建立在 http://140.112.94.59:30080/phpmyadmin 中的 111_farmer_database 中，如果需要更動授粉需求可以更改資料表 testjs ，需要增加或更改管理員帳號密碼請更動資料表 UserData，如需更動整個後端操考的資料庫位置，請更改 backend 中的 .env 與 backend\src\router\api\pollination.js 中的檔案

## 程式碼維護
### 前端
基本上前端所有會更動到的內容都在 frontend\src 內部

#### frontend\src\api.js
會更改 baseURL 位置，如果要換 deploy 的網頁位置或 port 請改這裡

#### frontend\src\constant\data.js
測試用資料，FAQ，與表單中鄉鎮市區，頭像照片之類的東西都放在這

#### frontend\src\constant\components\main.js
主要前端的進入頁面，如果要改分頁內的內容從這裡看一下分頁叫什麼名字，再進該分頁對應的 js 檔中進行更改

### 後端

#### backend\src\main.js
主要進入位置，如果要改對外 port 在這裡改

#### backend\routes\api\pollination.js
所有後端與資料庫互動的程式都在這，要新增或更改請改這個檔

#### .env
裝了資料庫位置與帳號密碼，如果要在資料庫裡放任何隱私資料，都不要直接打在 js 裡，要打在 .env 裡並讓 js 參考這個檔案

#### Dockerfile
生成 Docker image 的參考文件，教學[參照](https://peihsinsu.gitbooks.io/docker-note-book/content/docker-build.html)