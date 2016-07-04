import { provideRouter, RouterConfig }  from '@angular/router';
import { ExploreComponent } from './components/explore/explore.component';
import { ExampleComponent } from './components/examples/examples.component';
import { FrameworkComponentsComponent } from './components/framework-components/framework-components.component';
import { GuidelinesComponent } from './components/guidelines/guidelines.component';
import { UIKitComponent } from './components/ui-kit/ui-kit.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: RouterConfig = [
    {
        path: 'explore',
        component: ExploreComponent
    },
    {
        path: 'examples',
        component: ExampleComponent
    },
    {
        path: 'components',
        component: FrameworkComponentsComponent
    },
    {
        path: 'guidelines',
        component: GuidelinesComponent
    },
    {
        path: 'ui-kit',
        component: UIKitComponent
    },
    {
        path: 'contact',
        component: ContactComponent
    },
    {
        path: '',
        redirectTo: '/explore'
    },
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];