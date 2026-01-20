import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/DashboardView.vue';

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
    },
    {
        path: '/MotorMonitoring',
        name: 'MotorMonitoring',
        component: () => import('@/views/MotorMonitoring.vue'),
    },
    {
        path: '/MotorView',
        name: 'MotorView',
        component: () => import('@/views/MotorView.vue'),
    },
    {
        path: '/StatisticsView',
        name: 'StatisticsView',
        component: () => import('@/views/StatisticsView.vue'),
    },
    {
        path: '/DiagnosisView',
        name: 'DiagnosisView',
        component: () => import('@/views/DiagnosisView.vue'),
    },
    {
        path: '/PumpBoardView',
        name: 'PumpBoardView',
        component: () => import('@/views/PumpBoardView.vue'),
    },
    {
        path: '/WaterControlView',
        name: 'WaterControlView',
        component: () => import('@/views/WaterControlView.vue'),
    },
    {
        path: '/PacTubeView',
        name: 'PacTubeView',
        component: () => import('@/views/PacTubeView.vue'),
    },
    {
        path: '/AutoWaterView',
        name: 'AutoWaterView',
        component: () => import('@/views/AutoWaterView.vue'),
    },
    {
        path: '/RapidAgitatorView',
        name: 'RapidAgitatorView',
        component: () => import('@/views/RapidAgitatorView.vue'),
    },
    {
        path: '/AgglomerateView',
        name: 'AgglomerateView',
        component: () => import('@/views/AgglomerateView.vue'),
    },
    {
        path: '/SludgeCollectorView',
        name: 'SludgeCollectorView',
        component: () => import('@/views/SludgeCollectorView.vue'),
    },
    {
        path: '/FilterBackWashView',
        name: 'FilterBackWashView',
        component: () => import('@/views/FilterBackWashView.vue'),
    },
    {
        path: '/BackWashBlowerView',
        name: 'BackWashBlowerView',
        component: () => import('@/views/BackWashBlowerView.vue'),
    },
    {
        path: '/GacBackwashView',
        name: 'GacBackwashView',
        component: () => import('@/views/GacBackwashView.vue'),
    },
    {
        path: '/MotifPumpView',
        name: 'MotifPumpView',
        component: () => import('@/views/MotifPumpView.vue'),
    },
    {
        path: '/CoolingPumpView',
        name: 'CoolingPumpView',
        component: () => import('@/views/CoolingPumpView.vue'),
    },
    {
        path: '/TransformersView',
        name: 'TransformersView',
        component: () => import('@/views/TransformersView.vue'),
    },
    {
        path: '/VcbView',
        name: 'VcbView',
        component: () => import('@/views/VcbView.vue'),
    },
    {
        path: '/PumpBoardDetail',
        name: 'PumpBoardDetail',
        component: () => import('@/views/PumpBoardDetail.vue'),
    },
    {
        path: '/WaterControlDetail',
        name: 'WaterControlDetail',
        component: () => import('@/views/WaterControlDetail.vue'),
    },
    {
        path: '/PacTubeDetail',
        name: 'PacTubeDetail',
        component: () => import('@/views/PacTubeDetail.vue'),
    },
    {
        path: '/AutoWaterDetail',
        name: 'AutoWaterDetail',
        component: () => import('@/views/AutoWaterDetail.vue'),
    },
    {
        path: '/RapidAgitatorDetail',
        name: 'RapidAgitatorDetail',
        component: () => import('@/views/RapidAgitatorDetail.vue'),
    },
    {
        path: '/AgglomerateDetail',
        name: 'AgglomerateDetail',
        component: () => import('@/views/AgglomerateDetail.vue'),
    },
    {
        path: '/SludgeCollectorDetail',
        name: 'SludgeCollectorDetail',
        component: () => import('@/views/SludgeCollectorDetail.vue'),
    },
    {
        path: '/FilterBackWashDetail',
        name: 'FilterBackWashDetail',
        component: () => import('@/views/FilterBackWashDetail.vue'),
    },
    {
        path: '/BackWashBlowerDetail',
        name: 'BackWashBlowerDetail',
        component: () => import('@/views/BackWashBlowerDetail.vue'),
    },
    {
        path: '/GacBackwashDetail',
        name: 'GacBackwashDetail',
        component: () => import('@/views/GacBackwashDetail.vue'),
    },
    {
        path: '/MotifPumpDetail',
        name: 'MotifPumpDetail',
        component: () => import('@/views/MotifPumpDetail.vue'),
    },
    {
        path: '/CoolingPumpDetail',
        name: 'CoolingPumpDetail',
        component: () => import('@/views/CoolingPumpDetail.vue'),
    },
    {
        path: '/TransformersDetail',
        name: 'TransformersDetail',
        component: () => import('@/views/TransformersDetail.vue'),
    },
    {
        path: '/VcbDetail',
        name: 'VcbDetail',
        component: () => import('@/views/VcbDetail.vue'),
    },
    {
        path: '/MotorMonitoring',
        name: 'MotorMonitoring',
        component: () => import('@/views/MotorMonitoring.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
