<template>
    <div class="widget pomodoro-widget" :class="phaseClass">
        <!-- Progress Ring -->
        <div class="progress-ring">
            <svg class="progress-svg" width="200" height="200">
                <circle cx="100" cy="100" r="90" class="progress-bg" />
                <circle cx="100" cy="100" r="90" class="progress-fill" :style="{ strokeDashoffset: progressOffset }" />
            </svg>

            <!-- Center Content -->
            <div class="center-content">
                <div class="phase-info">
                    <div class="phase-icon">{{ phaseIcon }}</div>
                    <div class="phase-label">{{ phaseLabel }}</div>
                </div>

                <div class="timer-display">
                    <span class="time-segment">{{ minutes }}</span>
                    <span class="time-separator">:</span>
                    <span class="time-segment">{{ seconds }}</span>
                </div>

                <div class="session-info">
                    <div class="session-counter">Session {{ sessionCount }}</div>
                    <div class="session-progress">
                        <span class="progress-dots">
                            <span v-for="n in 4" :key="n" :class="{ active: n <= (completedSessions % 4 || 4) }"
                                class="dot"></span>
                        </span>
                        <span class="next-break">{{ nextBreakText }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modern Control Buttons -->
        <div class="modern-controls">
            <button class="modern-btn secondary" @click="showSettings = !showSettings"
                :class="{ active: showSettings }">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor"
                        d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                </svg>
                Settings
            </button>

            <button class="modern-btn primary" @click="toggle" :class="{ playing: isRunning }">
                <svg v-if="!isRunning" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
                <svg v-else viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                </svg>
                {{ isRunning ? 'Pause' : 'Start' }}
            </button>

            <button class="modern-btn secondary" @click="skipPhase">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
                </svg>
                Skip
            </button>

            <button class="modern-btn secondary reset-btn" @click="resetTimer" title="Reset Timer">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor"
                        d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z" />
                </svg>
                Reset
            </button>
        </div>

        <!-- Settings Modal -->
        <transition name="modal">
            <div v-if="showSettings" class="modal-overlay" @click="showSettings = false">
                <div class="modal-content" @click.stop :class="phaseClass">
                    <div class="modal-header">
                        <h3>Timer Settings</h3>
                        <button class="modal-close" @click="showSettings = false">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor"
                                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                            </svg>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="setting-item">
                            <label>Focus Duration</label>
                            <div class="input-group">
                                <input type="number" v-model.number="workMinutes" min="1" max="120"
                                    @change="updateTimers">
                                <span class="input-suffix">min</span>
                            </div>
                        </div>
                        <div class="setting-item">
                            <label>Break Duration</label>
                            <div class="input-group">
                                <input type="number" v-model.number="breakMinutes" min="1" max="60"
                                    @change="updateTimers">
                                <span class="input-suffix">min</span>
                            </div>
                        </div>
                        <div class="setting-item">
                            <label>Long Break Duration</label>
                            <div class="input-group">
                                <input type="number" v-model.number="longBreakMinutes" min="1" max="60"
                                    @change="updateTimers">
                                <span class="input-suffix">min</span>
                            </div>
                        </div>

                        <div class="setting-divider"></div>

                        <div class="setting-action">
                            <button class="reset-session-btn" @click="showResetModal = true">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="currentColor"
                                        d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z" />
                                </svg>
                                Reset All Sessions
                            </button>
                            <div class="session-stats">
                                <span>Sessions: {{ sessionCount }}</span>
                                <span>Completed: {{ completedSessions }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Reset Confirmation Modal -->
        <transition name="modal">
            <div v-if="showResetModal" class="modal-overlay" @click="showResetModal = false">
                <div class="modal-content reset-modal" @click.stop :class="phaseClass">
                    <div class="modal-header">
                        <h3>Reset Sessions</h3>
                    </div>

                    <div class="modal-body">
                        <div class="reset-warning">
                            <svg viewBox="0 0 24 24" width="48" height="48" class="warning-icon">
                                <path fill="currentColor"
                                    d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2M12,7A2,2 0 0,0 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9A2,2 0 0,0 12,7Z" />
                            </svg>
                            <p>Are you sure you want to reset all sessions and progress?</p>
                            <p class="warning-text">This will clear your current session count and cannot be undone.</p>
                        </div>

                        <div class="current-stats">
                            <div class="stat-item">
                                <span class="stat-label">Current Session:</span>
                                <span class="stat-value">{{ sessionCount }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Completed Sessions:</span>
                                <span class="stat-value">{{ completedSessions }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn-cancel" @click="showResetModal = false">
                            Cancel
                        </button>
                        <button class="btn-confirm" @click="confirmReset">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor"
                                    d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z" />
                            </svg>
                            Reset All
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getParams } from '@/shared/query.js';
import { applyTheme } from '@/shared/theme.js';

const params = getParams();
applyTheme(params);

const workMinutes = ref(params.work);
const breakMinutes = ref(params.break);
const longBreakMinutes = ref(15); // Default 15 minutes for long break
const workSec = computed(() => workMinutes.value * 60);
const breakSec = computed(() => breakMinutes.value * 60);
const longBreakSec = computed(() => longBreakMinutes.value * 60);
const phase = ref('work');
const remaining = ref(workSec.value);
const isRunning = ref(false);
const showSettings = ref(false);
const showResetModal = ref(false);
const sessionCount = ref(1);
const completedSessions = ref(0); // Track completed work sessions
let timer;

const phaseLabel = computed(() => {
    if (phase.value === 'work') return 'Focus';
    if (phase.value === 'break') return 'Short Break';
    if (phase.value === 'longbreak') return 'Long Break';
    return 'Break';
});

const phaseIcon = computed(() => {
    if (phase.value === 'work') return '🧠';
    if (phase.value === 'break') return '☕';
    return '🌙';
});

const phaseClass = computed(() => {
    if (phase.value === 'work') return 'focus-phase';
    if (phase.value === 'break') return 'break-phase';
    return 'longbreak-phase';
});

const minutes = computed(() => String(Math.floor(remaining.value / 60)).padStart(2, '0'));
const seconds = computed(() => String(remaining.value % 60).padStart(2, '0'));

// Progress ring calculation
const progressOffset = computed(() => {
    let total;
    if (phase.value === 'work') total = workSec.value;
    else if (phase.value === 'break') total = breakSec.value;
    else total = longBreakSec.value;

    const progress = (total - remaining.value) / total;
    const circumference = 2 * Math.PI * 90; // radius = 90
    return circumference - (progress * circumference);
});

// Next break indicator
const nextBreakText = computed(() => {
    const sessionsToLongBreak = 4 - (completedSessions.value % 4);
    if (phase.value === 'longbreak') return 'Long Break';
    if (phase.value === 'break') return 'Short Break';
    if (sessionsToLongBreak === 4) return 'Long Break Next!';
    return `${sessionsToLongBreak} to Long Break`;
});

function tick() {
    if (remaining.value > 0) {
        remaining.value--;
    } else {
        // Phase completed - move to next
        if (phase.value === 'work') {
            completedSessions.value++;

            // Every 4th work session -> long break, otherwise short break
            if (completedSessions.value % 4 === 0) {
                phase.value = 'longbreak';
                remaining.value = longBreakSec.value;
            } else {
                phase.value = 'break';
                remaining.value = breakSec.value;
            }
        } else {
            // Break completed -> back to work
            phase.value = 'work';
            remaining.value = workSec.value;
            sessionCount.value++;
        }
        // Optional: Add notification sound/vibration here
    }
}

function toggle() {
    isRunning.value = !isRunning.value;
}

function resetTimer() {
    isRunning.value = false;
    // Reset timer to current phase duration
    if (phase.value === 'work') {
        remaining.value = workSec.value;
    } else if (phase.value === 'break') {
        remaining.value = breakSec.value;
    } else {
        remaining.value = longBreakSec.value;
    }
}

function resetSession() {
    showResetModal.value = true;
}

function confirmReset() {
    isRunning.value = false;
    phase.value = 'work';
    remaining.value = workSec.value;
    sessionCount.value = 1;
    completedSessions.value = 0;
    showResetModal.value = false;
    showSettings.value = false;
}

function updateTimers() {
    if (!isRunning.value) {
        if (phase.value === 'work') {
            remaining.value = workSec.value;
        } else if (phase.value === 'break') {
            remaining.value = breakSec.value;
        } else {
            remaining.value = longBreakSec.value;
        }
    }
}

function skipPhase() {
    isRunning.value = false;

    if (phase.value === 'work') {
        completedSessions.value++;

        // Every 4th work session -> long break, otherwise short break
        if (completedSessions.value % 4 === 0) {
            phase.value = 'longbreak';
            remaining.value = longBreakSec.value;
        } else {
            phase.value = 'break';
            remaining.value = breakSec.value;
        }
    } else {
        // Break completed -> back to work
        phase.value = 'work';
        remaining.value = workSec.value;
        sessionCount.value++;
    }
}

onMounted(() => {
    document.body.style.minHeight = '300px';
    timer = setInterval(() => {
        if (isRunning.value) tick();
    }, 1000);
    // Klavye kısayolları (opsiyonel)
    window.addEventListener('keydown', onKey);
});
onUnmounted(() => {
    clearInterval(timer);
    window.removeEventListener('keydown', onKey);
});

function onKey(e) {
    if (e.code === 'Space') toggle();
    if (e.key === 'r' || e.key === 'R') reset();
}
</script>

<style lang="scss" scoped>
.pomodoro-widget {
    min-height: 280px;
    width: min-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5em;
    border-radius: 20px;
    padding: 1.5rem;
    position: relative;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.05);

    // Modern Glass Morphism Themes
    &.focus-phase {
        background: linear-gradient(135deg,
                rgba(239, 68, 68, 0.1) 0%,
                rgba(220, 38, 38, 0.05) 100%);

        --primary-color: #ef4444;
        --secondary-color: #fca5a5;
        --accent-color: rgba(239, 68, 68, 0.1);
    }

    &.break-phase {
        background: linear-gradient(135deg,
                rgba(34, 197, 94, 0.1) 0%,
                rgba(22, 163, 74, 0.05) 100%);

        --primary-color: #22c55e;
        --secondary-color: #86efac;
        --accent-color: rgba(34, 197, 94, 0.1);
    }

    &.longbreak-phase {
        background: linear-gradient(135deg,
                rgba(59, 130, 246, 0.1) 0%,
                rgba(37, 99, 235, 0.05) 100%);

        --primary-color: #3b82f6;
        --secondary-color: #93c5fd;
        --accent-color: rgba(59, 130, 246, 0.1);
    }

    // Modern Progress Ring
    .progress-ring {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .progress-svg {
            transform: rotate(-90deg);
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .progress-bg {
            fill: none;
            stroke: rgba(255, 255, 255, 0.1);
            stroke-width: 3;
        }

        .progress-fill {
            fill: none;
            stroke: var(--primary-color);
            stroke-width: 4;
            stroke-linecap: round;
            stroke-dasharray: 565; // 2π * 90
            transition: stroke-dashoffset 1s ease-in-out;
            filter: drop-shadow(0 0 8px var(--primary-color));
        }

        .center-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;

            .phase-info {
                margin-bottom: 1rem;

                .phase-icon {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    display: block;
                }

                .phase-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--primary-color);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
            }

            .timer-display {
                font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
                font-weight: 300;
                font-size: 2.5rem;
                line-height: 1;
                color: #1f2937;
                margin-bottom: 0.5rem;

                .time-separator {
                    opacity: 0.5;
                    animation: blink 2s infinite;
                }

                @keyframes blink {

                    0%,
                    50% {
                        opacity: 0.5;
                    }

                    51%,
                    100% {
                        opacity: 0.1;
                    }
                }
            }

            .session-info {
                .session-counter {
                    font-size: 0.75rem;
                    color: #6b7280;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }

                .session-progress {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.3rem;

                    .progress-dots {
                        display: flex;
                        gap: 0.3rem;

                        .dot {
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;
                            background: rgba(107, 114, 128, 0.3);
                            transition: all 0.3s ease;

                            &.active {
                                background: var(--primary-color);
                                box-shadow: 0 0 8px var(--primary-color);
                            }
                        }
                    }

                    .next-break {
                        font-size: 0.625rem;
                        color: #9ca3af;
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                }
            }
        }
    }

    // Modern Control Buttons
    .modern-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .modern-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border: none;
            border-radius: 12px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);

            svg {
                transition: transform 0.2s ease;
            }

            &:hover svg {
                transform: scale(1.1);
            }

            &.primary {
                background: var(--primary-color);
                color: white;
                box-shadow:
                    0 4px 12px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(255, 255, 255, 0.1);

                &:hover {
                    transform: translateY(-2px);
                    box-shadow:
                        0 8px 24px rgba(0, 0, 0, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.1);
                }

                &:active {
                    transform: translateY(0);
                }

                &.playing {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {

                    0%,
                    100% {
                        box-shadow:
                            0 4px 12px rgba(0, 0, 0, 0.15),
                            0 0 0 1px rgba(255, 255, 255, 0.1);
                    }

                    50% {
                        box-shadow:
                            0 4px 12px rgba(0, 0, 0, 0.15),
                            0 0 0 1px rgba(255, 255, 255, 0.1),
                            0 0 20px var(--primary-color);
                    }
                }
            }

            &.secondary {
                background: var(--accent-color);
                color: var(--primary-color);
                border: 1px solid rgba(255, 255, 255, 0.2);

                &:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-1px);
                }

                &.active {
                    background: var(--primary-color);
                    color: white;
                }
            }
        }
    }

    // Modal System
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(15px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 1rem;
    }

    .modal-content {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        width: 100%;
        max-width: 420px;
        max-height: 90vh;
        overflow: hidden;
        box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.2);

        // Theme inheritance
        &.work-phase {
            --modal-primary: var(--primary-color);
            --modal-accent: var(--accent-color);
        }

        &.short-break-phase {
            --modal-primary: var(--primary-color);
            --modal-accent: var(--accent-color);
        }

        &.long-break-phase {
            --modal-primary: var(--primary-color);
            --modal-accent: var(--accent-color);
        }

        &.reset-modal {
            max-width: 350px;
        }
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 1.5rem 0;

        h3 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--modal-primary, var(--primary-color, #f87171));
        }

        .modal-close {
            background: none;
            border: none;
            padding: 0.5rem;
            cursor: pointer;
            border-radius: 8px;
            color: #6b7280;
            transition: all 0.2s ease;

            &:hover {
                background: #f3f4f6;
                color: #374151;
            }
        }
    }

    .modal-body {
        padding: 1.5rem;
        overflow-y: auto;

        // Settings içeriği - orijinal stiller
        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;

            &:last-child {
                margin-bottom: 0;
            }

            label {
                font-size: 0.875rem;
                font-weight: 600;
                color: #374151;
            }

            .input-group {
                display: flex;
                align-items: center;
                gap: 0.5rem;

                input {
                    width: 60px;
                    padding: 0.5rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 0.875rem;
                    font-weight: 600;
                    transition: all 0.2s ease;

                    &:focus {
                        outline: none;
                        border-color: var(--modal-primary, var(--primary-color, #f87171));
                        box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
                    }
                }

                .input-suffix {
                    font-size: 0.75rem;
                    color: #6b7280;
                    font-weight: 500;
                }
            }
        }

        .setting-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
            margin: 1.5rem 0;
        }

        .setting-action {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            .reset-session-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                background: #fee2e2;
                color: #dc2626;
                border: 1px solid #fca5a5;
                border-radius: 8px;
                font-size: 0.875rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover {
                    background: #fecaca;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
                }

                svg {
                    flex-shrink: 0;
                }
            }

            .session-stats {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 0;
                font-size: 0.75rem;
                color: #6b7280;
                border-top: 1px solid #f3f4f6;

                span {
                    font-weight: 500;
                }
            }
        }
    }

    // Reset Modal Specific Styles
    .reset-modal {
        h3 {
            margin: 0 0 1.5rem 0;
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--modal-primary, var(--primary-color, #f87171));
            text-align: center;
        }

        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;

            &:last-child {
                margin-bottom: 0;
            }

            label {
                font-size: 0.875rem;
                font-weight: 600;
                color: #374151;
            }

            .input-group {
                display: flex;
                align-items: center;
                gap: 0.5rem;

                input {
                    width: 60px;
                    padding: 0.5rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 0.875rem;
                    font-weight: 600;
                    transition: all 0.2s ease;

                    &:focus {
                        outline: none;
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 3px rgba(var(--primary-color), 0.1);
                    }
                }

                .input-suffix {
                    font-size: 0.75rem;
                    color: #6b7280;
                    font-weight: 500;
                }
            }
        }

        .setting-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
            margin: 1.5rem 0;
        }

        .setting-action {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            .reset-session-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                background: #fee2e2;
                color: #dc2626;
                border: 1px solid #fca5a5;
                border-radius: 8px;
                font-size: 0.875rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover {
                    background: #fecaca;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
                }

                svg {
                    flex-shrink: 0;
                }
            }

            .session-stats {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 0;
                font-size: 0.75rem;
                color: #6b7280;
                border-top: 1px solid #f3f4f6;

                span {
                    font-weight: 500;
                }
            }
        }
    }

}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 0 1.5rem 1.5rem;

    button {
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .btn-cancel {
        background: #f3f4f6;
        color: #374151;

        &:hover {
            background: #e5e7eb;
        }
    }

    .btn-confirm {
        background: #dc2626;
        color: white;

        &:hover {
            background: #b91c1c;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }
    }
}

// Reset Modal Specific Styles
.reset-warning {
    text-align: center;
    margin-bottom: 1.5rem;

    .warning-icon {
        color: #f59e0b;
        margin-bottom: 1rem;
    }

    p {
        margin: 0 0 0.5rem 0;
        color: #374151;
        font-weight: 600;
    }

    .warning-text {
        font-size: 0.875rem;
        color: #6b7280;
        font-weight: 400;
    }
}

.current-stats {
    background: #f9fafb;
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;

    .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        &:last-child {
            margin-bottom: 0;
        }

        .stat-label {
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 500;
        }

        .stat-value {
            font-size: 0.875rem;
            color: #111827;
            font-weight: 700;
            background: var(--primary-color);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 6px;
            min-width: 2rem;
            text-align: center;
        }
    }
}

// Modal Transitions
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;

    .modal-content {
        transform: scale(0.9) translateY(-20px);
    }
}
</style>