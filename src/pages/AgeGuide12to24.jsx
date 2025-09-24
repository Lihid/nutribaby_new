
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Baby as BabyIcon, ArrowLeft, ChefHat, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AgeNavigation from '../components/guides/AgeNavigation';

const topics = [
  {
    title: "שילוב ארוחות משפחתיות",
    description: "איך להתחיל לשלב את התינוק בארוחות של כולם",
    icon: Utensils,
    bgColor: "var(--card-background-mint)",
    url: createPageUrl("FamilyMealsGuide")
  },
  {
    title: "שילוב ילדים במטבח",
    description: "מגדל למידה, כלים מתאימים ופעילויות בטוחות לגיל",
    icon: ChefHat,
    bgColor: "var(--secondary-yellow)",
    url: createPageUrl("KitchenInvolvementGuide")
  },
  {
    title: "בטיחות ומניעת חנק",
    description: "מדריך בטיחות מקיף לפי הנחיות בטרם - מותאם לגיל 12-24 חודשים",
    icon: Shield,
    bgColor: "var(--primary-salmon)",
    url: createPageUrl("ChokePreventionGuide")
  }
];

export default function AgeGuide12to24() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Utensils className="w-10 h-10" style={{color: 'var(--primary-salmon)'}}/>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{color: "var(--text-main)"}}>
            מאמרים לגיל 12-24 חודשים
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>
            ארוחות משפחתיות, עצמאות במטבח ומה שביניהם
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <Link to={topic.url} key={index}>
              <Card className="card-base hover:shadow-xl transition-all duration-300 h-full flex flex-col" style={{backgroundColor: topic.bgColor}}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{backgroundColor: '#fda4af'}}>
                      <topic.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold mb-1" style={{color: 'var(--text-main)'}}>
                        {topic.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow flex flex-col justify-between">
                   <p className="text-sm font-light leading-relaxed mb-4" style={{color: 'var(--text-soft)'}}>
                    {topic.description}
                  </p>
                  <div className="flex items-center justify-end">
                    <div className="flex items-center gap-2 font-medium" style={{color: 'var(--text-main)'}}>
                      <span>קראו עוד</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <AgeNavigation />

        <div className="text-center mt-12">
            <Link to={createPageUrl("Dashboard")}>
                 <Button variant="ghost" style={{color: 'var(--primary-salmon)'}}>
                    <ArrowLeft className="w-4 h-4 ml-2" />
                    חזרה לעמוד הראשי
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
