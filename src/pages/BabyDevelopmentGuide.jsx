import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Scale, Eye, Hand, Heart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const developmentAreas = [
  {
    title: "גדילה פיזית",
    icon: Scale,
    milestones: [
      "עלייה יציבה במשקל - כפילות משקל הלידה סביב 4-6 חודשים",
      "גדילה בגובה - כ-25 ס״מ בשנה הראשונה", 
      "התפתחות היקף הראש - מעידה על התפתחות תקינה של המוח"
    ]
  },
  {
    title: "התפתחות מוטורית",
    icon: Hand,
    milestones: [
      "שליטה בראש - החזקת ראש יציב במהלך החודשים הראשונים",
      "התהפכות - מבטן לגב ולהיפך (בדרך כלל 4-6 חודשים)",
      "ישיבה עם תמיכה - התחזקות שרירי הגב (סביב 6 חודשים)",
      "אחיזה - מעבר מרפלקס אחיזה לאחיזה מכוונת"
    ]
  },
  {
    title: "התפתחות חושים",
    icon: Eye,
    milestones: [
      "ראייה - מראייה מטושטשת לראייה ברורה יותר",
      "שמיעה - תגובה לקולות והכרת קולות מוכרים",
      "מגע - רגישות מפותחת למגע ולטמפרטורות",
      "עקיבה אחר עצמים - התפתחות תיאום עין-יד"
    ]
  },
  {
    title: "התפתחות חברתית-רגשית",
    icon: Heart,
    milestones: [
      "חיוכים חברתיים - תגובה לפנים מוכרות",
      "תקשורת קולית - צלילים, גיחוך וניסיונות 'שיחה'",
      "זיהוי אנשים קרובים - העדפה למטפלים הקרובים",
      "ביטוי רגשות - דרכים שונות להביע צרכים ורצונות"
    ]
  }
];

const nutritionGrowth = [
  {
    aspect: "משקל",
    details: "תינוקות מאבדים עד 10% ממשקל הלידה בימים הראשונים, אך חוזרים למשקל הלידה עד גיל 2-3 שבועות"
  },
  {
    aspect: "היקף ראש",
    details: "גדל כ-2 ס״מ בחודש בחודשים הראשונים - מעיד על התפתחות תקינה של המוח"
  },
  {
    aspect: "אורך",
    details: "גדל כ-2.5 ס״מ בחודש בממוצע במהלך השנה הראשונה"
  }
];

const stimulationTips = [
  {
    category: "עידוד פיזי",
    tips: [
      "זמן בטן מפוקח - חיזוק שרירי הצוואר והגב",
      "עיסוי עדין לידיים ולרגליים",
      "תנועות רכות של הזרועות והרגליים במהלך החתלה"
    ]
  },
  {
    category: "עידוד חושי",
    tips: [
      "דיבור ושירה לתינוק - פיתוח שמיעה ושפה",
      "הצגת צעצועים צבעוניים וחפצים בטוחים",
      "מוזיקה רכה ונעימה - גירוי חושי מתון"
    ]
  }
];

export default function BabyDevelopmentGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{backgroundColor: 'var(--background-cream)'}}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Brain className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מדריך התפתחות התינוק
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            אבני דרך בהתפתחות בגילאי 0-6 חודשים
          </p>
        </div>

        {/* Growth & Nutrition Connection */}
        <Card className="card-base" style={{backgroundColor: 'var(--card-background-mint)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <TrendingUp className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              גדילה ותזונה - הקשר החשוב
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4" style={{color: "var(--text-main)"}}>
              גדילה תקינה היא אחד הסימנים החשובים ביותר לכך שהתינוק מקבל תזונה מספקת ומתפתח כהלכה.
            </p>
            <div className="space-y-3">
              {nutritionGrowth.map((item, index) => (
                <div key={index} className="p-3 rounded-lg bg-white border" style={{borderColor: 'var(--border-light)'}}>
                  <h4 className="font-bold mb-1" style={{color: 'var(--primary-salmon)'}}>{item.aspect}</h4>
                  <p className="text-sm" style={{color: 'var(--text-main)'}}>{item.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Development Milestones */}
        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Brain className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              תחומי התפתחות עיקריים (0-6 חודשים)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {developmentAreas.map((area, index) => (
                <div key={index} className="border rounded-lg p-4" style={{backgroundColor: 'var(--secondary-yellow)', borderColor: 'var(--border-light)'}}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-3" style={{color: 'var(--primary-salmon)'}}>
                    <area.icon className="w-6 h-6" />
                    {area.title}
                  </h3>
                  
                  <ul className="space-y-2">
                    {area.milestones.map((milestone, idx) => (
                      <li key={idx} className="flex items-start gap-3" style={{color: 'var(--text-main)'}}>
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{backgroundColor: 'var(--primary-salmon)'}}></span>
                        <span className="text-sm">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stimulation Tips */}
        <Card className="card-base" style={{backgroundColor: 'var(--secondary-yellow)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              ✨ איך לעודד התפתחות בריאה?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {stimulationTips.map((category, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-2" style={{color: 'var(--primary-salmon)'}}>{category.category}</h4>
                  <ul className="text-sm space-y-2" style={{color: 'var(--text-main)'}}>
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Note */}
        <Card className="card-base" style={{backgroundColor: 'var(--primary-salmon)'}}>
          <CardHeader>
            <CardTitle className="text-white">
              💡 חשוב לזכור
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white/90 space-y-2">
              <p>כל תינוק מתפתח בקצב שלו - אין לחץ להשיג כל אבן דרך בזמן מדויק.</p>
              <p>מעקב סדיר אצל טיפת חלב ורופא ילדים יבטיח התפתחות תקינה.</p>
              <p>חשוב להתייעץ עם איש מקצוע אם יש שאלות או חששות לגבי ההתפתחות.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-12">
          <Link to={createPageUrl("FormulaFeedingGuide")}>
            <Button variant="outline" className="secondary-cta">
              <ArrowLeft className="w-4 h-4 ml-2" />
              הנושא הקודם: תחליף חלב
            </Button>
          </Link>
          
          <Link to={createPageUrl("AgeGuide0to6")}>
            <Button className="main-cta">
              חזרה למדריך 0-6 חודשים
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}