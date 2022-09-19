import { Injectable } from '@angular/core';
import { RecipeModel } from './recipe-model';
import { Ingredient } from './ingredient';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { StepsModel } from './steps.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private Recipes: RecipeModel[] = [];
  private recipeUpdated = new Subject<{ Recipes: RecipeModel[] }>();

  //URL for server hosting
  private serverUrl = 'http://localhost:3000/api/recipe';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  addRecipe(
    name: string,
    description: string,
    difficulty: number,
    timeToCook: number,
    rating: number,
    steps: StepsModel[],
    category: string,
    ingredients: Ingredient[]
  ) {
    const postData = {
      name: name,
      description: description,
      difficulty: difficulty,
      timeToCook: timeToCook,
      rating: rating,
      steps: steps,
      category: category,
      ingredients: ingredients,
    };

    this.http
      .post<{ message: string; recipe: RecipeModel }>(this.serverUrl, postData)
      .subscribe((responseData) => {
        console.log(responseData);
        this.router.navigate(['/']);
      });
  }

  getRecipes() {
    this.http
      .get<{ message: string; recipes: RecipeModel[] }>(this.serverUrl)
      .subscribe((recipeData) => {
        this.Recipes = recipeData.recipes;
        this.recipeUpdated.next({ Recipes: [...this.Recipes] });
      });
  }

  deleteRecipe(recipeId: string) {
    console.log(recipeId);
    this.http.delete(this.serverUrl + '/' + recipeId).subscribe((result) => {
      let updatedRecipes = this.Recipes.filter(
        (recipe) => recipe._id !== recipeId
      );
      this.Recipes = updatedRecipes;
      this.recipeUpdated.next({ Recipes: [...this.Recipes] });
    });
  }

  getRecipe(recipeId: string) {
    return { ...this.Recipes.find((recipe) => recipe._id === recipeId) };
  }

  updateRecipe(
    recipeId: string,
    name: string,
    description: string,
    difficulty: number,
    timeToCook: number,
    rating: number,
    steps: StepsModel[],
    category: string,
    ingredients: Ingredient[]
  ) {
    const postData = {
      name: name,
      description: description,
      difficulty: difficulty,
      timeToCook: timeToCook,
      rating: rating,
      steps: steps,
      category: category,
      ingredients: ingredients,
    };
    this.http
      .put(this.serverUrl + '/' + recipeId, postData)
      .subscribe((response) => {
        console.log(response);

        this.router.navigate(['/']);
      });
  }

  getRecipeUpdateListener() {
    return this.recipeUpdated.asObservable();
  }
}
