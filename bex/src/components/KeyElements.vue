<template>
<div>
  <p v-if="analysedData.topics[0] && analysedData.topics[0].winner">Topic: <b class="text-teal">{{ analysedData.topics[0].label }}</b></p>

  <div class="text-bold">Sentiment</div>
  <q-markup-table flat bordered class="q-mb-md">
    <thead>
    <tr>
      <th>Overall</th>
      <th>Positivity</th>
      <th>Negativity</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <th :class="analysedData.sentiment.overall | sentimentColor">{{ analysedData.sentiment.overall | sentiment }} ({{ analysedData.sentiment.overall }})</th>
      <th class="text-green">{{ analysedData.sentiment.positivity }}</th>
      <th class="text-red">{{ analysedData.sentiment.negativity }}</th>
    </tr>
    </tbody>
  </q-markup-table>

  <q-list bordered class="rounded-borders">
    <q-expansion-item expand-separator label="Main Lemmas" header-class="text-red">
      <q-card>
        <q-card-section>
          <div class="phrase q-mb-md">
            <q-chip color="teal" text-color="white" v-for="(lemma, i) in analysedData.mainLemmas" :key="i">{{ lemma.value }}</q-chip>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-expansion-item expand-separator label="Main Sentences" header-class="text-blue">
      <q-card>
        <q-card-section>
          <div class="sentence q-mb-md" v-for="(sentence, i) in analysedData.mainSentences" :key="i">
            <p class="content-bubble">{{ sentence.value }}</p>
            <p class="content-footer">Score: {{ sentence.score }}</p>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-expansion-item expand-separator label="Main Phrases" header-class="text-green">
      <q-card>
        <q-card-section>
          <div class="phrase q-mb-md" v-for="(phrase, i) in analysedData.mainPhrases" :key="i">
            <p class="content-bubble">{{ phrase.value }}</p>
            <p class="content-footer">Score: {{ phrase.score }}</p>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</div>
</template>

<script>
export default {
  name: "KeyElements",
  props: {
    analysedData: {
      type: Object,
      required: true
    }
  },
  filters: {
    sentiment(sentiment) {
      if (sentiment === 0) return 'Neutral'
      if (sentiment < 0) return 'Negative'
      if (sentiment > 0) return 'Positive'
    },

    sentimentColor(sentiment) {
      if (sentiment === 0) return 'text-grey'
      if (sentiment < 0) return 'text-red'
      if (sentiment > 0) return 'text-green'
    }
  }
}
</script>

<style scoped>
.content-bubble {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  margin: 0;
}

.content-footer {
  text-align: right;
  font-size: 12px;
  margin: 0;
  color: #919191;
}
</style>
