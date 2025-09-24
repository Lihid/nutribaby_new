
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TastingTracker from '../components/tasting/TastingTracker';

export default function TastingTrackerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Target className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מעקב וניהול טעימות
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            כלים לתיעוד חשיפה לאלרגנים ומעקב אחר מזונות שנוטעמו
          </p>
        </div>

        <TastingTracker />
        
        <div className="flex justify-between items-center mt-12">
          <Link to={createPageUrl("TextureGuide")}>
            <Button variant="outline" className="secondary-cta">
              <ArrowLeft className="w-4 h-4 ml-2" />
              הנושא הקודם: מדריך המרקמים השלם
            </Button>
          </Link>
          
          <Link to={createPageUrl("FingerFoodsGuide")}>
            <Button className="main-cta">
              הנושא הבא: מזון אצבעות
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>

        {/* New link for Water Drinking Guide */}
        <div className="text-center mt-8">
          <Link to={createPageUrl("WaterDrinkingGuide")}>
            <Button variant="outline" className="secondary-cta">
              מדריך שתיית מים
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
