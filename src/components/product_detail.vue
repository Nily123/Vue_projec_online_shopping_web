<script> 
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart, faCartPlus} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faHeart,faCartPlus);
import {ref} from 'vue';
export default {
  props: {
    productId: {
      type: Number,
      required: true
    }
  },
  components: {
  FontAwesomeIcon
  },
  data() {
    return {
      isLoading: true,
      selectedColor: null,
      selectedSize: null,
      selectedQuantity: 1,
      activities: [],
      isLiked: false,
    };
  },
  computed: {
    ...mapGetters(['getProductById', 'getCurrentUser','getActivities','isAuthenticated']),
    product() {
      return this.getProductById(this.productId);
    },
    activity() {
      return this.getActivities;
    },
    totalSales() {
      return this.product?.variations.reduce((total, variation) => {
        return total + variation.sizes.reduce((subTotal, size) => subTotal + size.sales, 0);
      }, 0);
    },
    firstImagesForColors() {
      return this.product?.variations.map(variation => ({
        color: variation.color,
        image: variation.image[0]
      })) || [];
    },
    selectedColorImage() {
      if (this.selectedColor) {
        const variation = this.product.variations.find(v => v.color === this.selectedColor);
        return variation ? variation.image[0] : null;
      }
      return this.firstImagesForColors[0]?.image;
    },
    allProductImages() {
      return [ ...(this.product.variations.flatMap(variation => variation.image) || []),...(this.product.image || [])];
      //return this.product?.variations.flatMap(variation => variation.image) || [];
    },
    relatedActivities() {
      const currentDate = new Date();

      return this.activity.filter(activity => {
        // Check if the current date falls within the activity's start and end dates
        const isWithinDateRange =
          new Date(activity.act_start) <= currentDate && currentDate <= new Date(activity.act_end);

        // Check if the activity applies to the product's category or specific product ID
        const isCategoryMatch = activity.category.some(category => this.product.category.includes(category));
        const isProductIdMatch = activity.pro_id.includes(this.productId);

        // Only return activities that match the conditions and are within the date range
        return (isCategoryMatch || isProductIdMatch) && isWithinDateRange;
      });
    },
      filteredNotice() {
      // 過濾出非空字串的項目
      return this.product.notice ? this.product.notice.filter(note => note.trim() !== "") : [];
    }
  },
  watch: {
    product(newVal) {
      this.isLoading = false;
      if (!newVal) {
        console.error("Product not found");
      } else {
        this.selectedColor = newVal.variations[0].color;
        this.checkIfLiked();
      }
    }
  },
  async created() {
      if (!this.product) {
        await this.$store.dispatch('fetchProducts');
      }
      if (!this.activity || this.activity.length === 0) {
        await this.$store.dispatch('fetchActivity');
      }
      this.isLoading = false;
    },
  methods: {
    ...mapActions(['fetchUser', 'fetchProducts','fetchActivity']),
    selectColor(color) {
      this.selectedColor = color;
    },
    async toggleLike() {
      if (!this.isAuthenticated) {
        // Redirect to login if not authenticated
        this.$router.push({ name: 'Login' });
        return;
      }
      const username = this.getCurrentUser.username;
      try {
        await axios.post(`http://localhost:3000/users/${username}/like`, {
          productId: this.productId
        });
        this.isLiked = !this.isLiked;
        alert("商品已加入收藏");
        await this.fetchUser();
      } catch (error) {
        console.error("Error updating like status:", error);
      }
    },
    checkIfLiked() {
      const user = this.getCurrentUser;
      this.isLiked = user.like.some(liked => liked.id === this.productId);
    },
    async addToCart() {
      const username = this.getCurrentUser.username;
      try {
        await axios.post(`http://localhost:3000/users/${username}/car`, {
          id: this.productId,
          color: this.selectedColor,
          size: this.selectedSize,
          number: this.selectedQuantity
        });
        await this.fetchUser();
        alert("商品已加入購物車");
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  }
};
</script>

<template>
  <div v-if="isLoading">
    <p>加載中...</p>
  </div>
  <div v-else-if="product" class="pro_div">
    

    <div v-if="selectedColorImage" class="pro_color0imgdiv">
      <img :src="'/data/' + selectedColorImage" :alt="selectedColor + ' selected image'" class="pro_color0img" />
    </div>

    <h2 class="pro_name">{{ product.name }}</h2>

    <div class="pro_colordiv">
      <div v-for="item in firstImagesForColors" :key="item.color" @click="selectColor(item.color)">
        <button :class="['pro_color',{ selected: selectedColor === item.color }]" >{{ item.color }}</button>
        
      </div>
    </div>

    <p class="pro_sales">總銷售量: {{ totalSales }} 件</p>
    <h3 class="pro_price">$ {{ product.price }} 元</h3>
    

    <div v-if="relatedActivities.length > 0" class="pro_actdiv">
      <div v-for="(activity, index) in relatedActivities" :key="index" class="activity-card">
        <p class="pro_act">{{ activity.act_name }}</p>
        <div v-if="activity.discount_rule">
          <p>折扣說明: 
            <span v-if="activity.discount_rule.type === 'same_product_discount'">
              購買相同商品，第二件打{{ activity.discount_rule.rate * 10 }}折
            </span>
            <span v-if="activity.discount_rule.type === 'same_category_discount'">
              購買同類型商品，打{{ activity.discount_rule.rate * 10 }}折優惠
            </span>
            <!-- Add more discount types here if needed -->
          </p>
        </div>
      </div>
    </div>


    
    <div class="pro_sizediv">
      <label for="size" class="pro_sizelabel">選擇尺寸:</label>
      <select v-model="selectedSize" class="pro_sizeselector">
        <option v-for="size in product.variations.find(v => v.color === selectedColor)?.sizes" :key="size.size" :value="size.size">
          {{ size.size }}
        </option>
      </select>
    </div>
    <div class="pro_numdiv">
      <label for="quantity" class="pro_numlabel">數量:</label>
      <input type="number" v-model="selectedQuantity" min="1" class="input_num">
    </div>
    <FontAwesomeIcon :icon="['fas', 'heart']"  class="pro_like" @click="toggleLike"/>
    <button @click="addToCart" class="pro_cartbut"><font-awesome-icon :icon="['fas', 'cart-plus']" class="pro_cart" /></button>


    <p class="pro_location">產地: {{ product.location }}</p>
    <p class="pro_material">材質: {{ product.material }}</p>
    <p class="pro_wash">洗滌方式: {{ product.wash }}</p>
    <!-- 商品注意事項 -->
    <div class="pro_noticediv">
      <h3 class="pro_noticeh3">注意事項:</h3>
      <ul v-if="filteredNotice.length > 0">
        <li v-for="(note, index) in filteredNotice" :key="index">{{ note }}</li>
      </ul>
      <p v-else>無</p>
    </div>
    <div class="pro_allimgdiv">
      <h3>所有圖片</h3>
      <div class="all-images">
        <img v-for="img in allProductImages" :src="'/data/' + img" :key="img" alt="Product Image" class="pro_allimage"/>
      </div>
    </div>
    
  </div>
    
  <div v-else>
    <p>找不到商品資訊</p>
  </div>
</template>

<style scoped>
.pro_div{
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: minmax(80px, auto);
  grid-template-areas:
		"color0imgdiv color0imgdiv color0imgdiv name name name"
		"color0imgdiv color0imgdiv color0imgdiv name name name"
		"color0imgdiv color0imgdiv color0imgdiv actdiv actdiv actdiv"
    "color0imgdiv color0imgdiv color0imgdiv colordiv colordiv price"
    "color0imgdiv color0imgdiv color0imgdiv sizediv sizediv numdiv"
    "color0imgdiv color0imgdiv color0imgdiv sales like cartbut"
    "location location location location location location"
    "material material material material material material"
    "wash wash wash wash wash wash"
    "noticediv noticediv noticediv noticediv noticediv noticediv"
    "allimgdiv allimgdiv allimgdiv allimgdiv allimgdiv allimgdiv";
    margin-top: 2%;
    padding: 3% 10%;
    background-color: rgba(240, 248, 255, 0.285);
    border-radius: 10px;
    border: solid 5px #E1C2A6;
}

.pro_color0imgdiv{
  grid-area: color0imgdiv;
  width: 100%;
  height: auto;
  object-fit: contain;
  text-align: center;
}
.pro_color0img{
  width: 90%;
  border-radius: 5px;
}
.pro_colordiv{
  grid-area: colordiv;
  display: flex;
  justify-content: space-around;
  margin-left: 5%;
}
.pro_color{
  width: max-content;
  background-color: #f9b884;
  border: rgb(227, 165, 73) solid 3px;
  border-radius: 5px;
  padding: 10% 30%
}
.pro_name{
  grid-area: name;
  text-align: center;
  font-size: 2em;
  font-weight: bolder;
}
.pro_sales{
  grid-area:sales ;
  margin-left: 5%;
}
.pro_price{
  grid-area: price;
  color: rgb(255, 77, 77);
  text-align: center;
  font-weight: 800;
  font-size: 2em;
}
.pro_actdiv{
  grid-area: actdiv;
  margin-left: 5%;
  background-color: #E1C2A6;
  color: white;
  padding: 0 10%;
  font-size: 1.1em;
  font-weight: 800;
  border-radius: 15px;
  border: solid 3px white;
}
.pro_like{
  color: rgb(250, 138, 138);
  width: auto;
  font-size: 2em;
  text-align: center;
  grid-area: like;
  margin-left: 75%;
}
.pro_sizediv{
  grid-area: sizediv;
  margin-left: 5%;
}
.pro_sizeselector{
  margin-left: 5%;
  border-radius: 5px;
  font-size: 1.1em;
  border: #f9b884 solid 3px;
  color: #6c541d;
}
.pro_numdiv{
  grid-area: numdiv;
}
.input_num{
  border: solid rgb(255, 214, 92) 3px;
  border-radius: 5px;
  margin-top: 5%;
}
.pro_cartbut{
  grid-area: cartbut;
  background-color: rgba(255, 255, 255, 0);
  border: solid 0;
}
.pro_cart{
  color: rgb(82, 146, 236);
  font-size: 2em;
}
.pro_location{
  grid-area: location;
  margin-left: 5%;
}
.pro_material{
  grid-area: material;
  margin-left: 5%;
}
.pro_wash{
  grid-area: wash;
  margin-left: 5%;
}
.pro_noticediv{
  grid-area: noticediv;
  margin-left: 5%;
}
.pro_allimgdiv{
  grid-area: allimgdiv;
  /*text-align: center;*/
}
button.selected {
  background-color: #6c541d;
  color: white;
}
.pro_allimage{
  text-align: center;
  width: 80%;
  height: auto;
  object-fit: contain;
  margin: 0 10%;
}
@media(max-width:400px){
  .pro_div{
    display:block;
    flex-wrap: wrap;
  }
  .pro_color0imgdiv{
    width: 300px;
    padding: 5% 0;
    margin: auto;
  }
  .pro_like{
    margin: 0;
  }
}
</style>
