<template>
  <div>
    <h2>訂單資訊</h2>
    <ul v-for="order in orders" :key="order.orderId" class="order-item">
      <li>
        <div class="o0">
          <span>訂單ID: {{ order.orderId }}</span>
          <span>總計 : {{ order.totalPrice }}</span>
          <span>狀態: {{ order.status }}</span>
          <button @click="toggleOrderDetails(order.orderId)">
            {{ order.showDetails ? '-' : '+' }}
          </button>
        </div>
        <div v-if="order.showDetails">
          <h3>訂單詳細資訊</h3>
          <ul>
            <li v-for="item in order.items" :key="item.productId" class="item">
              <div>
                <h3>商品名稱: {{ item.name }}</h3>
                <p>顏色: {{ item.color }}, 尺寸: {{ item.size }}</p>
                <p>數量: {{ item.quantity }}</p>
                <p>單件$ {{ item.price }}</p>
                <p class="dis">折扣: -{{ item.discount }}</p>
                <p class="money">小計: {{ item.quantity * (item.price - (item.discount || 0)) }}</p>
              </div>
              <!-- 顯示顏色對應的第一張圖片 -->
              <img
                v-if="item.imageUrl"
                :src="`/data/${item.imageUrl}`"
                :alt="`Image for ${item.name} in ${item.color}`"
              />
            </li>
          </ul>
          <h3>總結</h3>
          <p>訂單狀態: {{ order.status }}</p>

          <!-- 僅在快遞選項時顯示地址 -->
          <p v-if="order.deliveryMethod === 'storePickup'">領取方式:來店取貨</p>
          <p v-else>配送 : 地址: {{ order.address || 'N/A' }}</p>

          <p class="dis">總折扣: -{{ order.totalDiscount }}</p>
          <p class="money"><strong>總計: {{ order.totalPrice }}</strong></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
export default {
  data() {
    return {
      orders: [],
    };
  },
  async created() {
    await this.fetchUserOrders();
  },
  computed: {
    ...mapGetters(['getCurrentUser', 'getProductById'])
  },
  methods: {
    async fetchUserOrders() {
      try {
        const response = await axios.get('http://localhost:3000/user/orders', {
          params: { username: this.$store.state.user.username },
        });
        // 設定訂單資料並加上圖片
        this.orders = await Promise.all(
          response.data.map(async (order) => {
            const updatedItems = await Promise.all(
              order.items.map(async (item) => {
                // 透過 productId 和 color 來獲取商品的圖片URL
                const imageUrl = await this.fetchProductImage(item.id, item.color);
                return { ...item, imageUrl };
              })
            );
            return {
              ...order,
              items: updatedItems,
              showDetails: false, // For toggling order details view
            };
          })
        );
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    async fetchProductImage(productId, color) {
      try {
        const product = this.getProductById(productId);
        const variation = product.variations.find(v => v.color === color);
        return variation.image[0]; // 取得對應顏色的第一張圖片
      } catch (error) {
        console.error('Error fetching product image:', error);
        return null;
      }
    },
    toggleOrderDetails(orderId) {
      const order = this.orders.find((order) => order.orderId === orderId);
      if (order) order.showDetails = !order.showDetails;
    },
  },
};
</script>

<style scoped>
.o0{
  font-weight: 800;
}
span{
  padding-right:20%;
  font-size: 1.2em;
}
.order-item {
  margin-bottom: 1em;
  padding: 1em;
  border: 1px solid #c57f4aec;
}
button{
  background-color: rgb(239, 171, 87);
  color: rgb(255, 255, 255);
  border: solid 2px wheat;
  border-radius: 5px;
  font-size: 1.3em;
  padding: 0 1%;
}
li{
  border-bottom: solid rgb(0, 0, 0) 2px;
  padding:0 5% 2% 5%;
  list-style: none;
}
.item{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
img{
  width: 30%;
  height: auto;
  object-fit: contain;
}
.dis{
  color: rgb(37, 55, 145);
  font-weight: 800;
}
.money{
  color: red;
}
</style>
