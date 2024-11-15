<template>
    <div class="add-announcement">
      <h2>新增公告</h2>
      <!-- 公告基本資訊輸入 -->
      <div class="add_div">
        <label class="add_name add_inputlab">公告標題: <input v-model="announcement.ann_name" class="add_input" /></label>
        <label class="add_content add_inputlab">公告內容: <br/>
          <textarea v-model="announcement.ann_con" class="add_text"></textarea>
        </label>
      </div>
      <button @click="submitAnnouncement" class="sub_but">提交新增公告</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapState } from 'vuex';
  
  export default {
    data() {
      return {
        announcement: {
          ann_id: 0,
          ann_name: "",
          ann_con: "",
          ann_date: "",
        },
      };
    },
    computed: {
      ...mapState({
        announcements: (state) => state.announcements,
      }),
    },
    methods: {
      submitAnnouncement() {
        // 設定公告ID
        this.announcement.ann_id = this.announcements.length ? this.announcements[this.announcements.length - 1].ann_id + 1 : 1;
        // 設定公告發布時間為當前時間
        this.announcement.ann_date = new Date().toLocaleString();
  
        // 發送公告資料至伺服器
        axios
          .post("http://localhost:3000/announcements", this.announcement)
          .then(() => {
            alert("公告已新增成功");
            this.$router.push({ name: "Admin" });
          })
          .catch((error) => {
            console.error("新增公告失敗:", error);
            alert("新增公告失敗，請重試。");
          });
      },
    },
  };
  </script>
  
  <style scoped>
  .add-announcement {
    padding-bottom: 10%;
  }
  .add_div {
    padding-left: 5%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "add_name add_content";
    align-items: center;
  }
  .add_inputlab {}
  .add_name {
    grid-area: add_name;
  }
  .add_content {
    grid-area: add_content;
  }
  .add_input {
    margin-bottom: 5%;
  }
  .sub_but {
    margin-left: 5%;
    width: 15%;
    font-size: 1.2em;
    font-weight: 800;
    background-color: rgb(225, 165, 96);
    color: azure;
    border-radius: 5px;
    border: solid 3px rgb(138, 98, 29);
  }
  </style>
  