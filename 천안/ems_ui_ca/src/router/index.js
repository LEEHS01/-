import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Dashboard
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/setting',
    name: 'EmsSetting',
    component: () => import('../views/submenu/EmsSetting.vue')
  },
  {
    path: '/pumpOperation',
    name: 'PumpOperation',
    component: () => import('../views/submenu/smartems/PumpOperation.vue')
  },
  {
    path: '/CostSetting',
    name: 'CostSetting',
    component: () => import('../views/submenu/smartems/CostSetting.vue')
  },
  {
    path: '/goalSetting',
    name: 'goalSetting',
    component: () => import('../views/submenu/smartems/GoalSetting.vue')
  },
  {
    path: '/peakSet',
    name: 'peakSet',
    component: () => import('../views/submenu/smartems/PeakSet.vue')
  },
  {
    path: '/report',
    name: 'report',
    component: () => import('../views/submenu/smartems/Report.vue')
  },
  {
    path: '/cost',
    name: 'cost',
    component: () => import('../views/submenu/smartems/Cost.vue')
  },
  {
    path: '/reduction',
    name: 'reduction',
    component: () => import('../views/submenu/smartems/Reduction.vue')
  },
  {
    path: '/zoneUse',
    name: 'zoneUse',
    component: () => import('../views/submenu/smartems/ZoneUse.vue')
  },
  {
    path: '/facUse',
    name: 'facUse',
    component: () => import('../views/submenu/smartems/FacUse.vue')
  },
  {
    path: '/useTrand',
    name: 'useTrand',
    component: () => import('../views/submenu/smartems/UseTrand.vue')
  },
  {
    path: '/analysis',
    name: 'analysis',
    component: () => import('../views/submenu/smartems/Analysis.vue')
  },
  {
    path: '/songsu',
    name: 'songsu',
    component: () => import('../views/submenu/smartems/Songsu.vue')
  },
  {
    path: '/sujiSelect',
    name: 'sujiSelect',
    component: () => import('../views/submenu/smartems/SujiSelect.vue')
  },
  {
    path: '/sujiSelect_2',
    name: 'sujiSelect_2',
    component: () => import('../views/submenu/smartems/SujiSelect_2.vue')
  },
  {
    path: '/pumpPerform',
    name: 'pumpPerform',
    component: () => import('../views/submenu/smartems/PumpPerform.vue')
  },
  {
    path: '/peakControl',
    name: 'peakControl',
    component: () => import('../views/submenu/smartems/PeakControl.vue')
  },
  {
    path: '/peak',
    name: 'peak',
    component: () => import('../views/submenu/smartems/Peak.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
