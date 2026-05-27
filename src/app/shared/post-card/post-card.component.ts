import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IFeed } from '../../core/models/i-feed.interface';
import { PostCommentComponent } from "../../features/feed/feed-content/post-comment/post-comment.component";
import { PostsService } from '../../core/services/posts.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, PostCommentComponent],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent implements OnInit {

  private readonly postsService = inject(PostsService);
  @Output() deleted = new EventEmitter<string>();
  @Input() customClass: string = '';
  @Input() post!: IFeed;
  postId: string = '';

  ngOnInit(): void {
         this.postId = JSON.parse(localStorage.getItem('socialUser')!)._id; 
         }

   removePost(postId: string) : void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        if(res.success){
             this.deleted.emit(postId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
 }

toggleLike(post: IFeed): void {

  this.postsService.likePost(post._id).subscribe({

    next: (res) => {

      post.isLiked = res.data.liked;

      post.likesCount = res.data.likesCount;

    },

    error: (err) => {
      console.log(err);
    }

  });

}


toggleBookmark(post: IFeed): void {

  post.bookmarked = !post.bookmarked;

  this.postsService.bookmarkPost(post._id).subscribe({

    next: (res) => {
      console.log(res);
      
    },

    error: (err) => {

      console.log(err);

      // rollback لو حصل error
      post.bookmarked = !post.bookmarked;
    }

  });

}



}