import { Component, inject, Input, input, OnInit } from '@angular/core';
import { CommentsService } from './comments.service';
import { Comment } from './comment.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-post-comment',
  imports: [ReactiveFormsModule],
  templateUrl: './post-comment.component.html',
  styleUrl: './post-comment.component.css',
})
export class PostCommentComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
    private readonly userService = inject(UserService);
  

  
 commentContent: FormControl = new FormControl('');
  @Input() postId:string = "" ;
  commentList : Comment[] = [];
  userData: any;

ngOnInit(): void {
  this.getCommentPost();
  this.userService.userData.subscribe(user => {
      this.userData = user;
    });
}

getCommentPost(): void {
this.commentsService.getPostComment(this.postId).subscribe({
  next:(res) => {
    console.log(res);
    this.commentList = res.data.comments;
  },
  error:(err) => {
    console.log(err);
    
  }
})
}

  createComment(e: Event): void {

    e.preventDefault();

    if (!this.commentContent.value?.trim()) return;

    const data = {
      content: this.commentContent.value
    };

    this.commentsService.createComment(this.postId, data).subscribe({

      next: (res) => {

        console.log(res);

        if (res.success) {

          this.commentContent.reset();

          // refresh comments
          this.getCommentPost();

        }

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

}
