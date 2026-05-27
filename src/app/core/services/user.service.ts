import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';



@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);


  getMyProfile() : Observable<any> {
    return this.httpClient.get<any>(
      `${environment.baseUrl}/users/profile-data`)
  }

   getSuggestions(limit: number) : Observable<any>{
      return this.httpClient.get(environment.baseUrl + `/users/suggestions?limit=${limit}` )
    }

    getUserPost(userId: string) : Observable<any>{
      return this.httpClient.get(environment.baseUrl + `/users/${userId}/posts` )
    }

    getFollowUser(userId: string) : Observable<any>{
      return this.httpClient.put(environment.baseUrl + `/users/${userId}/follow` , {} )
    }

    getBookmarks(): Observable<any> {
  return this.httpClient.get(
    `${environment.baseUrl}/users/bookmarks`
  );
}

getUserProfile(userId: string) {
  return this.httpClient.get(
    `${environment.baseUrl}/users/${userId}/profile`
  );
}

uploadProfilePhoto(formData: FormData): Observable<any> {
  return this.httpClient.put(
    `${environment.baseUrl}/users/upload-photo`,
    formData
  );
}

uploadCover(formData: FormData): Observable<any> {
  return this.httpClient.put(
    `${environment.baseUrl}/users/upload-cover`,
    formData
  );
}

userData = new BehaviorSubject<any>(
  JSON.parse(localStorage.getItem('socialUser') || 'null')
);

setUserData(user: any): void {
  this.userData.next(user);
  localStorage.setItem('socialUser', JSON.stringify(user));
}

changePassword(data: object): Observable<any> {
  return this.httpClient.patch(
    `${environment.baseUrl}/users/change-password`,
    data
  );
}

updateUserPhoto(photo: string): void {
  const current = this.userData.value;
  const updated = { ...current, photo };

  this.setUserData(updated);
}

updateUserCover(cover: string): void {
  const current = this.userData.value;
  const updated = { ...current, cover };

  this.setUserData(updated);
}



  
}
