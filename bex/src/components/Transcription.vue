<template>
  <div>
    <div class="transcript" v-for="(transcript, i) in transcription" :key="i">
      <p class="speaker" v-if="!singleSpeaker">Speaker {{ transcript.speaker }}</p>
      <p class="message">{{ transcript.text }}</p>
      <p class="time">{{ transcript.startTime }} - {{ transcript.endTime }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Transcription",
  props: {
    transcription: {
      type: Array,
      required: true
    },

    singleSpeaker: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.message {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  margin: 0;
}

.speaker {
  margin: 0;
  font-weight: bold;
}

.time {
  text-align: right;
  font-size: 12px;
  margin: 0;
  color: #919191;
}

.transcript {
  margin-bottom: 10px;
}
</style>
