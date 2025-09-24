
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby as BabyIcon, ChefHat, Calendar, ArrowLeft, Eye, Utensils, Target, BookOpen, Droplets, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AgeNavigation from '../components/guides/AgeNavigation';

const topics = [
  {
    title: "תפריט טעימות יומי (8 שבועות)",
    description: "תוכנית מפורטת יום-אחר-יום למסע הטעימות השלם",
    icon: Calendar,
    bgColor: "#fef2f2",
    url: createPageUrl("FullTastingGuide")
  },
  {
    title: "הטעימות הראשונות",
    description: "הכל על התחלת מזון מוצק - מתי, איך ועם מה להתחיל",
    icon: ChefHat,
    bgColor: "var(--secondary-yellow)",
    url: createPageUrl("FirstTastingGuide")
  },
  {
    title: "מדריך איידוי מזון",
    description: "הדרך הטובה ביותר להכין ירקות ופירות בריאים ומזינים",
    icon: Utensils,
    bgColor: "var(--card-background-mint)",
    url: createPageUrl("SteamingGuide")
  },
  {
    title: "שתיית מים",
    description: "כל מה שצריך לדעת על מים לתינוקות - מתי, איך וכמה",
    icon: Droplets,
    bgColor: "var(--card-background-mint)",
    url: createPageUrl("WaterGuide")
  },
  {
    title: "המעבר בין מרקמים",
    description: "מטחון חלק לחתיכות רכות - המדריך המלא למעבר הדרגתי",
    icon: Utensils,
    bgColor: "var(--secondary-yellow)",
    url: createPageUrl("TextureGuide")
  },
  {
    title: "מעקב וניהול טעימות",
    description: "כלים לתיעוד חשיפה לאלרגנים ומעקב אחר מזונות שנוטעמו",
    icon: Target,
    bgColor: "var(--card-background-mint)",
    url: createPageUrl("TastingTrackerPage")
  },
  {
    title: "בטיחות ומניעת חנק",
    description: "מדריך בטיחות מקיף לפי הנחיות בטרם - חיתוך נכון והגשה בטוחה",
    icon: Shield,
    bgColor: "#fef2f2",
    url: createPageUrl("ChokePreventionGuide")
  }
];

export default function AgeGuide6to9() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <ChefHat className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מאמרים לגיל 6-9 חודשים
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            הרפתקת הטעימות הראשונות - בחרו נושא למידע מפורט
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {topics.map((topic, index) => {
            const isLightPinkCard = topic.bgColor === '#fef2f2'; // This variable is now unused for the icon background but remains for card background logic if needed elsewhere
            return (
              <Link to={topic.url} key={index}>
                <Card className="card-base hover:shadow-xl transition-all duration-300 h-full" style={{backgroundColor: topic.bgColor}}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{backgroundColor: '#fda4af'}}>
                        <topic.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold mb-1" style={{color: 'var(--text-main)'}}>
                          {topic.title}
                        </CardTitle>
                        <p className="text-sm font-light leading-relaxed" style={{color: 'var(--text-soft)'}}>
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center justify-end">
                      <div className="flex items-center gap-2 font-medium" style={{color: 'var(--text-main)'}}>
                        <span>קראו עוד</span>
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Calendar className="w-5 h-5" style={{color: "var(--primary-salmon)"}} />
              כלים למעקב מתקדם
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Link to={createPageUrl("TastingTrackerPage")}>
              <Button 
                className="w-full hover:bg-pink-50 h-auto py-3 shadow-md border"
                style={{backgroundColor: '#fef2f2', borderColor: 'var(--border-light)'}}
              >
                <div className="flex flex-col items-start">
                    <span className="font-semibold text-lg" style={{color: 'var(--text-main)'}}>מעקב חשיפה לאלרגנים</span>
                    <span className="font-light text-sm" style={{color: 'var(--text-soft)'}}>תעדו כל חשיפה ועקבו אחר תגובות</span>
                </div>
                <ArrowLeft className="w-5 h-5 mr-auto" style={{color: 'var(--text-main)'}} />
              </Button>
            </Link>
            <Link to={createPageUrl("BabyProfile")}>
              <Button className="w-full secondary-cta hover:opacity-90 h-auto py-3">
                <div className="flex flex-col items-start">
                    <span className="font-semibold text-lg">מעקב מזונות כללי</span>
                    <span className="font-light text-sm">ודאו גיוון תזונתי וזכרו מה התינוק אוהב</span>
                </div>
                <ArrowLeft className="w-5 h-5 mr-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <AgeNavigation />

        <div className="text-center mt-12">
            <Link to={createPageUrl("Dashboard")}>
                <Button variant="outline" style={{borderColor: 'var(--border-light)', color: 'var(--primary-salmon)'}}>
                    <ArrowLeft className="w-4 h-4 ml-2" />
                    חזרה לעמוד הראשי
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
