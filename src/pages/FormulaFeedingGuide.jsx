import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Thermometer, Clock, Droplets, AlertTriangle, CheckCircle, Baby, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const formulaTypes = [
  {
    type: "תמ״ל שלב 1 (0-6 חודשים)",
    description: "מותאם לתינוקות מלידה עד גיל 6 חודשים",
    features: ["מועשר בברזל", "דומה בהרכבו לחלב אם", "קל לעיכול"]
  },
  {
    type: "תמ״ל ללא לקטוז",
    description: "למקרים של רגישות ללקטוז או בעיות עיכול",
    features: ["ללא סוכר חלב", "מתאים לתינוקות עם רגישות", "לפי הנחיית רופא"]
  },
  {
    type: "תמ״ל חלבון מפורק",
    description: "למקרים של אלרגיה לחלבון חלב פרה",
    features: ["חלבון מעובד ומפורק", "מתאים לתינוקות אלרגיים", "רק לפי הנחיית רופא"]
  }
];

const preparationSteps = [
  "רחצו ידיים ונקו את כל הכלים",
  "הרתיחו מים טריים והניחו להתקרר ל-40-50 מעלות",
  "מדדו את כמות המים הנדרשת ושפכו לבקבוק",
  "הוסיפו את כמות האבקה הנכונה בהתאם להוראות",
  "סגרו את הבקבוק ונערו היטב עד להמסה מלאה",
  "בדקו את הטמפרטורה על פרק כף היד - צריכה להיות פושרת"
];

const hungerSatietySigns = {
  hunger: [
    "פתיחת פה וחיפוש אחר הבקבוק",
    "מציצת אצבעות או אגרוף (עד גיל 10 שבועות)",
    "תנועות מוצצות",
    "אי שקט או בכי (סימן מאוחר)"
  ],
  satiety: [
    "דוחף את הבקבוק או מפנה את הראש",
    "סוגר את הפה או מסרב לפתוח אותו",
    "הופך להיות רגוע ומרוצה",
    "נרדם במהלך האכלה"
  ]
};

const feedingAmounts = [
  { age: "לידה-2 שבועות", amount: "20-50 מ״ל", frequency: "כל 3-4 שעות", daily: "8 האכלות", total: "540-960 מ״ל" },
  { age: "חודשיים", amount: "90-120 מ״ל", frequency: "כל 3-4 שעות", daily: "8 האכלות", total: "540-960 מ״ל" },
  { age: "3 חודשים", amount: "120-180 מ״ל", frequency: "כל 4 שעות", daily: "6 האכלות", total: "720-960 מ״ל" },
  { age: "4 חודשים", amount: "150-210 מ״ל", frequency: "כל 4-5 שעות", daily: "4-6 האכלות", total: "720-960 מ״ל" },
  { age: "5 חודשים", amount: "180-240 מ״ל", frequency: "כל 4-5 שעות", daily: "5 האכלות", total: "720-960 מ״ל" },
  { age: "6 חודשים", amount: "180-240 מ״ל", frequency: "כל 4-5 שעות", daily: "4-5 האכלות", total: "720-960 מ״ל" }
];

const overfeeding = {
  signs: [
    "פליטות מרובות לאחר האכלות",
    "עלייה מוגזמת במשקל יחסית לגובה",
    "אי נוחות ובכי לאחר האכלות"
  ],
  prevention: [
    "האכלה איטית והדרגתית עם עצירות",
    "הקשבה לסימני שובע של התינוק",
    "הצעת מוצץ לסיפוק צורך המציצה",
    "הכנת תמ״ל נכונה לפי ההוראות"
  ]
};

export default function FormulaFeedingGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{backgroundColor: 'var(--background-cream)'}}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--card-background-mint)'}}>
            <Shield className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מדריך תחליף חלב (תמ״ל)
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            הכל על בחירת תמ״ל, הכנה נכונה והאכלה בטוחה
          </p>
        </div>

        {/* Hunger and Satiety Signs */}
        <Card className="card-base" style={{backgroundColor: 'var(--secondary-yellow)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Eye className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              זיהוי סימני רעב ושובע
            </CardTitle>
            <p className="text-sm font-light mt-2" style={{color: "var(--text-soft)"}}>
              בהאכלה מבקבוק השליטה בהזנה בידי ההורים, לכן חשוב לשים לב לסימנים של התינוק כדי למנוע האכלת יתר
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2" style={{color: 'var(--primary-salmon)'}}>
                  <Baby className="w-5 h-5" />
                  סימני רעב
                </h4>
                <ul className="space-y-2">
                  {hungerSatietySigns.hunger.map((sign, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span className="text-sm" style={{color: "var(--text-main)"}}>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2" style={{color: 'var(--primary-salmon)'}}>
                  <CheckCircle className="w-5 h-5" />
                  סימני שובע
                </h4>
                <ul className="space-y-2">
                  {hungerSatietySigns.satiety.map((sign, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm" style={{color: "var(--text-main)"}}>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formula Types */}
        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Shield className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              סוגי תחליפי חלב
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formulaTypes.map((formula, index) => (
                <div key={index} className="p-4 rounded-lg border" style={{backgroundColor: 'var(--secondary-yellow)', borderColor: 'var(--border-light)'}}>
                  <h4 className="font-bold text-lg mb-2" style={{color: 'var(--primary-salmon)'}}>{formula.type}</h4>
                  <p className="mb-3 text-sm" style={{color: 'var(--text-main)'}}>{formula.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {formula.features.map((feature, featIndex) => (
                      <span key={featIndex} className="px-2 py-1 rounded text-xs bg-white" style={{color: 'var(--primary-salmon)', border: '1px solid var(--border-light)'}}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feeding Amounts */}
        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Droplets className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              כמויות האכלה לפי גיל
            </CardTitle>
            <p className="text-sm font-light mt-2" style={{color: "var(--text-soft)"}}>
              כלל כללי: 60-75 מ״ל לק״ג משקל במשך 24 שעות. מקסימום 960 מ״ל ליממה עד גיל 6 חודשים
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{borderColor: 'var(--border-light)'}}>
                    <th className="text-right p-3 font-semibold" style={{color: 'var(--primary-salmon)'}}>גיל</th>
                    <th className="text-right p-3 font-semibold" style={{color: 'var(--primary-salmon)'}}>כמות בארוחה</th>
                    <th className="text-right p-3 font-semibold" style={{color: 'var(--primary-salmon)'}}>תדירות</th>
                    <th className="text-right p-3 font-semibold" style={{color: 'var(--primary-salmon)'}}>מספר ארוחות</th>
                    <th className="text-right p-3 font-semibold" style={{color: 'var(--primary-salmon)'}}>סה״כ יומי</th>
                  </tr>
                </thead>
                <tbody>
                  {feedingAmounts.map((schedule, index) => (
                    <tr key={index} className="border-b" style={{borderColor: 'var(--border-light)'}}>
                      <td className="p-3 font-medium" style={{color: 'var(--text-main)'}}>{schedule.age}</td>
                      <td className="p-3" style={{color: 'var(--text-main)'}}>{schedule.amount}</td>
                      <td className="p-3" style={{color: 'var(--text-main)'}}>{schedule.frequency}</td>
                      <td className="p-3" style={{color: 'var(--text-main)'}}>{schedule.daily}</td>
                      <td className="p-3 font-semibold" style={{color: 'var(--primary-salmon)'}}>{schedule.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Preparation Steps */}
        <Card className="card-base" style={{backgroundColor: 'var(--card-background-mint)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Thermometer className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              שלבי הכנת תמ״ל
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {preparationSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{backgroundColor: 'var(--primary-salmon)'}}>
                    {index + 1}
                  </div>
                  <span style={{color: "var(--text-main)"}}>{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overfeeding Prevention */}
        <Card className="card-base" style={{backgroundColor: 'var(--primary-salmon)'}}>
          <CardHeader>
            <CardTitle className="text-white">
              ⚠️ מניעת האכלת יתר
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/20 p-4 rounded-lg">
              <h4 className="font-bold mb-3 text-white">סימני האכלת יתר:</h4>
              <ul className="space-y-2">
                {overfeeding.signs.map((sign, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/90">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <h4 className="font-bold mb-3 text-white">כיצד למנוע:</h4>
              <ul className="space-y-2">
                {overfeeding.prevention.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/90">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="card-base" style={{backgroundColor: 'var(--secondary-yellow)'}}>
          <CardHeader>
            <CardTitle style={{color: "var(--text-main)"}}>
              💡 עקרונות חשובים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3" style={{color: "var(--text-main)"}}>
              <p>
                <strong>האכלה איטית:</strong> האכילו בשיטה תומכת, בקצב איטי שמאפשר להגיע לתחושת השובע (כ-20 דקות).
              </p>
              <p>
                <strong>הכנה נכונה:</strong> הקפידו על יחס נכון של מים לאבקה כדי לא לשנות את הערך הקלורי.
              </p>
              <p>
                <strong>מעקב יומי:</strong> התמקדו בסך הצריכה היומית ולא רק בארוחה בודדת.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-12">
          <Link to={createPageUrl("BreastfeedingGuide")}>
            <Button variant="outline" className="secondary-cta">
              <ArrowLeft className="w-4 h-4 ml-2" />
              הנושא הקודם: הנקה
            </Button>
          </Link>
          
          <Link to={createPageUrl("BabyDevelopmentGuide")}>
            <Button className="main-cta">
              הנושא הבא: התפתחות התינוק
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}