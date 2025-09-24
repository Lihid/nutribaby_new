
import React, { useState } from "react";
import { MealPlan } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ChefHat } from "lucide-react"; // Share2 and BabyIcon are not used in this component's logic or display

const sampleRecipes = [
  {
    "title": "מחית אבוקדו ובננה",
    "age_range": "6-12months",
    "meal_type": "breakfast", 
    "for_baby": true,
    "ingredients": ["אבוקדו בשל", "בננה", "טיפת לימון"],
    "instructions": "1. קלפו את האבוקדו והבננה\n2. רסקו עם מזלג עד למרקם חלק\n3. הוסיפו טיפת לימון למניעת החמצה",
    "nutrition_notes": "עשיר בשומנים בריאים, אשלגן וויטמין C. מושלם כארוחה ראשונה",
    "prep_time": 5
  },
  {
    "title": "מחית בטטה וגזר",
    "age_range": "6-12months",
    "meal_type": "lunch",
    "for_baby": true,
    "ingredients": ["בטטה קלופה", "גזר קלף", "מים"],
    "instructions": "1. חתכו את הבטטה והגזר לקוביות\n2. בשלו בממים רותחים עד שרכים\n3. טחנו במעבד מזון עד למרקם חלק",
    "nutrition_notes": "עשיר בבטא-קרוטן, ויטמין A וסיבים תזונתיים. טוב לעיכול",
    "prep_time": 20
  },
  {
    "title": "דייסת אורז עם תפוח",
    "age_range": "6-12months", 
    "meal_type": "breakfast",
    "for_baby": true,
    "ingredients": ["דגני אורז לתינוקות", "תפוח קלף", "מים רותחים"],
    "instructions": "1. הכינו את דגני האורז לפי ההוראות על האריזה\n2. גרדו תפוח קלף\n3. ערבבו יחד עד למרקם אחיד",
    "nutrition_notes": "מועשר בברזל וויטמינים. מתאים כארוחת בוקר מזינה",
    "prep_time": 10
  },
  {
    "title": "מחית קישוא ותפוח אדמה",
    "age_range": "6-12months",
    "meal_type": "lunch", 
    "for_baby": true,
    "ingredients": ["קישוא קלף", "תפוח אדמה", "מעט שמן זית"],
    "instructions": "1. בשלו את הקישוא ותפוח האדמה בממים\n2. סננו ורסקו עד למרקם חלק\n3. הוסיפו טיפת שמן זית",
    "nutrition_notes": "קל לעיכול, עשיר בממים ואלקטרוליטים",
    "prep_time": 15
  },
  {
    "title": "מחית אגס ובננה",
    "age_range": "6-12months",
    "meal_type": "snack",
    "for_baby": true,
    "ingredients": ["אגס בשל וקלף", "בננה"],
    "instructions": "1. קלפו ופרסו את האגס\n2. רסקו את הבננה\n3. ערבבו יחד עד למרקם חלק",
    "nutrition_notes": "עשיר בויטמינים ומתוק טבעי. מושלם לחטיף",
    "prep_time": 5
  },
  {
    "title": "פסטה עם רוטב ירקות",
    "age_range": "9-12months",
    "meal_type": "lunch",
    "for_baby": true,
    "ingredients": ["פסטה קטנה לתינוקות", "עגבניות", "קישוא", "גזר", "שמן זית"],
    "instructions": "1. בשלו את הפסטה היטב עד שרכה\n2. בשלו את הירקות ורסקו גס\n3. ערבבו את הפסטה עם הירקות",
    "nutrition_notes": "מזון אצבעות מושלם. עשיר בפחמימות וירקות",
    "prep_time": 25
  },
  {
    "title": "כדורי בטטה עם עדשים",
    "age_range": "9-12months",
    "meal_type": "lunch", 
    "for_baby": true,
    "ingredients": ["בטטה מבושלת", "עדשים אדומות מבושלות", "מעט קמח"],
    "instructions": "1. רסקו את הבטטה והעדשים יחד\n2. הוסיפו מעט קמח לקיבוע\n3. צרו כדורים קטנים והגישו",
    "nutrition_notes": "עשיר בחלבון, ברזל ופחמימות מורכבות",
    "prep_time": 20
  },
  {
    "title": "יוגורט עם בננה מעוכה",
    "age_range": "9-12months",
    "meal_type": "snack",
    "for_baby": true,
    "ingredients": ["יוגורט טבעי", "בננה בשלה"],
    "instructions": "1. עכו את הבננה עם מזלג\n2. ערבבו עם היוגורט\n3. הגישו בטמפרטורת החדר",
    "nutrition_notes": "עשיר בחלבון, סידן ופרוביוטיקה טובה לעיכול",
    "prep_time": 3
  },
  {
    "title": "פנקייק בננה ושיבולת שועל",
    "age_range": "12-18months",
    "meal_type": "breakfast",
    "for_baby": true,
    "ingredients": ["בננה בשלה", "שיבולת שועל טחונה", "ביצה", "מעט חלב"],
    "instructions": "1. רסקו את הבננה עם הביצה\n2. הוסיפו שיבולת שועל וחלב\n3. טגנו בפאן על אש נמוכה",
    "nutrition_notes": "עשיר בחלבון, סיבים ופחמימות איטיות",
    "prep_time": 15
  },
  {
    "title": "חתיכות עוף עם ירקות",
    "age_range": "12-18months",
    "meal_type": "dinner",
    "for_baby": true,
    "ingredients": ["חזה עוף", "בטטה", "ברוקולי", "שמן זית"],
    "instructions": "1. חתכו את העוף לחתיכות קטנות\n2. בשלו עם הירקות בממים\n3. וודאו שהכל רך ובטמפרטורה מתאימה",
    "nutrition_notes": "מקור חלבון איכותי עם ויטמינים וברזל",
    "prep_time": 25
  }
];

export default function LoadSampleRecipes() {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      for (const recipe of sampleRecipes) {
        await MealPlan.create(recipe);
      }
      setLoaded(true);
    } catch (error) {
      console.error("Error loading recipes:", error);
      alert("שגיאה בטעינת המתכונים");
    } finally {
      setLoading(false);
    }
  };

  if (loaded) {
    return (
      <Card className="shadow-lg border-0 bg-green-50 border-green-200">
        <CardContent className="text-center py-8">
          <ChefHat className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            המתכונים נטענו בהצלחה!
          </h3>
          <p className="text-green-700">
            ניתן כעת לעיין במתכונים בעמוד המתכונים
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-purple-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <ChefHat className="w-5 h-5" />
          טעינת מתכונים לדוגמה
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-purple-700 mb-4">
          לחצו כאן כדי לטעון מתכונים לדוגמה לתינוקות בעברית
        </p>
        <Button
          onClick={loadRecipes}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {loading ? "טוען מתכונים..." : "טען מתכונים לדוגמה"}
        </Button>
      </CardContent>
    </Card>
  );
}
