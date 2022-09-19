import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Ingredient } from '../ingredient';
import { RecipeModel } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { StepsModel } from '../steps.model';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css'],
})
export class RecipeCreateComponent implements OnInit {
  constructor(
    private recipeService: RecipeService,
    public route: ActivatedRoute
  ) {}

  Units: string[] = [
    'l',
    'dl',
    'cl',
    'ml',
    'msk',
    'tsk',
    'krm',
    'kg',
    'hg',
    'g',
    'st',
  ];

  ratings: number[] = [1, 2, 3, 4, 5];
  categories: string[] = [
    'pasta',
    'nötkött',
    'fläskkött',
    'vegetarisk',
    'vegansk',
    'bröd',
    'efterrätter',
    'bakverk',
  ];

  // Ingredients table
  Ingredients: Ingredient[] = [];
  dataSourceIngredients = new MatTableDataSource<Ingredient>(this.Ingredients);
  displayedColumnsIngredients: string[] = [
    'ingredient',
    'amount',
    'unit',
    'isEdit',
  ];
  dataSchemaIngredients = {
    ingredient: 'text',
    amount: 'number',
    unit: 'select',
    isEdit: 'isEdit',
  };

  //Steps table
  Steps: StepsModel[] = [];
  stepsCounter = 0;
  dataSourceSteps = new MatTableDataSource(this.Steps);
  displayedColumnsSteps: string[] = ['description', 'edit'];
  dataSchemaSteps = {
    description: 'text',
    edit: 'edit',
  };

  private mode = 'create';
  private recipeId: string;
  public recipe: RecipeModel;
  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      difficulty: new FormControl(null, { validators: [Validators.required] }),
      timeToCook: new FormControl(null, { validators: [Validators.required] }),
      rating: new FormControl(null, { validators: [Validators.required] }),
      category: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('recipeId')) {
        this.mode = 'edit';
        this.recipeId = paramMap.get('recipeId');

        this.recipe = this.recipeService.getRecipe(this.recipeId);

        this.form.setValue({
          name: this.recipe.name,
          description: this.recipe.description,
          difficulty: this.recipe.difficulty,
          timeToCook: this.recipe.timeToCook,
          rating: this.recipe.rating,
          category: this.recipe.category,
        });

        this.recipe.ingredients.forEach((ingred) => {
          this.updateIngredients(ingred);
        });

        this.recipe.steps.forEach((step) => {
          this.updateSteps(step);
        });
      } else {
        this.mode = 'create';
      }
    });
  }

  onSaveRecipe() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.recipeService.addRecipe(
        this.form.value.name,
        this.form.value.description,
        this.form.value.difficulty,
        this.form.value.timeToCook,
        this.form.value.rating,
        [...this.Steps],
        this.form.value.category,
        [...this.Ingredients]
      );
    } else {
      this.recipeService.updateRecipe(
        this.recipe._id,
        this.form.value.name,
        this.form.value.description,
        this.form.value.difficulty,
        this.form.value.timeToCook,
        this.form.value.rating,
        [...this.Steps],
        this.form.value.category,
        [...this.Ingredients]
      );
    }

    this.form.reset();
  }

  onAddIngredient(form: NgForm) {
    const newIngred: Ingredient = {
      ingredient: form.value.ingredient,
      unit: form.value.unit,
      amount: form.value.amount,
      isEdit: false,
    };

    this.Ingredients.push(newIngred);
    this.dataSourceIngredients._updateChangeSubscription();

    form.resetForm();
  }

  onDeleteIngred(ingred: Ingredient) {
    const index = this.dataSourceIngredients.data.indexOf(ingred);
    this.dataSourceIngredients.data.splice(index, 1);
    this.dataSourceIngredients._updateChangeSubscription();
  }

  updateIngredients(ingred: Ingredient) {
    this.Ingredients.push(ingred);
  }

  onAddStep(form: NgForm) {
    const stepDescription: string = form.value.step;
    const serial = (this.stepsCounter += 1);
    const newStep: StepsModel = {
      description: stepDescription,
      edit: false,
    };
    this.Steps.push(newStep);
    this.dataSourceSteps._updateChangeSubscription();
    form.resetForm();
  }

  updateSteps(step: StepsModel) {
    this.Steps.push(step);
  }

  onDeleteStep(step: StepsModel) {
    const index = this.dataSourceSteps.data.indexOf(step);
    this.dataSourceSteps.data.splice(index, 1);
    this.dataSourceSteps._updateChangeSubscription();
  }
}
