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
import SchoolMapPage from '../views/MapPage.vue';
import AdminPage from '../views/AdminPage.vue';
import CarpoolingPage from '../views/Carpooling/CarpoolingPage.vue';
import CarpoolingSearchPage from '../views/Carpooling/undersides/CarpoolingSearchPage.vue';
import CarpoolingCarPage from '../views/Carpooling/undersides/CarpoolingCarPage.vue';
import CarpoolingSessionPage from '../views/Carpooling/undersides/CarpoolingSessionPage.vue';
import CarpoolingProfilePage from '../views/Carpooling/undersides/CarpoolingProfilePage.vue';
import ChatPage from '../views/Carpooling/undersides/Chat/ChatPage.vue';
import CarpoolingSupportReport from '../views/Carpooling/undersides/CarpoolingSupportReport.vue';
import HomeworkContent from '../views/components/widgets/subpages/HomeworkContent.vue'
import GradeContent from '../views/components/widgets/subpages/GradeContent.vue';

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
        path: 'carpooling',
        name: 'Carpooling',
        component: CarpoolingPage
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
  },
  {
    path:'/admin-page',
    name:'Admin',
    component: AdminPage,
    meta: { requiresAdmin: true }
  },
  {
    path: '/hub-page',
    name: 'CommunityHub',
    component: CommunityHubPage
  },
  {
    path: '/carpooling-search-page',
    name: 'CarpoolingSearch',
    component: CarpoolingSearchPage
  },
  {
    path: '/carpooling-profile-page',
    name: 'CarpoolingProfilePage',
    component: CarpoolingProfilePage
  },
  {
    path: '/carpooling-session-page',
    name: 'CarpoolingSessionPage',
    component: CarpoolingSessionPage
  },
  {
    path: '/carpooling-car-page',
    name: 'CarpoolingCarPage',
    component: CarpoolingCarPage
  },
  {
    path: '/carpooling-chat',
    name: 'CarpoolingChat',
    component: ChatPage
  },
  {
    path: '/carpooling-support-report',
    name: 'CarpoolingSupportReport',
    component: CarpoolingSupportReport
  },
  {
    path: '/homeworkpage',
    name: 'HomeworkPage',
    component: HomeworkContent
  },
  {
    path: '/gradecontent',
    name: 'GradeContent',
    component: GradeContent
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});



function isAuthenticated() {
  const token = localStorage.getItem('jwt');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    return exp && Date.now() < exp * 1000;
  } catch (e) {
    return false;
  }
}

function isAdmin() {
  const r_id = localStorage.getItem("r_id");
  return r_id && JSON.parse(r_id) === 1;
}

router.beforeEach((to, from, next) => {
  const publicPages = ['/login-page'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !isAuthenticated()) {
    return next('/login-page');
  }

  if (to.meta.requiresAdmin && !isAdmin()) {
    return next('/tabs/settings'); // Kein Zugriff
  }

  next(); // normal weiter
});


export default router;
