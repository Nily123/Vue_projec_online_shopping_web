import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    role: null,
    products: [],
    activity: [],
    announcements: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = true;
      state.role = user.role;
    },
    setUserCart(state, cart) {
      if (state.user) {
        state.user.car = cart;
      }
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
    },
    setProducts(state, products) {
      state.products = products;
    },
    setActivity(state, activityData) {
      state.activity = activityData.activity;
      state.announcements = activityData.announce;
    }
  },
  actions: {
    async login({ commit }, userData) {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        const data = await response.json();

        if (data.success) {
          // 使用從後端返回的用戶信息來獲取該用戶的完整資料
          const userResponse = await fetch(`http://localhost:3000/users/${userData.username}`);
          const userDetails = await userResponse.json();
          console.log(userDetails);
          commit('setUser', userDetails);  // 存儲完整的用戶資訊
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error(error);
        throw error;  // 將錯誤傳遞給呼叫者
      }
    },
    logout({ commit }) {
      commit('logout');
    },
    async fetchUser({ commit,state }) {
      const response = await fetch(`http://localhost:3000/users/${state.user.username}`);
      const user = await response.json();
      commit('setUser', user);
    },
    async removeCartItem({ commit, state }, productId) {
      await fetch(`http://localhost:3000/user/${state.user.username}/cart/${productId}`, { method: 'DELETE' });
      const updatedCart = state.user.car.filter(item => item.id !== productId);
      commit('setUserCart', updatedCart);
    },
    async checkoutCart({commit,state },username) {
      await fetch(`http://localhost:3000/user/${username}/checkout`, { method: 'POST' });
      const response = await fetch(`http://localhost:3000/users/${state.user.username}`);
      const user = await response.json();
      commit('setUser', user);
    },
    async fetchProducts({ commit }) {
      const response = await fetch("http://localhost:3000/products");
      const products = await response.json();
      commit("setProducts", products);
    },
    async fetchActivity({ commit }) {
      const response = await fetch("http://localhost:3000/activity");
      const activityData = await response.json();
      console.log("fetch_act");
      commit("setActivity", activityData);
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    role: state => state.role,
    getCurrentUser: state => state.user,
    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === id);
    },
    getActivities: state => state.activity,
    getAnnouncements: state => state.announcements
  }
});
