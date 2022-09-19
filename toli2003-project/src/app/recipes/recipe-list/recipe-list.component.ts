import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Ingredient } from '../ingredient';
import { RecipeModel } from '../recipe-model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  Recipes: RecipeModel[];
  Ingredients: Ingredient[];
  private recipeSub: Subscription;
  isLoading: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  isUserAuthenticated: boolean = false;
  private authStatusSub: Subscription;

  ngOnInit(): void {
    this.isLoading = true;
    this.recipeService.getRecipes();
    this.recipeSub = this.recipeService
      .getRecipeUpdateListener()
      .subscribe((recipeData) => {
        this.Recipes = recipeData.Recipes;
        this.isLoading = false;
      });

    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isUserAuthenticated = isAuthenticated;
      });
  }

  onEdit(id: string) {
    console.log(id);
  }

  onDelete(recipeId: string) {
    this.recipeService.deleteRecipe(recipeId);
  }

  ngOnDestroy() {
    this.recipeSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
