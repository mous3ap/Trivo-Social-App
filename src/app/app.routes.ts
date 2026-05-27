import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { FeedComponent } from './features/feed/feed.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { ForgetPasswordComponent } from './features/forget-password/forget-password.component';
import { authGuard } from './core/auth/guards/auth-guard';
import { reverseAuthGuard } from './core/auth/guards/reverse-auth-guard';
import { DetailsComponent } from './features/details/details.component';
import { SuggestionsComponent } from './features/suggestions/suggestions.component';
import { SavedPostsComponent } from './features/saved-post/saved-post.component';
import { MyPostsComponent } from './features/my-posts/my-posts.component';

export const routes: Routes = [
  {path: "" , redirectTo: "login" , pathMatch: 'full'},
    {path: "", 
      component:AuthLayoutComponent,
      canActivate: [reverseAuthGuard],
         children:[
    {path: "login", component: LoginComponent , title: "Login page"},
    {path: "register", component: RegisterComponent , title: "Register page"},
    {path: "forgetPassword", component: ForgetPasswordComponent , title: "Forget password page"}
    ]},
    {path: "", 
      component: MainLayoutComponent, 
      canActivate: [authGuard],
        children:[
      {path: "feed", component: FeedComponent , title: "Feed"},
      {path: "profile", component: ProfileComponent , title: "Profile"},
      {path: "details/:id" , component: DetailsComponent , title: "details"},
      {path: "suggestions" , component: SuggestionsComponent , title: "Suggestions page"},
      {path: "saved" , component: SavedPostsComponent , title: "Saved posts"},
      {path: "my-posts" , component: MyPostsComponent , title: "My posts"},
      {path: "profile/:id" , loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent), title: "Profile"},
      {path: "notification", component: NotificationsComponent , title: "Notifications page"},
      {path: "change-password", component: ChangePasswordComponent , title: "Change password"},
    ]},
    {path: "**" , component: PageNotFoundComponent , title: "Page not found"}
];
