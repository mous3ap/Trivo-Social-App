import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LucideAngularModule, Mail, Lock, ArrowRight, Globe, Check } from 'lucide-angular';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);


      loginForm : FormGroup = new FormGroup({
        email : new FormControl("" , [Validators.required ]),
        password : new FormControl("" , [Validators.required]),
      });

      loading: boolean = false;
      msgError: string = "";
      loginSubscribe:Subscription = new Subscription();

      submitted:boolean = false;

submitForm(){

  this.submitted = true;

  if(this.loginForm.invalid){
    return;
  }

  this.loading = true;

  this.loginSubscribe.unsubscribe();

  this.authService.signIn(this.loginForm.value).subscribe({
    next: (res) => {
      if(res.success){
        console.log(res);
        localStorage.setItem("socialToken" , res.data.token);
        localStorage.setItem("socialUser" , JSON.stringify(res.data.user));
        this.router.navigate(['/feed']);
      }
    },

    error: (err:HttpErrorResponse)=> {
      this.msgError = err.error.message;
      this.loading = false;
    },

    complete: () => {
      this.loading = false;
    }
  });
}
     


}
