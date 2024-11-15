<template>
  <div>
    <div class="but_div">
    <!-- 按鈕區域 -->
      <button @click="show = 1">
        商品管理
      </button>
      <button @click="show = 2">
        活動管理
      </button>
      <button @click="show = 3">
        訂單管理
      </button>
    </div>
    <!-- 商品管理組件 -->
    <ProductManagement v-show="show == 1" />

    <!-- 活動管理組件 -->
    <ActivityManagement v-show="show == 2" />

    <!--訂單管理組件-->
    <OrderManagement v-show="show == 3"/>
  </div>
</template>

<script>
import ProductManagement from './product_management.vue';
import ActivityManagement from './activity_management.vue';
import OrderManagement from './order_management.vue';
export default {
  components: {
    ProductManagement,
    ActivityManagement,
    OrderManagement
  },
  data() {
    return {
      show: 1,
    };
  },
};
</script>

<style scoped>
.but_div{
  display: flex;
  align-content: space-around;
  flex-wrap: wrap;
  width: 80%;
  margin: 2% 10%;
}
button {
  font-size: 1.2em;
  width: 20%;
  margin: 0 5%;
  color: rgb(255, 255, 255);
  background-color: rgb(0, 0, 0);
  border-radius: 5px;
  border: solid 3px white;
}
</style>
