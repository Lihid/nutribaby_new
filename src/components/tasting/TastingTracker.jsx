
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Added Input component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Baby, User } from "@/api/entities";
import { Calendar, Check, ChefHat, Clock, Eye, AlertTriangle, Plus } from "lucide-react"; // Added Plus icon
import AllergenTracker from '../profile/AllergenTracker';

const tastingStages = [
  {
    week: "שבוע 1-2",
    title: "ירקות ופירות בסיסיים",
    description: "התחלה עדינה עם מזונות מתוקים וקלים לעיכול",
    foods: ["בטטה", "גזר", "דלעת", "קישוא", "אבוקדו", "בננה", "תפוח", "אגס"],
    allergens: [],
    style: {
      backgroundColor: 'var(--card-background-mint)',
      borderColor: 'var(--border-light)',
    },
    iconColor: "var(--text-main)"
  },
  {
    week: "שבוע 3-4",
    title: "חשיפה לאלרגנים",
    description: "חשיפה הדרגתית לכל האלרגנים העיקריים. זהו שלב קריטי למניעת אלרגיות עתידיות.",
    foods: [],
    allergens: [],
    style: {
      backgroundColor: 'var(--secondary-yellow)',
      borderColor: 'var(--border-light)',
    },
    iconColor: "var(--text-main)"
  },
  {
    week: "שבוע 5-6", 
    title: "דגנים, חלבונים ומרקמים",
    description: "הוספת דגנים, קטניות, בשר, מוצרי חלב ומעבר למרקם גס יותר",
    foods: ["אורז לתינוקות", "שיבולת שועל", "קינואה", "פסטה", "עדשים", "חומוס", "עוף", "הודו", "יוגורט", "גבינת קוטג'"],
    allergens: ["חיטה", "שעורה"],
    style: {
      backgroundColor: 'var(--card-background-mint)',
      borderColor: 'var(--border-light)',
    },
    iconColor: "var(--text-main)"
  },
  {
    week: "שבוע 7-8",
    title: "שילובים ומתכונים", 
    description: "שילוב מזונות שונים ליצירת ארוחות מלאות ומגוונות",
    foods: ["פסטה עם רוטב בולונז טחון", "קציצות עוף עם ירקות", "יוגורט עם פירות מעוכים", "דייסת שיבולת שועל עם טחינה"],
    allergens: [],
    style: {
      backgroundColor: 'var(--secondary-yellow)',
      borderColor: 'var(--border-light)',
    },
    iconColor: "var(--text-main)"
  }
];

export default function TastingTracker() {
  const [baby, setBaby] = useState(null);
  const [tastedFoods, setTastedFoods] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [customFood, setCustomFood] = useState(""); // State for custom food input

  useEffect(() => {
    loadBabyData();
  }, []);

  const loadBabyData = async () => {
    try {
      const currentUser = await User.me();
      const babies = await Baby.filter({ created_by: currentUser.email });
      if (babies.length > 0) {
        const currentBaby = babies[0];
        setBaby(currentBaby);
        setTastedFoods(currentBaby.tasted_foods || []);
      }
    } catch (error) {
      console.error("Error loading baby data:", error);
    }
  };

  const handleFoodToggle = async (food) => {
    if (!baby) return;
    
    const newTasted = tastedFoods.includes(food)
      ? tastedFoods.filter(f => f !== food)
      : [...tastedFoods, food];
    
    setTastedFoods(newTasted);

    try {
      await Baby.update(baby.id, { tasted_foods: newTasted });
    } catch (error) {
      console.error("Error updating tasted foods:", error);
    }
  };

  const getStageProgress = (stage) => {
    const allItems = [...stage.foods, ...stage.allergens];
    if (allItems.length === 0) return 0;
    const tastedItems = allItems.filter(item => tastedFoods.includes(item));
    return (tastedItems.length / allItems.length) * 100;
  };

  const getStageStatus = (stage) => {
    const progress = getStageProgress(stage);
    if (progress === 100) return { text: "הושלם", style: { backgroundColor: 'var(--card-background-mint)', color: 'var(--text-main)' }};
    if (progress > 0) return { text: "בתהליך", style: { backgroundColor: 'var(--secondary-yellow)', color: 'var(--text-main)' }};
    if (stage.title.includes("אלרגנים")) return { text: "שלב חשוב", style: { backgroundColor: 'var(--primary-salmon)', color: 'white', border: 'none' }};
    return { text: "לא התחיל", style: { backgroundColor: '#F3F4F6', color: 'var(--text-soft)', border: 'none' }};
  };

  const addCustomFood = async () => {
    if (!customFood.trim() || !baby) return;
    
    const newFood = customFood.trim();
    if (tastedFoods.includes(newFood)) {
      setCustomFood(""); // Clear input even if food is already listed
      return;
    }

    const newTasted = [...tastedFoods, newFood];
    setTastedFoods(newTasted);
    setCustomFood("");

    try {
      await Baby.update(baby.id, { tasted_foods: newTasted });
      // No need to call loadBabyData here as setTastedFoods already updates the local state.
    } catch (error) {
      console.error("Error adding custom food:", error);
    }
  };

  return (
    <Card className="card-base">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
          <ChefHat className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
          מעקב טעימות לפי שלבים
        </CardTitle>
        <p className="text-sm soft-text">
          לחצו על כל שלב לתיעוד המזונות שהתינוק טעם
        </p>
      </CardHeader>
      <CardContent>
        <div className="mt-3 p-3 rounded-lg border mb-6" style={{backgroundColor: 'var(--secondary-yellow)', borderColor: 'var(--primary-salmon)'}}>
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: 'var(--primary-salmon)'}} />
                <p className="text-sm font-medium" style={{color: 'var(--text-main)'}}>
                שימו לב: אין לתת חלב ניגר או דבש לפני גיל שנה.
                </p>
            </div>
        </div>
        <div className="grid gap-4">
          {tastingStages.map((stage, index) => {
            const progress = getStageProgress(stage);
            const status = getStageStatus(stage);
            
            return (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="p-4 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all" style={stage.style}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'white'}}>
                          <span className="font-bold text-lg" style={{color: 'var(--primary-salmon)'}}>{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold" style={{color: stage.iconColor}}>{stage.week}</h4>
                          <p className="text-sm opacity-80" style={{color: stage.iconColor}}>{stage.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge style={status.style}>
                          {status.text}
                        </Badge>
                        <Button variant="outline" size="sm" className="bg-white/50" style={{borderColor: 'var(--primary-salmon)', color: 'var(--primary-salmon)'}}>
                          <Eye className="w-4 h-4 ml-1" />
                          תיעוד
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3 opacity-70" style={{color: stage.iconColor}}>
                      {stage.description}
                    </p>
                    
                    {stage.title.includes("אלרגנים") ? (
                      <p className="text-xs text-center font-medium" style={{color: 'var(--text-main)'}}>לחצו לניהול ומעקב חשיפה מלא</p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span style={{color: stage.iconColor}}>התקדמות:</span>
                          <span style={{color: stage.iconColor}}>
                            {Math.round(progress)}% ({stage.foods.length + stage.allergens.length} מזונות)
                          </span>
                        </div>
                        <Progress value={progress} className="h-2 [&>div]:bg-[var(--primary-salmon)]" />
                      </div>
                    )}
                  </div>
                </DialogTrigger>
                
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: stage.style.backgroundColor, color: 'var(--primary-salmon)'}}>
                        {index + 1}
                      </span>
                      {stage.title}
                    </DialogTitle>
                  </DialogHeader>
                  
                  {index === 1 ? (
                    <div className="py-4">
                        <p className="soft-text mb-4">{stage.description}</p>
                        <div className="mt-3 p-3 rounded-lg border mb-6" style={{backgroundColor: 'var(--secondary-yellow)', borderColor: 'var(--primary-salmon)'}}>
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: 'var(--primary-salmon)'}} />
                                <p className="text-sm font-medium" style={{color: 'var(--text-main)'}}>
                                שימו לב: אם נצפתה תגובה אלרגית, יש להפסיק את ההאכלה ולפנות להתייעצות רפואית מיידית.
                                </p>
                            </div>
                        </div>
                        <AllergenTracker />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="soft-text">{stage.description}</p>
                      
                      {stage.foods.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <ChefHat className="w-4 h-4" style={{color: 'var(--primary-salmon)'}} />
                            מזונות בסיסיים
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {stage.foods.map(food => (
                              <div key={food} className="flex items-center gap-2 p-2 rounded-lg" style={{backgroundColor: 'var(--card-background-mint)'}}>
                                <Checkbox
                                  id={`food-${food}-${index}`}
                                  checked={tastedFoods.includes(food)}
                                  onCheckedChange={() => handleFoodToggle(food)}
                                  className="border-[var(--primary-salmon)] data-[state=checked]:bg-[var(--primary-salmon)]"
                                />
                                <Label htmlFor={`food-${food}-${index}`} className="text-sm cursor-pointer">
                                  {food}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {stage.allergens.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4" style={{color: 'var(--primary-salmon)'}} />
                            אלרגנים לחשיפה
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {stage.allergens.map(allergen => (
                              <div key={allergen} className="flex items-center gap-2 p-2 rounded-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
                                <Checkbox
                                  id={`allergen-${allergen}-${index}`}
                                  checked={tastedFoods.includes(allergen)}
                                  onCheckedChange={() => handleFoodToggle(allergen)}
                                  className="border-[var(--primary-salmon)] data-[state=checked]:bg-[var(--primary-salmon)]"
                                />
                                <Label htmlFor={`allergen-${allergen}-${index}`} className="text-sm cursor-pointer">
                                  {allergen}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add Custom Food Section */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Plus className="w-4 h-4" style={{color: 'var(--primary-salmon)'}} />
                          הוספת מזון אחר
                        </h4>
                        <div className="flex gap-2 mb-3">
                          <Input
                            placeholder="הוסיפו מזון שלא מופיע ברשימה..."
                            value={customFood}
                            onChange={(e) => setCustomFood(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomFood()}
                            className="flex-1"
                          />
                          <Button 
                            onClick={addCustomFood}
                            variant="outline"
                            className="secondary-cta"
                            disabled={!customFood.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Display Tasted Custom Foods */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {tastedFoods
                            .filter(food => 
                              // Filter out foods that are already part of any predefined stage's foods or allergens
                              !tastingStages.some(s => s.foods.includes(food) || s.allergens.includes(food))
                            )
                            .map(food => (
                              <div key={food} className="flex items-center gap-2 p-2 rounded-lg bg-white border" style={{borderColor: 'var(--border-light)'}}>
                                <Checkbox
                                  id={`custom-${food}-${index}`}
                                  checked={tastedFoods.includes(food)}
                                  onCheckedChange={() => handleFoodToggle(food)}
                                  className="border-[var(--primary-salmon)] data-[state=checked]:bg-[var(--primary-salmon)]"
                                />
                                <Label htmlFor={`custom-${food}-${index}`} className="text-sm cursor-pointer">
                                  {food}
                                </Label>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
