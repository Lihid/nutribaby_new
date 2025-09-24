
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Droplets, CupSoda } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import WaterGuideArticle from '../components/articles/WaterGuideArticle';

export default function WaterGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Droplets className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מדריך שתיית מים
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            כל מה שצריך לדעת על מים לתינוקות - מתי, איך וכמה
          </p>
        </div>

        <WaterGuideArticle />

        <Card className="card-base mt-8" style={{backgroundColor: 'var(--card-background-mint)'}}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{color: 'var(--text-main)'}}>
                    <CupSoda className="w-6 h-6" style={{color: 'var(--primary-salmon)'}} />
                    רוצים ללמד את התינוק לשתות מקשית?
                </CardTitle>
                <p className="text-sm soft-text">שתייה מקש מפתחת את שרירי הפה ועוזרת במעבר לכוס רגילה. יש לנו מדריך שיעזור לכם!</p>
            </CardHeader>
            <CardContent>
                <Link to={createPageUrl("StrawDrinkingGuide")}>
                    <Button className="main-cta w-full md:w-auto">
                        למדריך המלא: לימוד שתייה מקשית
                        <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
        
        <div className="flex justify-between items-center mt-12">
          <Link to={createPageUrl("FirstTastingGuide")}>
            <Button variant="outline" className="secondary-cta">
              <ArrowLeft className="w-4 h-4 ml-2" />
              הנושא הקודם: מדריך טעימות
            </Button>
          </Link>
          
          <Link to={createPageUrl("TextureGuide")}>
            <Button className="main-cta">
              הנושא הבא: מדריך המרקמים השלם
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
