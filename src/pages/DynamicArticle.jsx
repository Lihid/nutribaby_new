import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Article } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function DynamicArticle() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    try {
      const articles = await Article.filter({ slug, published: true });
      if (articles.length > 0) {
        setArticle(articles[0]);
      } else {
        setError('המאמר לא נמצא');
      }
    } catch (err) {
      console.error('Error loading article:', err);
      setError('שגיאה בטעינת המאמר');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--background-cream)'}}>
        <div className="animate-pulse text-lg">טוען מאמר...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="p-4 md:p-8 min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--background-cream)'}}>
        <Card className="card-base text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text-main)'}}>
              {error || 'המאמר לא נמצא'}
            </h2>
            <Link to={createPageUrl("Dashboard")}>
              <Button className="main-cta">
                <ArrowLeft className="w-4 h-4 ml-2" />
                חזרה לעמוד הראשי
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryLabels = {
    'preparation': 'הכנה לטעימות',
    'first_tasting': 'טעימות ראשונות',
    'water': 'שתיית מים',
    'steaming': 'איידוי מזון',
    'textures': 'מעבר מרקמים',
    'finger_foods': 'מזון אצבעות',
    'picky_eating': 'בררנות באכילה',
    'family_meals': 'ארוחות משפחתיות',
    'kitchen_involvement': 'שילוב במטבח',
    'choke_prevention': 'מניעת חנק',
    'baby_safety': 'בטיחות תינוקות',
    'breastfeeding': 'הנקה',
    'formula_feeding': 'תחליף חלב',
    'baby_development': 'התפתחות תינוק',
    'straw_drinking': 'שתייה מקשית'
  };

  const ageRangeLabels = {
    '0-6months': '0-6 חודשים',
    '6-9months': '6-9 חודשים',
    '9-12months': '9-12 חודשים',
    '12-24months': '12-24 חודשים'
  };

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{backgroundColor: 'var(--background-cream)'}}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Badge className="mb-2" style={{backgroundColor: 'var(--primary-salmon)', color: 'white'}}>
              {categoryLabels[article.category] || article.category}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{color: 'var(--text-main)'}}>
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-lg font-light mb-4" style={{color: 'var(--text-soft)'}}>
              {article.excerpt}
            </p>
          )}
          
          <div className="flex justify-center items-center gap-4 text-sm" style={{color: 'var(--text-soft)'}}>
            {article.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>זמן קריאה: {article.reading_time} דקות</span>
              </div>
            )}
            {article.age_ranges && article.age_ranges.length > 0 && (
              <div className="flex gap-2">
                {article.age_ranges.map(range => (
                  <Badge key={range} variant="outline">
                    {ageRangeLabels[range] || range}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {article.image_url && (
          <div className="mb-8">
            <img 
              src={article.image_url} 
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <Card className="card-base">
          <CardContent className="p-8">
            <div 
              className="prose prose-lg max-w-none"
              style={{color: 'var(--text-main)'}}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </CardContent>
        </Card>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <Card className="card-base mt-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium" style={{color: 'var(--text-soft)'}}>תגיות:</span>
                {article.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" className="secondary-cta">
              <ArrowLeft className="w-4 h-4 ml-2" />
              חזרה לעמוד הראשי
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}