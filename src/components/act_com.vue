<template>
  <div class="activity-list">
    <h3 class="act_title">活動列表</h3>
    <div v-for="activity in activities" :key="activity.act_id" class="activity-item">
      <div class="item-header">
        <div v-if="activity.act_con_img && activity.act_con_img.length">
          <img v-for="img in activity.act_con_img" :src="`/data/${img}`" :alt="`活動圖片 ${img}`" class="activity-img" />
        </div>  
        <h3 class="act_name">{{ activity.act_name }}</h3>
        <p>{{ activity.act_start }} - {{ activity.act_end }}</p>
        <button @click="toggleDetails(activity.act_id)" class="act_but">+</button>
      </div>
      <div v-show="show === activity.act_id" class="item-details">
        <p>{{ activity.act_con }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.activity-list{
  width: 100%;
}
.act_title{
  text-align: center;
  color: rgb(243, 174, 100);
  font-size: 2em;
  margin: 3% 0 0 0;
  -webkit-text-stroke: 1px rgba(197, 138, 44, 0.922);
}
.activity-item{
  width: 90%;
  margin: 0% 0;
  background-color: rgba(127, 255, 212, 0);
  border-bottom: solid black 3px;
  padding: 0 5%;
}
.item-header{
  position: relative;
}
.act_name{
  font-size: 1.5em;
  font-weight: 800;
}
.activity-img{
  width: 80%;
  margin: 5% 10% 0 10%;
}
.act_but{
  background-color: rgb(173, 173, 173);
  padding: 0 1.5%;
  color: rgb(255, 255, 255);
  font-size: 1.5em;
  font-weight: 800;
  border-radius: 10px;
  position: absolute;
  bottom: 3%;
  right: 3%;
  border:  solid 2px white;
}
</style>
<script>
import { mapGetters } from 'vuex';
import { mapActions, mapState } from 'vuex';
export default {
  data() {
    return {
      show: 0
    };
  },
  methods: {
    toggleDetails(id) {
      this.show = this.show === id ? 0 : id;
    }
  },
  computed: {
    ...mapGetters(['getActivities']),
    ...mapState({
      activity: (state) => state.activity
    }),
    activities() {
      console.log("getter"+this.getActivities );
      return this.getActivities;
    }
  }
};
</script>
