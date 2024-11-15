<template>
  <div class="div0">
    <!-- Toggle Buttons for Activity and Announcement -->
    <button @click="showActivity = !showActivity" class="sw_btn">
      {{ showActivity ? "顯示公告" : "顯示活動" }}
    </button>

    <!-- Activity Management Section -->
    <div v-show="showActivity">
        <div class="act">
          <h2>活動管理</h2>
          <button class="add_btn"><RouterLink to="/add_activity">新增活動</RouterLink></button>
        </div>
        <div v-for="activity in activity" :key="activity.act_id" class="activity-item">
          <div class="act0">
            <h3>{{ activity.act_name }}</h3>
            <button @click="toggleActivityDetails(activity.act_id)" class="but0">
              {{ activity.showDetails ? "收起詳細資訊" : "查看詳細資訊" }}
            </button>
          </div>
        <!-- Detailed Activity Information -->
        <div v-show="activity.showDetails" class="activity-details">
          <label class="it_tl">活動名稱:</label>
          <input v-model="activity.act_name" type="text" class="act_name"/><br/>

          <label class="it_tl">分類:</label><button @click="addCategory(activity)" class="btn2">新增分類</button>
          <div v-for="(cat, index) in activity.category" :key="index">
            <input v-model="activity.category[index]" type="text" />
          </div>
          <br/>

          <label class="it_tl">商品ID:</label><button @click="addProductId(activity)" class="btn2">新增商品ID</button>
          <div v-for="(id, index) in activity.pro_id" :key="index">
            <input v-model="activity.pro_id[index]" type="text" />
          </div>
          <br/>

          <label class="it_tl">活動內容:</label><br/>
          <textarea v-model="activity.act_con" class="act_con"></textarea><br/>

          <label class="it_tl">開始時間:</label>
          <input v-model="activity.act_start" type="date" /><br/>

          <label class="it_tl">結束時間:</label>
          <input v-model="activity.act_end" type="date" /><br/>

          <label class="it_tl">折扣:</label>
          <input v-model="activity.discount" type="text" /><br/>

          <label class="it_tl">折扣規則</label><br/>
          <label>類型:</label><input v-model="activity.discount_rule.type" placeholder="類型" /><br/>
          <label>數量條件:</label><input v-model.number="activity.discount_rule.quantity_condition" placeholder="數量條件" /><br/>
          <label>應用對象:</label><input v-model="activity.discount_rule.apply_to" placeholder="應用對象" /><br/>
          <label>折扣率:</label><input v-model.number="activity.discount_rule.rate" placeholder="折扣率" /><br/>

          <button @click="updateActivity0(activity)" class="but1">儲存更改</button>
        </div>
      </div>
    </div>

    <!-- Announcement Management Section -->
    <div v-show="!showActivity">
      <div class="act">
        <h2>公告管理</h2>
          <button class="add_btn"><RouterLink to="/add_ann">新增活動</RouterLink></button>
        </div>
      <div v-for="announce in announcements" :key="announce.ann_id" class="announce-item">
        <div class="act0">
          <h3>{{ announce.ann_name }}</h3>
          <button @click="toggleAnnouncementDetails(announce.ann_id)" class="but0">
            {{ announce.showDetails ? "收起詳細資訊" : "查看詳細資訊" }}
          </button>
        </div>
        <!-- Detailed Announcement Information -->
        <div v-show="announce.showDetails" class="announce-details">
          <label class="it_tl">公告名稱:</label>
          <input v-model="announce.ann_name" type="text" /><br/>

          <label class="it_tl">公告內容:</label><br/>
          <textarea v-model="announce.ann_con"></textarea><br/>

          <label class="it_tl">公告時間:</label>
          <input v-model="announce.ann_date" type="text" disabled /><br/>

          <button @click="updateAnnouncement(announce)" class="but1">儲存更改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      showActivity: true, // Toggle between activity and announcement
    };
  },
  computed: {
    ...mapState(["activity", "announcements"]),
  },
  methods: {
    ...mapActions(["fetchActivity"]),
    
    // Toggle activity and announcement details visibility
    toggleActivityDetails(id) {
      const activity = this.activity.find(a => a.act_id === id);
      activity.showDetails = !activity.showDetails;
    },
    toggleAnnouncementDetails(id) {
      const announce = this.announcements.find(a => a.ann_id === id);
      announce.showDetails = !announce.showDetails;
    },

    // Add category or product ID in activity
    addCategory(activity) {
      activity.category.push("");
    },
    addProductId(activity) {
      activity.pro_id.push("");
    },
    async updateActivity0(activity) {
      try {
        const response = await fetch(`http://localhost:3000/activity/${activity.act_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            act_name: activity.act_name,
            category: activity.category,
            pro_id: activity.pro_id,
            act_con: activity.act_con,
            act_cau_img: activity.act_cau_img,
            act_con_img: activity.act_con_img,
            act_start: activity.act_start,
            act_end: activity.act_end,
            discount: activity.discount,
            discount_rule: activity.discount_rule
          })
        });
        if (!response.ok) throw new Error('Failed to update activity');
        await this.fetchActivity();
        alert('活動更新成功');
      } catch (error) {
        console.error("Error updating activity:", error);
        alert('活動更新失敗');
      }
    },
    async updateAnnouncement(announce) {
      try {
        const response = await fetch(`http://localhost:3000/announce/${announce.ann_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ann_name: announce.ann_name,
            ann_con: announce.ann_con,
            ann_date: announce.ann_date
          })
        });
        if (!response.ok) throw new Error('Failed to update announce');
        await this.fetchActivity();
        alert('公告更新成功');
      } catch (error) {
        console.error("Error updating announce:", error);
        alert('公告更新失敗');
      }

    }, 
    ensureDiscountRule() {
      this.activity.forEach(act => {
        if (!act.discount_rule) {
          act.discount_rule = {
            type: "",
            quantity_condition: 0,
            apply_to: "",
            rate: 0
          };
        }
      });
      console.log("1");
    }
  },
  created() {
    this.fetchActivity().then(() => {
    this.ensureDiscountRule();
  });
  },
};
</script>

<style scoped>
.act{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.div0{
  padding: 2% 0 5%  0;
}
.add_btn{
  margin-bottom: 3%;
  background-color: rgba(255, 178, 89, 0.701);
  color: white;
  font-weight: 800;
  width: 15%;
  font-size: 1em;
  border-radius: 6px;
  border: solid 3px white;
}
.add_btn a{
  color: rgba(255, 255, 255, 0.925);
  text-decoration: none;
}
.sw_btn{
  background-color: rgb(210, 140, 49);
  color: white;
  border-radius: 5px;
  font-weight: 800;
  border: white;
  padding: 1% 3%;
}
.act0{
  border-bottom: solid 3px rgb(8, 8, 8);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 2% 10%;
}
.but0{
  height: 100%;
  background-color: black;
  color: white;
  border-radius: 5px;
  padding: 2% 3%;
}
.act_name{
  width: 50%;
}
.activity-item, .announce-item { 
  border-bottom: solid 3px rgb(8, 8, 8);

 }
.it_tl{
  margin-top: 2%;
  font-weight: 800;
}
input{
  margin: 2%;
}
.but1{
  background-color: black;
  color: white;
  border-radius: 5px;
  padding: 1% 0%;
  width: 15%;
  margin: 5% 35%;
}
.btn2{
  margin-left: 5%;
  background-color: rgb(214, 156, 80);
  color: white;
  border: rgb(201, 172, 134);
  border-radius: 5px;
}
.activity-details, .announce-details{
  padding:5% 10%;
}
.act_con{
  width: 80%;
  height: 40%;
}
</style>
