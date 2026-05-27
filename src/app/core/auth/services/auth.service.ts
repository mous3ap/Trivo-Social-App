import { environment } from './../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  signUp(data: object) : Observable <any>{
    return this.httpClient.post(`${environment.baseUrl}/users/signup` , data)
  }

  signIn(data : object) : Observable<any> {
     return this.httpClient.post(`${environment.baseUrl}/users/signin` , data ) 
  }

  signOut() : void {
    localStorage.removeItem("socialToken");
    this.router.navigate(["/login"])
    
  }

}
