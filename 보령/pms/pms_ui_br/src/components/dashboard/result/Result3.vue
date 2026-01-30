<template>
  <div class="right-contents">
  </div>
</template>

<script>
export default {
  props: [
    'isAiOn'
  ],
  methods: {
    getAIFCLocationSpeed: function(location) {
      return this.$store.state.mixing.latest['ai_d_fc_location_sp' + location]
    }
  }
}
</script>
