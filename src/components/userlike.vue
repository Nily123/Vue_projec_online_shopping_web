<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    data() {
      return {
      };
    },
    computed: {
      ...mapGetters(['getCurrentUser', 'getProductById']),
      username(){
        this.updateKey = this.getCurrentUser.username;
        return this.getCurrentUser.username;
      },
      likes() {
        return this.getCurrentUser.like || [];
      },
      likedProducts() {
        // 增加防錯處理
        return this.likes
          .map(like => {
            const product = this.getProductById(like.id);
            if (!product) return null; // 檢查 product 是否存在
            const firstVariation = product.variations[0];
            return {
              ...product,
              firstColorImage: firstVariation.image[0]
            };
          })
          .filter(product => product !== null); // 移除為 null 的項目
      }
    },
    methods: {
      ...mapActions(['fetchUser', 'fetchProducts'])
    },
    async created() {
      // Fetch user data to ensure dynamic updates
      await this.fetchUser();

      // If product data is not loaded, fetch it
      if (!this.getCurrentUser.like || this.getCurrentUser.like.length === 0) {
        await this.fetchProducts();
      }
    }
  };
</script>

<template>
  <div>
    <h3 class="like_title">我的收藏{{ updateKey }}</h3>
    <div v-if="likes && likedProducts.length > 0" class="like_box">
      <div v-for="product in likedProducts" :key="product.id" class="like-item">
        <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
          <img :src="`/data/${product.firstColorImage}`" :alt="product.name" />
          <p>{{ product.name }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .like_title{
    font-size: 1.7em;
    font-weight: 800;
    text-align: center;
  }
  .like_box {
    width:100%;
    height: auto; 
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: auto;
  }
  .like-item {
    align-items: center;
    text-align: center;
    background-color: rgb(244, 244, 244);
    border-radius: 5px;
    margin-bottom: 3vh;
    margin-right: 2%;
  }
  .like-item a {
    margin: 0;
    height: min-content;
    padding: 10px;
  }
  .like-item p {
    display: block;
    margin: 10px 0 0 0;
    color: black;
    font-weight: 800;
  }
  .like-item img {
    display: block;
    margin: 0 auto;
    width: 300px;
    mix-blend-mode: darken;
  }
</style>
