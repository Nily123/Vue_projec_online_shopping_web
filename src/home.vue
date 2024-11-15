<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { RouterLink, RouterView } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHeart,faCartShopping ,faReceipt} from '@fortawesome/free-solid-svg-icons';

const store = useStore();

// Computed properties to access Vuex state
const isAuthenticated = computed(() => store.getters.isAuthenticated);
const username = computed(() => store.state.user?.username);
const role = computed(() => store.getters.role);

// Logout function
function handleLogout() {
  store.dispatch('logout');
  this.$router.push({ name: 'Home' });
}
</script>

<template>
  <div class="top_nav">
    <RouterLink to="/"><img src="./assets/SW_BLACK.png" alt="logo" class="logo"></RouterLink>
    
    <!-- Show login link if not authenticated, else show username and logout button -->
    <div v-if="isAuthenticated" class="user-info">
      <div  v-show ="role === 'customer'" class="">
          <RouterLink to ='/like'><FontAwesomeIcon :icon="faHeart" class="like icon"/></RouterLink>
          <RouterLink to ='/cart'><FontAwesomeIcon :icon="faCartShopping" class="cart icon" /></RouterLink>
          <RouterLink to ='/userorder'><FontAwesomeIcon :icon="faReceipt" class="order icon" /></RouterLink>
      </div>
        <span>歡迎, {{ username }}</span>
        <button @click="handleLogout" class="logout-button">登出</button>
      
    </div>
    <RouterLink v-else to="/login" class="login">登入</RouterLink>
  </div>

  <div class="option_nav">
    <!--<RouterLink to="/" active-class="active" class="ul"><ul>首頁</ul></RouterLink>-->
    <RouterLink to="/product" active-class="active" class="ul"><ul>商品</ul></RouterLink>
    <RouterLink to="/activity" active-class="active" class="ul"><ul>活動</ul></RouterLink>
    <RouterLink to="/about" active-class="active" class="ul"><ul>關於我們</ul></RouterLink>

    <!-- Show admin link if the user is an employee -->
    <ul v-if="role === 'employee'" class="ul">
      <RouterLink to="/admin" active-class="active"  class="ul_admin">管理</RouterLink>
    </ul>
  </div>

  <div class="show_div">
    <RouterView/>
    <div class="footer">
      <div><p>聯絡電話: (02) 1234-5678 (非真實電話)</p></div>
      <div><p>門市地址 : 台北市中正區建國路一段23號(非真實店家或地址)</p></div>
      <div class="socail">
        <p>社群連結:</p>
        <a href=""><img src="./assets/facebook.png" class="ic"/></a>
        <a href=""><img src="./assets/x.png"  class="ic"/></a>
        <a href=""><img src="./assets/instagram.png"  class="ic"/></a>
      </div>
  </div>


  </div>
</template>

<style>
/* Additional styles for new elements */
.user-info {
  display: flex;
  flex-wrap: wrap;
  justify-items: end;
  text-align: end;
  width: 50%;
  justify-content: flex-end;
  position: absolute;
  right: 5%;
  top: 5vh;
}
.logout-button {
  margin-left: 1em;
  cursor: pointer;
  background: none;
  border: none;
  color: rgb(255, 138, 123);
  text-decoration: none;
}
body{
    background-color:white;
    color: black;
    width: 100%;
    height: auto;
    background-image: url("data/back01.png");
    background-repeat: repeat;
    object-fit: cover;
}
.top_nav{
    width: 100%;
    height: 10vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.377);
    backdrop-filter: blur(5px);
}
.logo{
    width: 10%;
    height: 100%;
    margin-left: 5%;
}
.login{
    position: absolute;
    right: 5%;
    top: 5vh;
}
.option_nav{
    position: absolute;
    top: 10%;
    left: 0;
    width: 100%;
    height: 5vh;
    background-color: rgba(255, 253, 250, 0.441);
    border-top: solid 3px #CBB0A5;
    border-bottom: solid 3px #CBB0A5;
    align-items: center;
    justify-content: center;
    text-align: center;
    display: flex;
    backdrop-filter: blur(5px);
}
.ul{
    margin: 0 5%;
    height: auto;
    font-weight: 800;
    width: 15%;
    color: #b07420;
    -webkit-text-stroke: 0.2px rgba(255, 255, 255, 0.922);
    /*text-shadow: 2px 2px #9a782268;*/
    font-size: 1.3em;
    text-decoration: none;
    border-radius: 5px;
}
.ul :hover{
  background-color: #b0742070;
  color: azure;
  border-radius: 5px;
}
.ul ul{
  text-align: center;
  padding: 0 0 0 0 ;
}
.ul_admin{
  text-decoration: none;
}

.show_div{
    position: absolute;
    top:18vh;
    padding: 0 5% 15% 5%;
    width: 89%;
    height: auto;
    border:  solid 4% hsl(59, 100%, 75%);
    border-radius: 5px;
    background-image: linear-gradient(to top left,rgba(254, 255, 189, 0.249),70%, rgba(255, 255, 255, 0.342));
    backdrop-filter: blur(5px);
}
.footer{
  position: absolute;
  bottom: 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  border-top: solid black 5px;
  width: 89%;
  padding: 3% 0;
}
.active{
    background-color: rgba(221, 182, 140, 0);
    color: #db8c46;
    -webkit-text-stroke: 0.2px rgba(169, 104, 0, 0.922);
    /*text-shadow: 2px 2px #88847368;*/
    font-weight: 800;

}
.icon{
  margin: 0 10px ;
  
  filter: drop-shadow( 2px 2px 2px rgba(251, 251, 251, 0.2));
  font-size: 1.5em;
}
.like{
  color: #db8c46;
  
}
.cart{
  color: #db8c46;
}
.order{
  color:#db8c46;
}
.ic{
  width: 24px;
}
.socail{
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width:972px) {
  .ul{
    font-size: 0.8em;
  }
  .logo{
    width: 20%;
  }
}
@media (max-width:400px) {
  .ul{
    font-size: 0.5em;
  }
  .logo{
    width: 30%;
  }
  .user-info{
    top: 20%;
  }
}
</style>