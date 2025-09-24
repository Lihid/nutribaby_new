
import React, { useState, useEffect } from "react";
import { MealPlan } from "@/api/entities";
import { Baby, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, ChefHat, Plus, Share2, X, Heart, AlertCircle, RefreshCw, Search, BookOpen, AlertTriangle } from "lucide-react";
import { differenceInMonths } from "date-fns";
import { useTranslation } from "../components/utils/translations";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadFile } from "@/api/integrations";

const ALLERGEN_MAP = {
    'מוצרי חלב': ['יוגורט', 'גבינה', 'שמנת', 'חמאה', 'קוטג'],
    'חיטה': ['חיטה', 'קמח', 'גלוטן', 'סולת', 'פסטה', 'לחם', 'בורגול', 'פתיתים', 'קוסקוס'],
    'ביצים': ['ביצה', 'ביצים'],
    'בוטנים': ['בוטנים', 'חמאת בוטנים'],
    'אגוזים': ['אגוז', 'אגוזים', 'שקד', 'שקדים', 'קשיו', 'פקאן', 'מלך', 'לוז'],
    'שומשום': ['שומשום', 'טחינה'],
    'סויה': ['סויה', 'טופו', 'אדממה'],
    'דגים': ['דג', 'דגים', 'טונה', 'סלמון']
};

const getRecipeAllergens = (recipe) => {
    const foundAllergens = new Set();
    const ingredients = (recipe.ingredients || []).join(' ').toLowerCase();
    if (!ingredients) return [];

    for (const [allergen, keywords] of Object.entries(ALLERGEN_MAP)) {
        // Skip checking for dairy products if the recipe contains "חלב רגיל/צמחי"
        if (allergen === 'מוצרי חלב' && ingredients.includes('חלב רגיל/צמחי')) {
            continue;
        }
        
        if (keywords.some(keyword => ingredients.includes(keyword))) {
            foundAllergens.add(allergen);
        }
    }
    return Array.from(foundAllergens);
};


export default function MealPlanner() {
  const [meals, setMeals] = useState([]);
  const [baby, setBaby] = useState(null);
  const [activeTab, setActiveTab] = useState("breakfast");
  const [targetAge, setTargetAge] = useState("6-12months"); // Default to 6-12 months
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    age_ranges: [], // Changed from age_range to age_ranges (array)
    meal_types: [], // Changed from meal_type to meal_types (array)
    ingredients: [],
    instructions: "",
    nutrition_notes: "",
    prep_time: "",
    image: "", // Changed from image_url to image
    servings: 1
  });
  const [newIngredient, setNewIngredient] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showAddToLogDialog, setShowAddToLogDialog] = useState(false);
  const [selectedMealForLog, setSelectedMealForLog] = useState(null);
  const [logAmount, setLogAmount] = useState("");
  const [isUploading, setIsUploading] = useState(false); // Added isUploading state

  const [selectedMealForDetails, setSelectedMealForDetails] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const userLanguageForTranslation = user?.preferred_language;
  const { t, dir, align, language } = useTranslation(userLanguageForTranslation);

  useEffect(() => {
    loadData();

    const urlParams = new URLSearchParams(window.location.search);
    const ageParam = urlParams.get('age');
    // Updated valid age parameters to exclude "0-6months"
    if (ageParam && ["6-12months", "12-18months", "18-24months"].includes(ageParam)) {
      setTargetAge(ageParam);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const mealData = await MealPlan.list();
      setMeals(mealData || []);

      try {
        const babyData = await Baby.filter({ created_by: currentUser.email });
        if (babyData && babyData.length > 0) {
          setBaby(babyData[0]);
          const urlParams = new URLSearchParams(window.location.search);
          const ageParam = urlParams.get('age');
          // Updated valid age parameters to exclude "0-6months"
          if (!ageParam || !["6-12months", "12-18months", "18-24months"].includes(ageParam)) {
            const babyAge = getAgeRange(babyData[0].birth_date);
            setTargetAge(babyAge);
          }
        }
      } catch (babyError) {
        console.log("No baby profile found, using default age range");
      }

    } catch (err) {
      console.error("Error loading meal data:", err);
      setError(`אירעה שגיאה בטעינת המתכונים: ${err.message}`);
    }
    setLoading(false);
  };

  const getAgeRange = (birthDate) => {
    if (!birthDate) return "6-12months"; // Default to 6-12 months if no birth date

    try {
      const today = new Date();
      const birth = new Date(birthDate);

      // console.log('Birth date in meal planner:', birth.toLocaleDateString());
      // console.log('Today in meal planner:', today.toLocaleDateString());

      const ageInMonths = differenceInMonths(today, birth);

      // console.log('Age in months in meal planner:', ageInMonths);

      // All ages under 12 months now fall into "6-12months" category.
      if (ageInMonths < 12) return "6-12months"; 
      if (ageInMonths < 18) return "12-18months";
      return "18-24months";
    } catch (error) {
      console.error("Error calculating age in meal planner:", error);
      return "6-12months"; // Fallback to 6-12 months on error
    }
  };

  // Updated valid age ranges to exclude "0-6months"
  const validAgeRanges = ["6-12months", "12-18months", "18-24months"];

  const babyAllergies = baby?.allergies?.filter(a => a.trim() !== '');
  const isFilteringByAllergy = babyAllergies && babyAllergies.length > 0;

  const filteredMeals = meals.
  filter((meal) => {
    // Support both old format (age_range) and new format (age_ranges)
    const ageRanges = meal.age_ranges || (meal.age_range ? [meal.age_range] : []);
    // Filter out recipes with no valid age ranges associated, including the removed 0-6 months.
    return ageRanges.some((range) => validAgeRanges.includes(range));
  }).
  filter((meal) => {
    if (!isFilteringByAllergy) {
        return true;
    }
    const mealAllergens = getRecipeAllergens(meal);
    const hasBabyAllergen = babyAllergies.some(babyAllergen =>
        mealAllergens.find(ma => ma === babyAllergen)
    );

    return !hasBabyAllergen;
  }).
  filter((meal) => {
    const mealAgeRanges = meal.age_ranges || (meal.age_range ? [meal.age_range] : []);
    // Support both old format (meal_type) and new format (meal_types)
    const mealTypes = meal.meal_types || (meal.meal_type ? [meal.meal_type] : []);
    
    return mealTypes.includes(activeTab) && mealAgeRanges.includes(targetAge);
  }).
  filter((meal) => {
    if (!searchTerm) return true;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const titleMatch = meal.title?.toLowerCase().includes(lowerCaseSearchTerm);
    const ingredientsMatch = meal.ingredients?.some((ingredient) =>
    ingredient.toLowerCase().includes(lowerCaseSearchTerm)
    );
    return titleMatch || ingredientsMatch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await MealPlan.create({
        ...formData,
        prep_time: parseInt(formData.prep_time) || 15,
        servings: parseInt(formData.servings) || 1
      });

      setFormData({
        title: "",
        age_ranges: [], 
        meal_types: [], // Reset to empty array
        ingredients: [],
        instructions: "",
        nutrition_notes: "",
        prep_time: "",
        image: "", 
        servings: 1
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error("Error creating meal:", error);
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim() && !formData.ingredients.includes(newIngredient.trim())) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()]
      }));
      setNewIngredient("");
    }
  };

  const removeIngredient = (ingredientToRemove) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ingredient) => ingredient !== ingredientToRemove)
    }));
  };

  const shareRecipe = async (meal) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `מתכון: ${meal.title}`,
          text: `מתכון נהדר מ-NutriBaby!\n\n${meal.title}\n\nמרכיבים:\n${meal.ingredients?.join('\n')}\n\nהוראות הכנה:\n${meal.instructions}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      const shareText = `מתכון: ${meal.title}\n\nמרכיבים:\n${meal.ingredients?.join('\n')}\n\nהוראות הכנה:\n${meal.instructions}`;
      navigator.clipboard.writeText(shareText);
      alert('המתכון הועתק ללוח!');
    }
  };

  const handleAddToLog = (meal) => {
    setSelectedMealForLog(meal);
    setShowAddToLogDialog(true);
  };

  const saveToLog = async () => {
    if (!selectedMealForLog || !logAmount) return;

    try {
      const { DailyLog } = await import("@/api/entities");
      const now = new Date();

      // Determine log type, preferring meal_type for old data, then first meal_types entry, then 'unknown'
      const logType = selectedMealForLog.meal_type || (selectedMealForLog.meal_types && selectedMealForLog.meal_types.length > 0 ? selectedMealForLog.meal_types[0] : 'unknown');

      await DailyLog.create({
        log_date: now.toISOString().split('T')[0],
        log_time: now.toTimeString().split(' ')[0].substring(0, 5),
        log_type: logType,
        food_items: [selectedMealForLog.title],
        notes: `${logAmount} - ${selectedMealForLog.title}`
      });

      alert(t('add_to_log_success'));
      setShowAddToLogDialog(false);
      setSelectedMealForLog(null);
      setLogAmount("");
    } catch (error) {
      console.error("Error adding to log:", error);
    }
  };

  const handleAgeRangeToggle = (ageRange) => {
    setFormData((prev) => ({
      ...prev,
      age_ranges: prev.age_ranges.includes(ageRange) ?
      prev.age_ranges.filter((range) => range !== ageRange) :
      [...prev.age_ranges, ageRange]
    }));
  };

  const handleMealTypeToggle = (mealType) => {
    setFormData((prev) => ({
      ...prev,
      meal_types: prev.meal_types.includes(mealType) ?
      prev.meal_types.filter((type) => type !== mealType) :
      [...prev.meal_types, mealType]
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData((prev) => ({ ...prev, image: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("שגיאה בהעלאת התמונה. נסו שוב.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewDetails = (meal) => {
    setSelectedMealForDetails(meal);
    setShowDetailsDialog(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-[var(--card-background-mint)] rounded-md w-1/3 mb-8"></div>
            <div className="h-12 bg-[var(--secondary-yellow)] rounded-2xl w-full mb-8"></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 bg-[var(--card-background-mint)] rounded-xl"></div>
              <div className="h-64 bg-[var(--secondary-yellow)] rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>);
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
        <Card className="card-base text-center p-8">
          <CardContent>
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--primary-salmon)' }} />
            <h2 className="text-2xl font-semibold mb-2">אופס, משהו השתבש</h2>
            <p className="soft-text mb-6">{error}</p>
            <Button onClick={loadData} className="main-cta">
              <RefreshCw className="w-4 h-4 ml-2" />
              נסו שוב
            </Button>
          </CardContent>
        </Card>
      </div>);
  }

  return (
    <div className="p-6 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl text-base font-bold">{t('baby_recipes')}</h1>
        </div>

        {isFilteringByAllergy && (
            <Card className="mb-8 card-base bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-amber-800">סינון מתכונים פעיל</p>
                            <p className="text-sm text-amber-700">
                                {t('filtered_by_allergies', {
                                    name: baby.name,
                                    allergens: babyAllergies.join(', ')
                                })}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-center justify-end mb-8">
          {baby &&
          <Badge variant="outline" className="text-sm" style={{ borderColor: 'var(--border-light)', color: 'var(--primary-salmon)', backgroundColor: 'var(--secondary-yellow)' }}>
              ארוחות של {baby.name}
            </Badge>
          }
          <Select value={targetAge} onValueChange={setTargetAge}>
            <SelectTrigger className="w-full md:w-[220px] bg-white" style={{ borderColor: 'var(--border-light)', color: 'var(--text-main)' }}>
              <SelectValue placeholder="בחרי טווח גילאים" />
            </SelectTrigger>
            <SelectContent>
              {/* Removed 0-6 months option */}
              <SelectItem value="6-12months">6-12 חודשים</SelectItem>
              <SelectItem value="12-18months">12-18 חודשים</SelectItem>
              <SelectItem value="18-24months">18-24 חודשים</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" style={{ [align === 'right' ? 'right' : 'left']: '0.75rem', [align === 'right' ? 'left' : 'right']: 'auto' }} />
            <Input
              placeholder={t('search_recipe_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[220px] bg-white"
              style={{
                paddingLeft: align === 'left' ? '2.5rem' : '0.75rem',
                paddingRight: align === 'right' ? '2.5rem' : '0.75rem',
                borderColor: 'var(--border-light)',
                color: 'var(--text-main)'
              }} />

          </div>
        </div>

        {showForm &&
        <Card className="card-base mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>הוספת מתכון חדש</span>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div> {/* This div now only contains the title input */}
                  <Label>שם המתכון</Label>
                  <Input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="הכניסו שם מתכון..."
                  required />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>זמן הכנה (דקות)</Label>
                    <Input
                    type="number"
                    value={formData.prep_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, prep_time: e.target.value }))}
                    placeholder="15" />

                  </div>
                  <div>
                    <Label>{t('servings')}</Label>
                    <Input
                    type="number"
                    value={formData.servings}
                    onChange={(e) => setFormData((prev) => ({ ...prev, servings: e.target.value }))}
                    placeholder={t('servings_placeholder')} />

                  </div>
                </div>

                <div>
                  <Label>{t('image_link')}</Label>
                  <div className="space-y-3">
                    {/* File upload option */}
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        onChange={handleImageUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-yellow)] file:text-[var(--primary-salmon)] hover:file:bg-[var(--primary-salmon)] hover:file:text-white"
                        disabled={isUploading}
                        accept="image/*"
                      />
                      {isUploading && <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary-salmon)]" />}
                    </div>
                    
                    {/* OR divider */}
                    <div className="text-center text-sm text-gray-500">או</div>
                    
                    {/* URL input option */}
                    <Input
                      type="url"
                      placeholder="הדביקו קישור לתמונה..."
                      value={formData.image}
                      onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    />
                  </div>
                  
                  {formData.image && (
                    <div className="mt-2">
                      <img src={formData.image} alt="תצוגה מקדימה" className="w-32 h-32 object-cover rounded-lg border-2 border-[var(--border-light)]" />
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('age_ranges')}</Label>
                    <div className="space-y-2 p-3 border rounded-lg" style={{ borderColor: 'var(--border-light)' }}>
                      <p className="text-sm text-gray-600">{t('select_age_ranges')}</p>
                      {validAgeRanges.map((ageRange) =>
                    <div key={ageRange} className="flex items-center space-x-2">
                          <Checkbox
                        id={`age-${ageRange}`}
                        checked={formData.age_ranges.includes(ageRange)}
                        onCheckedChange={() => handleAgeRangeToggle(ageRange)} />

                          <Label htmlFor={`age-${ageRange}`} className="text-sm">
                            {ageRange === "6-12months" && "6-12 חודשים"}
                            {ageRange === "12-18months" && "12-18 חודשים"}
                            {ageRange === "18-24months" && "18-24 חודשים"}
                          </Label>
                        </div>
                    )}
                    </div>
                  </div>
                  <div>
                    <Label>סוגי ארוחות</Label>
                    <div className="space-y-2 p-3 border rounded-lg" style={{ borderColor: 'var(--border-light)' }}>
                      <p className="text-sm text-gray-600">בחרו סוגי ארוחות (ניתן לבחור כמה)</p>
                      {[
                        { value: "breakfast", label: "ארוחת בוקר" },
                        { value: "lunch", label: "ארוחת צהריים" },
                        { value: "snack", label: "ביניים" },
                        { value: "dinner", label: "ארוחת ערב" }
                      ].map((mealType) => (
                        <div key={mealType.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`meal-${mealType.value}`}
                            checked={formData.meal_types.includes(mealType.value)}
                            onCheckedChange={() => handleMealTypeToggle(mealType.value)}
                          />
                          <Label htmlFor={`meal-${mealType.value}`} className="text-sm">
                            {mealType.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>מרכיבים</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="הוסיפו מרכיב..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())} />

                    <Button type="button" onClick={addIngredient} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.ingredients.map((ingredient, index) =>
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <button
                      type="button"
                      onClick={() => removeIngredient(ingredient)}
                      className="hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                        {ingredient}
                      </Badge>
                  )}
                  </div>
                </div>

                <div>
                  <Label>הוראות הכנה</Label>
                  <Textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
                  placeholder="תארו את שלבי ההכנה..."
                  className="h-24"
                  required />

                </div>

                <div>
                  <Label>הערות תזונה</Label>
                  <Textarea
                  value={formData.nutrition_notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nutrition_notes: e.target.value }))}
                  placeholder="יתרונות תזונתיים, ויטמינים..."
                  className="h-20" />

                </div>

                <Button type="submit" className="w-full main-cta">
                  <span>שמירת מתכון</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        }

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-2xl p-2" style={{ borderColor: 'var(--border-light)' }}>
            <TabsTrigger value="dinner" className="rounded-xl data-[state=active]:bg-[var(--card-background-mint)] data-[state=active]:text-[var(--text-main)]">ערב</TabsTrigger>
            <TabsTrigger value="snack" className="rounded-xl data-[state=active]:bg-[var(--card-background-mint)] data-[state=active]:text-[var(--text-main)]">ביניים</TabsTrigger>
            <TabsTrigger value="lunch" className="rounded-xl data-[state=active]:bg-[var(--secondary-yellow)] data-[state=active]:text-[var(--primary-salmon)]">צהריים</TabsTrigger>
            <TabsTrigger value="breakfast" className="rounded-xl data-[state=active]:bg-[var(--secondary-yellow)] data-[state=active]:text-[var(--primary-salmon)]">בוקר</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMeals.map((meal, index) => {
                const allergens = getRecipeAllergens(meal);
                return (
                  <Card
                    key={meal.id || index}
                    className="card-base hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative"
                    onClick={() => handleViewDetails(meal)}>
                      
                      {meal.image &&
                    <div className="aspect-square w-full overflow-hidden">
                          <img
                        src={meal.image}
                        alt={meal.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />

                        </div>
                    }
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm text-center line-clamp-2" style={{ color: 'var(--text-main)' }}>
                          {meal.title}
                        </h3>
                        <div className="flex items-center justify-center gap-1 text-xs mt-2" style={{ color: 'var(--text-soft)' }}>
                          <Clock className="w-3 h-3" />
                          <span>{meal.prep_time} {t('minutes')}</span>
                        </div>
                      </CardContent>
                    </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                {selectedMealForDetails?.title}
              </DialogTitle>
            </DialogHeader>
            
            {selectedMealForDetails &&
            (() => {
              const allergensInRecipe = getRecipeAllergens(selectedMealForDetails);
              return (
                <div className="space-y-6 pb-6">
                    {selectedMealForDetails.image &&
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                        <img
                      src={selectedMealForDetails.image}
                      alt={selectedMealForDetails.title}
                      className="w-full h-full object-cover" />

                      </div>
                  }
                    
                    <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-soft)' }}>
                    <Clock className="w-4 h-4" style={{ color: 'var(--primary-salmon)' }} />
                    <span>{selectedMealForDetails.prep_time} {t('minutes')}</span>
                  </div>
                  {selectedMealForDetails.servings &&
                <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                      • {selectedMealForDetails.servings === 1 ?
                  t('makes_1_serving') :
                  t('makes_servings', { servings: selectedMealForDetails.servings })
                  }
                    </div>
                }
                  {/* Display age ranges as badges */}
                  <div className="flex flex-wrap gap-1">
                    {(selectedMealForDetails.age_ranges || (selectedMealForDetails.age_range ? [selectedMealForDetails.age_range] : [])).map((range, idx) =>
                  <Badge key={idx} variant="outline" className="text-xs" style={{
                    borderColor: 'var(--primary-salmon)',
                    color: 'var(--primary-salmon)',
                    backgroundColor: 'transparent'
                  }}>
                        {/* Removed 0-6 months label */}
                        {range === "6-12months" && "6-12 חודשים"}
                        {range === "12-18months" && "12-18 חודשים"}
                        {range === "18-24months" && "18-24 חודשים"}
                      </Badge>
                  )}
                  </div>
                </div>

                    {allergensInRecipe.length > 0 && (
                        <div className="rounded-lg p-3 bg-red-50 border border-red-200">
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-700">
                                <AlertTriangle className="w-5 h-5" />
                                {t('contains_allergens')}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {allergensInRecipe.map(allergen => (
                                    <Badge key={allergen} variant="destructive">{allergen}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-3" style={{ color: 'var(--text-main)' }}>מרכיבים:</h4>
                  <ul className="space-y-2">
                    {selectedMealForDetails.ingredients?.map((ingredient, i) =>
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-soft)' }}>
                        <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--primary-salmon)' }}></span>
                        <span>{ingredient}</span>
                      </li>
                  )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--text-main)' }}>הוראות הכנה:</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                    {selectedMealForDetails.instructions}
                  </p>
                </div>

                {selectedMealForDetails.nutrition_notes &&
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--card-background-mint)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4" style={{ color: 'var(--primary-salmon)' }} />
                      <span className="font-semibold" style={{ color: 'var(--text-main)' }}>הערות תזונה</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
                      {selectedMealForDetails.nutrition_notes}
                    </p>
                  </div>
              }

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t" style={{borderColor: 'var(--border-light)'}}>
                  <Button
                  onClick={() => shareRecipe(selectedMealForDetails)}
                  variant="outline"
                  className="flex-1">

                    <Share2 className="w-4 h-4 ml-2" />
                    שיתוף מתכון
                  </Button>
                  <Button
                  onClick={() => {
                    handleAddToLog(selectedMealForDetails);
                    setShowDetailsDialog(false);
                  }}
                  className="flex-1 main-cta">

                    <BookOpen className="w-4 h-4 ml-2" />
                    {t('add_to_log')}
                  </Button>
                </div>
              </div>
              );
            })()
            }
          </DialogContent>
        </Dialog>

        {/* Add to Log Dialog */}
        <Dialog open={showAddToLogDialog} onOpenChange={setShowAddToLogDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('add_to_daily_log')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">{selectedMealForLog?.title}</p>
                <p className="text-sm text-gray-600">{t('how_much_eaten')}</p>
              </div>

              <div className="space-y-2">
                <Label>{t('amount_eaten')}</Label>
                <Select value={logAmount} onValueChange={setLogAmount}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_amount_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="מנה שלמה">{t('full_serving')}</SelectItem>
                    <SelectItem value="חצי מנה">{t('half_serving')}</SelectItem>
                    <SelectItem value="רבע מנה">{t('quarter_serving')}</SelectItem>
                    <SelectItem value="כמה ביסים">{t('few_bites')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddToLogDialog(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={saveToLog} disabled={!logAmount} className="main-cta">
                  {t('add_to_log_button')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {filteredMeals.length === 0 &&
        <Card className="card-base">
            <CardContent className="text-center py-12">
              <ChefHat className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--primary-salmon)" }} />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? `${t('no_recipes_found_for_search')} "${searchTerm}"` : t('no_recipes_found')}
              </h3>
              <p className="soft-text">
                {searchTerm ? t('try_different_search_term') : t('try_different_category')}
              </p>
            </CardContent>
          </Card>
        }
      </div>
    </div>);

}
