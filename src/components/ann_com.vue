<template>
  <div class="announcement-list">
    <h3 class="ann_title">公告列表</h3>
    <div v-for="announcement in announcements" :key="announcement.ann_id" class="announcement-item">
      <h3>{{ announcement.ann_name }}</h3>
      <p>{{ announcement.ann_con }}</p>
      <p>{{ announcement.ann_date }}</p>
    </div>
  </div>
</template>
<style scoped>
.ann_title{
  text-align: center;
  color: rgb(243, 174, 100);
  font-size: 2em;
  margin: 3% 0 0 0;
  -webkit-text-stroke: 1px rgba(197, 138, 44, 0.922);
}
.announcement-item{
  width: 90%;
  margin: 0% 0;
  background-color: rgba(127, 255, 212, 0);
  border-bottom: solid black 3px;
  padding: 0 5%;
}

</style>

<script>
import { mapGetters } from 'vuex';
import { mapActions, mapState } from 'vuex';
export default {
  computed: {
    ...mapGetters(['getAnnouncements']),
    announcements() {
      return this.getAnnouncements;
    }
  }
};
</script>
