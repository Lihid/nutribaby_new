
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PreparationGuideArticle from '../components/articles/PreparationGuideArticle';

export default function PreparationGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Sparkles className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            הכנה לקראת טעימות
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            כל מה שצריך כדי להתחיל את הרפתקאת הטעימות ברגל ימין
          </p>
        </div>

        <PreparationGuideArticle />
        
        <div className="text-center mt-12">
            <Link to={createPageUrl("AgeGuide0to6")}>
                <Button variant="ghost" style={{color: 'var(--primary-salmon)'}}>
                    <ArrowLeft className="w-4 h-4 ml-2" />
                    חזרה למדריך 0-6 חודשים
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
