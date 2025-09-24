import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Utensils, Heart, Shield, Baby, Star } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { DailyTip } from '@/api/entities';

export default function DailyInsights({ userLanguage, babyAgeInMonths }) {
  const { t, dir, align } = useTranslation(userLanguage);
  const [dailyTip, setDailyTip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyTip();
  }, [babyAgeInMonths, userLanguage]);

  const loadDailyTip = async () => {
    try {
      console.log('Loading daily tips...');
      // Load all published tips
      const tips = await DailyTip.filter({ published: true });
      console.log('Loaded tips:', tips.length);
      
      if (tips.length === 0) {
        console.log('No tips found in database, using fallback');
        // Fallback to default tips if no tips in database
        setDailyTip(getDefaultTip());
        setLoading(false);
        return;
      }

      // Filter tips by baby's age range if age is available
      let suitableTips = tips;
      if (babyAgeInMonths !== null && babyAgeInMonths !== undefined) {
        const currentAgeRange = babyAgeInMonths < 6 ? '0-6months' :
                               babyAgeInMonths < 9 ? '6-9months' :
                               babyAgeInMonths < 12 ? '9-12months' : '12-24months';
        
        console.log('Baby age:', babyAgeInMonths, 'Age range:', currentAgeRange);
        
        const ageFilteredTips = tips.filter(tip => 
          tip.age_ranges && tip.age_ranges.includes(currentAgeRange)
        );
        
        console.log('Age filtered tips:', ageFilteredTips.length);
        
        // Use age-filtered tips if available, otherwise use all tips
        suitableTips = ageFilteredTips.length > 0 ? ageFilteredTips : tips;
      }

      console.log('Suitable tips:', suitableTips.length);

      // Select random tip with daily seed (changes once per day)
      const today = new Date().toDateString();
      const seed = hashString(today);
      const randomIndex = seed % suitableTips.length;
      const selectedTip = suitableTips[randomIndex];

      console.log('Selected tip:', selectedTip);

      setDailyTip({
        text: userLanguage === 'en' ? selectedTip.tip_text_en : selectedTip.tip_text_he,
        icon: getIconComponent(selectedTip.icon),
        category: selectedTip.category
      });

    } catch (error) {
      console.error('Error loading daily tip:', error);
      // Fallback to default tip on error
      setDailyTip(getDefaultTip());
    }
    setLoading(false);
  };

  // Simple hash function to convert string to number (for consistent daily selection)
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const getIconComponent = (iconName) => {
    const icons = {
      'Lightbulb': Lightbulb,
      'Utensils': Utensils,
      'Heart': Heart,
      'Shield': Shield,
      'Baby': Baby,
      'Star': Star
    };
    return icons[iconName] || Lightbulb;
  };

  const getDefaultTip = () => {
    const defaultTips = [
      { 
        text: userLanguage === 'en' 
          ? "Did you know? Early exposure to various tastes and textures can reduce picky eating in the future." 
          : "ידעת? חשיפה למגוון טעמים ומרקמים בגיל צעיר יכולה להפחית בררנות אכילה בעתיד.", 
        icon: Lightbulb,
        category: 'nutrition'
      },
      { 
        text: userLanguage === 'en'
          ? "Finger foods are an excellent way to develop fine motor skills and hand-eye coordination."
          : "מזון אצבעות הוא דרך מצוינת לפתח מיומנויות מוטוריקה עדינה ותיאום עין-יד.", 
        icon: Utensils,
        category: 'development'
      },
    ];
    
    return defaultTips[Math.floor(Math.random() * defaultTips.length)];
  };

  if (loading) {
    return (
      <Card className="card-base" style={{backgroundColor: '#fef2f2', direction: dir}}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)", textAlign: align}}>
            <Lightbulb className="w-5 h-5" style={{color: "var(--primary-salmon)"}} />
            {t('daily_tip')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-base" style={{backgroundColor: '#fef2f2', direction: dir}}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)", textAlign: align}}>
          <Lightbulb className="w-5 h-5" style={{color: "var(--primary-salmon)"}} />
          {t('daily_tip')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-base font-light leading-relaxed" style={{color: "var(--text-soft)", textAlign: align}}>
              {dailyTip?.text || 'טוען טיפ יומי...'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}