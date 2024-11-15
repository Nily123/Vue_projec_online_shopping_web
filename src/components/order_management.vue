<template>
  <div>
    <h2>訂單管理</h2>
    <ul v-for="order in orders" :key="order.orderId" class="order-item">
      <li>
        <div>
          <span>訂單ID: {{ order.orderId }}</span>
          <span>客戶名稱: {{ order.username }}</span>
          <span>總計: {{ order.totalPrice }}</span>
          <button @click="toggleOrderDetails(order.orderId)" class="de_but">
            {{ order.showDetails ? '-' : '+' }}
          </button>
        </div>
        <div v-if="order.showDetails">
          <h3>訂單資訊</h3>
          <ul>
            <li v-for="item in order.items" :key="item.id">
              <p>商品名稱: {{ item.name }}</p>
              <p>顏色: {{ item.color }}, 尺寸: {{ item.size }}</p>
              <p>數量: {{ item.quantity }}</p>
              <p>$: {{ item.price }}</p>
              <p>折扣: {{ item.discount }}</p>
            </li>
          </ul>
          <h3>使用者資訊</h3>
          <p v-if="order.deliveryMethod === 'storePickup'">來店取貨</p>
          <p v-else>配送 : 地址: {{ order.address || 'N/A' }}</p>

          <h3>訂單狀態</h3>
          <select v-model="order.status" @change="updateOrderStatus(order.orderId, order.status)">
            <option value="未發貨">未發貨</option>
            <option value="已發貨">已發貨</option>
            <option value="已取消">已取消</option>
          </select>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
    };
  },
  async created() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get('http://localhost:3000/orders');
        this.orders = response.data.orders.map(order => ({
          ...order,
          showDetails: false, // toggle detail view
          status: order.status // default status
        }));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    toggleOrderDetails(orderId) {
      const order = this.orders.find(order => order.orderId === orderId);
      if (order) order.showDetails = !order.showDetails;
    },
    async updateOrderStatus(orderId, status) {
      try {
        await axios.put(`http://localhost:3000/orders/${orderId}`, { status });
        if (status === 'Shipped') {
          await axios.post(`http://localhost:3000/orders/${orderId}/ship`);
        }
        await this.fetchOrders();
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    },
  },
};
</script>

<style scoped>
.order-item {
  margin-bottom: 1em;
  padding: 1em;
  border: 1px solid #ddd;
}
span{
  margin-right: 10%;
}
.de_but{

}
</style>
