<template>
    <div class="widget clock-widget" @click="openModal">
        <!-- Modern Clock Ring -->
        <div class="clock-ring">
            <svg class="clock-svg" width="260" height="260">
                <circle cx="130" cy="130" r="120" class="ring-bg" />
                <circle cx="130" cy="130" r="120" class="ring-accent"
                    :style="{ strokeDashoffset: secondsOffset, stroke: accentColor }" />
            </svg>

            <!-- Center Content -->
            <div class="center-content">
                <div class="clock-time" :style="{ color: timeColor }">{{ time }}</div>
                <div class="clock-date" :style="{ color: dateColor }">{{ date }}</div>
                <div class="timezone-info" v-if="selectedTimezone" :style="{ color: timezoneColor }">{{ timezoneLabel }}
                </div>
            </div>
        </div>

        <!-- Settings Modal -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>Clock Settings</h3>
                    <button class="close-btn" @click="closeModal">&times;</button>
                </div>

                <div class="modal-body">
                    <!-- Color Settings -->
                    <div class="setting-group">
                        <h4>Color Settings</h4>

                        <div class="color-setting">
                            <label>Ring Color:</label>
                            <input type="color" v-model="accentColor" />
                        </div>

                        <div class="color-setting">
                            <label>Time Color:</label>
                            <input type="color" v-model="timeColor" />
                        </div>

                        <div class="color-setting">
                            <label>Date Color:</label>
                            <input type="color" v-model="dateColor" />
                        </div>

                        <div class="color-setting">
                            <label>Timezone Color:</label>
                            <input type="color" v-model="timezoneColor" />
                        </div>
                    </div>

                    <!-- Timezone Settings -->
                    <div class="setting-group">
                        <h4>Timezone</h4>
                        <select v-model="selectedTimezone">
                            <option value="">Local Time</option>
                            <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                                {{ tz.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-reset" @click="resetSettings">Reset</button>
                    <button class="btn-save" @click="saveSettings">Save</button>
                </div>
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
const showModal = ref(false);
let timer;

// Default/Original Settings
const defaultSettings = {
    accentColor: '#e29d80',
    timeColor: '#000000',
    dateColor: '#e29d80',
    timezoneColor: 'rgba(255, 255, 255, 0.6)',
    selectedTimezone: ''
};

// Settings
const accentColor = ref(defaultSettings.accentColor);
const timeColor = ref(defaultSettings.timeColor);
const dateColor = ref(defaultSettings.dateColor);
const timezoneColor = ref(defaultSettings.timezoneColor);
const selectedTimezone = ref(defaultSettings.selectedTimezone);

// Timezone options
const timezones = ref([
    { value: 'Europe/Istanbul', label: 'Istanbul' },
    { value: 'Europe/London', label: 'London' },
    { value: 'America/New_York', label: 'New York' },
    { value: 'America/Los_Angeles', label: 'Los Angeles' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
    { value: 'Australia/Sydney', label: 'Sydney' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Europe/Berlin', label: 'Berlin' },
    { value: 'Asia/Dubai', label: 'Dubai' },
    { value: 'America/Sao_Paulo', label: 'São Paulo' },
    { value: 'Asia/Kolkata', label: 'Kolkata' }
]);

// Seconds ring animation - completes every minute
const secondsOffset = computed(() => {
    const progress = seconds.value / 60;
    const circumference = 2 * Math.PI * 120; // radius = 120
    return circumference - (progress * circumference);
});

// Timezone label
const timezoneLabel = computed(() => {
    if (!selectedTimezone.value) return '';
    const tz = timezones.value.find(t => t.value === selectedTimezone.value);
    return tz ? tz.label : selectedTimezone.value.split('/').pop()?.replace('_', ' ');
});

// Modal functions
function openModal() {
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
}

// Settings functions
function saveSettings() {
    // Save to localStorage
    localStorage.setItem('clock-settings', JSON.stringify({
        accentColor: accentColor.value,
        timeColor: timeColor.value,
        dateColor: dateColor.value,
        timezoneColor: timezoneColor.value,
        selectedTimezone: selectedTimezone.value
    }));
    closeModal();
}

function resetSettings() {
    // Reset to original settings
    accentColor.value = defaultSettings.accentColor;
    timeColor.value = defaultSettings.timeColor;
    dateColor.value = defaultSettings.dateColor;
    timezoneColor.value = defaultSettings.timezoneColor;
    selectedTimezone.value = defaultSettings.selectedTimezone;

    // Clear localStorage settings
    localStorage.removeItem('clock-settings');

    // User notification (optional)
    console.log('Settings have been reset to defaults');
}

function loadSettings() {
    const saved = localStorage.getItem('clock-settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            accentColor.value = settings.accentColor || defaultSettings.accentColor;
            timeColor.value = settings.timeColor || defaultSettings.timeColor;
            dateColor.value = settings.dateColor || defaultSettings.dateColor;
            timezoneColor.value = settings.timezoneColor || defaultSettings.timezoneColor;
            selectedTimezone.value = settings.selectedTimezone || defaultSettings.selectedTimezone;
        } catch (error) {
            console.warn('Error loading settings, using default settings:', error);
            resetSettings();
        }
    }
}

function update() {
    const now = selectedTimezone.value
        ? new Date(new Date().toLocaleString('en-US', { timeZone: selectedTimezone.value }))
        : new Date();

    time.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    date.value = now.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
    seconds.value = now.getSeconds();
}

onMounted(() => {
    loadSettings();
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
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease;

    --height: 300px;
    height: var(--height);
    width: var(--height);
    min-height: var(--height);
    min-width: var(--height);
    border-radius: 100%;

    &:hover {
        transform: scale(1.02);
    }
}

.clock-widget {
    // Theme variables
    --primary-color: #e29d80;
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
            overflow: visible;
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

// Modal styles
.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.9));
    backdrop-filter: blur(20px);
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
    width: 90%;
    max-width: 400px;
    max-height: 80vh;
    overflow: hidden;
    color: #333;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 1.5rem;
    padding-bottom: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #333;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        &:hover {
            background: rgba(0, 0, 0, 0.1);
            color: #333;
        }
    }
}

.modal-body {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 3px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c2c2c2;
        border-radius: 3px;
    }

    @supports not selector(::-webkit-scrollbar) {
        scrollbar-color: #e29d80 transparent;
    }
}

.setting-group {
    margin-bottom: 0;

    h4 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: #444;
    }

    .color-setting {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0;

        label {
            font-size: 0.9rem;
            color: #555;
        }

        input[type="color"] {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 0;
        }
    }

    select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
        color: #333;

        &:focus {
            outline: none;
            border-color: #e29d80;
            box-shadow: 0 0 0 2px rgba(226, 157, 128, 0.2);
        }
    }
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-shrink: 0;

    button {
        padding: 0.5rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &.btn-reset {
            background: rgba(0, 0, 0, 0.1);
            color: #666;

            &:hover {
                background: rgba(0, 0, 0, 0.2);
                color: #333;
            }
        }

        &.btn-save {
            background: #e29d80;
            color: white;

            &:hover {
                background: darken(#e29d80, 10%);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(226, 157, 128, 0.3);
            }
        }
    }
}

// Responsive design
@media (max-width: 480px) {
    .widget {
        padding: 0;
    }

    .clock-widget .clock-ring {
        .clock-svg {
            overflow: visible;
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

    .modal-content {
        width: 95%;
        margin: 1rem;
    }

    .modal-footer {
        flex-direction: column;

        button {
            width: 100%;
        }
    }
}
</style>