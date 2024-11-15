<template>
    <div class="cart_div">
      <h3 class="cart_title">我的購物車</h3>
      <div v-if="cartItems.length" class="car_div">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="`/data/${item.image}`" :alt="item.name" class="cart_image"/>
          <p class="cart_name">{{ item.name }}</p>
          <p class="cart_color">顏色: {{ item.color }}</p>
          <p class="cart_size">大小: {{ item.size }}</p>
          <p class="cart_number">數量: {{ item.number }}</p>
          <p class="cart_price">價格: {{ item.price }} 元</p>
          <button @click="removeFromCart(item.id)" class="cart_re">刪除</button>
        </div>
        <button @click="checkout" class="ch_but"><RouterLink to="/checkout">結帳</RouterLink></button>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    computed: {
      ...mapGetters(['getCurrentUser', 'getProductById']),
      cartItems() {
        return this.getCurrentUser.car.map(cartItem => {
          const product = this.getProductById(cartItem.id);
          const variation = product.variations.find(v => v.color === cartItem.color);
          return {
            ...product,
            color: cartItem.color,
            size: cartItem.size,
            number: cartItem.number,
            image: variation.image[0],
            price: product.price
          };
        });
      }
    },
    async created() {
      if (!this.product) {
        await this.$store.dispatch('fetchProducts');
      }
    },
    methods: {
      ...mapActions(['removeCartItem']),
      removeFromCart(productId) {
        this.removeCartItem(productId);
      }
    }
  };
  </script>
  
  <style scoped>
  .cart_div{
    margin: 0 0 5% 0;
  }
  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1% 0;
    padding: 1% 5%;
    border-bottom: solid black 5px;
  }
  .cart_image{
    width: 10%;
  }
  .ch_but{
    background-color: rgb(255, 255, 255);
    color: rgb(228, 159, 89);
    position: fixed;
    right: 10%;
    border-radius: 5px;
    font-size: 1.3em;
    font-weight: 800;
    border: solid 2px rgb(227, 183, 96);
  }
  .ch_but a{
    color: rgb(231, 175, 102);
    text-decoration: none;
  }
  </style>
  