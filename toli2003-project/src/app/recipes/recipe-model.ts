import { Ingredient } from './ingredient';
import { StepsModel } from './steps.model';

export interface RecipeModel {
  _id: string;
  name: string;
  description: string;
  difficulty: number;
  timeToCook: number;
  rating: number;
  steps: StepsModel[];
  category: string;
  ingredients: Ingredient[];
}
