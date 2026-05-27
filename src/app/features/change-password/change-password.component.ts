import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {

   private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  isLoading: boolean = false;

  changePasswordForm: FormGroup = this.fb.group({

    currentPassword: [
      '',
      [Validators.required]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)      ]
    ],

    rePassword: [
      '',
      [Validators.required]
    ]

  }, {
    validators: this.confirmPasswordValidator
  });

  confirmPasswordValidator(group: AbstractControl): ValidationErrors | null {

    const password = group.get('password')?.value;

    const rePassword = group.get('rePassword')?.value;

    if (password === rePassword) {
      return null;
    }

    return {
      mismatch: true
    };

  }

  submitForm(): void {

  if (this.changePasswordForm.invalid) {

    this.changePasswordForm.markAllAsTouched();

    return;

  }

  this.isLoading = true;

  const body = {

    password: this.changePasswordForm.value.currentPassword,

    newPassword: this.changePasswordForm.value.password

  };

  this.userService.changePassword(body).subscribe({

    next: (res: any) => {

      console.log(res);

      this.isLoading = false;

      localStorage.removeItem('token');

      this.changePasswordForm.reset();

       this.authService.signOut();

    },

    error: (err) => {

      console.log(err);

      this.isLoading = false;

      alert(err.error.message || 'Something went wrong');

    }

  });

}


}
