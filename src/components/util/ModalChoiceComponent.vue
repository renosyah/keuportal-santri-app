<template>
    <div class="ModalChoiceComponent">

        <!---- each modal MUST have unique id html tag ---->
        <div v-bind:id="id" class="card modal">
            <div class="modal-content">
            <span class="card-title black-text">{{ title }}</span>
            <p> {{ message }} </p>
            </div>
            <div class="center card-action modal-footer">
            <a v-on:click="onPositiveClick" class="waves-effect waves-green btn-flat"> {{ positive_button }} </a>
            <a v-on:click="onNegativeClick" class="waves-effect waves-green btn-flat"> {{ negative_button }} </a>
            </div>
        </div>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';

export default {
    name : 'ModalChoiceComponent',
    props : {
        title : String,
        message : String,
        positive_button : String,
        negative_button : String
    },
    data(){
        return {
            id : uuid.v4()
        }
    },
    mounted : function(){
        window.$('.modal').modal();
    },
    methods : {
        showModal(){
            window.$('#' + this.id).modal('open')
        },
        onPositiveClick(){
            this.$emit('on-positive-click')
            window.$('#' + this.id).modal('close')
        },
        onNegativeClick(){
            this.$emit('on-negative-click')
            window.$('#' + this.id).modal('close')
        }
    }
}
</script>
