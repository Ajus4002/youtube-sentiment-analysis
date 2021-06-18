<template>
  <div class="row q-col-gutter-md">
    <div class="col-6" v-if="hasData('emotional-traits')">
      <q-card flat bordered>
        <q-card-section>
          <DonutChart title="Emotional traits" :data="getData('emotional-traits')"/>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-6" v-if="hasData('behavioral-traits')">
      <q-card flat bordered>
        <q-card-section>
          <DonutChart title="Behavioral traits" :data="getData('behavioral-traits')"/>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-6" v-if="hasData('iptc')">
      <q-card flat bordered>
        <q-card-section>
          <DonutChart title="IPTC Media Topics" :data="getData('iptc')"/>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-6" v-if="hasData('geotax')">
      <q-card flat bordered>
        <q-card-section>
          <DonutChart title="GeoTax" :data="getData('geotax')"/>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import DonutChart from "components/DonutChart";
export default {
  name: "Classification",
  components: {DonutChart},
  props: {
    classifiedData: {
      type: Object,
      required: true
    }
  },

  methods: {
    getData(taxonomy) {
      const data = this.classifiedData[taxonomy].categories.map(v => {
        return {
          name: v.label,
          value: v.frequency
        }
      })

      const total = data.reduce((acc, v) => acc + v.value, 0);
      if (total < 100) {
        data.push({
          name: 'Others',
          value: 100 - total
        })
      }

      return data;
    },

    hasData(taxonomy) {
      return this.classifiedData[taxonomy]?.categories?.length > 0
    }
  }
}
</script>

<style scoped>

</style>
