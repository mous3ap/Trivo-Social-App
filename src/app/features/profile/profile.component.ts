import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../core/models/user-profile.interface';
import { UserService } from '../../core/services/user.service';
import { IFeed } from '../../core/models/i-feed.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostCardComponent } from "../../shared/post-card/post-card.component";

@Component({
  selector: 'app-profile',
  imports: [RouterLink, PostCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  showCoverPreview: boolean = false;
  showProfilePreview: boolean = false;
 isOwner: boolean = false;
  userProfile!: User;

  userPosts: IFeed[] = [];
  savedPosts: IFeed[] = [];

  activeTab: 'posts' | 'saved' = 'posts';
  

ngOnInit(): void {

  this.activatedRoute.paramMap.subscribe({

    next: (params) => {

      const userId = params.get('id');

      if (userId) {

        // بروفايل شخص تاني
        this.getUserProfile(userId);

      } else {

        
        this.getMyProfile();

      }

    }

  });

}

 getMyProfile(): void {

  this.userService.getMyProfile().subscribe({

    next: (res: any) => {

      if (res.success) {

        this.userProfile = res.data.user;
        this.userService.setUserData(this.userProfile);

        this.isOwner = true;

        this.getMyPosts(this.userProfile._id);

      }

    },

    error: (err) => {
      console.log(err);
    }

  });

}

  getMyPosts(userId: string): void {

    this.userService.getUserPost(userId).subscribe({

      next: (res) => {

        console.log(res);

        if (res.success) {
          this.userPosts = res.data.posts;
        }

      },

      error: (err) => {
        console.log(err);
      }

    });

  }

  getUserProfile(userId: string): void {

  this.userService.getUserProfile(userId).subscribe({

    next: (res: any) => {

      console.log(res);

      if (res.success) {

        this.userProfile = res.data.user;

        const loggedInUserId = localStorage.getItem('userId');

        this.isOwner = this.userProfile._id === loggedInUserId;

        this.getMyPosts(userId);

      }

    },

    error: (err) => {
      console.log(err);
    }

  });

}

changeTab(tab: 'posts' | 'saved'): void {

  this.activeTab = tab;

  if (tab === 'saved' && this.savedPosts.length === 0) {
    this.getSavedPosts();
  }

}

  getSavedPosts(): void {
  this.userService.getBookmarks().subscribe({
    next: (res) => {
      if (res.success) {
        this.savedPosts = res.data.bookmarks;
        
      }
    },
    error: (err) => {
      console.log(err);
    }
  });
}

uploadProfilePhoto(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  const formData = new FormData();

  formData.append('photo', file);

  this.userService.uploadProfilePhoto(formData).subscribe({

    next: (res) => {

      if (res.success) {

        this.userService.updateUserPhoto(res.data.photo);
        this.userProfile.photo = res.data.photo;

      }

    },

    error: (err) => {
      console.log(err);
    }

  });

}

uploadCover(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  const formData = new FormData();

  formData.append('cover', file);

  this.userService.uploadCover(formData).subscribe({

    next: (res) => {

      if (res.success) {

        this.userProfile.cover = res.data.cover;

      }

    },

    error: (err) => {
      console.log(err);
    }

  });

}




}

