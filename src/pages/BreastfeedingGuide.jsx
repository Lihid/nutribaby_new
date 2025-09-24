
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Clock, Baby, Droplets, Users, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const breastfeedingBenefits = [
  "מערכת חיסון חזקה יותר - נוגדנים מהאם מגנים על התינוק",
  "הרכב מזון מושלם - כל הויטמינים והמינרלים הדרושים",
  "עיכול קל יותר - חלב אם קל יותר לעיכול מתחליף חלב", 
  "קשר רגשי - חיזוק הקשר בין האם לתינוק",
  "הגנה מפני זיהומים - פחות זיהומי אוזניים ודרכי נשימה",
  "הפחתת סיכון לאלרגיות ואסטמה בעתיד"
];

const breastfeedingOnDemandInfo = [
  {
    title: "ימים ראשונים",
    content: "תינוקות יונקים לעיתים קרובות, במיוחד בימים הראשונים, כדי לעודד את ייצור החלב אצל האם ולהבטיח שהם מקבלים מספיק קולוסטרום (חלב ראשוני עשיר בנוגדנים)."
  },
  {
    title: "הנקה על פי דרישה",
    content: "חשוב להניק לפי דרישת התינוק ולא לקבוע זמנים קבועים, במיוחד בשבועות הראשונים."
  },
  {
    title: "סימני רעב",
    content: "כדאי לשים לב לסימני רעב של התינוק, כמו פתיחת פה, מציצת אצבעות, או חיפוש אחר השד."
  },
  {
    title: "התפתחות",
    content: "עם הזמן, תינוקות מפתחים דפוסי הנקה קבועים יותר, ומרווחי הזמן בין הארוחות יכולים להתארך."
  },
  {
    title: "חלב אם",
    content: "חלב אם הוא קל לעיכול, ולכן תינוקות יונקים לעיתים קרובות. ככל שהתינוק יונק יותר, כך גוף האם מייצר יותר חלב."
  },
  {
    title: "הנקת מרתון",
    content: "בימים הראשונים, ייתכן שהתינוק ירצה לינוק ברציפות במשך זמן רב, מה שנקרא \"הנקת מרתון\". תופעה זו היא טבעית ועוזרת להגביר את ייצור החלב."
  },
  {
    title: "תמיכה מקצועית",
    content: "אם יש לך שאלות או חששות לגבי הנקה, מומלץ להתייעץ עם יועצת הנקה או איש מקצוע בתחום."
  }
];

const commonChallenges = [
  {
    challenge: "תחושת מחסור בחלב",
    solution: "הנקות תכופות, שתייה מרובה, מנוחה והזנה טובה של האם"
  },
  {
    challenge: "גודש בשד",
    solution: "הנקות תכופות, עיסוי קל, חום לפני הנקה וקור אחריה"
  },
  {
    challenge: "התינוק לא רוצה להיצמד",
    solution: "מגע עור אל עור, סבלנות, ניסוי עמדות הנקה שונות"
  }
];

const nutritionTips = [
  "שתו לפחות 8-10 כוסות מים ביום",
  "צרכו 300-500 קלוריות נוספות ביום",
  "הקפידו על צריכת חלבון (בשר, דגים, קטניות, ביצים)",
  "קחו תוסף של ויטמין D אם הרופא ממליץ",
  "הגבילו קפאין ל-2-3 כוסות ביום ורצוי לא סמוך להנקה",
  "הימנעו מאלכוהול או הגבילו למינימום"
];

export default function BreastfeedingGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{backgroundColor: 'var(--background-cream)'}}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Heart className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מדריך הנקה מקיף
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            כל מה שצריך לדעת על הנקה בלעדית בששת החודשים הראשונים
          </p>
        </div>

        {/* Benefits */}
        <Card className="card-base" style={{backgroundColor: 'var(--card-background-mint)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Heart className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              יתרונות ההנקה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {breastfeedingBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor: 'var(--primary-salmon)'}}></div>
                  <span className="text-sm" style={{color: "var(--text-main)"}}>{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Breastfeeding on Demand */}
        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Clock className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              הנקה על פי דרישה
            </CardTitle>
            <p className="text-sm font-light mt-2" style={{color: "var(--text-soft)"}}>
              תינוקות יונקים על פי דרישה, כלומר לפי הצורך והרצון שלהם, וזה בדרך כלל 8-12 פעמים ביממה בשבועות הראשונים לחייהם. ייתכן שהם ירצו לינוק כל שעה או שעתיים, במיוחד בימים הראשונים, ובהמשך יפתחו מרווחים ארוכים יותר בין הארוחות.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {breastfeedingOnDemandInfo.map((info, index) => (
                <div key={index} className="p-4 rounded-lg border" style={{backgroundColor: 'var(--secondary-yellow)', borderColor: 'var(--border-light)'}}>
                  <h4 className="font-bold text-lg mb-2" style={{color: 'var(--text-main)'}}>{info.title}</h4>
                  <p className="text-sm leading-relaxed" style={{color: 'var(--text-main)'}}>{info.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Challenges */}
        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <AlertCircle className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              אתגרים נפוצים ופתרונות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonChallenges.map((item, index) => (
                <div key={index} className="p-4 rounded-lg" style={{backgroundColor: 'var(--card-background-mint)'}}>
                  <h4 className="font-bold mb-2" style={{color: 'var(--primary-salmon)'}}>{item.challenge}</h4>
                  <p className="text-sm" style={{color: 'var(--text-main)'}}>{item.solution}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Tips */}
        <Card className="card-base" style={{backgroundColor: 'var(--secondary-yellow)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Droplets className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              תזונה לאם המיניקה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nutritionTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor: 'var(--primary-salmon)'}}></div>
                  <span style={{color: "var(--text-main)"}}>{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="card-base" style={{backgroundColor: 'var(--primary-salmon)'}}>
          <CardHeader>
            <CardTitle className="text-white">
              💡 זכרו: זה תהליך של למידה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 mb-4">
              הנקה היא מיומנות שנלמדת. אל תתייאשו אם זה לא זורם מהיום הראשון. 
              כל אם ותינוק צריכים זמן להכיר אחד את השני ולמצוא את הדרך שעובדת עבורם.
            </p>
            <p className="text-white/90">
              <strong>חשוב להיעזר ב:</strong> יועצת הנקה, רופא ילדים, אחות טיפת חלב או קבוצות תמיכה לאמהות.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-12">
          <Link to={createPageUrl("AgeGuide0to6")}>
            <Button variant="outline" className="secondary-cta">
              <ArrowLeft className="w-4 h-4 ml-2" />
              חזרה למדריך 0-6 חודשים
            </Button>
          </Link>
          
          <Link to={createPageUrl("FormulaFeedingGuide")}>
            <Button className="main-cta">
              הנושא הבא: תחליף חלב
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
