<template>
  <button @click="handleClick" :class="[active, 'tab']">
    {{ label }}
  </button>
</template>

<script>
import { computed, toRefs } from 'vue'
export default {
  props: {
    id: Number,
    label: String,
    currentId: Number
  },
  setup (props, { emit }) {
    const { id, currentId } = toRefs(props)
    const active = computed(() => {
      return currentId.value === id.value ? 'active' : ''
    })

    const handleClick = () => {
      emit('update:currentId', id.value)
    }

    return {
      active,
      handleClick
    }
  }
}
</script>

<style scoped>
.tab {
  position: relative;
  z-index: 1;
  width: 70px;
  height: 60%;
  margin: 5px;
  border: solid 1px #b4dffa;
  background-color: rgba(139, 194, 240, 0.25);
  cursor: pointer;
  border-radius: 4px;
  font-family: "KHNPHDRegular";
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
}
/* .tab:hover {
  border: solid 1px #F8C314 !important;
} */
.active {
  color: #F8C314 !important;
  border: solid 1px #F8C314 !important;
  font-weight: bold;
}
</style>
