<template>
    <div class="login_div">
      <h1>登入</h1>
      <form @submit.prevent="handleLogin">
        <input v-model="username" placeholder="Username" required class="acc"/>
        <br/>
        <input type="password" v-model="password" placeholder="Password" required  class="pass"/>
        <br/>
        <button type="submit" class="login_but">登入~</button>
      </form>
      <p v-if="error">{{ error }}</p>
    </div>
</template>
<style>
.login_div{
  width: auto;
  height: auto;
  background: linear-gradient(to top left,rgba(245, 217, 145, 0.368),70%, rgba(255, 255, 255, 0.372));
  border-radius: 10px;
  padding: 5%;
  height: 50vh;
  backdrop-filter: blur(10px);
}
.acc{
  margin: 20px 0;
  width: 20%;
  height: 40px;
  font-size: 1.3em;
  padding-left: 2%;
  background-color:  rgba(255, 255, 255, 0.6);
  border: solid 3px #e1c2a6;
  border-radius: 10px;
  color: #e1c2a6;
}
.pass{
  margin: 20px 0;
  width: 20%;
  height: 40px;
  font-size: 1.3em;
  padding-left: 2%;
  background-color:  rgba(255, 255, 255, 0.6);
  border: solid 3px #e1c2a6;
  border-radius: 10px;
  color: #e1c2a6;
}
.login_but{
  margin: 20px 0;
  background-color: rgb(164, 114, 13);
  border-radius: 15px;
  width: 150px;
  height: 50px;
  text-align: center;
  font-size: 1.3em;
  font-weight: 800;
  color: white;
  border-image: linear-gradient(to top left,rgba(255, 255, 255, 0.769),70%, rgb(255, 255, 255)) 1 1 1 1;
}
@media(max-width:990px){
  .acc{
    width: 50%;
  }
  .pass{
    width: 50%;
  }
}
  @media(max-width:400px){
    .acc{
    width: 80%;
  }
  .pass{
    width: 80%;
  }
}
</style>
<script>
  import { mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: ''
      };
    },
    methods: {
      ...mapActions(['login']),
      async handleLogin() {
        try {
          console.log({ username: this.username, password: this.password });
          await this.login({ username: this.username, password: this.password });
          console.log('test');
          this.$router.push({ name: 'Home' });
        } catch (err) {
          this.error = 'Login failed, please check your credentials';
        }
      }
    }
  };
  </script>
  