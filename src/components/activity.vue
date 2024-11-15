<template>
  <div class="activity-announcement">
    <div class="act_switchbut">
      <button 
        @click="show_act = 1" 
        :class="['actbut', { act_active: show_act === 1 }]">
        活動
      </button>
      <button 
        @click="show_act = 2" 
        :class="['annbut', { act_active: show_act === 2 }]">
        公告
      </button>
    </div>  
    <!-- 確保資料加載完成後再渲染子組件 -->
    <ActivityComponent v-show="show_act === 1" />
    <AnnouncementComponent v-show="show_act === 2" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import ActivityComponent from './act_com.vue';
import AnnouncementComponent from './ann_com.vue';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      show_act: 1,
      showActivities: true,
    };
  },
  components: {
    ActivityComponent,
    AnnouncementComponent,
  },
  methods: {
    ...mapActions(['fetchActivity']),
    toggleShowActivities() {
      if (this.show_act === 1) {
        this.show_act = 2;
        this.showActivities = false;
      } else {
        this.show_act = 1;
        this.showActivities = true;
      }
    },
  },
  created() {
    this.fetchActivity();
    console.log('fetch act');
  },
};
</script>

<style scoped>
.activity-announcement {
  max-width:100%;
  margin: auto;
}
.act_switchbut{
  width: 100%;
  border-bottom: solid black 3px;
  margin: 1% 0;
}
.actbut{
  width: 50%;
  height: auto;
  margin-top: 0%;
  font-size: 1.5em;
  text-align: center;
  border-radius: 5px;
  font-weight: 800;
  color: rgb(0, 0, 0);
  border: 0;
  background-color: rgba(0, 0, 0, 0);
  margin-bottom: 1%;
}
.actbut :hover{
  background-color:rgb(0, 0, 0);
}
.annbut{
  width: 50%;
  height: auto;
  margin-top: 0%;
  font-size: 1.5em;
  text-align: center;
  border-radius: 5px;
  font-weight: 800;
  color: black;
  border: 0;
  background-color: rgba(0, 0, 0, 0);
}
.act_active{
  background-color: rgba(255, 255, 255, 0.562);
  color: rgb(205, 162, 35);
}
</style>
