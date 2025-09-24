import React, { useState, useEffect } from "react";
import { MealPlan, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileSpreadsheet } from "lucide-react";

export default function ExportRecipes() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const currentUser = await User.me();
      const mealData = await MealPlan.list();
      setMeals(mealData);
    } catch (error) {
      console.error("Error loading meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    // CSV Headers
    const headers = [
      "כותרת",
      "טווח_גילאים", 
      "סוג_ארוחה",
      "עבור_תינוק",
      "מרכיבים",
      "הוראות_הכנה",
      "הערות_תזונה",
      "זמן_הכנה_דקות"
    ];

    // Convert meals to CSV format
    const csvData = meals.map(meal => [
      meal.title || "",
      meal.age_range || "",
      meal.meal_type || "",
      meal.for_baby ? "כן" : "לא",
      (meal.ingredients || []).join("; "),
      meal.instructions || "",
      meal.nutrition_notes || "",
      meal.prep_time || ""
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");

    // Add BOM for Hebrew support
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Create download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "מתכונים_NutriBaby.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSampleCSV = () => {
    const sampleHeaders = [
      "כותרת",
      "טווח_גילאים", 
      "סוג_ארוחה",
      "עבור_תינוק",
      "מרכיבים",
      "הוראות_הכנה",
      "הערות_תזונה",
      "זמן_הכנה_דקות"
    ];

    const sampleData = [
      [
        "מחית אבוקדו ובננה",
        "6-12months",
        "breakfast",
        "כן",
        "אבוקדו בשל; בננה; טיפת לימון",
        "1. קלפו את האבוקדו והבננה\n2. רסקו עם מזלג עד למרקם חלק\n3. הוסיפו טיפת לימון למניעת החמצה",
        "עשיר בשומנים בריאים, אשלגן וויטמין C. מושלם כארוחה ראשונה",
        "5"
      ],
      [
        "דייסה מדגני בוקר",
        "6-12months", 
        "breakfast",
        "כן",
        "דגני בוקר לתינוקות; מים רותחים; חלב אם או תחליף",
        "1. ערבבו את הדגנים עם מים רותחים לפי ההוראות\n2. הוסיפו חלב אם או תחליף לפי הצורך\n3. בדקו טמפרטורה לפני הגשה",
        "מועשר בברזל וויטמינים חיוניים. מתאים כארוחת בוקר מזינה",
        "3"
      ]
    ];

    const csvContent = [sampleHeaders, ...sampleData]
      .map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "דוגמה_מתכונים_NutriBaby.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            ייצוא ועריכת מתכונים
          </h1>
          <p className="text-lg" style={{color: "var(--text-soft)"}}>
            ייצוא המתכונים לאקסל לעריכה
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <FileSpreadsheet className="w-5 h-5 text-green-500" />
              ייצוא מתכונים קיימים
            </CardTitle>
            <p className="text-sm" style={{color: "var(--text-soft)"}}>
              הורידו קובץ CSV עם כל המתכונים הקיימים במערכת
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">מתכונים נוכחיים במערכת:</h4>
                <p className="text-blue-700">{meals.length} מתכונים</p>
              </div>
              
              <Button 
                onClick={exportToCSV}
                disabled={loading || meals.length === 0}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                הורידו קובץ CSV עם כל המתכונים
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Upload className="w-5 h-5 text-orange-500" />
              קובץ דוגמה
            </CardTitle>
            <p className="text-sm" style={{color: "var(--text-soft)"}}>
              הורידו קובץ דוגמה עם הפורמט הנכון להעלאת מתכונים
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-800 mb-2">פורמט הקובץ:</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• <strong>טווח_גילאים:</strong> 0-6months, 6-12months, 12-18months, 18-24months</li>
                  <li>• <strong>סוג_ארוחה:</strong> breakfast, lunch, dinner, snack</li>
                  <li>• <strong>עבור_תינוק:</strong> כן/לא</li>
                  <li>• <strong>מרכיבים:</strong> הפרידו בנקודה פסיק (;)</li>
                </ul>
              </div>
              
              <Button 
                onClick={exportSampleCSV}
                variant="outline"
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <Download className="w-4 h-4 mr-2" />
                הורידו קובץ דוגמה
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-3">הוראות שימוש:</h3>
          <ol className="text-sm text-yellow-700 space-y-2">
            <li>1. הורידו את קובץ ה-CSV עם המתכונים הקיימים</li>
            <li>2. פתחו את הקובץ באקסל או Google Sheets</li>
            <li>3. ערכו את המתכונים לפי הצורך</li>
            <li>4. שמרו את הקובץ בפורמט CSV</li>
            <li>5. צרו קשר לקבלת הוראות להעלאה חזרה למערכת</li>
          </ol>
        </div>
      </div>
    </div>
  );
}