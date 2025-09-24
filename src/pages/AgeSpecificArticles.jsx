
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Article, User } from '@/api/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';

const ageRangeLabels = {
  '0-6months': '0-6 חודשים',
  '6-9months': '6-9 חודשים',
  '9-12months': '9-12 חודשים',
  '12-24months': '12-24 חודשים',
};
const ageRangeLabelsEn = {
  '0-6months': '0-6 Months',
  '6-9months': '6-9 Months',
  '9-12months': '9-12 Months',
  '12-24months': '12-24 Months',
};

export default function AgeSpecificArticles() {
  const [searchParams] = useSearchParams();
  const ageRange = searchParams.get('age_range');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { t, dir, align, language } = useTranslation(user?.preferred_language);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        if (ageRange) {
          const allArticles = await Article.filter({ published: true }, 'order_index'); // Added ordering by order_index
          const filtered = allArticles.filter(article => 
            article.age_ranges && article.age_ranges.includes(ageRange)
          );
          setArticles(filtered);
        }
      } catch (error) {
        console.error("Error loading articles:", error);
      }
      setLoading(false);
    };

    loadData();
  }, [ageRange]);
  
  const pageTitle = language === 'en' 
    ? `Articles for ${ageRangeLabelsEn[ageRange] || 'your baby'}` 
    : `מאמרים לגיל ${ageRangeLabels[ageRange] || 'התינוק'}`;

  if (loading) {
    return <div className="p-8 text-center">טוען מאמרים...</div>;
  }

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{ direction: dir }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <BookOpen className="w-10 h-10" style={{color: 'var(--primary-salmon)'}}/>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{color: "var(--text-main)", textAlign: align}}>
            {pageTitle}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.length > 0 ? (
            articles.map(article => (
              <Link to={createPageUrl("DynamicArticle") + `?slug=${article.slug}`} key={article.id}>
                <Card className="card-base hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={article.image_url || 'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-lg mb-2 flex-grow" style={{ color: 'var(--text-main)', textAlign: align }}>
                      {article.title}
                    </h3>
                    <p className="font-light text-sm opacity-90 mb-4" style={{ color: 'var(--text-soft)', textAlign: align }}>
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium mt-auto" style={{ color: 'var(--primary-salmon)' }}>
                      <span>{t('read_more')}</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-600">לא נמצאו מאמרים נוספים לגיל זה כרגע.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" style={{color: 'var(--primary-salmon)'}}>
              <ArrowLeft className="w-4 h-4 ml-2" />
              {t('back_to_dashboard')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
