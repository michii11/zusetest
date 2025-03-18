import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import SettingPage from '../views/SettingPage.vue';
import ProfilePage from '../views/settings/ProfilePage.vue';
import NotificationPage from '../views/settings/NotificationPage.vue';
import LanguagePage from '../views/settings/LanguagePage.vue';
import DesignPage from '../views/settings/DesignPage.vue';
import InfoPage from '../views/settings/InfoPage.vue';
import HelpPage from '../views/settings/HelpPage.vue';
import SafetyPage from '../views/settings/SafetyPage.vue';
import TabsPage from '../views/components/TabsPage.vue';
import CommunityHubPage from '../views/CommunityHubPage.vue';
import SchoolMapPage from '../views/SchoolMapPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/login-page'
  },
  {
    path: '/login-page',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: HomePage
      },
      {
        path: 'school-map',
        name: 'SchoolMap',
        component: SchoolMapPage
      },
      {
        path: 'hub',
        name: 'CommunityHub',
        component: CommunityHubPage
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingPage
      }
    ]
  },
  {
    path: '/profile-page',
    name: 'Profile',
    component: ProfilePage
  },
  {
    path: '/notification-page',
    name: 'Notification',
    component: NotificationPage
  },
  {
    path: '/language-page',
    name: 'Language',
    component: LanguagePage
  },
  {
    path: '/design-page',
    name: 'Design',
    component: DesignPage
  },
  {
    path: '/info-page',
    name: 'Info',
    component: InfoPage
  },
  {
    path: '/help-page',
    name: 'Help',
    component: HelpPage
  },
  {
    path: '/safety-page',
    name: 'Safety',
    component: SafetyPage
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt');
  if (to.meta.requiresAuth && !token) {
    next('/login-page'); // Weiterleitung zur Login-Seite
  } else {
    next(); // Weiter zur angeforderten Route
  }
});

export default router;
