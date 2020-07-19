<template>
    <div class="OfflineWarning">
        <transition name="bounce">
            <div class="container center" v-if="!is_online" v-on:click="is_online = true">
                <div class="row">
                    <div class="col s12 m2"></div>
                    <div class="col s12 m8">
                        <div class="chip red white-text center">
                            <span class="white-text">Perangkat Anda Sedang Offline! 
                            </span>
                        </div>
                    </div>
                    <div class="col s12 m2"></div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name : 'OfflineWarning',
    data(){
        return {
            is_online : true
        }
    },
    created() {
        window.addEventListener('offline', () => {
             this.is_online = false
        })
        window.addEventListener('online', () => {
            this.is_online = true
        })
    }
}
</script>

<style scoped>
.OfflineWarning {
  overflow: hidden;
  position: fixed;
  top: 25px;
  width: 100%;
  font-size: 32px;
  z-index: 10;
}

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

</style>