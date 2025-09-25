<template>
    <div class="landing-page">
        <header class="hero">
            <h1>⚡ Notion Widgets</h1>
            <p>Beautiful, modern widgets for your Notion pages</p>
        </header>

        <div class="widgets-grid">
            <!-- Clock Widget -->
            <div class="widget-card">
                <div class="widget-preview">
                    <iframe :src="clockUrl" width="320" height="350" frameborder="0" scrolling="no">
                    </iframe>
                </div>
                <div class="widget-info">
                    <h3>🕐 Clock Widget</h3>
                    <p>Live time display with timezone support and beautiful animations</p>
                    <div class="widget-features">
                        <span>✓ Real-time updates</span>
                        <span>✓ Timezone support</span>
                        <span>✓ Modern design</span>
                    </div>
                    <button class="copy-btn" @click="copyUrl(clockEmbedUrl)">
                        📋 Copy Embed URL
                    </button>
                </div>
            </div>

            <!-- Pomodoro Widget -->
            <div class="widget-card">
                <div class="widget-preview">
                    <iframe :src="pomodoroUrl" width="320" height="380" frameborder="0" scrolling="no">
                    </iframe>
                </div>
                <div class="widget-info">
                    <h3>🍅 Pomodoro Timer</h3>
                    <p>Advanced productivity timer with focus/break cycle management</p>
                    <div class="widget-features">
                        <span>✓ Session tracking</span>
                        <span>✓ Long breaks</span>
                        <span>✓ Customizable durations</span>
                    </div>
                    <button class="copy-btn" @click="copyUrl(pomodoroEmbedUrl)">
                        📋 Copy Embed URL
                    </button>
                </div>
            </div>
        </div>

        <div class="how-to-use">
            <h2>🚀 How to Use</h2>
            <div class="steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>Copy Widget URL</h4>
                        <p>Click "Copy Embed URL" button above</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>Add to Notion</h4>
                        <p>Type <code>/embed</code> in your Notion page</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4>Paste & Enjoy</h4>
                        <p>Paste the URL and adjust embed size</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="customization">
            <h2>🎨 Customization</h2>
            <div class="custom-options">
                <div class="option">
                    <strong>Example URL:</strong>
                    <code>https://your-username.github.io/notion-widgets/clock?theme=dark&primary=f87171</code>
                </div>
                <div class="option">
                    <strong>Theme:</strong> <code>?theme=dark</code> or <code>?theme=light</code>
                </div>
                <div class="option">
                    <strong>Colors:</strong> <code>&primary=f87171&accent=fbbf24</code>
                </div>
                <div class="option">
                    <strong>Timezone:</strong> <code>&tz=America/New_York</code>
                </div>
                <div class="option">
                    <strong>Timer Settings:</strong> <code>&work=25&break=5&longBreak=15</code>
                </div>
            </div>
        </div>

        <!-- Toast Notification -->
        <div v-if="showToast" class="toast">
            ✅ URL copied to clipboard!
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const showToast = ref(false);

// Base URL for GitHub Pages
const baseUrl = computed(() => {
    if (typeof window !== 'undefined') {
        const origin = window.location.origin;
        const pathname = window.location.pathname;

        // GitHub Pages: https://hilaldrmz.github.io/notion-widgets/
        // Remove trailing slash and any current route
        if (pathname.includes('/notion-widgets')) {
            return `${origin}/notion-widgets`;
        }

        // Local development: http://localhost:5173/
        return origin;
    }
    return '';
});

// Widget URLs for preview
const clockUrl = computed(() => `${baseUrl.value}/#/clock?theme=dark&primary=f87171&accent=fbbf24&tz=Europe/Istanbul`);
const pomodoroUrl = computed(() => `${baseUrl.value}/#/pomodoro?theme=dark&primary=10b981&accent=34d399`);

// Embed URLs for copying
const clockEmbedUrl = computed(() => clockUrl.value);
const pomodoroEmbedUrl = computed(() => pomodoroUrl.value);

async function copyUrl(url) {
    try {
        await navigator.clipboard.writeText(url);
        showToast.value = true;
        setTimeout(() => {
            showToast.value = false;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy URL:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        showToast.value = true;
        setTimeout(() => {
            showToast.value = false;
        }, 2000);
    }
}
</script>

<style lang="scss" scoped>
.landing-page {
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.hero {
    text-align: center;
    margin-bottom: 4rem;

    h1 {
        font-size: 3.5rem;
        font-weight: 800;
        color: white;
        margin-bottom: 1rem;
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    p {
        font-size: 1.25rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
    }
}

.widgets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 3rem;
    max-width: 1200px;
    margin: 0 auto 4rem;
}

.widget-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
}

.widget-preview {
    margin-bottom: 1.5rem;
    border-radius: 12px;
    overflow: hidden;

    iframe {
        display: block;
        width: 100%;
        height: auto;
        min-height: 380px;
        border: none;
        overflow: hidden;
    }
}

.widget-info {
    h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        margin-bottom: 0.75rem;
    }

    p {
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 1rem;
        line-height: 1.5;
    }
}

.widget-features {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;

    span {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
    }
}

.copy-btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: linear-gradient(135deg, #059669, #047857);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
}

.how-to-use,
.customization {
    max-width: 800px;
    margin: 0 auto 3rem;
    text-align: center;

    h2 {
        font-size: 2rem;
        font-weight: 700;
        color: white;
        margin-bottom: 2rem;
    }
}

.steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.step {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.step-number {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #f87171, #ef4444);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1.125rem;
    margin: 0 auto 1rem;
}

.step-content {
    h4 {
        color: white;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    p {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.875rem;
        line-height: 1.4;
    }

    code {
        background: rgba(0, 0, 0, 0.3);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: 'SF Mono', Monaco, monospace;
        font-size: 0.8rem;
    }
}

.custom-options {
    display: grid;
    gap: 1rem;
    text-align: left;
}

.option {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.9);

    strong {
        color: white;
    }

    code {
        background: rgba(0, 0, 0, 0.3);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: 'SF Mono', Monaco, monospace;
        font-size: 0.875rem;
        margin-left: 0.5rem;
    }
}

.toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

// Responsive
@media (max-width: 768px) {
    .landing-page {
        padding: 1rem;
    }

    .hero h1 {
        font-size: 2.5rem;
    }

    .widgets-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .widget-card {
        min-width: auto;
        width: 100%;
    }

    .clock-card,
    .pomodoro-card {
        min-width: auto;
    }

    .clock-preview {
        width: 300px;
        height: 300px;

        iframe {
            width: 300px;
            height: 300px;
        }
    }

    .pomodoro-preview {
        width: 320px;
        height: 360px;

        iframe {
            width: 320px;
            height: 360px;
        }
    }

    .steps {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}
</style>
