<template>
  <div class="cate_div">
    <div class="op_rightline">
      <h3>分類篩選</h3>
      <div class="op">
        <input
          type="checkbox"
          id="showAll"
          v-model="showAll"
          @change="resetFilters"
          :class="['cat_check',{op_active:selectedCategory == category}]"
        />
        <label for="showAll" class="cat_lab">顯示全部</label>
      </div>
    </div>

    <div class="op_rightline">
      <h4>性別</h4>
      <div v-for="(label, category) in categoryLabels.gender" :key="category" class="op">
        <input
          type="checkbox"
          :value="category"
          v-model="selectedCategory"
          @change="handleSingleSelect(category)"
          :id="category"
          :class="['cat_check',{op_active:selectedCategory == category}]"
        />
        <label :for="category" class="cat_lab">{{ label }}</label>
      </div>
    </div>

    <div class="op_rightline">
      <h4>服裝部位</h4>
      <div v-for="(label, category) in categoryLabels.clothingType" :key="category" class="op">
        <input
          type="checkbox"
          :value="category"
          v-model="selectedCategory"
          @change="handleSingleSelect(category)"
          :id="category"
          :class="['cat_check',{op_active:selectedCategory == category}]"
        />
        <label :for="category" class="cat_lab">{{ label }}</label>
      </div>
    </div>

    <div class="op_rightline">
      <h4>服裝種類</h4>
      <div v-for="(label, category) in categoryLabels.style" :key="category" class="op">
        <input
          type="checkbox"
          :value="category"
          v-model="selectedCategory"
          @change="handleSingleSelect(category)"
          :id="category"
          :class="['cat_check',{op_active:selectedCategory == category}]"
        />
        <label :for="category" class="cat_lab">{{ label }}</label>
      </div>
    </div>

    <div class="op_rightline">
      <h4>季節</h4>
      <div v-for="(label, category) in categoryLabels.season" :key="category" class="op">
        <input
          type="checkbox"
          :value="category"
          v-model="selectedCategory"
          @change="handleSingleSelect(category)"
          :id="category"
          :class="['cat_check',{op_active:selectedCategory == category}]"
        />
        <label :for="category" class="cat_lab">{{ label }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: Array,
  },
  data() {
    return {
      selectedCategory: "", // Stores the currently selected category
      showAll: false, // Tracks if 'Show All' is selected
      categoryLabels: {
        gender: {
          Men: "男士服裝",
          Women: "女士服裝",
        },
        clothingType: {
          Shirt: "上衣",
          Pants: "褲子",
          Jacket: "外套",
          
        },
        style:{
           Cowboy:"牛仔風",
           POLO: "POLO 衫",
           Hooded_shirt:"帽T",
        },
        season: {
          Fall: "秋季服裝",
          Winter: "冬季服裝",
        },
      },
    };
  },
  methods: {
    handleSingleSelect(category) {
      // When a checkbox is selected, update selectedCategory and reset 'Show All'
      this.showAll = false;
      this.selectedCategory = category;
      this.$emit("filter-change", this.selectedCategory);
    },
    resetFilters() {
      // Reset all filters if 'Show All' is checked
      if (this.showAll) {
        this.selectedCategory = "";
        this.$emit("filter-change", this.selectedCategory);
      }
    },
  },
};
</script>

<style scoped>
.cate_div {
  background-color: rgba(215, 222, 219, 0);
  margin: 5% 5% 0 0;
  padding: 0 3% 5% 0%;
  width: 20%;
  height: 50%;
  border-right: solid black 3px;  
}
h4{
  border-bottom: solid black 3px;
  margin-bottom: 0;
}
.op{
  background-color: rgba(255, 255, 255, 0);
  padding: 2%;
}
.cat_check{
  display: none;
}
.cat_lab{
  color: rgb(209, 146, 37);
  font-weight: 800;
  font-size: 1.1em;
  padding: 2px 3px;
  border-radius: 3px;
}
.op_active+ .cat_lab{ 
  background-color: rgba(255, 255, 255, 0.74);
  color: rgb(157, 95, 1);
  font-weight: 800;
}
</style>
