
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Check, AlertTriangle, CupSoda } from 'lucide-react';

const howToOffer = [
  "הדרך המומלצת ביותר היא בכוס פתוחה כדי לפתח את שרירי הפה.",
  "אפשרות טובה נוספת היא כוס עם קש.",
  "אפשרות נוספת היא בקבוק מים עם ידיות אחיזה (בקבוק אימון).",
  "הימנעו מהגשת מים בבקבוק עם פטמת סיליקון, כדי לא ליצור בלבול עם האכלה."
];

export default function WaterGuideArticle() {
  return (
    <Card className="card-base shadow-xl my-8" style={{backgroundColor: 'var(--card-background-mint)'}}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Droplets className="w-7 h-7" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <div>
            <CardTitle className="text-2xl" style={{color: 'var(--text-main)'}}>שתיית מים לתינוקות 💧</CardTitle>
            <p className="font-light" style={{color: 'var(--text-soft)'}}>מתי, איך וכמה להתחיל להציע מים</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-base font-light leading-relaxed" style={{color: 'var(--text-main)'}}>
        <p>
          עם המעבר למזון מוצק, חשוב להתחיל להציע לתינוק גם מים. המים עוזרים לעיכול, מונעים עצירות ומפתחים הרגלי שתייה בריאים לעתיד.
        </p>

        <div className="bg-white/70 p-4 rounded-xl border" style={{borderColor: 'var(--border-light)'}}>
          <h4 className="font-medium mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
            <Badge style={{backgroundColor: 'var(--secondary-yellow)', color: 'var(--text-main)'}}>מתי מתחילים?</Badge>
            במקביל לתחילת הטעימות
          </h4>
          <p>
            יש להתחיל להציע מים עם תחילת החשיפה למזונות מוצקים (סביב גיל 6 חודשים). עד גיל זה, תינוקות יונקים או ניזונים מתמ"ל מקבלים את כל הנוזלים שהם צריכים מחלב אם או מהתמ"ל.
          </p>
        </div>
        
        <div className="bg-white/70 p-4 rounded-xl border" style={{borderColor: 'var(--border-light)'}}>
          <h4 className="font-medium mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
            <CupSoda className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
            איך להציע?
          </h4>
           <ul className="space-y-2 pr-5">
            {howToOffer.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" style={{color: 'var(--primary-salmon)'}} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/70 p-4 rounded-xl border" style={{borderColor: 'var(--primary-salmon)'}}>
          <h4 className="font-medium mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
            <AlertTriangle className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
            כמה מים להציע ודגשים חשובים
          </h4>
          <ul className="space-y-2 pr-5">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0" style={{backgroundColor: 'var(--primary-salmon)'}}></span>
              <span>הציעו <strong>כמה לגימות</strong> עם כל ארוחת מוצקים. אין צורך בכמויות גדולות.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0" style={{backgroundColor: 'var(--primary-salmon)'}}></span>
              <span><strong>מים אינם מחליפים הנקה או תמ"ל,</strong> המשמשים כמקור התזונה העיקרי בשנה הראשונה.</span>
            </li>
          </ul>
        </div>
        
      </CardContent>
    </Card>
  );
}
