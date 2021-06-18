<template>
<div>
  <q-markup-table flat bordered>
    <thead>
    <tr>
      <th>Element</th>
      <th>Type</th>
      <th>Linked Data</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(entity, i) in analysedData.entities" :key="i">
      <td class="text-bold">{{ entity.lemma }}</td>
      <td><q-chip :color="getEntityColor(entity.type)" text-color="white">{{ getEntityDescription(entity.type) }}</q-chip></td>
      <td>
        <div v-if="entity.syncon !== -1" class="q-gutter-md">
          <q-btn color="grey-4" text-color="teal" unelevated round :icon="getKnowledgeIcon(prop)" @click="openPage(getKnowledgeUrl(prop))" v-for="(prop, i) in getKnowledge(entity.syncon).properties" :key="i">
            <q-tooltip>{{ getKnowledgeUrl(prop) }}</q-tooltip>
          </q-btn>
        </div>
      </td>

    </tr>
    </tbody>
  </q-markup-table>
</div>
</template>

<script>
import entities from "src/entities";

export default {
  name: "Entities",
  props: {
    analysedData: {
      type: Object,
      required: true
    }
  },

  methods: {
    getEntityDescription(type) {
      return entities[type]['desc']
    },

    getEntityColor(type) {
      return entities[type]['color']
    },

    getKnowledge(syncon) {
      return this.analysedData.knowledge.find(v => v.syncon === syncon)
    },

    getKnowledgeIcon(knowledge) {
      switch (knowledge.type) {
        case 'WikiDataId':
          return `bar_chart`;

        case 'GeoNamesId':
          return `public`;

        case 'DBpediaId':
          return `local_florist`;

        case 'Coordinate':
          return `location_on`;
      }
    },

    getKnowledgeUrl(knowledge) {
      switch (knowledge.type) {
        case 'WikiDataId':
          return `https://www.wikidata.org/wiki/${knowledge.value}`;

        case 'GeoNamesId':
          return `https://www.geonames.org/${knowledge.value}`;

        case 'DBpediaId':
          return `https://${knowledge.value}`;

        case 'Coordinate':
          const value = knowledge.value.split(';')
          return `https://www.google.com/maps?q=${value[0].split('/')[1]},${value[1].split('/')[1]}`;
      }
    },

    openPage(url) {
      window.open(url, '_blank').focus();
    }
  }
}
</script>

<style scoped>

</style>
