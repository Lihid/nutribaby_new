import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StrawDrinkingGuideArticle from '../components/articles/StrawDrinkingGuideArticle';

export default function StrawDrinkingGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Rocket className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מדריך: איך ללמד תינוק לשתות מקשית
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            הדרך הקלה והיעילה ללמד את הקטנטנים מיומנות חשובה
          </p>
        </div>

        <StrawDrinkingGuideArticle />
        
        <div className="text-center mt-8">
          <Link to={createPageUrl("WaterGuide")}>
            <Button variant="ghost" style={{color: 'var(--primary-salmon)'}}>
              חזרה למדריך שתיית מים
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}