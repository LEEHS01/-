<template>
    <div class="nav-box">
        <div class="pump-num">#{{pumpNum}}</div>
        <div class="nav-btn"
            :class="{
                        selected: store.state.monitor19.nav === 'POV' 
                        && store.state.monitor19.pumpMotorId === pumpMotorId
                }"
        v-on:click="tab('POV')">POV</div>
        <div class="nav-btn"
            :class="{
                        selected: store.state.monitor19.nav === 'PIV'
                        && store.state.monitor19.pumpMotorId === pumpMotorId
                }"
        v-on:click="tab('PIV')">PIV</div>
        <div class="nav-btn"
            :class="{
                        selected: store.state.monitor19.nav === 'MOV'
                        && store.state.monitor19.pumpMotorId === pumpMotorId
                }"
        v-on:click="tab('MOV')">MOV</div>
        <div class="nav-btn"
            :class="{
                        selected: store.state.monitor19.nav === 'MIV'
                        && store.state.monitor19.pumpMotorId === pumpMotorId
                }"
        v-on:click="tab('MIV')">MIV</div>
    </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
    props: {
    pumpMotorId: {
      type: String,
      required: true
    },
    ipcLocId: {
      type: String,
      required: true
    },
    pumpNum: {
      type: String,
      required: true
    },
    centerId: {
      type: String,
      required: true
    },
    trendChart: {
      type: Function,
      required: true
    }

}   ,
    setup(props) {
        const store = useStore();
        
        const tab = (nav) => {
            if(nav === 'POV'){
                store.state.monitor19.channelId = `${props.pumpNum*4-3}Ch_P`
            } 
            else if(nav === 'PIV'){
                store.state.monitor19.channelId = `${props.pumpNum*4-2}Ch_P`
            }
            else if(nav === 'MOV'){
                store.state.monitor19.channelId = `${props.pumpNum*4-1}Ch_M`
            }
            else{
                store.state.monitor19.channelId = `${props.pumpNum*4}Ch_M`
            }

            store.state.monitor19.pmId = `${props.pumpNum}PM`
            store.state.monitor19.ipcLocId = props.ipcLocId
            store.state.monitor19.nav = nav
            store.state.monitor19.pumpMotorId = props.pumpMotorId
            store.state.monitor19.centerId = props.centerId
            store.dispatch(`monitor19/fetchDiag${nav}`).then(() => {
                props.trendChart(); // Call trendChart after fetching data
            });
        };

        return{
            tab,
            store
        }
    }
}

</script>

<style lang="scss" scoped>
.nav-box{
    flex-direction: row;
    margin-bottom: 10px;

}
.pump-num{
    float: left;
    text-align: center;
    width: 40px;
    padding: 5px 7px;
    color: #fff;
    background: gray;
    border-radius: 4px;
    border: 1px solid gray;
    z-index: 10;
}
.selected {
      border: 1px solid #00ffee;
      background-color: #22536794;
    }

</style>