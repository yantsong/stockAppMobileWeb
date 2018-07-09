<template>
    <div class="related-fund">
        <FundList :funds="funds" ></FundList>
    </div>
</template>

<script>
import FundList from "@/components/fundList/fundList";
import stocksApi from "@/service/stocksApi";

export default {
  data() {
    return {
      funds: [],
      bkjId: 0
    };
  },
  created() {
    this.bkjId = this.$route.params.id;
    this._getfund();
    this._changeMeta();
  },
  components: {
    FundList
  },
  methods: {
    _getfund() {
      stocksApi
        .getFundList(this.bkjId)
        .then(res => {
          if (res.code === 20000) {
            this.funds = this._fundFilter(res.data.funds).slice(0, 10);
          }
        })
        .catch(e => console.log(e));
    },
    _fundFilter(data) {
      return data.sort((a, b) => b.ratio_in_nv - a.ratio_in_nv);
    },
    _changeMeta() {
      stocksApi.getPlatNormalInfo(this.bkjId).then(res => {
        if (res.code === 20000) {
          this.bkjName = res.data.plate_name;
          let head = document.getElementsByTagName("title");
          console.log(head);
          //   let meta = document.createElement("meta");
          head[0].innerHTML = `${this.bkjName}相关基金`;
          //   head[0].appendChild(meta);
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
