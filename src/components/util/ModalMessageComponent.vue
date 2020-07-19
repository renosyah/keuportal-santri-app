<template>
    <div class="ModalMessageComponent">

        <!---- each modal MUST have unique id html tag ---->
        <div v-bind:id="id" class="card modal">
            <div class="modal-content">
            <span class="card-title black-text">{{ title }}</span>
            <p> {{ message }} </p>
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
    name : 'ModalMessageComponent',
    props : {
        title : String,
        message : String
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
    }
}
</script>

