import {Router} from '@vaadin/router';
import {from} from 'rxjs';

const router = new Router(document.getElementById('outlet'));

router.setRoutes([
  {
    path: '/',
    component: 'main-layout-element',
    children: [
      {
        path: '/',
        component: 'list-element',
        data: () => ({
          title: 'employeeList',
        })
      },
      {
        path: '/employee/:mode',
        component: 'employee-form-element',
        data: () => ({
          title: 'createEmployee',
        })
      },
      {
        path: '/employee/:mode/:id',
        component: 'employee-form-element',
        data: () => ({
          title: 'editEmployee',
        })
      },
    ]
  },
]);

export function redirectToPath(path) {
  window.history.pushState(null, document.title, window.location.pathname = path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function isRouterReady() {
  return from(router.ready);
}

export function getCurrentRouteData() {
  const loc = router.location;
  const raw = loc?.route?.data;
  
  return typeof raw === 'function' ? raw(loc) : raw || null;
}
