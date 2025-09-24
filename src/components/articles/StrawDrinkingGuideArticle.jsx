import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Check, Lightbulb } from 'lucide-react';

const steps = [
    {
        title: "שלב 1: הדגמה",
        text: "הדגימו לתינוק איך אתם שותים מקש. תינוקות לומדים מחיקוי. עשו זאת בהתלהבות כדי לעורר את סקרנותו."
    },
    {
        title: "שלב 2: שיטת הפיפטה",
        text: "טבלו את הקש במים וסתמו את הקצה העליון עם האצבע כדי ללכוד מעט מים. קרבו את הקש לפי התינוק ושחררו את האצבע כדי שהמים יטפטפו לפיו. זה עוזר לו להבין שהקש מוציא נוזלים."
    },
    {
        title: "שלב 3: עידוד יניקה",
        text: "לאחר שהתינוק מבין את הרעיון, החזיקו את הקש עם מים לכודים מעל פיו ועודדו אותו לסגור את השפתיים סביב הקש ולנסות לינוק. שחררו את המים רק כשהוא מנסה לינוק."
    },
    {
        title: "שלב 4: תרגול עם כוס",
        text: "השתמשו בכוס עם קש קצר. קשים ארוכים מדי מקשים על הלמידה. תרגלו יחד בכל הזדמנות."
    }
];

const tips = [
  "השתמשו בקשית סיליקון רכה ובטוחה לשימוש.",
  "התחילו עם נוזלים שהתינוק אוהב (אפשר גם מחית פירות דלילה) כדי להגביר את המוטיבציה.",
  "היו סבלניים. זה יכול לקחת זמן, וזה בסדר.",
  "שמרו על אווירה חיובית ונטולת לחץ. אם התינוק מתוסכל, קחו הפסקה ונסו שוב במועד אחר."
];

export default function StrawDrinkingGuideArticle() {
  return (
    <Card className="card-base shadow-xl my-8" style={{backgroundColor: 'var(--card-background-mint)'}}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Rocket className="w-7 h-7" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <div>
            <CardTitle className="text-2xl" style={{color: 'var(--text-main)'}}>לימוד שתייה מקשית 🚀</CardTitle>
            <p className="font-light" style={{color: 'var(--text-soft)'}}>צעד אחר צעד להצלחה</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-base font-light leading-relaxed" style={{color: 'var(--text-main)'}}>
        <p>
          שתייה מקש היא מיומנות חשובה שמחזקת את שרירי הפה, הלשון והשפתיים, ועוזרת להתפתחות הדיבור. היא גם מקלה על המעבר משתייה מבקבוק לכוס פתוחה.
        </p>

        <div className="bg-white/70 p-4 rounded-xl border" style={{borderColor: 'var(--border-light)'}}>
          <h4 className="font-medium mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
            <Badge style={{backgroundColor: 'var(--secondary-yellow)', color: 'var(--text-main)'}}>מתי מתחילים?</Badge>
            סביב גיל 6-9 חודשים
          </h4>
          <p>
            אפשר להתחיל לנסות ברגע שהתינוק יושב יציב ומראה עניין. כל תינוק והקצב שלו.
          </p>
        </div>
        
        <div className="bg-white/70 p-4 rounded-xl border" style={{borderColor: 'var(--border-light)'}}>
          <h4 className="font-medium mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
            <Check className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
            שיטת ארבעת השלבים
          </h4>
           <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="p-3 rounded-lg border bg-white">
                <p className="font-semibold" style={{color: 'var(--text-main)'}}>{step.title}</p>
                <p className="text-sm soft-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 p-4 rounded-xl border" style={{borderColor: 'var(--primary-salmon)'}}>
          <h4 className="font-medium mb-3 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
            <Lightbulb className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
            טיפים להצלחה
          </h4>
          <ul className="space-y-2 pr-5">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0" style={{backgroundColor: 'var(--primary-salmon)'}}></span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        
      </CardContent>
    </Card>
  );
}