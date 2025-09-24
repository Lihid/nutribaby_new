
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Utensils, Soup, Smile, ChevronsUp, Baby } from 'lucide-react';

const stages = [
  {
    title: "שלב 1: התחלה בגיל 6 חודשים",
    description: "בשלב זה המרקם הוא חלק לגמרי, כמו מחית חלקה או יוגורט. המטרה היא חשיפה לטעמים חדשים והתרגלות לתנועת בליעה.",
    icon: <Soup className="w-5 h-5" />,
    bgColor: 'var(--card-background-mint)'
  },
  {
    title: "שלב 2: סביב גיל 7-8 חודשים",
    description: "אפשר להתחיל להגיש מרקמים מעט יותר סמיכים ומעוכים, כמו בננה מעוכה במזלג או אבוקדו. המטרה היא לעודד את התינוק להשתמש בלשון.",
    icon: <Smile className="w-5 h-5" />,
    bgColor: 'var(--secondary-yellow)'
  },
  {
    title: "שלב 3: סביב גיל 9-12 חודשים",
    description: "זה הזמן למזונות רכים חתוכים לחתיכות קטנות (מזון אצבעות), כמו חתיכות בטטה מבושלת או פסטה. המטרה היא לפתח לעיסה עצמאית.",
    icon: <ChevronsUp className="w-5 h-5" />,
    bgColor: 'var(--card-background-mint)'
  }
];

export default function TextureTransitionArticle() {
  return (
    <Card className="card-base">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl" style={{color: 'var(--text-main)'}}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--secondary-yellow)'}}>
             <Utensils className="w-7 h-7" style={{color: 'var(--primary-salmon)'}}/>
          </div>
          <div>
            המדריך למעבר הדרגתי במרקמים
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="soft-text mb-6">
          המעבר בין מרקמים (מטחינה חלקה ועד לחתיכות רכות) בגילאי 6–9 חודשים הוא שלב חשוב בהתפתחות האכילה של תינוקות. הוא צריך להיעשות בהדרגה לפי סימני מוכנות, ולא רק לפי גיל. חשוב לזכור שלכל תינוק יש קצב התפתחות אישי, ויש כאלה שיעברו בין השלבים מהר יותר מאחרים. הקשיבו לסימנים של התינוק שלכם.
        </p>
        
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={index} className="p-4 rounded-xl" style={{backgroundColor: stage.bgColor}}>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-3" style={{color: 'var(--text-main)'}}>
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white" style={{color: 'var(--primary-salmon)'}}>{stage.icon}</span>
                <Badge variant="outline" className="border-[var(--primary-salmon)] text-[var(--primary-salmon)] bg-white">
                  {stage.title}
                </Badge>
              </h3>
              <p className="soft-text pr-11">{stage.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl border-2" style={{borderColor: 'var(--primary-salmon)', backgroundColor: 'var(--card-background-mint)'}}>
            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2" style={{color: 'var(--text-main)'}}>
                <Baby className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
                ומה לגבי בייבי-לד (Baby-Led Weaning)?
            </h4>
            <p className="soft-text">
                שיטת "בייבי-לד" היא גישה פופולרית שבה מדלגים על שלב המחיות ומציעים לתינוק מזון אצבעות רך כבר מתחילת הטעימות (סביב גיל 6 חודשים, ועם סימני מוכנות). בשיטה זו התינוק אוכל באופן עצמאי מההתחלה. אם אתם בוחרים בגישה זו, חשוב מאוד ללמוד על כללי הבטיחות וחיתוך נכון של מזונות.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
