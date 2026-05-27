import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Suggestion } from '../../core/models/suggest.interface';
import { UserService } from '../../core/services/user.service';
import { AuthLayoutComponent } from "../../layouts/auth-layout/auth-layout.component";
import { LeftSideComponent } from "../feed/left-side/left-side.component";

@Component({
  selector: 'app-suggestions',
  imports: [RouterLink, AuthLayoutComponent, LeftSideComponent],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css',
})
export class SuggestionsComponent  implements OnInit {
     private readonly userService = inject(UserService);
   suggestions: Suggestion[] = [];
    limit: number = 50; 

    ngOnInit(): void {
       this.getFollowSuggestions();
    };

    getFollowSuggestions(){
    this.userService.getSuggestions(this.limit).subscribe({
      next: (res) => {
        console.log(res);
          this.suggestions = res.data.suggestions;
        
      },
      error: (err) => {
        console.error(err);
      }
    })
   }

followUser(userId: string): void {

  this.userService.getFollowUser(userId).subscribe({
    next: (res: any) => {

      const user = this.suggestions.find(
        suggest => suggest._id === userId
      );

      if (user) {

        user.isFollowing = res.data.following;

        if (res.data.following) {
          user.followersCount++;
        } else {
          user.followersCount--;
        }

      }

    },
    error: (err) => {
      console.log(err);
    }
  });

}

}
