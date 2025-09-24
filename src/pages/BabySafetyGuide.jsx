import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Shield, Baby, CheckCircle, XCircle, Heart, Milk } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Baby as BabyEntity, User } from "@/api/entities";
import { differenceInMonths } from "date-fns";
import { useTranslation } from "../components/utils/translations";

const babyFoodSafetyTable = [
  {
    category: "פיצוחים ופירות יבשים",
    items: [
      { food: "אגוזים, שקדים ופיצוחים", rule: "אסור לחלוטין עד גיל 5", danger: true },
      { food: "אגוזים טחונים לפירורים", rule: "מותר רק במרקם חלק לחלוטין ללא שברים", caution: true },
      { food: "חרוסת", rule: "אסור, אלא אם המרקם חלק לחלוטין", danger: true },
      { food: "פירות יבשים", rule: "יש לגלען ולחתוך לחתיכות קטנות", caution: true },
      { food: "צימוקים", rule: "מותר בשל גודלם הקטן" }
    ]
  },
  {
    category: "פירות",
    items: [
      { food: "פירות קשים (תפוח, אגס)", rule: "לבשל או לרסק לחלוטין - אסור פירות קשים", danger: true },
      { food: "בננה", rule: "לרסק או לחתוך לרצועות ארוכות לאחיזה" },
      { food: "ענבים", rule: "לחתוך לאורך ל-4 חלקים", caution: true },
      { food: "אבוקדו", rule: "חתוך לרצועות עבות או מרוסק" }
    ]
  },
  {
    category: "ירקות וקטניות",
    items: [
      { food: "ירקות קשים (גזר, דלעת)", rule: "לבשל היטב עד שהם רכים ולחתוך לרצועות", caution: true },
      { food: "מלפפון", rule: "לחתוך לרצועות ארוכות (לא עיגולים)", caution: true },
      { food: "עגבניות שרי", rule: "לחתוך לאורך ל-4 חלקים", caution: true },
      { food: "זיתים", rule: "לגלען ולחתוך לרצועות", caution: true },
      { food: "אפונה, תירס", rule: "אסור גרגירים בודדים - רק מבושל ומרוסק", danger: true }
    ]
  },
  {
    category: "חלבונים",
    items: [
      { food: "ביצים", rule: "חביתה חתוכה לרצועות ארוכות" },
      { food: "עוף/בשר", rule: "מבושל רך וחתוך לרצועות או מרוסק" },
      { food: "דגים", rule: "לוודא הסרת כל העצמות - מרוסק או בחתיכות רכות" },
      { food: "טופו", rule: "חתוך לקוביות רכות גדולות" }
    ]
  },
  {
    category: "דגנים ומוצרי לחם",
    items: [
      { food: "לחם רך", rule: "חתוך לרצועות ארוכות, לא פירורים קטנים" },
      { food: "פסטה", rule: "צורות גדולות (פוזילי, פנה) - מבושלת היטב" },
      { food: "אורז", rule: "מבושל רך, לא גרגירים בודדים קשים" },
      { food: "קינואה", rule: "מבושלת היטב ורכה" }
    ]
  },
  {
    category: "ממתקים וחטיפים - אסורים לחלוטין",
    items: [
      { food: "פופקורן", rule: "אסור - נטייה להתנפח בקנה הנשימה", danger: true },
      { food: "סוכריות קשות", rule: "אסור - סכנת חנק", danger: true },
      { food: "מסטיק", rule: "אסור - מרקם דביק", danger: true },
      { food: "מרשמלו, טופי", rule: "אסור - מרקם דביק וחלק", danger: true },
      { food: "ביסלי, באמבה", rule: "אסור - קשה ויכול להתפורר", danger: true }
    ]
  }
];

const bottleFeedingGuidelines = [
  "מחזיקים תמיד את התינוק על הידיים בזמן האכלה מבקבוק",
  "מאכילים מבקבוק כאשר התינוק במנח ערסול או חצי ישיבה - לא בשכיבה מלאה",
  "נשארים בקשר עין רציף עם התינוק בזמן האכלה",
  "לא משאירים את התינוק לבד עם בקבוק",
  "בודקים שהטטינה לא חמה מדי לפני ההאכלה"
];

const firstFeedingGuidelines = [
  "כל ילד יש קצב התפתחות משלו - עוקבים אחר יכולות הילד ומתאימים את המזון",
  "תינוקות המסוגלים לשבת אוכלים אך ורק בישיבה ובהשגחת מבוגר",
  "בזמן האכילה לא עוסקים באף פעילות אחרת - ללא טלפונים או הסחות דעת",
  "מתחילים באוכל מרוסק וחלק, עוברים בהדרגה למרקמים עבים יותר",
  "חותכים לאורך מאכלים עגולים - אסור עיגולים שיכולים לחסום את קנה הנשימה",
  "אין לתת פיצוחים - אלא אם טחונים במרקם חלק לגמרי",
  "מציגים מזון חדש במשך 3-5 ימים לפני מעבר למזון הבא"
];

export default function BabySafetyGuide() {
  const [baby, setBaby] = useState(null);
  const [user, setUser] = useState(null);
  const { t, dir, align } = useTranslation(user?.preferred_language);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBabyData();
  }, []);

  const loadBabyData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      const babies = await BabyEntity.filter({ created_by: currentUser.email });
      if (babies.length > 0) {
        setBaby(babies[0]);
      }
    } catch (error) {
      console.error("Error loading baby data:", error);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{backgroundColor: 'var(--background-cream)', direction: dir}}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--card-background-mint)'}}>
            <Baby className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)", textAlign: align}}>
            בטיחות אכילה לתינוקות 0-12 חודשים
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)", textAlign: align}}>
            מדריך מיוחד לבטיחות תינוקות מבוסס על הנחיות "בטרם"
          </p>
          {baby && (
            <p className="text-sm mt-2" style={{color: "var(--primary-salmon)", textAlign: align}}>
              מותאם במיוחד עבור {baby.name}
            </p>
          )}
        </div>

        {/* Main Message */}
        <Card className="card-base" style={{backgroundColor: 'var(--primary-salmon)'}}>
          <CardHeader>
            <CardTitle className="text-white text-center text-xl" style={{textAlign: 'center'}}>
              🍼 מה חשוב לדעת על תינוקות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white text-lg font-medium text-center" style={{textAlign: 'center'}}>
              תינוקות לומדים את העולם דרך הפה ונוטים להכניס כל דבר לפה. 
              יכולות הבליעה והלעיסה שלהם אינן מפותחות ויש להם נטייה לשאוף מזון לקנה הנשימה.
            </p>
          </CardContent>
        </Card>

        {/* Bottle Feeding */}
        <Card className="card-base" style={{backgroundColor: 'var(--secondary-yellow)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)", textAlign: align}}>
              <Milk className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              אכילה מבקבוק והנקה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {bottleFeedingGuidelines.map((guideline, index) => (
                <li key={index} className="flex items-start gap-3" style={{textAlign: align}}>
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                  <span style={{color: "var(--text-main)", fontWeight: '500'}}>{guideline}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* First Feeding */}
        <Card className="card-base" style={{backgroundColor: 'var(--card-background-mint)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)", textAlign: align}}>
              <Baby className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              ראשית האכילה - כללי בטיחות חיוניים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {firstFeedingGuidelines.map((guideline, index) => (
                <li key={index} className="flex items-start gap-3" style={{textAlign: align}}>
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                  <span style={{color: "var(--text-main)", fontWeight: '500'}}>{guideline}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Food Safety Table for Babies */}
        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)", textAlign: align}}>
              📋 מדריך מזונות בטוחים לתינוקות
            </CardTitle>
            <p className="text-sm mt-2" style={{color: "var(--text-soft)", textAlign: align}}>
              טבלה מפורטת המותאמת במיוחד לגילאי 6-12 חודשים
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {babyFoodSafetyTable.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h4 className="font-bold text-lg mb-3 p-3 rounded-lg" style={{
                    backgroundColor: category.category.includes('אסורים') ? 'var(--primary-salmon)' : 'var(--secondary-yellow)', 
                    color: category.category.includes('אסורים') ? 'white' : 'var(--text-main)',
                    textAlign: align
                  }}>
                    {category.category}
                  </h4>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className={`p-3 rounded-lg border ${
                        item.danger ? 'border-red-200 bg-red-50' : 
                        item.caution ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                      }`}>
                        <div className="flex items-start gap-3">
                          {item.danger ? 
                            <XCircle className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" /> :
                            item.caution ?
                            <AlertTriangle className="w-5 h-5 mt-0.5 text-yellow-600 flex-shrink-0" /> :
                            <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                          }
                          <div className="flex-1" style={{textAlign: align}}>
                            <span className="font-semibold text-lg" style={{color: "var(--text-main)"}}>{item.food}</span>
                            <p className="text-sm mt-1 font-medium" style={{
                              color: item.danger ? "rgb(185 28 28)" : 
                                     item.caution ? "rgb(161 98 7)" :
                                     "rgb(21 128 61)"
                            }}>
                              {item.rule}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Info for Babies */}
        <Card className="card-base" style={{backgroundColor: 'var(--primary-salmon)'}}>
          <CardHeader>
            <CardTitle className="text-white text-center" style={{textAlign: 'center'}}>
              🚨 חירום - תינוקות עד גיל שנה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/20 p-4 rounded-lg text-white">
              <h4 className="font-bold mb-3 text-lg" style={{textAlign: align}}>אם התינוק משתעל:</h4>
              <p className="mb-3" style={{textAlign: align}}>עודדו אותו להמשיך להשתעל. אין להכות על גבו.</p>
              
              <h4 className="font-bold mb-3 text-lg" style={{textAlign: align}}>אם התינוק לא נושם או לא משתעל:</h4>
              <ol className="space-y-2">
                <li style={{textAlign: align, fontWeight: 'bold'}}>1. 📞 הזעיקו מיד עזרה - חייגו 101</li>
                <li style={{textAlign: align}}>2. 🤲 5 טפיחות בין השכמות (עם עקב כף היד)</li>
                <li style={{textAlign: align}}>3. 👐 5 לחיצות חזה (במרכז החזה, מתחת לפטמות)</li>
                <li style={{textAlign: align}}>4. 🔄 חזרו על הפעולות עד להגעת הצוותים או שחרור החפץ</li>
              </ol>
            </div>
            <div className="text-center bg-white/10 p-4 rounded-lg">
              <p className="text-white font-bold text-lg">⚠️ חשוב מאוד!</p>
              <p className="text-white/90 text-base mt-2">
                למדו עזרה ראשונה לתינוקות וילדים. קורס יכול להציל חיים!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Ages Alert */}
        <Card className="card-base" style={{backgroundColor: 'var(--card-background-mint)'}}>
          <CardContent className="p-6">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" style={{color: 'var(--primary-salmon)'}} />
              <h3 className="font-bold text-xl mb-2" style={{color: "var(--text-main)"}}>
                זכרו: רוב ההמלצות תקפות עד גיל 5 שנים
              </h3>
              <p className="soft-text text-base">
                גם אחרי גיל שנה, המשיכו להקפיד על כללי הבטיחות. 
                תינוקות ופעוטות זקוקים לזהירות מיוחדת בכל שלב.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Links to other guides */}
        <Card className="card-base">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-xl" style={{color: "var(--text-main)", textAlign: align}}>
              מדריכים נוספים שיעזרו לכם:
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to={createPageUrl("FirstTastingGuide")}>
                <Button className="w-full main-cta h-auto py-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">הטעימות הראשונות</div>
                    <div className="text-sm text-white/90">מתי ואיך להתחיל</div>
                  </div>
                </Button>
              </Link>
              <Link to={createPageUrl("ChokePreventionGuide")}>
                <Button className="w-full secondary-cta h-auto py-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">מדריך בטיחות כללי</div>
                    <div className="text-sm opacity-80">לכל הגילאים</div>
                  </div>
                </Button>
              </Link>
              <Link to={createPageUrl("AgeGuide6to9")}>
                <Button className="w-full secondary-cta h-auto py-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">מדריך 6-9 חודשים</div>
                    <div className="text-sm opacity-80">טעימות ראשונות</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

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