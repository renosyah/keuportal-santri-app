<template>
    <div class="ModalListComponent">

        <!---- each modal MUST have unique id html tag ---->
        <div v-bind:id="id" class="card modal">
            <div class="modal-content">
            <span class="card-title black-text">{{ title }}</span>
            <ul v-for="item in items" v-bind:key="item.id" class="collection">
                <a v-on:click="itemChoosed(item)"><li class="collection-item">{{ item.name }}</li></a>
            </ul>
            </div>
            <div class="center card-action modal-footer">
            <a class="modal-close waves-effect waves-green btn-flat black-text">Close</a>
            </div>
        </div>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';

export default {
    name : 'ModalListComponent',
    props : {
        title : String,
        items : Array
    },
    data(){
        return {
            id : uuid.v4()
        }
    },
    mounted(){
        window.$('.modal').modal();
    },
    methods : {
        showModal(){
            window.$('#' + this.id).modal('open');
        },
        itemChoosed(item){
            this.$emit("on-item-choosed",item)
            window.$('#' + this.id).modal('close');
        }
    }
}
</script>

<style scoped>
a {
    cursor: pointer;
}
</style>