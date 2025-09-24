import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../utils/translations';
import { MealPlan } from '@/api/entities';

export default function DailyRecipe({ userLanguage }) {
  const { t, dir, align } = useTranslation(userLanguage);
  const [randomRecipe, setRandomRecipe] = useState(null);

  useEffect(() => {
    const loadRandomRecipe = async () => {
      try {
        const meals = await MealPlan.list();
        const mealsWithImages = meals.filter(meal => meal.image);
        if (mealsWithImages.length > 0) {
          const selected = mealsWithImages[Math.floor(Math.random() * mealsWithImages.length)];
          setRandomRecipe(selected);
        }
      } catch (error) {
        console.error('Error loading random recipe:', error);
      }
    };
    
    loadRandomRecipe();
  }, []);

  if (!randomRecipe) {
    return (
      <Card className="card-base" style={{ backgroundColor: 'var(--card-background-mint)', direction: dir }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: "var(--text-main)", textAlign: align }}>
            <ChefHat className="w-5 h-5" style={{ color: "var(--primary-salmon)" }} />
            {t('recipe_of_day')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
              <Link to={createPageUrl("MealPlanner")}>
                <span className="text-sm font-semibold hover:underline" style={{ color: 'var(--primary-salmon)' }}>
                  {t('more_recipes')}
                </span>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-base" style={{ backgroundColor: 'var(--card-background-mint)', direction: dir }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: "var(--text-main)", textAlign: align }}>
          <ChefHat className="w-5 h-5" style={{ color: "var(--primary-salmon)" }} />
          {t('recipe_of_day')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={randomRecipe.image} 
              alt={randomRecipe.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-main)', textAlign: align }}>
              {randomRecipe.title}
            </h3>
            <Link to={createPageUrl("MealPlanner")}>
              <span className="text-sm font-semibold hover:underline" style={{ color: 'var(--primary-salmon)' }}>
                {t('more_recipes')}
              </span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}