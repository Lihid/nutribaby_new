
import React, { useState, useEffect, useCallback } from 'react';
import { Baby, TastingGuideDay, User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { quantityData, weekData } from '../components/guides/quantityData';

export default function FullTastingGuide() {
    const [guideDays, setGuideDays] = useState([]);
    const [baby, setBaby] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const currentUser = await User.me();
            const babies = await Baby.filter({ created_by: currentUser.email });
            if (babies.length > 0) {
                setBaby(babies[0]);
            }
            const allDays = await TastingGuideDay.list('day_number', 100);
            setGuideDays(allDays);
        } catch (error) {
            console.error("Error loading data:", error);
        }
        setLoading(false);
    }, []);
    
    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleStartGuide = async () => {
        if (!baby) return;
        setUpdating(true);
        try {
            const updatedBaby = await Baby.update(baby.id, { 
                tasting_guide_start_date: format(new Date(), 'yyyy-MM-dd'),
                completed_tasting_days: [] 
            });
            setBaby(updatedBaby);
        } catch (error) {
            console.error("Error starting guide:", error);
        }
        setUpdating(false);
    };

    const handleToggleDay = async (dayNumber) => {
        if (!baby) return;
        const currentCompleted = baby.completed_tasting_days || [];
        const newCompleted = currentCompleted.includes(dayNumber)
            ? currentCompleted.filter(d => d !== dayNumber)
            : [...currentCompleted, dayNumber];
        
        try {
            const updatedBaby = await Baby.update(baby.id, { completed_tasting_days: newCompleted });
            setBaby(updatedBaby);
        } catch (error) {
            console.error("Error updating completed days:", error);
        }
    };

    const groupedByWeek = guideDays.reduce((acc, day) => {
        (acc[day.week] = acc[day.week] || []).push(day);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-[var(--primary-salmon)]" />
            </div>
        );
    }
    
    if (!baby) {
        return (
            <div className="p-4 md:p-8 text-center min-h-screen flex flex-col items-center justify-center" style={{backgroundColor: 'var(--card-background-mint)'}}>
                <Card className="card-base max-w-lg p-8">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold mb-4">🍼 יצירת פרופיל תינוק</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="soft-text mb-6">
                            כדי להתחיל את מסע הטעימות, יש ליצור תחילה פרופיל לתינוק/ת שלך.
                        </p>
                        <Link to={createPageUrl("BabyProfile")}>
                            <Button className="main-cta w-full text-lg py-6">
                                ליצירת פרופיל
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!baby?.tasting_guide_start_date) {
        return (
            <div className="p-4 md:p-8 text-center min-h-screen flex flex-col items-center justify-center" style={{backgroundColor: 'var(--card-background-mint)'}}>
                <Card className="card-base max-w-lg p-8">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold mb-4">🍼 ברוכים הבאים למדריך הטעימות!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="soft-text mb-6">
                            המדריך ילווה אתכם שלב-אחר-שלב, יום-אחר-יום, במסע הטעימות המרגש. הוא כולל חשיפה הדרגתית לכל קבוצות המזון והאלרגנים, בהתאם להנחיות משרד הבריאות.
                        </p>
                        <Button onClick={handleStartGuide} disabled={updating} className="main-cta w-full text-lg py-6">
                            {updating ? <Loader2 className="w-6 h-6 animate-spin" /> : "בואו נתחיל את המסע!"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8" style={{backgroundColor: 'var(--background-cream)'}}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)"}}>🍼 תפריט טעימות יומי</h1>
                    <p className="text-lg font-light" style={{color: "var(--text-soft)"}}>שבועות 1-8: התחלה, חשיפה לאלרגנים וגיוון</p>
                </div>

                <div className="space-y-12">
                    {Object.entries(groupedByWeek).map(([week, days]) => (
                        <div key={week}>
                            <h2 className="text-2xl font-semibold mb-1" style={{borderColor: 'var(--primary-salmon)', color: 'var(--text-main)'}}>
                                {weekData[week]?.description.split('|')[0]}
                            </h2>
                            <p className="text-md soft-text mb-4 pb-2 border-b-2" style={{borderColor: 'var(--border-light)'}}>
                                {weekData[week]?.description.split('|')[1]}
                            </p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {days.map(day => {
                                    const override = quantityData[day.day_number];
                                    const displayTitle = override?.title || day.title;
                                    const displayDetails = override?.amount || day.details;

                                    return (
                                        <Card key={day.id} className="card-base hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-3">
                                                    <span className="text-3xl">{day.icon}</span>
                                                    <div>
                                                        <span className="text-sm font-medium soft-text">יום {day.day_number}</span>
                                                        <h3 className="text-lg font-semibold">{displayTitle}</h3>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="soft-text text-sm mb-4">{displayDetails}</p>
                                                <div 
                                                    className="flex items-center gap-2 p-3 rounded-lg cursor-pointer" 
                                                    style={{backgroundColor: 'var(--card-background-mint)'}}
                                                    onClick={() => handleToggleDay(day.day_number)}
                                                >
                                                    <Checkbox
                                                        id={`day-${day.day_number}`}
                                                        checked={baby?.completed_tasting_days?.includes(day.day_number)}
                                                        className="border-[var(--primary-salmon)] data-[state=checked]:bg-[var(--primary-salmon)]"
                                                    />
                                                    <Label htmlFor={`day-${day.day_number}`} className="cursor-pointer">
                                                        סימון כהושלם
                                                    </Label>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
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
