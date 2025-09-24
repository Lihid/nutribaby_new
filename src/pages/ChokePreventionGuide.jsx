import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Shield, Baby, CheckCircle, XCircle, Eye, Hand, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Baby as BabyEntity, User } from "@/api/entities";
import { differenceInMonths } from "date-fns";
import { useTranslation } from "../components/utils/translations";

const chokePreventionData = {
  "0-12": {
    title: "תינוקות (לידה עד שנה)",
    mainMessage: "תינוקות לומדים את העולם דרך הפה ונוטים להכניס כל דבר לפה. יכולות הבליעה והלעיסה שלהם אינן מפותחות ויש להם נטייה לשאוף מזון לקנה הנשימה.",
    bottleFeeding: [
      "מחזיקים תמיד את התינוק על הידיים בזמן האכלה מבקבוק",
      "מאכילים מבקבוק כאשר התינוק במנח ערסול או חצי ישיבה - לא בשכיבה מלאה",
      "נשארים בקשר עין רציף עם התינוק בזמן האכלה"
    ],
    firstFeeding: [
      "כל ילד יש קצב התפתחות משלו - עוקבים אחר יכולות הילד ומתאימים את המזון",
      "תינוקות המסוגלים לשבת אוכלים אך ורק בישיבה ובהשגחת מבוגר",
      "בזמן האכילה לא עוסקים באף פעילות אחרת",
      "מגישים באופן הדרגתי מרקמים שונים - מתחילים באוכל מרוסק",
      "חותכים לאורך מאכלים עגולים (עגבניות שרי, ענבים, מלפפון)",
      "אין לתת פיצוחים (אגוזים, בוטנים, שקדים) - אלא אם טחונים במרקם חלק לגמרי"
    ]
  },
  "12-60": {
    title: "פעוטות וילדים (שנה עד 5 שנים)",
    mainMessage: "גם בגילאים אלה ילדים עדיין בסיכון לחנק. יכולות הלעיסה מתפתחות בהדרגה ודרושה זהירות רבה.",
    guidelines: [
      "כל ילד יש קצב התפתחות משלו - עוקבים אחר יכולות הילד ומתאימים את המזון",
      "ילדים אוכלים אך ורק בישיבה ובהשגחת מבוגר",
      "בזמן האכילה לא עוסקים באף פעילות אחרת",
      "מלמדים את הילדים ללעוס היטב ומשגיחים בזמן האכילה",
      "מגישים באופן הדרגתי מרקמים שונים - מאוכל מרוסק לאוכל רך בחתיכות קטנות",
      "חותכים לאורך מאכלים עגולים - מאכלים עגולים וחלקים עלולים לחסום את קנה הנשימה"
    ]
  }
};

const foodSafetyTable = [
  {
    category: "פיצוחים ופירות יבשים",
    items: [
      { food: "אגוזים, שקדים ופיצוחים", rule: "אסור עד גיל 5", danger: true },
      { food: "אגוזים טחונים לפירורים", rule: "מותר רק במרקם חלק לחלוטין ללא שברים" },
      { food: "חרוסת", rule: "אסור מתחת לגיל 5, אלא אם המרקם חלק לחלוטין", danger: true },
      { food: "פירות יבשים", rule: "עד גיל 5 יש לגלען ולחתוך לחתיכות קטנות" },
      { food: "צימוקים", rule: "אין הגבלת גיל בשל גודלם הקטן" }
    ]
  },
  {
    category: "פירות",
    items: [
      { food: "פירות קשים", rule: "בראשית האכילה לבשל או לרסק. עד גיל 5 לחתוך לחתיכות מתאימות" },
      { food: "בננה", rule: "אין הגבלת גיל. בראשית האכילה לרסק או לחתוך לאורך" },
      { food: "ענבים", rule: "עד גיל 5 יש לחתוך לאורך", danger: true }
    ]
  },
  {
    category: "ירקות וקטניות",
    items: [
      { food: "ירקות קשים", rule: "בראשית האכילה לבשל או לרסק. עד גיל 5 לחתוך לחתיכות מתאימות" },
      { food: "מלפפון", rule: "עד גיל 5 לחתוך לאורך" },
      { food: "עגבניות שרי", rule: "עד גיל 5 לחתוך לאורך", danger: true },
      { food: "גזר", rule: "עד גיל 5 לחתוך לאורך" },
      { food: "זיתים", rule: "עד גיל 5 לגלען ולחתוך לאורך" },
      { food: "אפונה, תירס, חומוס וקטניות", rule: "עד גיל 5 אסור גרגירים מיובשים. ניתן מבושל היטב במרקם רך" }
    ]
  },
  {
    category: "ממתקים וחטיפים",
    items: [
      { food: "פופקורן", rule: "אסור עד גיל 5 - נטייה להתנפח בקנה הנשימה", danger: true },
      { food: "סוכריות קשות, סוכריות על מקל", rule: "אסור עד גיל 5 - סכנה שיישאפו ויחסמו דרכי אוויר", danger: true },
      { food: "מסטיק", rule: "אסור עד גיל 5 - מרקם דביק ועלול להישאף ולהידבק לקנה הנשימה", danger: true },
      { food: "מרשמלו, טופי, ג'לי, עדשים", rule: "אסור עד גיל 5", danger: true },
      { food: "ביסלי", rule: "אסור עד גיל 5. מעל גיל זה לבדוק שהמרקם מותאם ליכולות הלעיסה", danger: true },
      { food: "אפרופו, צ'יריוס, צ'יפס, ביסקוויט, בייגלה", rule: "אין הגבלת גיל, בהתאם ליכולות הלעיסה" }
    ]
  },
  {
    category: "מזונות שונים",
    items: [
      { food: "נתחי בשר", rule: "עד גיל 5 לחתוך לחתיכות קטנות בהתאם ליכולות הילד" },
      { food: "נקניקיות", rule: "עד גיל 5 יש לחתוך לאורך", danger: true },
      { food: "נתחי גבינה", rule: "עד גיל 5 לחתוך לחתיכות קטנות בהתאם ליכולות הילד" },
      { food: "מצה", rule: "עד גיל 5 מומלץ לרכך במים ולתת בהתאם ליכולות הלעיסה" },
      { food: "חמאת בוטנים וממרחים דביקים", rule: "עד גיל 5 ניתן להגיש אך ורק בממרח. להימנע מנתחים" }
    ]
  }
];

const goldenRules = [
    { title: "השגחה", text: "משגיחים על הילדים בזמן האוכל, במרחק נגיעה וללא הסחות דעת.", icon: Eye },
    { title: "הושבה", text: "אוכלים רק בישיבה, סביב שולחן. לא אוכלים בזמן משחק, ריצה, נסיעה או צפייה במסכים.", icon: Hand },
    { title: "סביבה בטוחה", text: "מרחיקים מהישג ידם של ילדים מתחת לגיל 5 חפצים קטנים, ומוודאים שהצעצועים בטוחים ומתאימים לגילם.", icon: Home }
];

export default function ChokePreventionGuide() {
  const [baby, setBaby] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedAge, setSelectedAge] = useState("0-12");
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
        const babyData = babies[0];
        setBaby(babyData);
        if (babyData.birth_date) {
          const age = differenceInMonths(new Date(), new Date(babyData.birth_date));
          if (age < 12) setSelectedAge("0-12");
          else setSelectedAge("12-60");
        }
      }
    } catch (error) {
      console.error("Error loading baby data:", error);
    }
  };

  const currentData = chokePreventionData[selectedAge];

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{backgroundColor: 'var(--background-cream)', direction: dir}}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--primary-salmon)'}}>
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)", textAlign: align}}>
            בטיחות ומניעת חנק
          </h1>
          <p className="text-lg font-light" style={{color: "var(--text-soft)", textAlign: align}}>
            מבוסס על הנחיות ארגון "בטרם" לבטיחות ילדים
          </p>
          {baby && (
            <p className="text-sm mt-2" style={{color: "var(--primary-salmon)", textAlign: align}}>
              מותאם לגיל {baby.name}
            </p>
          )}
        </div>

        {/* Golden Rules */}
        <Card className="card-base" style={{backgroundColor: 'var(--card-background-mint)'}}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)", textAlign: align}}>
                    <Shield className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
                    3 כללי זהב למניעת חנק
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                    {goldenRules.map(rule => (
                        <div key={rule.title} className="p-4 rounded-lg bg-white border text-center" style={{borderColor: 'var(--border-light)'}}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{backgroundColor: 'var(--secondary-yellow)'}}>
                                <rule.icon className="w-6 h-6" style={{color: 'var(--primary-salmon)'}} />
                            </div>
                            <h3 className="font-bold text-lg mb-1" style={{color: 'var(--text-main)'}}>{rule.title}</h3>
                            <p className="text-sm font-light" style={{color: 'var(--text-soft)'}}>{rule.text}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* Age Selection */}
        <Card className="card-base">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(chokePreventionData).map(([ageKey, data]) => (
                <Button
                  key={ageKey}
                  onClick={() => setSelectedAge(ageKey)}
                  variant={selectedAge === ageKey ? "default" : "outline"}
                  className={selectedAge === ageKey ? "main-cta" : "secondary-cta"}
                >
                  {data.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Alert */}
        <Card className="card-base" style={{backgroundColor: 'var(--primary-salmon)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white text-center" style={{textAlign: 'center'}}>
              <AlertTriangle className="w-8 h-8 mx-auto" />
              <span className="text-xl">{currentData.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white text-lg text-center font-medium">
              {currentData.mainMessage}
            </p>
          </CardContent>
        </Card>

        {/* Bottle Feeding Guidelines for babies */}
        {selectedAge === "0-12" && currentData.bottleFeeding && (
          <Card className="card-base" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)", textAlign: align}}>
                🍼 אכילה מבקבוק והנקה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentData.bottleFeeding.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3" style={{textAlign: align}}>
                    <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                    <span style={{color: "var(--text-main)"}}>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* First Feeding Guidelines */}
        <Card className="card-base" style={{backgroundColor: 'var(--card-background-mint)'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)", textAlign: align}}>
              <Baby className="w-6 h-6" style={{color: "var(--primary-salmon)"}} />
              {selectedAge === "0-12" ? "ראשית האכילה" : "הנחיות האכלה"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(currentData.firstFeeding || currentData.guidelines || []).map((tip, index) => (
                <li key={index} className="flex items-start gap-3" style={{textAlign: align}}>
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                  <span style={{color: "var(--text-main)"}}>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Food Safety Table */}
        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)", textAlign: align}}>
              📋 טבלת בטיחות מזון לפי "בטרם"
            </CardTitle>
            <p className="text-sm mt-2" style={{color: "var(--text-soft)", textAlign: align}}>
              הטבלה אינה כוללת את כל סוגי המזון. בבחירת מזון לילד בודקים את מאפייני המזון בהתאם לאלו המופיעים בטבלה.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {foodSafetyTable.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h4 className="font-bold text-lg mb-3 p-3 rounded-lg" style={{
                    backgroundColor: 'var(--secondary-yellow)', 
                    color: 'var(--text-main)',
                    textAlign: align
                  }}>
                    {category.category}
                  </h4>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className={`p-3 rounded-lg border ${item.danger ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                        <div className="flex items-start gap-3">
                          {item.danger ? 
                            <XCircle className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" /> :
                            <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                          }
                          <div className="flex-1" style={{textAlign: align}}>
                            <span className="font-semibold" style={{color: item.danger ? "var(--text-main)" : "var(--text-main)"}}>{item.food}</span>
                            <p className="text-sm mt-1" style={{color: item.danger ? "rgb(185 28 28)" : "rgb(21 128 61)"}}>{item.rule}</p>
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

        {/* Emergency Information */}
        <Card className="card-base" style={{backgroundColor: 'var(--primary-salmon)'}}>
          <CardHeader>
            <CardTitle className="text-white text-center" style={{textAlign: 'center'}}>
              🚨 במקרה חירום
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/20 p-4 rounded-lg text-white">
              <h4 className="font-bold mb-2" style={{textAlign: align}}>אם התינוק/ילד משתעל:</h4>
              <p className="text-sm" style={{textAlign: align}}>עודדו אותו להמשיך להשתעל. אין להכות על גבו.</p>
              
              <h4 className="font-bold mb-2 mt-3" style={{textAlign: align}}>אם התינוק/ילד אינו נושם, מדבר או משתעל:</h4>
              <ol className="space-y-1 text-sm">
                <li style={{textAlign: align}}>1. הזעיקו מיד עזרה - חייגו 101</li>
                <li style={{textAlign: align}}>2. בתינוקות (עד גיל שנה): בצעו 5 טפיחות בין השכמות ו-5 לחיצות חזה</li>
                <li style={{textAlign: align}}>3. בילדים (מעל גיל שנה): בצעו לחיצות ברום הבטן (היימליך)</li>
              </ol>
            </div>
            <div className="text-center">
              <p className="text-white font-bold">חשוב ללמוד עזרה ראשונה!</p>
              <p className="text-white/90 text-sm">קורס עזרה ראשונה לתינוקות וילדים יכול להציל חיים.</p>
            </div>
          </CardContent>
        </Card>

        {/* Links to other guides */}
        <Card className="card-base">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4" style={{color: "var(--text-main)", textAlign: align}}>
              מדריכים נוספים שיעזרו לכם:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to={createPageUrl("FirstTastingGuide")}>
                <Button className="w-full main-cta">
                  הטעימות הראשונות
                </Button>
              </Link>
              <Link to={createPageUrl("FingerFoodsGuide")}>
                <Button className="w-full secondary-cta">
                  מזון אצבעות
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