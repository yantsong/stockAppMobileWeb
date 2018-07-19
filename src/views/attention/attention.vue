<template>
    <div class="attention">
      <Plate-item v-for="(item, index) in infos"
      :key="index"
      :info="item"
      :index="index"
      :query="query"></Plate-item>
    </div>
</template>

<script>
import PlateItem from "@/components/PlateItem/PlateItem";
import api from "@/service/stocksApi";

export default {
  data() {
    return {
      infos: [],
      query: {
        skin: 0,
        type: 0
      }
    };
  },
  created() {
    this._initData();
    this._ViewStyle();
  },
  methods: {
    _initData() {
      api.getTodayChance().then(res => {
        if (res.code === 20000) this.infos = res.data;
      });
    },
    _ViewStyle(type = 0, skin = 0) {
      this.query = {
        type: this.$route.query.type || type,
        skin: this.$route.query.skin || skin
      };
    }
  },
  components: {
    PlateItem
  }
};
</script>

<style lang="scss">
</style>
