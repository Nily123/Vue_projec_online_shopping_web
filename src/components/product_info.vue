<template>
    <div>
      <h3>商品列表</h3>
      <label for="sort">排序方式:</label>
      <select id="sort" v-model="sortBy" @change="sortProducts">
        <option value="sales">銷售量</option>
        <option value="price">價格</option>
      </select>
      <ul class="pro_ul row">
        <li v-for="product in sortedProducts" :key="product.id" class="pro_li  col-lg-4 col-md-4 col-xs-6">
          <router-link :to="`/product/${product.id}`">
            <img :src="getProductImage(product)" alt="product image" class="pro_img"/>
            <h4 class="pro_name">{{ product.name }}</h4>
            <div class="num_box">
                <p class="pro_num">已售: {{ calculateTotalSales(product) }}</p>
                <p class="pro_price"> $:{{ product.price }}</p>
            </div>
        </router-link>
        </li>
      </ul>
    </div>
  </template>
<style scoped>
    .pro_ul{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        list-style: none;
        padding: 0;
    }
    .pro_li{
        width: 27%;
        text-align: center;
        background-color: #F6E1C3;
        margin-bottom: 3%;
        margin-right: 3%;
        color: black;
        border: solid rgba(255, 255, 255, 0.658) 3px;
        font-weight: 800;
    }
    @media(max-width:992px){
      .pro_li{
        width:43%
      }
    }
    @media (max-width:400px) {
      .pro_li{
        width:86%
      }
    }
    a{
        text-decoration: none;
    }
    .pro_name{
        color: black;  
        margin: 5% 0 0 0; 
    }
    .pro_img{
        width: 70%;
        margin-top: 10%;
    }
    .num_box{
        display: flex;
        justify-content: space-around;
    }
    .pro_price{
        color: red;
        
       
    }
    .pro_num{
        color: rgb(134, 134, 134);
    }
</style>
<script>
export default {
  props: {
    products: Array
  },
  data() {
    return {
      sortBy: "sales",
      sortedProducts: []
    };
  },
  watch: {
    products: {
      handler(newProducts) {
        // Assign total sales as a static value to each product for sorting
        this.sortedProducts = newProducts.map(product => ({
          ...product,
          totalSales: this.calculateTotalSales(product) // calculate totalSales once
        }));
        this.sortProducts(); // Sort initially
      },
      immediate: true
    },
    sortBy() {
      this.sortProducts();
    }
  },
  methods: {
    // Calculate the total sales for a product
    calculateTotalSales(product) {
      return product.variations.reduce((totalSales, variation) => {
        return (
          totalSales +
          variation.sizes.reduce((sizeSales, size) => sizeSales + size.sales, 0)
        );
      }, 0);
    },
    getProductImage(product) {
      if (product.variations && product.variations.length > 0) {
        return `/data/${product.variations[0].image[0]}`;
      } else if (product.image && product.image.length > 0) {
        return `/data/${product.image[0]}`;
      } else {
        return "default-image.jpg";
      }
    },
    sortProducts() {
      this.sortedProducts.sort((a, b) => {
        if (this.sortBy === "sales") {
          return b.totalSales - a.totalSales;
        } else if (this.sortBy === "price") {
          return b.price - a.price;
        }
      });
    }
  }
};

</script>
  