<template>
  <div class="pro_box">
    <CategoryFilter :categories="categories" @filter-change="applyFilter" class="cate"/>
    <ProductList :products="filteredProducts" class="pro_list"/>
  </div>
</template>
<style scoped>
  .pro_box{
    display: flex;
    width: 100%;
  }
  .pro_list{
    width: 75%;
  }
</style>
<script>
import CategoryFilter from "@/components/option.vue";
import ProductList from "@/components/product_info.vue";
import { mapActions, mapState } from 'vuex';

export default {
  components: { CategoryFilter, ProductList },
  data() {
    return {
      filteredProducts: [], // 篩選後的商品
      categories: ["Men", "Shirt", "POLO", "Fall", "Winter"], // 可根據實際分類來設定
      selectedCategories: ""
    };
  },
  computed: {
    ...mapState({
      products: (state) => state.products
    })
  },
  created() {
    this.fetchProducts(); 
  },
  watch: {
    // 監聽 products 的變化來更新篩選後的商品
    products: {
      handler(newProducts) {
        this.filteredProducts = newProducts;
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['fetchProducts']),
    applyFilter(selectedCategory) { // now expects a single string
    this.selectedCategories = selectedCategory;
    this.filteredProducts = this.products.filter((product) =>
      selectedCategory ? product.category.includes(selectedCategory) : true
    );
  }
}
};
</script>
