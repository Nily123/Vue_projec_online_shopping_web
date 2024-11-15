<template>
    <div class="add-activity">
      <h2>新增活動</h2>
      <!-- 基本活動資訊輸入 -->
      <div class="add_div">
        <label class="add_name add_inputlab">活動名稱: <input v-model="activity.act_name" class="add_input"/></label><br/>
        <label class="add_start add_inputlab">開始日期: <input v-model="activity.act_start" type="date" class="add_input"/></label><br/>
        <label class="add_end add_inputlab">結束日期: <input v-model="activity.act_end" type="date" class="add_input"/></label><br/>
        <label class="add_discount add_inputlab">折扣: <input v-model="activity.discount" class="add_input" placeholder="例如: *0.9"/></label><br/>
        <label class="add_content add_inputlab">活動內容:<br/> <textarea v-model="activity.act_con" class="add_text"></textarea></label><br/>
      </div>
      
      <!-- 類別與產品 ID -->
      <div class="category_div">
        <label class="add_category add_inputlab">活動類別:
          <input v-model="newCategory" placeholder="例如: Fall, Winter" />
          <button @click="addCategory" class="cat_but">新增類別</button>
        </label>
        <ul>
          <li v-for="(category, index) in activity.category" :key="index">{{ category }}</li>
        </ul>
  
        <label class="add_pro_id add_inputlab">產品 ID:
          
          <input v-model="newProductId" placeholder="填寫產品 ID" />
          <button @click="addProductId" class="pro_but">新增產品ID</button>
        </label>
        <ul>
          <li v-for="(id, index) in activity.pro_id" :key="index">{{ id }}</li>
        </ul>
      </div>
  
      <!-- 圖片上傳 -->
      <div class="image_div">
        <label>活動主圖片:</label>
        <input type="file" @change="handleCoverImageUpload" class="add_img"/>
        <label>內容圖片:</label>
        <input type="file" multiple @change="handleContentImagesUpload" class="add_img"/>
      </div>
      
      <!-- 折扣規則 -->
      <div class="discount_rule">
        <h3>折扣規則</h3>
        <label>類型:
          <select v-model="activity.discount_rule.type" class="add_input">
            <option value="same_category_discount">同類別折扣</option>
            <option value="same_product_discount">同款折扣</option>
          </select>
        </label>
        <label>數量條件: <input v-model.number="activity.discount_rule.quantity_condition" type="number" class="add_input"/></label>
        <label>適用於: 
          <select v-model="activity.discount_rule.apply_to" class="add_input">
            <option value="all">所有商品</option>
            <option value="second_item">第二件</option>
          </select>
        </label>
        <label>折扣率: <input v-model.number="activity.discount_rule.rate" type="number" class="add_input" placeholder="例如: 0.8"/></label>
      </div>
      
      <button @click="submitActivity" class="sub_but">提交新增活動</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        activity: {
          act_id: 0,
          act_name: "",
          category: [],
          pro_id: [],
          act_con: "",
          act_cau_img: "",
          act_con_img: [],
          act_start: "",
          act_end: "",
          discount: "",
          discount_rule: {
            type: "",
            quantity_condition: 1,
            apply_to: "",
            rate: 1
          }
        },
        newCategory: "",
        newProductId: ""
      };
    },
    methods: {
      addCategory() {
        if (this.newCategory) {
          this.activity.category.push(this.newCategory);
          this.newCategory = "";
        }
      },
      addProductId() {
        if (this.newProductId) {
          this.activity.pro_id.push(this.newProductId);
          this.newProductId = "";
        }
      },
      handleCoverImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          
          axios.post(`http://localhost:3000/upload/activity_cover`, formData)
            .then(() => {
              alert("主圖片上傳成功！");
            })
            .catch(error => {
              console.error("主圖片上傳失敗:", error);
            });
        }
      },
      handleContentImagesUpload(event) {
        const files = Array.from(event.target.files);
        const uploadPromises = files.map(async file => {
          const formData = new FormData();
          formData.append("file", file);
  
          const response = await axios.post(`http://localhost:3000/upload/activity_content`, formData);
            this.activity.act_con_img.push(response.data.filePath);
        });
  
        Promise.all(uploadPromises)
          .then(() => alert("內容圖片上傳成功！"))
          .catch(error => console.error("內容圖片上傳失敗:", error));
      },
      async submitActivity() {
        this.activity.act_id = Date.now();
        await axios.post("http://localhost:3000/activity", this.activity);
        alert("活動已新增成功");
        this.$router.push({ name: 'Admin' });
      }
    }
  };
  </script>
  
  <style scoped>
label{
    margin: 1%;
}
input{
    margin:1%;
}
.add_text{
    margin:1%;   
}
.sub_but{
    margin-left: 5%;
  width:15% ;
  font-size: 1.2em;
  font-weight: 800;
  background-color: rgb(225, 165, 96);
  color: azure;
  border-radius: 5px;
  border: solid 3px rgb(138, 98, 29);
  margin: 5% 40%;
}
  </style>
  