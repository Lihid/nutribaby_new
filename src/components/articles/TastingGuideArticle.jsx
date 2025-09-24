
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, CheckSquare, Smile, AlertTriangle, Heart } from 'lucide-react';

const readinessSigns = [
  "התעניינות במזון כאשר אתם אוכלים בסביבתו",
  "ישיבה עם תמיכה",
  "יציבות של הראש",
  "הכנסת ידיים וחפצים לפה",
  "רפלקס הוצאת הלשון נעלם"
];

const allergenicFoods = [
  "דגים", "ביצים", "שומשום", "אגוזים", "מוצרי חלב", "פירות ים", "סויה", "חיטה", "בוטנים"
];

export default function TastingGuideArticle() {
  return (
    <Card className="card-base shadow-xl my-8" style={{backgroundColor: 'var(--card-background-mint)'}}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <ChefHat className="w-7 h-7" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <div>
            <CardTitle className="text-2xl" style={{color: 'var(--text-main)'}}>המדריך המלא לטעימות הראשונות 🥑</CardTitle>
            <p className="font-light" style={{color: 'var(--text-soft)'}}>מתי, איך ועם מה להתחיל את המסע הקולינרי</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-base font-light leading-relaxed" style={{color: 'var(--text-main)'}}>
        <p>
          איזה כיף שבקרוב הקטנים שלכם יתחילו לאכול מוצקים. זהו שלב מאוד מרגש וחוויתי עבורכן ועבורם.
          ההנחייה העדכנית של משרד הבריאות ממליצה על חשיפה למצוקים החל מגיל 6 חודשים ועם הצגה של סימני מוכנות:
        </p>

        <div className="bg-white/70 p-4 rounded-xl border" style={{borderColor: 'var(--border-light)'}}>
          <h4 className="font-medium mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
            <CheckSquare className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
            מתי להתחיל? סימני מוכנות
          </h4>
          <ul className="space-y-2 pr-5">
            {readinessSigns.map((sign, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0" style={{backgroundColor: 'var(--primary-salmon)'}}></span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/70 p-4 rounded-xl border" style={{borderColor: 'var(--border-light)'}}>
          <h4 className="font-medium mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
            <Smile className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
            איך להתחיל? טיפים להצלחה
          </h4>
          <p>
            החלטתן שהגיע הזמן להתחיל? ממליצה להתחיל בחשיפה הדרגתית, כל פעם למזון חדש אחר כדי להרגיל את הבטן למזון מוצק.
            מומלץ להתחיל מירקות מבושלים/מאודים טחונים ואח״כ פירות טחונים. אפשר להאכיל בכסא תינוק או בטרמפולינה עם זוית נוחה לאכילה.
          </p>
        </div>

        <div className="bg-white/70 p-4 rounded-xl border" style={{borderColor: 'var(--primary-salmon)'}}>
            <h4 className="font-medium mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
              <AlertTriangle className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
              חשיפה לאלרגנים
            </h4>
            <p className="mb-4">
              יש לחשוף למזונות אלרגניים עם תחילת החשיפה למוצקים כדי לשלול אלרגיות.
              יש לחשוף לכל אלרגן 3 פעמים לפחות כדי לשלול אלרגיה. את כמות החשיפה לאלרגניים נעלה בצורה הדרגתית:
            </p>
            <div className="grid md:grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-white p-2 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                    <p className="font-medium" style={{color: 'var(--text-soft)'}}>יום ראשון</p>
                    <p className="font-semibold text-lg" style={{color: 'var(--text-main)'}}>1/4 כפית</p>
                </div>
                <div className="bg-white p-2 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                    <p className="font-medium" style={{color: 'var(--text-soft)'}}>יום שני</p>
                    <p className="font-semibold text-lg" style={{color: 'var(--text-main)'}}>1/2 כפית</p>
                </div>
                <div className="bg-white p-2 rounded-lg border" style={{borderColor: 'var(--border-light)'}}>
                    <p className="font-medium" style={{color: 'var(--text-soft)'}}>יום שלישי</p>
                    <p className="font-semibold text-lg" style={{color: 'var(--text-main)'}}>1 כפית</p>
                </div>
            </div>
            <p className="font-medium mt-4 mb-2" style={{color: 'var(--text-main)'}}>מזונות אלרגניים לחשיפה:</p>
            <div className="flex flex-wrap gap-2">
                {allergenicFoods.map(food => (
                    <Badge key={food} style={{backgroundColor: 'var(--secondary-yellow)', color: 'var(--text-main)'}} className="border-0">{food}</Badge>
                ))}
            </div>
        </div>

        <div className="bg-white/70 p-4 rounded-xl border" style={{borderColor: 'var(--border-light)'}}>
          <h4 className="font-medium mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
            <Heart className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
            מה לתת? רעיונות למזונות ראשונים
          </h4>
          <p className="mb-3">
            לאחר שהקטן/ה סימן/ה שהוא/היא מוכן/ה, זה הזמן לבחור את המזונות הראשונים. מומלץ להתחיל עם ירקות ולאחר מכן פירות.
            אלו כמה רעיונות למזונות קלים לעיכול ובעלי סיכון נמוך לאלרגיה:
          </p>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium mb-2" style={{color: 'var(--text-main)'}}>להתחיל עם (הכי קלים לעיכול):</h5>
              <ul className="list-disc list-inside space-y-1 pr-5">
                <li>מחית קישוא</li>
                <li>מחית דלעת</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2" style={{color: 'var(--text-main)'}}>המשך עם:</h5>
              <ul className="list-disc list-inside space-y-1 pr-5">
                <li>מחית גזר</li>
                <li>מחית תפוח אדמה</li>
                <li>מחית בטטה</li>
                <li>מחית תפוח עץ</li>
                <li>מחית אגס</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="font-medium text-lg" style={{color: 'var(--text-main)'}}>
            שיהיה לכן מלא בהצלחה, מוזמנות להתייעץ איתי לכל שאלה שעולה ❤️
          </p>
          <p className="mt-2 font-light" style={{color: 'var(--text-soft)'}}>
            ליהי דנאי, דיאטנית ילדים קלינית
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
