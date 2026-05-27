import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../core/services/posts.service';
import { IFeed } from '../../core/models/i-feed.interface';
import { PostCardComponent } from "../../shared/post-card/post-card.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-saved-posts',
  imports: [PostCardComponent , RouterLink],
  templateUrl: './saved-post.component.html',
  styleUrl: './saved-post.component.css'
})
export class SavedPostsComponent implements OnInit {

  private readonly postsService = inject(PostsService);

  savedPosts: IFeed[] = [];

  ngOnInit(): void {
    this.getSavedPosts();
  }

  getSavedPosts(): void {

    this.postsService.getSavedPosts().subscribe({

      next: (res: any) => {

        console.log(res);

        this.savedPosts = res.data.bookmarks;

      },

      error: (err) => {
        console.log(err);
      }

    });

  }

}