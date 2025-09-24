
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Soup, Clock, CheckCircle, AlertTriangle, Thermometer } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const steamingTimes = [
  { food: "בטטה", time: "15-20 דקות", prep: "חתוכה לקוביות גדולות" },
  { food: "גזר", time: "12-15 דקות", prep: "פרוסות עבות או מקלונים" },
  { food: "קישוא", time: "8-10 דקות", prep: "חתוך לרצועות או קוביות" },
  { food: "דלעת", time: "15-18 דקות", prep: "חתוכה לקוביות" },
  { food: "ברוקולי", time: "8-12 דקות", prep: "זרי ברוקולי קטנים" },
  { food: "כרובית", time: "10-12 דקות", prep: "זרי כרובית קטנים" },
  { food: "תפוח עץ", time: "10-12 דקות", prep: "פרוסות עבות ללא קליפה" },
  { food: "אגס", time: "8-10 דקות", prep: "פרוסות עבות ללא קליפה" }
];

const steamingBenefits = [
  "שמירה על ויטמינים ומינרלים",
  "מרקם רך ומתאים לתינוקות",
  "ללא שמנים או תוספות מיותרות",
  "קל לעיכול",
  "טעם טבעי של המזון נשמר"
];

export default function SteamingGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{backgroundColor: 'var(--background-cream)'}}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Soup className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מדריך איידוי מזון לתינוקות 🥕
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            הדרך הטובה ביותר להכין מזון בריא ומזין לגילאי 6-12 חודשים
          </p>
        </div>

        <Card className="card-base" style={{backgroundColor: 'var(--card-background-mint)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <CheckCircle className="w-6 h-6" style={{color: 'var(--primary-salmon)'}} />
              למה איידוי?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base font-light leading-relaxed" style={{color: "var(--text-soft)"}}>
              איידוי הוא אחת השיטות הבריאות ביותר להכנת מזון לתינוקות. בניגוד לבישול במים, שבו חלק מהויטמינים והמינרלים "בורחים" למים, באיידוי המזון נשאר עם כל הרכיבים התזונתיים החשובים.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {steamingBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/70 p-3 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{color: 'var(--primary-salmon)'}} />
                  <span className="text-sm font-medium" style={{color: "var(--text-main)"}}>{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Clock className="w-6 h-6" style={{color: 'var(--primary-salmon)'}} />
              זמני איידוי מומלצים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {steamingTimes.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border" style={{backgroundColor: 'var(--secondary-yellow)', borderColor: 'var(--border-light)'}}>
                  <h4 className="font-semibold text-lg mb-2" style={{color: "var(--text-main)"}}>{item.food}</h4>
                  <div className="space-y-1">
                    <p className="text-sm flex items-center gap-2" style={{color: "var(--text-soft)"}}>
                      <Clock className="w-4 h-4" />
                      {item.time}
                    </p>
                    <p className="text-sm" style={{color: "var(--text-soft)"}}>{item.prep}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-base" style={{backgroundColor: 'var(--card-background-mint)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Thermometer className="w-6 h-6" style={{color: 'var(--primary-salmon)'}} />
              איך לאדות נכון - שלב אחר שלב
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-white/70 p-4 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                <h4 className="font-semibold mb-2" style={{color: "var(--text-main)"}}>🥄 שלב 1: הכנת הציוד</h4>
                <ul className="text-sm space-y-1 pr-5" style={{color: "var(--text-soft)"}}>
                  <li>• סיר עם מעט מים בתחתית</li>
                  <li>• סל אידוי או מסננת המתאימה לסיר</li>
                  <li>• מכסה לסיר</li>
                </ul>
              </div>

              <div className="bg-white/70 p-4 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                <h4 className="font-semibold mb-2" style={{color: "var(--text-main)"}}>🔪 שלב 2: הכנת הירקות</h4>
                <ul className="text-sm space-y-1 pr-5" style={{color: "var(--text-soft)"}}>
                    <li>• <strong>למזון אצבעות:</strong> חתכו את הירקות לרצועות עבות וארוכות, בגודל של אצבע של מבוגר.</li>
                    <li>• <strong>למרקם טחון/חלק:</strong> חתכו את הירקות לקוביות קטנות כדי לקצר את זמן האידוי.</li>
                </ul>
              </div>
              
              <div className="bg-white/70 p-4 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                <h4 className="font-semibold mb-2" style={{color: "var(--text-main)"}}>🔥 שלב 3: הבישול</h4>
                <ul className="text-sm space-y-1 pr-5" style={{color: "var(--text-soft)"}}>
                  <li>• הרתיחו את המים בסיר</li>
                  <li>• הניחו את המזון החתוך בסל האיידוי</li>
                  <li>• כסו במכסה והקטינו את האש</li>
                  <li>• אדו לפי הזמנים המומלצים</li>
                </ul>
              </div>

              <div className="bg-white/70 p-4 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                <h4 className="font-semibold mb-2" style={{color: "var(--text-main)"}}>✅ שלב 4: בדיקת מוכנות</h4>
                <ul className="text-sm space-y-1 pr-5" style={{color: "var(--text-soft)"}}>
                  <li>• המזון צריך להיות רך מספיק כדי להתמעך בקלות במזלג.</li>
                  <li>• עבור מזון אצבעות - רך מספיק להימעך בין שתי אצבעות.</li>
                </ul>
              </div>

              <div className="bg-white/70 p-4 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                <h4 className="font-semibold mb-2" style={{color: "var(--text-main)"}}>🥣 שלב 5: הכנה להגשה</h4>
                <ul className="text-sm space-y-1 pr-5" style={{color: "var(--text-soft)"}}>
                  <li>• תנו למזון המאודה להתקרר לטמפרטורה פושרת ובטוחה.</li>
                  <li>• <strong>למרקם טחון:</strong> טחנו את הירקות בבלנדר עד למרקם הרצוי.</li>
                  <li>• <strong>למרקם מעוך:</strong> מעכו את הירקות הרכים באמצעות מזלג.</li>
                  <li>• <strong>למזון אצבעות:</strong> הגישו את הרצועות כפי שהן.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-base" style={{backgroundColor: '#fef2f2'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <AlertTriangle className="w-6 h-6" style={{color: 'var(--primary-salmon)'}} />
              טיפים חשובים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-white/70 p-3 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                <h4 className="font-semibold mb-1" style={{color: "var(--text-main)"}}>💡 חיסכון בזמן</h4>
                <p className="text-sm" style={{color: "var(--text-soft)"}}>ניתן לאדות כמה מזונות יחד - התחילו עם אלו שדורשים זמן רב יותר</p>
              </div>
              
              <div className="bg-white/70 p-3 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                <h4 className="font-semibold mb-1" style={{color: "var(--text-main)"}}>🧊 קפיאה והכנה מראש</h4>
                <p className="text-sm" style={{color: "var(--text-soft)"}}>המזון המאודה ניתן לקפיאה עד 3 חודשים - הכינו מנות גדולות לחיסכון בזמן</p>
              </div>

              <div className="bg-white/70 p-3 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                <h4 className="font-semibold mb-1" style={{color: "var(--text-main)"}}>🌡️ בטיחות</h4>
                <p className="text-sm" style={{color: "var(--text-soft)"}}>תמיד בדקו את הטמפרטורה לפני ההגשה - המזון צריך להיות פושר</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-12">
          <Link to={createPageUrl("AgeGuide6to9")}>
            <Button variant="outline" className="secondary-cta">
              <ArrowLeft className="w-4 h-4 ml-2" />
              חזרה למדריך 6-9 חודשים
            </Button>
          </Link>
          
          <Link to={createPageUrl("TextureGuide")}>
            <Button className="main-cta">
              הנושא הבא: מדריך המרקמים
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
