
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Utensils, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TextureTransitionArticle from '../components/articles/TextureTransitionArticle';

export default function TextureGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Utensils className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מדריך המרקמים השלם
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            מטחון חלק ועד חתיכות בטוחות - כל מה שצריך לדעת
          </p>
        </div>

        {/* Content from TextureTransitionArticle */}
        <TextureTransitionArticle />

        {/* Content from TextureGuideByAge */}
        <Card className="card-base shadow-lg mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
              <Eye className="w-6 h-6" style={{color: 'var(--primary-salmon)'}} />
              מדריך הגשת מזון ויזואלי לפי גיל
            </CardTitle>
            <p className="text-sm" style={{color: "var(--text-soft)"}}>
              כיצד להגיש מזונות נפוצים בצורה בטוחה לפי שלבי ההתפתחות של התינוק
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/bd6aca5d7_1F6F1BB2-5C86-4B77-A865-9C3ACFB0A132.png" 
              alt="מדריך הגשת מזון לפי גיל" 
              className="rounded-lg w-full border" style={{borderColor: 'var(--border-light)'}}
            />
          </CardContent>
        </Card>

        <Card className="card-base shadow-lg" style={{backgroundColor: 'var(--card-background-mint)'}}>
          <CardHeader>
            <CardTitle style={{color: "var(--text-main)"}}>עקרונות חשובים לזכור</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
              <h4 className="font-semibold mb-2" style={{color: "var(--text-main)"}}>⚠️ בטיחות תמיד קודמת</h4>
              <ul className="text-sm space-y-1" style={{color: "var(--text-soft)"}}>
                <li>• וודאו שהמזון רך מספיק להימעך בין שתי אצבעות</li>
                <li>• הימנעו ממזונות קשים, עגולים או דביקים</li>
                <li>• השגיחו תמיד על התינוק בזמן האכילה</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
              <h4 className="font-semibold mb-2" style={{color: "var(--text-main)"}}>🎯 התאמה אישית</h4>
              <ul className="text-sm space-y-1" style={{color: "var(--text-soft)"}}>
                <li>• כל תינוק מתפתח בקצב שלו</li>
                <li>• התבססו על מיומנויות ולא רק על גיל</li>
                <li>• התייעצו עם דיאטנית קלינית בספק</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12">
          <Link to={createPageUrl("WaterGuide")}>
            <Button variant="outline" className="w-full md:w-auto secondary-cta">
              <ArrowLeft className="w-4 h-4 ml-2" />
              הנושא הקודם: מדריך שתיית מים
            </Button>
          </Link>
          
          <Link to={createPageUrl("TastingTrackerPage")}>
            <Button className="w-full md:w-auto main-cta">
              הנושא הבא: מעקב טעימות
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link to={createPageUrl("AgeGuide6to9")}>
            <Button variant="ghost" style={{color: 'var(--primary-salmon)'}}>
              חזרה למדריך 6-9 חודשים
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
