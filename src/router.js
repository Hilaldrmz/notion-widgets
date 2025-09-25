import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/components/LandingPage.vue';
import ClockView from '@/widgets/clock/ClockView.vue';
import PomodoroView from '@/widgets/pomodoro/PomodoroView.vue';

const routes = [
    { path: '/', component: LandingPage },
    { path: '/clock', component: ClockView },
    { path: '/pomodoro', component: PomodoroView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
