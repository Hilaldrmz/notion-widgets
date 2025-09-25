<template>
    <div class="widget clock-widget">
        <!-- Modern Clock Ring -->
        <div class="clock-ring">
            <svg class="clock-svg" width="260" height="260">
                <circle cx="130" cy="130" r="120" class="ring-bg" />
                <circle cx="130" cy="130" r="120" class="ring-accent" :style="{ strokeDashoffset: secondsOffset }" />
            </svg>

            <!-- Center Content -->
            <div class="center-content">
                <div class="clock-time">{{ time }}</div>
                <div class="clock-date">{{ date }}</div>
                <div class="timezone-info" v-if="params.tz">{{ timezoneLabel }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getParams } from '@/shared/query.js';
import { applyTheme } from '@/shared/theme.js';

const params = getParams();
applyTheme(params);

const time = ref('');
const date = ref('');
const seconds = ref(0);
let timer;

// Seconds ring animation - completes every minute
const secondsOffset = computed(() => {
    const progress = seconds.value / 60;
    const circumference = 2 * Math.PI * 120; // radius = 120
    return circumference - (progress * circumference);
});

// Timezone label
const timezoneLabel = computed(() => {
    if (!params.tz) return '';
    return params.tz.split('/').pop()?.replace('_', ' ') || params.tz;
});

function update() {
    const now = params.tz
        ? new Date(new Date().toLocaleString('en-US', { timeZone: params.tz }))
        : new Date();

    time.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    date.value = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
    seconds.value = now.getSeconds();
}

onMounted(() => {
    update();
    timer = setInterval(update, 1000);
    document.body.style.minHeight = '300px';
});

onUnmounted(() => clearInterval(timer));
</script>

<style lang="scss" scoped>
// Base widget styles
.widget {
    padding: 1.5rem;
    text-align: center;
    border-radius: var(--radius, 16px);
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clock-widget {
    // Theme variables
    --primary-color: #3b82f6;
    --accent-color: rgba(59, 130, 246, 0.1);

    // Modern Clock Ring
    .clock-ring {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .clock-svg {
            transform: rotate(-90deg);
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .ring-bg {
            fill: none;
            stroke: rgba(255, 255, 255, 0.1);
            stroke-width: 2;
        }

        .ring-accent {
            fill: none;
            stroke: var(--primary-color);
            stroke-width: 3;
            stroke-linecap: round;
            stroke-dasharray: 754; // 2π * 120
            transition: stroke-dashoffset 1s ease-in-out;
            filter: drop-shadow(0 0 8px var(--primary-color));
        }

        .center-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;

            .clock-time {
                font-size: 2.5rem;
                font-weight: 700;
                letter-spacing: -0.02em;
                margin-bottom: 0.5rem;
                color: var(--fg, #ffffff);
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                line-height: 1;
            }

            .clock-date {
                font-size: 0.875rem;
                font-weight: 500;
                color: var(--primary-color);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 0.25rem;
            }

            .timezone-info {
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.6);
                font-weight: 400;
                text-transform: capitalize;
            }
        }
    }
}

// Responsive design
@media (max-width: 480px) {
    .widget {
        padding: 1rem;
        min-height: 250px;
    }

    .clock-widget .clock-ring {
        .clock-svg {
            width: 200px;
            height: 200px;
        }

        .center-content {
            .clock-time {
                font-size: 2rem;
            }

            .clock-date {
                font-size: 0.8rem;
            }
        }
    }
}
</style>