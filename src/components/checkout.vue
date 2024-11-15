<template>
    <div class="checkout">
      <h2>結帳</h2>
      <div v-if="cart.length">
        <!-- Cart Items -->
        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <img :src="`/data/${item.image}`" alt="Product Image" />
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p>顏色: {{ item.color }}, 尺寸: {{ item.size }}</p>
            <p>價錢: ${{ item.price }}</p>
            <p v-if="item.discount" class="dis">折扣: -${{ item.discount }}</p>
            <p class="price"><strong>小計: ${{ item.finalPrice }}</strong></p>
          </div>
        </div>
  
        <!-- Order Summary -->
        <div class="order-summary">
          <h3>訂單總結</h3>
          <p class="dis">總折扣: -${{ totalDiscount }}</p>
          <p class="price"><strong>總計: ${{ totalPrice }}</strong></p>
        </div>
  
        <!-- Shipping Option -->
        <div class="shipping-options">
          <h3>取貨方式</h3>
          <label>
            <input type="radio" value="storePickup" v-model="deliveryOption" />
            來店取貨
          </label>
          <label>
            <input type="radio" value="delivery" v-model="deliveryOption" />
            配送到府
          </label>
        </div>
        <div v-if="deliveryOption === 'delivery'" class="address-input">
          <label>配送地址:</label>
          <input type="text" v-model="deliveryAddress" placeholder="Enter your address" />
        </div>
  
        <!-- Confirm Order -->
        <button @click="confirmOrder" class="confirm-order-button">送出</button>
      </div>
      <div v-else>
        <p>購物車已經清空囉!</p>
      </div>
    </div>
  </template>
<script>
  import axios from 'axios';
  import { mapGetters, mapActions } from 'vuex';
  export default {
    data() {
      return {
        cart: [], // Loaded from the API
        totalDiscount: 0,
        totalPrice: 0,
        deliveryOption: 'storePickup', // Default option
        deliveryAddress: '',
      };
    },
    created() {
      this.loadCart();
    },
    methods: {
        ...mapActions(['checkoutCart']),
      // Load Cart and Calculate Discount
      async loadCart() {
        try {
          const response = await axios.post('http://localhost:3000/checkout', { cart: this.$store.state.user.car });
          this.cart = response.data.updatedCart;
          this.totalDiscount = response.data.totalDiscount;
          this.totalPrice = response.data.totalPrice;
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      },
      // Confirm Order and Submit
      async confirmOrder() {
        if (this.deliveryOption === 'delivery' && !this.deliveryAddress) {
          alert("Please enter a delivery address.");
          return;
        }
  
        try {
          const orderData = {
            username: this.$store.state.user.username,
            cart: this.cart,
            totalDiscount:this.totalDiscount,
            totalPrice:this.totalPrice,
            deliveryMethod: this.deliveryOption,
            address: this.deliveryOption === 'delivery' ? this.deliveryAddress : null,
            status: '未發貨'
          };
          await axios.post('http://localhost:3000/sendorder', orderData);
          console.log("q");
          //alert("Order confirmed!");
          this.checkoutCart(this.$store.state.user.username);
          console.log("w");
          this.$router.push({ name: 'userorder' });
          console.log("e");
        } catch (error) {
          console.error("Error confirming order:", error);
        }
      }
    }
  };
</script>
  
<style scoped>
  .checkout { 
    margin: 0 10%;
    }
  .cart-item { 
    display: flex; 
    margin-bottom: 10px; 
  }
  .cart-item img { 
    width: 40%; 
    max-width: 300px;
    height:40%;
    object-fit: contain; 
    margin-right: 10px; 
  }
  .item-details { 
    flex-grow: 1; 
    font-size: 1.2em;
    margin-left: 10%;
  }
  .price{
    color: red;
    font-weight: 800;
  }
  .dis{
    color: rgb(51, 56, 157);
  }
  .order-summary { 
    margin-top: 2%; 
    padding: 10px; 
    border-top: solid 3px black; 
    font-size: 1.2em;
  }
  .shipping-options, .address-input { 
    margin-top: 10px; 
  }
  .confirm-order-button { 
    margin-top: 20px; 
    padding: 2% 5%; 
    background-color: #000000; 
    font-size: 1.1em;
    font-weight: 800;
    color: white; 
    border: none; 
    border-radius: 5px;
    cursor: pointer; 
    margin: 5% 40%;
  }
    
</style>
  