<template>
    <div class="full-width flex flex-center q-pt-md border-radius-12 card-gradient" @mouseenter="isHovered = true"
        @mouseleave="isHovered = false">
        <q-img src="../assets/me1.png" class="me" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isHovered = ref(false);
</script>

<style scoped lang="scss">
.me {
    width: 60%;
    transition: filter 0.3s ease;
}

.card-gradient {
    background: linear-gradient(135deg, #8c4aff 0%, #470ea2 100%);
    position: relative;
    overflow: visible;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    cursor: pointer;

    &:hover {
        transform: translateY(-8px) rotateX(5deg);
        box-shadow:
            0 25px 50px rgba(124, 58, 237, 0.4),
            0 0 60px rgba(124, 58, 237, 0.3);

        .me {
            filter: brightness(1.1) saturate(1.1);
        }
    }
}
</style>
