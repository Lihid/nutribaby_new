import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, ShoppingCart, Sparkles } from 'lucide-react';

const readinessSigns = [
  "התעניינות במזון כאשר אתם אוכלים בסביבתו",
  "ישיבה עם תמיכה",
  "יציבות של הראש",
  "הכנסת ידיים וחפצים לפה",
  "רפלקס הוצאת הלשון נעלם או פוחת משמעותית"
];

const shoppingList = [
    "כסא אוכל בטיחותי עם תמיכה טובה",
    "סינרים (רצוי סינר עם כיס לאיסוף שאריות)",
    "כפיות סיליקון רכות ועדינות לחניכיים",
    "קעריות נצמדות לשולחן (עם וואקום) למניעת החלקות",
    "כוס אימון קטנה או כוס פתוחה קטנה למים"
];

export default function PreparationGuideArticle() {
  return (
    <Card className="card-base shadow-lg my-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Sparkles className="w-7 h-7" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <div>
            <CardTitle className="text-2xl" style={{color: 'var(--text-main)'}}>מתרגשים? מתחילים! ✨</CardTitle>
            <p className="soft-text font-light">כל מה שצריך לדעת כדי להתכונן לשלב הטעימות</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 text-base font-light leading-relaxed" style={{color: 'var(--text-main)'}}>
        <p>
            איזה כיף שבקרוב הקטנים שלכם יתחילו לאכול מוצקים. זהו שלב מאוד מרגש וחוויתי עבורכן ועבורם. 
            כדי להפוך את החוויה לחלקה ונעימה, אפשר להתחיל להתכונן מראש.
        </p>

        <div className="p-4 rounded-xl" style={{backgroundColor: 'var(--card-background-mint)'}}>
          <h4 className="font-semibold mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
            <CheckSquare className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
            סימני מוכנות שכדאי להכיר
          </h4>
          <p className='soft-text mb-3 text-sm'>
            ההמלצה היא להתחיל טעימות סביב גיל 6 חודשים ורק כאשר התינוק מראה את סימני המוכנות הבאים:
          </p>
          <ul className="space-y-2 pr-5">
            {readinessSigns.map((sign, index) => (
              <li key={index} className="flex items-start gap-3 soft-text">
                <span className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0" style={{backgroundColor: 'var(--primary-salmon)'}}></span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
              <ShoppingCart className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
              ציוד מומלץ (אבל לא חובה!)
            </h4>
            <p className='soft-text mb-3 text-sm'>
                רכישת ציוד מתאים יכולה להקל על התהליך ולהפוך אותו לנוח יותר:
            </p>
            <ul className="space-y-2 pr-5">
            {shoppingList.map((item, index) => (
              <li key={index} className="flex items-start gap-3 soft-text">
                <span className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0" style={{backgroundColor: 'var(--primary-salmon)'}}></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center pt-4">
          <p className="font-medium text-lg" style={{color: 'var(--text-main)'}}>
            הכי חשוב זה להגיע לשלב הזה בגישה חיובית ורגועה. שיהיה בתיאבון! ❤️
          </p>
        </div>
      </CardContent>
    </Card>
  );
}