import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostsService } from '../../core/services/posts.service';
import { IFeed } from '../../core/models/i-feed.interface';
import { CommentsService } from '../feed/feed-content/post-comment/comments.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Comment } from './../feed/feed-content/post-comment/comment.interface';

@Component({
  selector: 'app-details',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  private readonly commentsService = inject(CommentsService);
  private readonly router = inject(Router);

  commentContent: FormControl = new FormControl('');

  postId: string = '';
  userId: string = '';

  postDetails: IFeed = {} as IFeed;
  commentDetails: Comment[] = [];

  ngOnInit(): void {

    this.userId = JSON.parse(
      localStorage.getItem('socialUser')!
    )?._id;

    this.activatedRoute.paramMap.subscribe((parm) => {

      this.postId = parm.get('id')!;

      this.getPostDetails();
      this.getPostComments();

    });

  }

  getPostDetails(): void {

    this.postsService.getSinglePost(this.postId).subscribe({

      next: (res) => {

        console.log(res);

        this.postDetails = {

          ...res.data.post,

          isLiked: res.data.post.likes.includes(this.userId)

        };

      },

      error: (err) => {
        console.log(err);
      }

    });

  }

  getPostComments(): void {

    this.commentsService.getPostComment(this.postId).subscribe({

      next: (res) => {

        console.log(res);

        this.commentDetails = res.data.comments;

      },

      error: (err) => {
        console.log(err);
      }

    });

  }

  createComment(e: Event): void {

    e.preventDefault();

    if (!this.commentContent.value?.trim()) return;

    const data = {
      content: this.commentContent.value
    };

    this.commentsService.createComment(this.postId, data).subscribe({

      next: (res) => {

        if (res.success) {

          this.commentContent.reset();

          this.getPostComments();

          this.postDetails.commentsCount++;

        }

      },

      error: (err) => {
        console.log(err);
      }

    });

  }

  removePost(postId: string): void {

    this.postsService.deletePost(postId).subscribe({

      next: (res) => {

        console.log(res);

        if (res.success) {

          this.router.navigate(['/feed']);

        }

      },

      error: (err) => {
        console.log(err);
      }

    });

  }

  toggleLike(post: IFeed): void {

  this.postsService.likePost(post._id).subscribe({

    next: (res) => {

      console.log(res);

      post.isLiked = res.data.liked;

      post.likesCount = res.data.likesCount;

    },

    error: (err) => {
      console.log(err);
    }

  });

}

}