<template>
  <div class="product-management">
    <div class="d0">
      <h1>商品管理</h1>
      <button class="add_but"><RouterLink to="/add_product">新增商品</RouterLink></button>
    </div>
    <div v-for="product in products" :key="product.id" class="product-item">
      <h3>{{ product.name }}</h3>
      <button @click="toggleProductDetails(product.id)" class="info_but">
        {{ product.showDetails ? '收起詳細資訊' : '查看詳細資訊' }}
      </button>

      <!-- 詳細資訊區域 -->
      <div v-show="product.showDetails" class="product-details">
        <!-- 基本資訊 -->
        <div class="up_info">
          <div class="up">
            <label>名稱:</label>
            <input type="text" v-model="product.name" />
          </div>
          <div class="up">
            <label>價格:</label>
            <input type="number" v-model.number="product.price" />
          </div>
          <div class="up">
            <label>材質:</label>
            <input type="text" v-model="product.material" />
          </div>
          <div class="up">
            <label>洗滌方式:</label><br/>
            <textarea v-model="product.wash"></textarea>
          </div>
          <div class="up">
            <label>是否上架:</label>
            <input type="checkbox" v-model="product.state" />
          </div>

          <!-- Notice 多項輸入框 -->
          <div class="up">
            <h4>注意事項</h4>
            <div v-for="(notice, index) in product.notice" :key="index">
              <input type="text" v-model="product.notice[index]" />
            </div>
            <button @click="addNotice(product)">新增注意事項</button>
          </div>
      </div>    
          <!-- Category 多項輸入框 -->
          <div class="up">
            <h4>類別</h4>
            <div v-for="(category, index) in product.category" :key="index">
              <input type="text" v-model="product.category[index]" />
            </div>
            <button @click="addCategory(product)">新增類別</button>
          </div>
      
        <!-- Variations 區域 -->
        <h4>商品變化</h4>
        <div v-for="(variation, vIndex) in product.variations" :key="vIndex" class="variation-item">
          <label>顏色: {{ variation.color }}</label>
          <div v-for="(size, sizeIndex) in variation.sizes" :key="sizeIndex" class="size-item">
            <label>尺寸: {{ size.size }}</label>
            <label>銷量:</label>
            <input type="number" v-model.number="size.sales" />
            <label>庫存:</label>
            <input type="number" v-model.number="size.stock" />
          </div>
        </div>

        <button @click="updateProduct(product)">儲存更改</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['products']) // 從 Vuex 獲取產品列表
  },
  methods: {
    toggleProductDetails(productId) {
      const product = this.products.find(p => p.id === productId);
      if (product) product.showDetails = !product.showDetails;
    },
    addNotice(product) {
      product.notice.push(""); // 新增空白的注意事項輸入框
    },
    addCategory(product) {
      product.category.push(""); // 新增空白的類別輸入框
    },
    async updateProduct(product) {
      try {
        const response = await fetch(`http://localhost:3000/updateProduct/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: product.name,
            price: product.price,
            location: product.location,
            material: product.material,
            wash: product.wash,
            notice: product.notice,
            category: product.category,
            state: product.state,
            variations: product.variations
          })
        });
        if (!response.ok) throw new Error('Failed to update product');
        alert('商品更新成功');
      } catch (error) {
        console.error("Error updating product:", error);
        alert('商品更新失敗');
      }
    }
  }
};
</script>

<style scoped>
.product-management {
  max-width: 800px;
  margin: auto;
}
.d0{
  display: flex;
  justify-content: space-around;
}
.add_but{
  margin-bottom: 3%;
  background-color: rgba(255, 178, 89, 0.701);
  color: white;
  font-weight: 800;
  width: 15%;
  font-size: 1em;
  border-radius: 6px;
  border: solid 3px white;
}
.add_but a{
  color: rgba(255, 255, 255, 0.925);
  text-decoration: none;
}
.product-item {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 10px;
}
.info_but{
  background-color: black;
  color: white;
  border-radius: 5px;
  border: solid 2px white;
}
.up_info{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
}
.up{
  width: 40%;
  margin: 3%;
}
.product-details {
  margin-top: 10px;
}
.variation-item, .size-item {
  margin-top: 5px;
}
.variation-item{
  padding-bottom: 2%;
  margin-bottom: 2%;
  border-bottom: 3px solid black;
}
h4{
  margin-top: 0;
}
</style>
