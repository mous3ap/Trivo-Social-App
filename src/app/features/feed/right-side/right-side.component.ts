import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { Suggest, Suggestion } from '../../../core/models/suggest.interface';


@Component({
  selector: 'app-right-side',
  imports: [RouterLink],
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.css',
})
export class RightSideComponent implements OnInit {
   private readonly userService = inject(UserService);
   suggestions: Suggestion[] = [];
   limit: number = 5; 

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

      console.log(res);

      const user = this.suggestions.find(
        suggest => suggest._id === userId
      );

      if (user) {

        user.isFollowing = res.data.following;

        if (res.data.following) {

          user.followersCount++;

          setTimeout(() => {

            this.suggestions = this.suggestions.filter(
              suggest => suggest._id !== userId
            );

          }, 500);

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
