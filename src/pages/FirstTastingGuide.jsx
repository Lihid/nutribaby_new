
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TastingGuideArticle from '../components/articles/TastingGuideArticle';

export default function FirstTastingGuide() {
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
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מדריך הטעימות הראשונות
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            הכל על התחלת מזון מוצק - מתי, איך ועם מה להתחיל
          </p>
        </div>

        <TastingGuideArticle />
        
        <div className="flex justify-between items-center mt-12">
          <Link to={createPageUrl("AgeGuide6to9")}>
            <Button variant="outline" className="secondary-cta">
              <ArrowLeft className="w-4 h-4 ml-2" />
              חזרה למדריך 6-9 חודשים
            </Button>
          </Link>
          
          <Link to={createPageUrl("WaterGuide")}>
            <Button className="main-cta">
              הנושא הבא: מדריך שתיית מים
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
