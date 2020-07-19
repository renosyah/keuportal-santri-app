<template>
    <div class="AddToHomeScreen">
        <transition name="bounce">
            <div id="message-chip" class="container center" v-show="show">
                <div class="row">
                    <div class="col s12 m2"></div>
                    <div class="col s12 m8">
                        <a v-on:click="addingToHomeScreen">
                            <div class="z-depth-2 chip center black darken-3 white-text">
                                Tambahkan Ke Layar depan
                                <i v-on:click="saveStatusInstalled" class="close material-icons">close</i>
                            </div>
                        </a>
                    </div>
                    <div class="col s12 m2"></div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name : 'AddToHomeScreen',
    data(){
        return {
            status_install : {
                installed : false
            },
            show : false,
            deferredPrompt : null
        }
    },
    created() {

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.loadStatusInstalled()
        })
    },
    methods : {
        addingToHomeScreen(){
            this.show = false
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {

                    console.log('User accepted the A2HS prompt');
                    this.saveStatusInstalled()

                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                this.deferredPrompt = null;
            });
        },
        saveStatusInstalled(){
            this.status_install.installed = true
            const parsed = JSON.stringify(this.status_install);
            localStorage.setItem('status_install', parsed);
        },
        loadStatusInstalled(){
            this.show = !localStorage.getItem('status_install')
        }
    }
}
</script>

<style scoped>

a {
    cursor: pointer;
}

.AddToHomeScreen {
    overflow: hidden;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 10;
}

#message-chip{
    margin-top: 20px
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