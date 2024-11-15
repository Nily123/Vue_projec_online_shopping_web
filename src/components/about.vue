<template>
    <div class="ab_div">
      <div class="c1">
        <div class="img_div">
          <img src="/data/shop.jpg" class="shop_img">
        </div>
        <div class="c1-5">
          <h1>歡迎來到SW Shop！ </h1>
          <p>自2022年開店以來，SW Shop 一直致力於提供青少年與年輕人群體最新潮、最具個人風格的服裝。
            我們相信每一件衣物都應該能夠展現穿著者的個性，不僅是一件衣物，更是生活方式的延伸。
            SW Shop 為您帶來物超所值的選擇，不論是流行款還是經典款，我們都嚴選每件產品以確保高品質的穿著體驗。
          
          </p>
        </div>
    </div>
      <div class="c2">
        <h1>品牌價值與堅持：</h1>
        <p>
          SW Shop 堅持「品質即信任」的品牌核心價值。我們深信，高品質與合理價格並不相悖，
          因此在挑選布料與製作工藝時精益求精，不斷追求最佳平衡。我們的設計風格獨特，
          將青春的活力和時尚潮流融入每件衣物中，以滿足新世代消費者對於品味與舒適的雙重需求。
        </p>
      </div>
      <div class="c3">
        <h1>未來展望與承諾：</h1>
        <p>
          SW Shop 希望不僅僅是您的購物平台，更成為您個性表現的支持者。我們承諾在未來持續推動流行與品質的標準化，
          並擴展我們的商品選擇，提供更多元的時尚選擇。隨著成長，我們將持續傾聽顧客需求，
          為每位穿上 SW Shop 服飾的人帶來自信與驕傲。
        </p>
      </div>
    </div>
</template>
<style>
.ab_div{
  padding: 5% ;
  font-size: 1.1em;
  line-height: 30px;
  font-weight: 500;
  letter-spacing: 3px;
}
.img_div{
  width: 40%;
}

.shop_img{
  width: 100%;
  border-radius: 5px;
}
.c1{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 5%;
  border-bottom:solid black 3px ;
}
.c1-5{
  margin-left: 5%;
  width: 50%;
}
.c2{
  padding-right: 30%;
  padding-bottom: 5%;
  border-bottom:solid black 3px ;
}
.c3{
  text-align: left;
  padding-left: 30%;
  padding-bottom: 5%;
  border-bottom:solid black 3px ;
}
@media(max-width:990px){
  .img_div{
  width: 80%;
  }
  .c1-5{
    width: 80%;
  }.ab_div{
    text-align: left;
  }
  .c3{
    padding: 0;
  }
}
</style>
<script>
</script>