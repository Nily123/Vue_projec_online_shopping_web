<template>
  <div class="add-product">
    <h2>新增商品</h2>
    <!-- 基本資訊輸入 -->
    <div class="add_div">
      <label class="add_name add_inputlab">名稱: <input v-model="product.name" class="add_input"/></label>
      <label class="add_number add_inputlab">價格: <input v-model.number="product.price" type="number" class="add_input"/></label>
      <label class="add_location add_inputlab">產地: <input v-model="product.location"  class="add_input"/></label>
      <label class="add_material add_inputlab">材質: <input v-model="product.material"  class="add_input"/></label>
      <label class="add_wash add_inputlab">洗滌方式: <textarea v-model="product.wash"  class="add_text"></textarea></label>
      <label class="add_isVisible add_inputlab">上架: <input type="checkbox" v-model="product.state"   class="add_input"/></label>
      <!-- Notice -->
      <label class="add_notice add_inputlab">注意事項:
        <textarea v-model="newNotice"></textarea>
        <button @click="addNotice" class="not_but">新增注意事項</button>
      </label>
      <ul>
        <li v-for="(note, index) in product.notice" :key="index">{{ note }}</li>
      </ul>
      <!-- Category -->
      <label class="add_cat add_inputlab">商品類別:
        <input v-model="newCategory" placeholder="例如: Men, Jacket" />
        <button @click="addCategory" class="cat_but">新增類別</button>
      </label>
      <ul>
        <li v-for="(category, index) in product.category" :key="index">{{ category }}</li>
      </ul>
    </div>
    <!-- 顏色與尺寸 -->
    <div class="color_div">
      <h3>顏色與尺寸</h3>
      <div v-for="(variation, index) in product.variations" :key="index" class="color">
        <label>顏色: <input v-model="variation.color"  class="add_input"/></label>
        <!-- 尺寸與庫存 -->
        <div v-for="(size, sIndex) in variation.sizes" :key="sIndex">
          <label>尺寸: <input v-model="size.size"  class="add_input"/></label>
          <label>庫存: <input v-model.number="size.stock" type="number"  class="add_input"/></label>
          <label>已售數量: <input v-model.number="size.sales" type="number"  class="add_input"/></label>
        </div>
        <button @click="addSize(index)" class="size_but">新增尺寸</button>
        <!-- 圖片上傳 -->
        <div>
          <label>上傳圖片:</label>
          <input type="file" multiple @change="handleFileUpload($event, index)" class="add_img"/>
        </div>
      </div>
      <button @click="addColor" class="color_but">新增顏色</button>
      <!-- Related Images -->
      <div class="img_info">
        <label>上傳主圖片:</label>
        <input type="file" multiple @change="handleRelatedImagesUpload" class="add_img"/>
      </div>
    </div>
    <button @click="submitProduct" class="sub_but">提交新增商品</button>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions,mapState } from 'vuex';
export default {
  data() {
    return {
      product: {
        id:0,
        name: "",
        price: 0,
        location: "",
        material: "",
        wash: "",
        state: true,
        notice: [],
        category: [],
        variations: [{ color: "", sizes: [{ size: "", stock: 0, sales: 0 }], image: [] }],
        image: [],
      },
      newNotice: "",
      newCategory: "",
    };
  },
  computed: {
    ...mapState({
      products: (state) => state.products
    })
  },
  methods: {
    addColor() {
      this.product.variations.push({ color: "", sizes: [{ size: "", stock: 0, sales: 0 }], image: [] });
    },
    addSize(variationIndex) {
      this.product.variations[variationIndex].sizes.push({ size: "", stock: 0, sales: 0 });
    },
    addNotice() {
      if (this.newNotice) {
        this.product.notice.push(this.newNotice);
        this.newNotice = "";
      }
    },
    addCategory() {
      if (this.newCategory) {
        this.product.category.push(this.newCategory);
        this.newCategory = "";
      }
    },
    handleFileUpload(event, colorIndex) {
      const files = Array.from(event.target.files); // 將 FileList 轉換成 Array 以便使用 map 和 Promise.all
      this.product.id = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
      console.log("id:" + this.product.id);

      const uploadPromises = files.map(file => {
        const fileName = file.name;
        // 將圖片名稱添加到該顏色的 images 列表中
        this.product.variations[colorIndex].image.push(this.product.id+"/"+fileName);
        console.log((this.product.id+"/"+fileName));
        // 準備上傳的 formData
        const formData = new FormData();
        formData.append("file", file);
      
        // 發送圖片到伺服器
        return axios.post(`http://localhost:3000/upload/${this.product.id}`, formData);
      });
    
      // 等待所有上傳完成
      Promise.all(uploadPromises)
        .then(() => {
          alert("所有圖片上傳成功！");
        })
        .catch(error => {
          console.error("圖片上傳失敗:", error);
          alert("部分圖片上傳失敗，請重試。");
        });
    },
    handleRelatedImagesUpload(event) {
      const files = Array.from(event.target.files);
      this.product.id = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
      console.log("id:" + this.product.id);

      const uploadPromises = files.map(file => {
        const fileName = file.name;
        this.product.image.push(this.product.id+"/"+fileName);

        const formData = new FormData();
        formData.append("file", file);
      
        return axios.post(`http://localhost:3000/upload/related/${this.product.id}`, formData);
      });
    
      Promise.all(uploadPromises)
        .then(() => {
          alert("所有主圖片上傳成功！");
        })
        .catch(error => {
          console.error("主圖片上傳失敗:", error);
          alert("部分主圖片上傳失敗，請重試。");
        });
    },
    async submitProduct() {
      this.product.id = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
      await axios.post("http://localhost:3000/products", this.product);
      alert("商品已新增成功");
      this.$router.push({ name: 'Admin' });
    }
  }
};
</script>
<style scoped>
.add-product{
  padding-bottom: 10%;
}
.add_div{
  padding-left: 5%;
  border-bottom:solid black 5px ;
  display: grid;
  grid-template-columns: repeat(2,1fr);
	grid-template-areas:
		"add_name add_number "
		"add_location add_material"
		"add_wash add_isVisible"
    "add_notice add_cat";
    align-items: center;
}
.add_inputlab{


}
.add_name{
  grid-area: add_name;
}
.add_number{
  grid-area: add_number;
}
.add_location{
  grid-area: add_location;
}
.add_material{
  grid-area: add_material;
}

.add_isVisible{
  grid-area: add_isVisible;
}
.add_notice{
  grid-area: add_notice;
}
.add_cat{
  grid-area: add_cat;
}
.add_input{
  margin-bottom: 5%;

}
.color_div{
  padding-left: 5%;
}
.color{
  padding-bottom: 2%;
  margin-bottom: 3%;
  border-bottom:  solid rgb(216, 177, 93) 3px;
}
.not_but{
  margin-left: 5%;
  font-size: 1.2em;
  font-weight: 800;
  background-color: rgb(225, 165, 96);
  color: azure;
  border-radius: 5px;
  border: solid 3px rgb(138, 98, 29);
}
.cat_but{
  margin-left: 5%;
  font-size: 1.2em;
  font-weight: 800;
  background-color: rgb(225, 165, 96);
  color: azure;
  border-radius: 5px;
  border: solid 3px rgb(138, 98, 29);
}
.size_but{
  margin-bottom: 2%;
  font-size: 1.2em;
  font-weight: 800;
  background-color: rgb(225, 165, 96);
  color: azure;
  border-radius: 5px;
  border: solid 3px rgb(138, 98, 29);
}
.color_but{
  font-size: 1.2em;
  font-weight: 800;
  background-color: rgb(225, 165, 96);
  color: azure;
  border-radius: 5px;
  border: solid 3px rgb(138, 98, 29);
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
}
.add_img{
  padding-left: 5%;
}
.img_info{
  padding: 5% 0;
}
.add_wash{
  grid-area: add_wash;
  margin-bottom: 5%;
}
</style>
