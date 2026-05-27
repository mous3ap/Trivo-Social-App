import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostCardComponent } from "../../shared/post-card/post-card.component";
import { UserService } from '../../core/services/user.service';
import { IFeed } from '../../core/models/i-feed.interface';

@Component({
  selector: 'app-my-posts',
  imports: [PostCardComponent, RouterLink],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
})
export class MyPostsComponent implements OnInit {

  private readonly userService = inject(UserService);

  userPosts: IFeed[] = [];

  ngOnInit(): void {
    this.getMyPosts();
  }

  getMyPosts(): void {

    this.userService.getMyProfile().subscribe({

      next: (profileRes) => {

        const userId = profileRes.data.user._id;

        this.userService.getUserPost(userId).subscribe({

          next: (res) => {

            if (res.success) {
              this.userPosts = res.data.posts;
            }

          },

          error: (err) => {
            console.log(err);
          }

        });

      },

      error: (err) => {
        console.log(err);
      }

    });

  }

}