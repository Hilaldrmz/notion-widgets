<template>
    <div class="app-container">
        <router-view />
    </div>
</template>

<script setup>
import '@/scss/base.scss';
</script>

<style scoped>
.app-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
