<template>
    <div class="chart-box">
        <div class="titlebox">
            <img src="@/assets/monitor-centerTitle.svg" alt="">
            <p>{{TITLE.name}}</p>
        </div>
            <img src="@/assets/light2.png" alt="" class="light">
          <Frame />

          <div class="motors">
              <div class="main-motor">
                  <img src="@/assets/motor.png" alt="">
              </div>

              <div class="select-motor">
                  <div class="motor-box" v-for="motor in store.state.motors" :key="motor.id"  @click="selectedMotor(motor.id)">
                      <div class="motor-img" :class="{selected : motor.select}">
                          <img src="@/assets/motor.png" alt="">
                      </div>
                      <div class="motor-name" :class="{selectName : motor.select}">
                          {{motor.name}}
                      </div>
                  </div>
              </div>
          </div>
    </div>
</template>

<script>
import Frame from '@/components/component/BoxFrame.vue';
import { useStore } from "vuex";
import { reactive } from 'vue';
export default {
    components:{Frame},
     setup(){
         const store = useStore();
             let TITLE = reactive({
                 name: '송수펌프 #1'
             })

         const selectedMotor = (num) => {
             const motorsData = store.state.motors;
             motorsData.map(x => x.select = false)

             motorsData.filter(x => {
                 if(x.id === num){
                     x.select = true
                     TITLE.name = x.name
                     return;
                 }
             })
         }


        return{store,selectedMotor, TITLE}
    }
}
</script>

<style>

</style>