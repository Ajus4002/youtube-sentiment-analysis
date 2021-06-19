<template>
  <q-page class="q-pa-md" ref="page">
    <div class="flex flex-center">
      <div class="text-red" v-if="error && !transcribing">
        {{error}}
      </div>

      <q-inner-loading :showing="transcribing">
        <q-spinner-bars size="50px" color="primary" />
      </q-inner-loading>
    </div>

    <q-card flat bordered v-if="transcription">
      <q-card-section>
        <div class="q-gutter-md row">
          <q-select class="col" outlined stack-label v-model="selectedSpeaker" label="Speaker" emit-value map-options :options="speakersList"/>
          <q-input class="col" outlined stack-label v-model="fromTime" label="From (in sec)" clearable/>
          <q-input class="col" outlined stack-label v-model="toTime" label="To (in sec)" clearable/>
        </div>
      </q-card-section>
    </q-card>

    <q-tabs v-model="tab" class="text-teal" v-if="transcription">
      <q-tab name="classification" icon="data_usage"  label="Classification" />
      <q-tab name="key-elements"   icon="star"        label="Key Elements" />
      <q-tab name="entities"       icon="badge"       label="Entities" />
      <q-tab name="transcription"  icon="description" label="Transcription" />
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      animated
      swipeable
      v-if="transcription"
    >
      <q-tab-panel name="classification">
        <div class="text-h6 q-mb-md">Classification</div>
        <Classification :classified-data="classifiedData" v-if="classifiedData"/>

        <q-inner-loading :showing="classifying">
          <q-spinner-bars size="50px" color="primary" />
        </q-inner-loading>
      </q-tab-panel>

      <q-tab-panel name="key-elements">
        <div class="text-h6 q-mb-md">Key Elements</div>
        <KeyElements :analysed-data="analysedData" v-if="analysedData"/>

        <q-inner-loading class="flex flex-center" :showing="analysing">
          <q-spinner-bars size="50px" color="primary" />
        </q-inner-loading>
      </q-tab-panel>

      <q-tab-panel name="entities">
        <div class="text-h6 q-mb-md">Entities</div>
        <Entities :analysed-data="analysedData" v-if="analysedData"/>

        <q-inner-loading class="flex flex-center" :showing="analysing">
          <q-spinner-bars size="50px" color="primary" />
        </q-inner-loading>
      </q-tab-panel>

      <q-tab-panel name="transcription">
        <div class="text-h6 q-mb-md">Transcription</div>
        <Transcription :transcription="transcribedData.speakerDiarization" :single-speaker="this.selectedSpeaker !== 0"/>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import md5 from 'blueimp-md5'

import http from "../http";
import Transcription from "components/Transcription";
import KeyElements from "components/KeyElements";

import Entities from "components/Entities";
import Classification from "components/Classification";

export default {
  name: 'PageIndex',
  components: {Classification, Entities, KeyElements, Transcription},
  data() {
    return {
      transcription: null,
      error: null,

      transcribing: false,
      analysing: false,
      classifying: false,

      selectedSpeaker: 0,
      fromTime: null,
      toTime: null,

      analysedData: null,
      classifiedData: null,
      cachedData: {},

      tab: 'classification'
    };
  },
  computed: {
    speakersList() {
      return this.transcription.speakerDiarization.reduce((acc, v) => {
        if (!acc.find(a => a.value === v.speaker)) {
          acc.push({label: 'Speaker ' + v.speaker, value: v.speaker})
        }
        return acc;
      }, [{label: 'Overall', value: 0}])
    },

    transcribedData() {
      if (!this.transcription) {
        return null
      }

      let speaker = this.transcription.speakerDiarization
      if (this.selectedSpeaker !== 0) {
        speaker = speaker.filter(v => v.speaker === this.selectedSpeaker)
      }

      if (this.fromTime) {
        const ft = parseFloat(this.fromTime);
        speaker = speaker.filter(v => parseFloat(v.startTime) >= ft)
      }

      if (this.toTime) {
        const tt = parseFloat(this.toTime);
        speaker = speaker.filter(v => parseFloat(v.endTime) <= tt)
      }

      return {
        transcription: speaker.reduce((acc, v) => acc + v.text + "\n", ""),
        speakerDiarization: speaker
      }
    }
  },
  watch: {
    transcribedData() {
      if (this.transcription) {
        this.analyseSpeaker()
      }
    }
  },
  methods: {
    async analyseVideo(videoId) {
      this.transcribing = true;
      try {
        const res = await http.post('/video/transcribe', {videoId});
        return res.data;
      } catch (e) {
        this.error = "Unable to analyse video."
      } finally {
        this.transcribing = false
      }
    },

    async analyseText(text) {
      this.analysing = true;
      try {
        const res = await http.post('/text/analyse', {text});
        return res.data;
      } catch (e) {
        this.error = "Unable to analyse text."
      } finally {
        this.analysing = false
      }
    },

    async classifyText(text) {
      this.classifying = true;
      try {
        const res = await http.post('/text/classify/all', {text});
        return res.data;
      } catch (e) {
        this.error = "Unable to classify text."
      } finally {
        this.classifying = false
      }
    },

    async analyseSpeaker() {
      const hash = md5(this.transcribedData.transcription)
      if (this.cachedData[hash]) {
        this.analysedData = this.cachedData[hash].analysedData
        this.classifiedData = this.cachedData[hash].classifiedData
        return;
      }

      this.classifiedData = await this.classifyText(this.transcribedData.transcription)
      this.analysedData = await this.analyseText(this.transcribedData.transcription)

      this.cachedData[hash] = {
        analysedData: this.analysedData,
        classifiedData: this.classifiedData
      }
    },

    async analyse() {
      const params = new URL(location.href).searchParams;
      const videoId = params.get('videoId');
      this.transcription = await this.analyseVideo(videoId);
    }
  },

  mounted() {
    this.analyse()
  }
}
</script>

<style>
/deep/ .q-tab-panel {
  min-height: 250px;
}
</style>
