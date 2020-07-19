<template>
    <div v-show="is_loading" class="LoadingComponent">
        <!-- Loading -->
        <div class="preloader-background">
            <div class="preloader-wrapper big active">
                <div class="spinner-layer spinner-blue-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'LoadingComponent',
    data(){
        return {
            is_loading : false
        }
    },
    methods : {
        show(){
            this.is_loading = true
        },
        close(){
            this.is_loading = false
        }
    }
}
</script>

<style scoped>

.preloader-background {
    display: flex;
	align-items: center;
	justify-content: center;
	background-color: #ffffff;
    opacity:0.5;
	position: fixed;
	z-index: 100;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;	
}

</style>