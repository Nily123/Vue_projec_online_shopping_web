# 聲明
### 此專案的所有內容皆非商業或營利用途，僅為個人能力展適用。
### 本專案內商品皆為Net所有。若有需求請至Net官網購買 (https://www.net-fashion.net/)

# vue-project
此Vue3專案使用 Node.js+ Vite 進行建置，並搭配express虛擬後端做api的串接及模擬資料庫的連結。

## 專案設置

```sh
npm install
```

### 啟動vue專案、app.js為虛擬後端，為保證功能正常運作，請開一個終端機來執行他
如果想參考後端的部分可以從app.js查看相關的api設置及後端運算

```sh
npm run dev
node app.js
```

### 內容介紹
此專案為線上服飾商店，使用Vuex、VueRouter 、Express來使整個體驗更加完整。
登入分份分為使用者跟管理者:
```sh
使用者帳號:customer1
使用者密碼:12345

管理者帳號:employee1
管理者密碼:67890
```
使用者可以從左方的點選條件進行商品的條件篩選，右邊的商品列表會隨著篩選條件的改變或排序方式的改變而變動。
![image](https://github.com/user-attachments/assets/e89302c3-dca0-4bf3-bc0e-78766f2efb42)
點選商品就會連結到該商品的詳細資訊，在這裡使用者可以點選顏色的按鈕來快速瀏覽該商品不同顏色的圖片，也可以進行收藏及加入購物車的操作。

也可以看到該商品有套用的活動，以及該活動的折扣方式。
![image](https://github.com/user-attachments/assets/c5112fcf-0d23-4fbc-9381-c8ee0b4a5aae)
如果想參考更多的圖片也可以在下方看到所有圖片的展示。
![image](https://github.com/user-attachments/assets/38aae55f-98b7-429d-a0c1-1005574cd0a4)
活動介面的部分將活動跟公告分開顯示，點選上方的按鈕即可切換
![image](https://github.com/user-attachments/assets/df36d2a8-c00d-49d4-b738-c83a433ba6a4)
點選+可以看到活動的詳細資訊
![image](https://github.com/user-attachments/assets/67c736f4-3823-457e-a753-1f040dbdead7)


### 以下為登入後可以進行的操作:
### 消費者部分:
可以透過右上方的icon進行頁面跳轉。

使用者的收藏列表，再點選商品頁面收藏的時候會自動獲取新的使用者訊息，所以不用重新載入網站也可以更新收藏列表。
![image](https://github.com/user-attachments/assets/5ee17cf3-31f5-4b02-a442-cb845f5ca65d)
購物車內的商品，可以看到該商品的圖片，所選的顏色、大小、數量、金額，也可以點選刪除將該商品清除。
![image](https://github.com/user-attachments/assets/4ce40dc2-b3c1-4b6a-9add-af054443b885)
點選結帳後就會但訂單確認的結帳頁面，可以看到活動帶來的折扣，所有金額的加總計算，以及選擇取貨方式。

若選擇宅配到府可以輸入地址。
![image](https://github.com/user-attachments/assets/ab252916-4213-42c5-871f-b0dc1bf1720c)
點選結帳後會跳轉到訂單頁面，顯示該使用者所有的訂單資訊，可以在這邊看到自己的訂單狀態以及訂單明細。
![image](https://github.com/user-attachments/assets/432de4ad-ea92-4bcd-8d7c-349faab06694)

### 管理者部分
管理者登入後上方會多一個管理的選項，點擊後會跳轉到可以切換不同管理系統的管理介面

商品管理介面可以看到所有商品並進行編輯或新增商品。
![image](https://github.com/user-attachments/assets/b9fa6b01-91a3-479a-a971-10ed06e244b8)


新增商品的頁面，商品id會自動處理所以不會出現id的填入格。

圖片上傳支持一次一張或一次多張上傳。
![image](https://github.com/user-attachments/assets/2224c993-bc03-4312-a995-4bed2b9df84b)


點選詳細資訊可以進行商品編輯，除了id跟圖片其他都支持編輯。
![image](https://github.com/user-attachments/assets/6b0e45c8-5135-4524-9fc6-a3df6f81bc3a)


活動管理頁面，也是將活動跟公告做分開處理，點選按鈕可以進行切換
![image](https://github.com/user-attachments/assets/58fe97c0-ed92-4c7c-9d03-05e0b6c55c92)


新增活動
![image](https://github.com/user-attachments/assets/d28ea3ac-d686-4112-8289-18cf9696f1ce)


活動編輯，除了id跟圖片不支持編輯外，文案、時間、折扣方式都可以進行編輯。
![image](https://github.com/user-attachments/assets/c8a40f5f-9e70-458c-95e6-59e8bed374fe)

訂單管理:可以看到訂單的詳細資訊、該筆訂單的消費者，也可以進行狀態編輯(未出貨、已出貨、已取消)
![image](https://github.com/user-attachments/assets/31af516b-3a02-4626-badd-7e7e8416285e)






