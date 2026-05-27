import { Component, inject } from '@angular/core';
import { AuthLayoutComponent } from "../../layouts/auth-layout/auth-layout.component";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../../core/auth/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ReceiptPoundSterling } from 'lucide-angular';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [AuthLayoutComponent , ReactiveFormsModule , RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);


      registerForm : FormGroup = new FormGroup({
        name : new FormControl("" , [Validators.required , Validators.minLength(3)]),
        email : new FormControl("" , [Validators.required , Validators.email]),
        dateOfBirth : new FormControl("" , Validators.required),
        gender : new FormControl("" , Validators.required),
        password : new FormControl("" , [Validators.required , Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
        rePassword : new FormControl("" , Validators.required),
      } , {validators: [this.confirmPass]});

      loading: boolean = false;
      msgError: string = "";
      registerSubscribe:Subscription = new Subscription();

      submitForm(){
        this.loading = true;
        this.registerSubscribe.unsubscribe();
        this.authService.signUp(this.registerForm.value).subscribe({
          next: (res) => {
            if(res.success){
              console.log(res);
            this.router.navigate(['/login']);
            }
          },
          error: (err:HttpErrorResponse)=> {
            this.msgError = err.error.message;
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        })


        if(this.registerForm.valid){
          console.log(this.registerForm.value);
        }
        else{
          this.registerForm.markAllAsTouched();
        }
      }
      confirmPass(group: AbstractControl){
       const rePassword =  group.get("rePassword")?.value;
       const password = group.get("password")?.value;

        if(rePassword !== password && rePassword !== ""){

          group.get("rePassword")?.setErrors({mismatch: true });
          return {mismatch: true};

        }
       
          return null;
        


      }
}
