<template>
    <div class="attention">
      <Plate-item v-for="(item, index) in infos" :key="index" :info="item" :index="index"></Plate-item>
    </div>
</template>

<script>
import PlateItem from "@/components/PlateItem/PlateItem";
import api from "@/service/stocksApi";

export default {
  data() {
    return {
      infos: []
    };
  },
  created() {
    this._initData();
  },
  methods: {
    _initData() {
      api.getTodayChance().then(res => {
        if (res.code === 20000) this.infos = res.data;
      });
    }
  },
  components: {
    PlateItem
  }
};
</script>

<style lang="scss">
.attention {
}
</style>
