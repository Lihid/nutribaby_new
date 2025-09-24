import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, CheckCircle, PartyPopper, Rocket } from 'lucide-react';
import { differenceInDays, addDays, format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { quantityData } from '../guides/quantityData';

export default function DailyTastingRecommendation({ baby, allGuideDays }) {
  if (!baby || !baby.tasting_guide_start_date || !allGuideDays || allGuideDays.length === 0) {
    return null;
  }

  const startDate = new Date(baby.tasting_guide_start_date);
  const completedDays = baby.completed_tasting_days || [];

  // Find the first uncompleted day
  let recommendedDay = null;
  for (let i = 1; i <= allGuideDays.length; i++) {
    if (!completedDays.includes(i)) {
      const dayData = allGuideDays.find((d) => d.day_number === i);
      if (dayData) {
        recommendedDay = dayData;
        break;
      }
    }
  }

  if (!recommendedDay) {
    // All days are completed
    return (
      <Card className="card-base" style={{ backgroundColor: 'var(--secondary-yellow)' }}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <PartyPopper className="w-6 h-6" style={{ color: 'var(--primary-salmon)' }} />
                        כל הכבוד!
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="soft-text mb-4">סיימתם את מדריך הטעימות המלא! אתם מוזמנים להמשיך ולגוון עם מתכונים חדשים.</p>
                    <Link to={createPageUrl("MealPlanner")}>
                        <Button className="main-cta w-full">לעמוד המתכונים</Button>
                    </Link>
                </CardContent>
            </Card>);

  }

  const override = quantityData[recommendedDay.day_number];
  const displayTitle = override?.title || recommendedDay.title;
  const displayDetails = override?.amount || recommendedDay.details;

  return (
    <div className="card-base p-6" style={{ backgroundColor: 'var(--card-background-mint)' }}>
            <h2 className="text-2xl mb-4 text-base font-medium flex items-center gap-2">
                <Rocket className="w-6 h-6" style={{ color: "var(--primary-salmon)" }} />
                ההמלצה היומית למסע הטעימות
            </h2>
            <Link to={createPageUrl("FullTastingGuide")}>
                <div className="p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow border bg-white" style={{borderColor: 'var(--border-light)'}}>
                    <div className="flex items-center justify-between">
                         <div className="flex items-start gap-4">
                            <span className="text-5xl text-lg">{recommendedDay.icon}</span>
                            <div>
                                <p className="font-light text-sm opacity-90 soft-text">יום {recommendedDay.day_number} במדריך</p>
                                <h3 className="text-base font-bold" style={{color: 'var(--text-main)'}}>{displayTitle}</h3>
                                <p className="font-light text-sm opacity-90 soft-text">{displayDetails}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-base font-semibold">
                            <ArrowLeft className="w-8 h-8" style={{color: 'var(--primary-salmon)'}}/>
                            <span className="text-xs" style={{color: 'var(--primary-salmon)'}}>למדריך המלא</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>);

}