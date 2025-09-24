
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MessageCircle, Send, Search, Baby, Heart, AlertCircle, Shield, ChevronDown } from "lucide-react";
import { SendEmail } from "@/api/integrations";

const faqData = [
  {
    category: "התחלת מזון מוצק",
    questions: [
      {
        q: "מתי להתחיל עם מזון מוצק?",
        a: "בדרך כלל בסביבות גיל 6 חודשים, כאשר התינוק יושב עם תמיכה, מגיע למזון וחוקה אותו בפה במקום לדחוף החוצה."
      },
      {
        q: "איזה מזון לתת ראשון?",
        a: "מומלץ להתחיל עם ירקות ופירות כמו בטטה, אבוקדו או בננה. המרקם צריך להיות חלק ורך."
      },
      {
        q: "כמה זמן לחכות בין מזון חדש אחד לשני?",
        a: "אין צורך לחכות במזונות שאינם אלרגניים, כן מומלץ להפריד בין מזונות אלרגניים עד לסיום החשיפה."
      },
      {
        q: "מכמה ארוחות ביום להתחיל?",
        a: "מומלץ להתחיל מארוחה אחת ביום בשעות הבוקר/צהריים ולעלות ל-2 ארוחות בהדרגה כאשר התינוק מגדיל כמויות ומתקדם באכילה."
      }
    ]
  },
  {
    category: "הנקה",
    questions: [
      {
        q: "כמה פעמים ביום צריך להניק?",
        a: "תינוקות יונקים בדרך כלל 8-12 פעמים ביממה בשבועות הראשונים. מומלץ להניק על פי דרישה ולא לפי לוח זמנים קבוע."
      },
      {
        q: "איך אדע שהתינוק שלי מקבל מספיק חלב?",
        a: "סימנים טובים: עלייה במשקל, 6-8 חיתולים רטובים ביום, התינוק נרגע אחרי הנקה, והשד מרגיש רך יותר אחרי ההנקה."
      },
      {
        q: "מה לעשות אם יש כאבי הנקה?",
        a: "כאבי הנקה יכולים לנבוע מהצמדה לא נכונה, פיסורים בפטמה או גודש. מומלץ לפנות ליועצת הנקה או לרופא המשפחה."
      },
      {
        q: "מתי להפסיק להניק?",
        a: "ההנקה יכולה להמשיך כל עוד זה נוח לאם ולתינוק. ארגון הבריאות העולמי ממליץ על הנקה בלעדית עד 6 חודשים והמשך הנקה עד גיל שנתיים לפחות."
      },
      {
        q: "האם אפשר להניק כשחולים?",
        a: "ברוב המקרים כן! חלב אם מכיל נוגדנים שעוזרים לתינוק להתמודד עם מחלות. במקרה של מחלה חמורה או תרופות מסוימות, יש להתייעץ עם רופא."
      }
    ]
  },
  {
    category: "תחליף חלב (תמ״ל)",
    questions: [
      {
        q: "איך לבחור תחליף חלב מתאים?",
        a: "תמ״ל שלב 1 מתאים לגיל 0-6 חודשים. יש לבחור תמ״ל מועשר בברזל ולפי הנחיות הרופא. במקרה של אלרגיות, יש להתייעץ עם רופא ילדים."
      },
      {
        q: "כמה תמ״ל התינוק צריך ביום?",
        a: "כלל כללי: 150-200 מ״ל לק״ג משקל ביום. לדוגמה, תינוק של 5 ק״ג יצרוך בסביבות 750-1000 מ״ל ביום, מחולק ל-6-8 ארוחות."
      },
      {
        q: "מה לעשות אם התינוק לא מקבל את הבקבוק?",
        a: "נסו פטמות שונות, טמפרטורות שונות, עמדות האכלה שונות. לפעמים עוזר אם מישהו אחר נותן את הבקבוק. היו סבלניים - זה יכול לקחת זמן."
      },
      {
        q: "האם אפשר להחליף בין סוגי תמ״ל?",
        a: "כן, אבל עדיף לעשות זאת בהדרגה. ערבבו בהתחלה את התמ״ל החדש עם הישן ובהדרגה עברו לתמ״ל החדש לחלוטין."
      }
    ]
  },
  {
    category: "אלרגיות ורגישויות",
    questions: [
      {
        q: "איך מכניסים אלרגנים עיקריים?",
        a: "מכניסים אלרגנים עיקריים (כמו ביצים, טחינה, דגים) בכמויות קטנות ובהדרגה - 1/4 כפית, אחר כך 1/2 כפית ולבסוף כפית שלמה."
      },
      {
        q: "מה הם הסימנים לתגובה אלרגית?",
        a: "פריחה, נפיחות, הקאות, שלשולים, קשיי נשימה. במקרה של תגובה קשה - פנו מיד לטיפול רפואי חירום."
      },
      {
        q: "האם לעכב הכנסת אלרגנים אם יש אלרגיות במשפחה?",
        a: "לא! מחקרים מראים שהכנסה מוקדמת של אלרגנים יכולה למנע אלרגיות. התייעצו עם רופא הילדים."
      }
    ]
  },
  {
    category: "בעיות האכלה נפוצות",
    questions: [
      {
        q: "התינוק שלי סורב לאכול מזון מוצק, מה לעשות?",
        a: "זה תקין לחלוטין! המשיכו להציע ללא לחץ. לפעמים לוקח עד 10 חשיפות עד שתינוק מקבל מזון חדש. הציעו בזמנים שונים ובדרכים שונות."
      },
      {
        q: "התינוק אוכל רק מזון מתוק, איך לגוון?",
        a: "נסו לערבב מזונות מתוקים עם פחות מתוקים בהדרגה. למשל, ערבבו בננה עם אבוקדו או בטטה עם קישוא."
      },
      {
        q: "כמה התינוק צריך לאכול בכל ארוחה?",
        a: "התינוק יודע כמה הוא צריך! התחילו עם כמויות קטנות (1-2 כפיות) ותנו לו להוביל. אל תכפו אכילה."
      }
    ]
  }
];

export default function Chat() {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchTerm, setSearchTerm] = useState("");
  // Track expanded state for each category, default to all closed
  const [expandedCategories, setExpandedCategories] = useState({}); 
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredFaq = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await SendEmail({
        to: "lihi.danay@gmail.com",
        subject: `הודעה מ-NutriBaby: ${contactForm.subject}`,
        body: `
          שם: ${contactForm.name}
          אימייל: ${contactForm.email}
          נושא: ${contactForm.subject}
          
          הודעה:
          ${contactForm.message}
        `,
        from_name: "NutriBaby App"
      });

      setSubmitSuccess(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      alert("אירעה שגיאה בשליחת ההודעה. אנא נסו שוב.");
    }

    setIsSubmitting(false);
  };

  const getCategoryIcon = (categoryIndex) => {
    // Icons array ordered based on the updated faqData categories
    const icons = [Baby, Heart, Shield, AlertCircle, Baby]; 
    return icons[categoryIndex] || Baby; // Fallback to Baby icon
  };

  const toggleCategory = (categoryIndex) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }));
  };

  return (
    <div className="p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{color: "var(--text-main)"}}>
            שאלות ותשובות 💬
          </h1>
          <p className="text-md font-light" style={{color: "var(--text-soft)"}}>
            מענה מקצועי לשאלות תזונה נפוצות
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-2xl p-2">
            <TabsTrigger
              value="faq"
              className="rounded-xl data-[state=active]:bg-[var(--secondary-yellow)]"
              style={{color: "var(--primary-salmon)"}}
            >
              שאלות נפוצות
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="rounded-xl data-[state=active]:bg-[var(--card-background-mint)]"
              style={{color: "var(--text-main)"}}
            >
              יצירת קשר
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-8">
            <Card className="card-base mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" style={{color: "var(--primary-salmon)"}} />
                  <Label htmlFor="search" style={{color: "var(--text-main)"}}>
                    חיפוש בשאלות ותשובות
                  </Label>
                </div>
              </CardHeader>
              <CardContent>
                <Input
                  id="search"
                  placeholder="הקלידו מילת חיפוש..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-right"
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              {filteredFaq.map((category, categoryIndex) => {
                const CategoryIcon = getCategoryIcon(categoryIndex);
                const isExpanded = expandedCategories[categoryIndex] || false;
                
                return (
                  <Card key={categoryIndex} className="card-base">
                    <Collapsible open={isExpanded} onOpenChange={() => toggleCategory(categoryIndex)}>
                      <CollapsibleTrigger 
                        className="w-full"
                      >
                        <CardHeader className="hover:bg-gray-50 transition-colors">
                          <CardTitle className="flex items-center justify-between text-right" style={{color: "var(--text-main)"}}>
                            <ChevronDown 
                              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              style={{color: "var(--primary-salmon)"}}
                            />
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-xs" style={{borderColor: 'var(--border-light)', color: 'var(--primary-salmon)'}}>
                                {category.questions.length} שאלות
                              </Badge>
                              <span>{category.category}</span>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--secondary-yellow)'}}>
                                <CategoryIcon className="w-4 h-4" style={{color: "var(--primary-salmon)"}} />
                              </div>
                            </div>
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent>
                          <div className="space-y-6">
                            {category.questions.map((item, qIndex) => (
                              <div key={qIndex} className="border-r-4 pr-4" style={{borderColor: 'var(--secondary-yellow)'}}>
                                <h4 className="font-medium mb-2 text-right" style={{color: "var(--primary-salmon)"}}>{item.q}</h4>
                                <p className="text-sm font-light leading-relaxed text-right" style={{color: "var(--text-soft)"}}>
                                  {item.a}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}
            </div>

            {filteredFaq.length === 0 && (
              <Card className="card-base">
                <CardContent className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{color: "var(--text-soft)"}} />
                  <h3 className="text-xl font-medium mb-2" style={{color: "var(--text-main)"}}>
                    לא נמצאו תוצאות
                  </h3>
                  <p className="font-light" style={{color: "var(--text-soft)"}}>
                    נסו מילות חיפוש אחרות או עברו לטאב יצירת קשר
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contact" className="mt-8">
            <Card className="card-base">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
                  <Send className="w-5 h-5" style={{color: "var(--primary-salmon)"}} />
                  יצירת קשר עם ליהי דנאי
                </CardTitle>
                <p className="text-sm font-light" style={{color: "var(--text-soft)"}}>
                  שאלה ספציפית? שלחו הודעה ישירות לדיאטנית
                </p>
              </CardHeader>
              <CardContent>
                {submitSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'var(--card-background-mint)'}}>
                      <Heart className="w-8 h-8" style={{color: "var(--primary-salmon)"}} />
                    </div>
                    <h3 className="text-xl font-medium mb-2" style={{color: "var(--primary-salmon)"}}>ההודעה נשלחה בהצלחה!</h3>
                    <p className="font-light" style={{color: "var(--text-soft)"}}>
                      ליהי תחזור אליכם בהקדם האפשרי
                    </p>
                    <Button 
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-4 main-cta"
                    >
                      <span>שלחו הודעה נוספת</span>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" style={{color: "var(--text-main)"}}>שם מלא</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({...prev, name: e.target.value}))}
                          placeholder="השם שלכם"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" style={{color: "var(--text-main)"}}>כתובת אימייל</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({...prev, email: e.target.value}))}
                          placeholder="example@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" style={{color: "var(--text-main)"}}>נושא ההודעה</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({...prev, subject: e.target.value}))}
                        placeholder="בקצרה - על מה ההודעה?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" style={{color: "var(--text-main)"}}>הודעה</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({...prev, message: e.target.value}))}
                        placeholder="פרטו את השאלה או הבקשה שלכם..."
                        className="h-32"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full main-cta"
                      disabled={isSubmitting}
                    >
                      <span>{isSubmitting ? "שולח הודעה..." : "שלחו הודעה"}</span>
                      <Send className="w-4 h-4 mr-2" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
