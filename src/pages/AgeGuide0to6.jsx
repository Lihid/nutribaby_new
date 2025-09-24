
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Heart, Shield, Brain, ClipboardList, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import AgeNavigation from '../components/guides/AgeNavigation';

const topics = [
  {
    title: "הנקה",
    description: "הכל על הנקה בלעדית בששת החודשים הראשונים - הנחיות, טיפים וחיזוק האם המיניקה",
    icon: Heart,
    bgColor: "var(--secondary-yellow)",
    url: createPageUrl("BreastfeedingGuide")
  },
  {
    title: "תחליף חלב (תמ״ל)",
    description: "מדריך מפורט להאכלה עם תמ״ל - בחירת התחליף הנכון, הכנה נכונה וטיפים חשובים",
    icon: Shield,
    bgColor: "var(--card-background-mint)",
    url: createPageUrl("FormulaFeedingGuide")
  },
  {
    title: "אבני דרך והתפתחות",
    description: "מעקב אחר התפתחות התינוק - גדילה פיזית, התפתחות מוטורית וסימני התפתחות תקינה",
    icon: Brain,
    bgColor: "var(--secondary-yellow)",
    url: createPageUrl("BabyDevelopmentGuide")
  },
  {
    title: "בטיחות ומניעת חנק",
    description: "מדריך בטיחות מקיף לתינוקות מלידה עד שנה - הנחיות בטרם והכנה לתחילת הטעימות",
    icon: Shield,
    bgColor: "var(--primary-salmon)",
    url: createPageUrl("BabySafetyGuide")
  }
];

export default function AgeGuide0to6() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Baby className="w-10 h-10" style={{color: 'var(--primary-salmon)'}}/>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מאמרים לגיל 0-6 חודשים
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            בניית הבסיס התזונתי וההתפתחותי - בחרו נושא למידע מפורט
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {topics.map((topic, index) => (
            <Link to={topic.url} key={index}>
              <Card className="card-base hover:shadow-xl transition-all duration-300 h-full" style={{backgroundColor: topic.bgColor}}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{backgroundColor: '#fda4af'}}>
                      <topic.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold mb-1" style={{color: topic.title.includes("בטיחות") ? 'white' : 'var(--text-main)'}}>
                        {topic.title}
                      </CardTitle>
                      <p className="text-sm font-light leading-relaxed" style={{color: topic.title.includes("בטיחות") ? 'white/90' : 'var(--text-soft)'}}>
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex items-center justify-end">
                    <div className="flex items-center gap-2 font-medium" style={{color: topic.title.includes("בטיחות") ? 'white' : 'var(--text-main)'}}>
                      <span>קראו עוד</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="card-base mt-8" style={{backgroundColor: 'var(--primary-salmon)'}}>
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                    <Sparkles className="w-6 h-6" />
                    <span>הכנה לשלב הבא: טעימות!</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-white/90 mb-4">
                  איזה כיף, בקרוב מתחילים טעימות! זה שלב ממש מרגש ומשמעותי. אפשר להתחיל להתכונן על ידי עיון בטעימות וללמוד על סימני מוכנות.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <Link to={createPageUrl("PreparationGuide")} className="flex-1">
                      <Button className="w-full bg-white hover:bg-white/90" style={{color: 'var(--primary-salmon)'}}>
                          <span>הכנה לטעימות</span>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                      </Button>
                  </Link>
                  <Link to={createPageUrl("FullTastingGuide")} className="flex-1">
                      <Button className="w-full bg-white/20 text-white hover:bg-white/30 border border-white/50">
                          <span>תפריט טעימות יומי</span>
                      </Button>
                  </Link>
                </div>
            </CardContent>
        </Card>

        <Card className="card-base mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3" style={{color: "var(--text-main)"}}>
              <ClipboardList className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              <span>כלים למעקב</span>
            </CardTitle>
            <p className="text-sm font-light" style={{color: "var(--text-soft)"}}>
              מעקב אחר האכלה ושינה חיוני בשלבים הראשונים להתפתחות תקינה.
            </p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Link to={createPageUrl("FeedingLog")}>
              <Button className="w-full h-auto py-4 flex items-center justify-center gap-3 shadow-md main-cta">
                  <span>רישום יומי</span>
                  <ClipboardList className="w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl("BabyProfile")}>
              <Button className="w-full h-auto py-4 flex items-center justify-center gap-3 shadow-md secondary-cta">
                <span>פרופיל התינוק</span>
                <Baby className="w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <AgeNavigation />

        <div className="text-center mt-12">
            <Link to={createPageUrl("Dashboard")}>
                <Button variant="ghost" style={{color: 'var(--primary-salmon)'}}>
                    <ArrowLeft className="w-4 h-4 ml-2" />
                    חזרה למסך הראשי
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
