export interface MealIdea {
  name: string;
  protein: number;
  calories: number;
  timing: 'pre' | 'post' | 'any';
  description: string;
}

export interface NutritionPrinciple {
  title: string;
  body: string;
  icon: string;
}

export const nutritionPrinciples: NutritionPrinciple[] = [
  {
    title: 'Protein First',
    icon: '🥩',
    body: 'Build every meal around a protein source. Aim for 0.8–1g of protein per pound of bodyweight. Protein preserves muscle while you are in a calorie deficit and drives muscle growth when training hard.',
  },
  {
    title: 'Calorie Deficit for Fat Loss',
    icon: '⚖️',
    body: 'To lose fat, consume fewer calories than you burn. A deficit of 300–500 calories per day leads to sustainable fat loss of 0.5–1 lb per week without excessive muscle loss. Do not drop below 1,600–1,800 calories as a male — you will lose muscle.',
  },
  {
    title: 'Carbs Are Not the Enemy',
    icon: '🍚',
    body: 'Carbohydrates fuel your workouts. Eat the majority of your carbs around your training session — pre-workout for energy, post-workout for recovery. Whole food sources: rice, oats, potatoes, fruit.',
  },
  {
    title: 'Hydration',
    icon: '💧',
    body: 'Drink a minimum of 3–4 liters of water daily. Dehydration kills performance, recovery, and fat loss. Add electrolytes (sodium, potassium, magnesium) if you sweat heavily.',
  },
  {
    title: 'Whole Foods Over Processed',
    icon: '🥦',
    body: 'The majority of your food should come from minimally processed sources — lean meats, fish, eggs, vegetables, fruit, legumes, rice, oats. Processed food is designed to make you overeat.',
  },
  {
    title: 'Consistency Over Perfection',
    icon: '📅',
    body: 'One bad meal does not ruin progress. One bad week does not ruin a month. The pattern over time is what determines results. Eat well 80–90% of the time and you will make progress.',
  },
];

export const preworkoutMeals: MealIdea[] = [
  {
    name: 'Oats + Protein Shake',
    protein: 40,
    calories: 450,
    timing: 'pre',
    description: '1 cup oats, 1 scoop protein powder, 1 banana. Eat 60–90 min before training.',
  },
  {
    name: 'Chicken + Rice',
    protein: 45,
    calories: 500,
    timing: 'pre',
    description: '5 oz chicken breast, 1 cup white rice, hot sauce. Solid carbs and protein.',
  },
  {
    name: 'Greek Yogurt + Fruit + Granola',
    protein: 25,
    calories: 380,
    timing: 'pre',
    description: '1 cup Greek yogurt (0%), 1/2 cup granola, mixed berries. If training later in the day.',
  },
  {
    name: 'Eggs + Toast + Avocado',
    protein: 28,
    calories: 420,
    timing: 'pre',
    description: '3 whole eggs, 2 slices whole grain toast, half an avocado. Steady energy without a spike.',
  },
];

export const postworkoutMeals: MealIdea[] = [
  {
    name: 'Protein Shake + Banana',
    protein: 35,
    calories: 350,
    timing: 'post',
    description: 'Fast digesting. Whey protein shake with 1–2 bananas. Drink within 30 min of training.',
  },
  {
    name: 'Ground Turkey + Sweet Potato',
    protein: 50,
    calories: 520,
    timing: 'post',
    description: '6 oz lean ground turkey (93%), 1 large sweet potato. High protein, quality carbs for glycogen replenishment.',
  },
  {
    name: 'Salmon + Rice + Broccoli',
    protein: 48,
    calories: 540,
    timing: 'post',
    description: '5 oz salmon, 1 cup rice, 2 cups broccoli. Omega-3s aid recovery. Perfect dinner after training.',
  },
  {
    name: 'Cottage Cheese + Fruit',
    protein: 30,
    calories: 300,
    timing: 'post',
    description: '1 cup low-fat cottage cheese, 1 cup pineapple or berries. Easy and high protein.',
  },
];

export const restaurantChoices = [
  {
    category: 'Chipotle / Mexican',
    choice: 'Burrito bowl: double chicken, white rice, black beans, pico, no sour cream',
    protein: '55g',
    tip: 'Skip the chips. Add guac only if within your calorie target.',
  },
  {
    category: 'Subway / Sandwiches',
    choice: 'Footlong turkey or tuna on whole wheat, load up on veggies, light mayo',
    protein: '45g',
    tip: 'Ask for extra protein (double meat). Avoid sugar-heavy dressings.',
  },
  {
    category: 'Japanese / Sushi',
    choice: 'Sashimi platter + edamame + miso soup',
    protein: '50g',
    tip: 'Skip the rolls — mostly rice. Sashimi is pure protein.',
  },
  {
    category: 'American / Grill',
    choice: 'Grilled chicken or steak + baked potato + side salad',
    protein: '55g',
    tip: 'Avoid fried options. Ask for dressing on the side.',
  },
  {
    category: 'Mediterranean',
    choice: 'Grilled chicken bowl with hummus, tzatziki, and salad',
    protein: '48g',
    tip: 'One of the best options for fat loss. High protein, anti-inflammatory fats.',
  },
  {
    category: 'Fast Food (Unavoidable)',
    choice: 'Grilled chicken sandwich, side salad, water',
    protein: '35g',
    tip: 'Skip fries. Avoid anything fried. Not ideal but manageable.',
  },
];
