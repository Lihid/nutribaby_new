
import React, { useState, useEffect } from "react";
import { Baby as BabyEntity, User, TastingGuideDay, Article } from "@/api/entities"; // Removed ArticleImage import
import WelcomeCard from "../components/dashboard/WelcomeCard";
import DailyInsights from "../components/dashboard/DailyInsights";
import DailyRecipe from "../components/dashboard/DailyRecipe";
import QuickActions from "../components/dashboard/QuickActions";
import DailyTastingRecommendation from "../components/dashboard/DailyTastingRecommendation";
import { differenceInMonths, format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, BookOpen, Utensils, Baby, Star, ChefHat, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../components/utils/translations";

export default function Dashboard() {
  const [baby, setBaby] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ageInMonths, setAgeInMonths] = useState(null);
  const [error, setError] = useState(null);
  const [allGuideDays, setAllGuideDays] = useState([]);
  // const [articleImages, setArticleImages] = useState({}); // Removed articleImages state
  const [randomSeed, setRandomSeed] = useState(Math.random());
  const [articleRandomSeed, setArticleRandomSeed] = useState(Math.random());
  const [dynamicArticles, setDynamicArticles] = useState([]); // Add dynamic articles state

  // Add translation hook
  const { t, dir, align } = useTranslation(user?.preferred_language);

  const ageGuides = [
  {
    title: t('age_guide_0_6_title'),
    subtitle: t('building_foundation'),
    url: createPageUrl("AgeGuide0to6"),
    icon: Baby,
    imageUrl: 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    title: t('age_guide_6_9_title'),
    subtitle: t('first_tasting_adventure'),
    url: createPageUrl("AgeGuide6to9"),
    icon: ChefHat,
    imageUrl: 'https://images.pexels.com/photos/6393332/pexels-photo-6393332.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    title: t('age_guide_9_12_title'),
    subtitle: t('independence_finger_foods'),
    url: createPageUrl("AgeGuide9to12"),
    icon: Baby,
    imageUrl: 'https://images.pexels.com/photos/792829/pexels-photo-792829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    title: t('age_guide_12_24_title'),
    subtitle: t('family_meals_subtitle'),
    url: createPageUrl("AgeGuide12to24"),
    icon: Utensils,
    imageUrl: 'https://images.pexels.com/photos/7608998/pexels-photo-7608998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }];

  let currentGuide = null;
  if (ageInMonths !== null) {
    if (ageInMonths < 6) currentGuide = ageGuides.find((g) => g.title === t('age_guide_0_6_title'));else
    if (ageInMonths < 9) currentGuide = ageGuides.find((g) => g.title === t('age_guide_6_9_title'));else
    if (ageInMonths < 12) currentGuide = ageGuides.find((g) => g.title === t('age_guide_9_12_title'));else
    if (ageInMonths <= 24) currentGuide = ageGuides.find((g) => g.title === t('age_guide_12_24_title'));
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const babies = await BabyEntity.filter({ created_by: currentUser.email });
      if (babies.length > 0) {
        const currentBaby = babies[0];
        setBaby(currentBaby);
        if (currentBaby.birth_date) {
          const age = differenceInMonths(new Date(), new Date(currentBaby.birth_date));
          setAgeInMonths(age);
        }
      }

      const guideDaysData = await TastingGuideDay.list('day_number', 100);
      setAllGuideDays(guideDaysData);

      // Load dynamic articles from database
      try {
        const articlesData = await Article.filter({ published: true }, 'order_index');
        setDynamicArticles(articlesData);
      } catch (articleError) {
        console.log('Error loading dynamic articles:', articleError);
      }

      // Removed loading of custom article images
      // try {
      //   const customImages = await ArticleImage.list();
      //   const imageMap = {};
      //   customImages.forEach(img => {
      //     imageMap[img.article_key] = img.image_url;
      //   });
      //   setArticleImages(imageMap);
      // } catch (imageError) {
      //   console.log('No custom article images found, using defaults');
      // }

      // Generate new random seeds for recipe and article selection
      setRandomSeed(Math.random());
      setArticleRandomSeed(Math.random());

    } catch (err) {
      console.error("Error loading data:", err);
      setError(t('data_loading_error'));
    }
    setLoading(false);
  };

  const formatAge = (birthDate) => {
    if (!birthDate) return "";

    try {
      const today = new Date();
      const birth = new Date(birthDate);

      console.log('Birth date:', birth.toLocaleDateString());
      console.log('Today:', today.toLocaleDateString());

      const ageInMonths = differenceInMonths(today, birth);

      console.log('Calculated age in months:', ageInMonths);

      if (ageInMonths < 0) return t('newborn');
      if (ageInMonths < 1) return t('newborn');
      if (ageInMonths === 1) return user?.preferred_language === 'en' ? '1 month' : 'חודש אחד';
      if (ageInMonths < 12) return `${ageInMonths} ${t('months')}`;

      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      if (months === 0) return `${years} ${years > 1 ? t('years') : t('year')}`;
      return `${years} ${years > 1 ? t('years') : t('year')} ${user?.preferred_language === 'en' ? 'and' : 'ו-'}${months} ${months > 1 ? t('months') : t('months')}`;
    } catch (error) {
      console.error("Error calculating age:", error);
      return t('newborn');
    }
  };

  // Modified article selection logic to use dynamic articles - FIXED
  let recommendedArticle = null;
  if (ageInMonths !== null && dynamicArticles.length > 0) {
    // Determine current age range more precisely
    const currentAgeRange = ageInMonths < 6 ? '0-6months' :
                           ageInMonths < 9 ? '6-9months' :
                           ageInMonths < 12 ? '9-12months' : '12-24months';
    
    console.log('Current baby age:', ageInMonths, 'months');
    console.log('Age range:', currentAgeRange);
    
    // Filter articles suitable for the baby's EXACT age range
    const suitableArticles = dynamicArticles.filter(article => {
      // Only show articles that specifically target this age range
      if (!article.age_ranges || article.age_ranges.length === 0) {
        return false; // Don't show general articles
      }
      
      const hasMatchingRange = article.age_ranges.includes(currentAgeRange);
      console.log('Article:', article.title, 'Age ranges:', article.age_ranges, 'Matches:', hasMatchingRange);
      
      return hasMatchingRange;
    });
    
    console.log('Suitable articles found:', suitableArticles.length);
    
    // If there are suitable articles, pick one based on articleRandomSeed
    if (suitableArticles.length > 0) {
      const randomIndex = Math.floor(articleRandomSeed * suitableArticles.length);
      const selectedArticle = suitableArticles[randomIndex];
      
      console.log('Selected article:', selectedArticle.title);
      
      recommendedArticle = {
        title: selectedArticle.title,
        subtitle: selectedArticle.excerpt || '',
        url: createPageUrl("DynamicArticle") + `?slug=${selectedArticle.slug}`,
        imageUrl: selectedArticle.image_url || 'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      };
    } else {
      console.log('No suitable articles found for age range:', currentAgeRange);
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8" style={{ direction: dir }}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 rounded-xl" style={{ backgroundColor: 'var(--secondary-yellow)' }}></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-64 rounded-xl" style={{ backgroundColor: 'var(--card-background-mint)' }}></div>
              <div className="h-64 rounded-xl" style={{ backgroundColor: 'var(--secondary-yellow)' }}></div>
              <div className="h-64 rounded-xl" style={{ backgroundColor: 'var(--card-background-mint)' }}></div>
            </div>
          </div>
        </div>
      </div>);

  }

  if (error) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)', direction: dir }}>
        <Card className="card-base text-center p-8">
          <CardContent>
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--primary-salmon)' }} />
            <h2 className="text-2xl font-semibold mb-2" style={{ textAlign: align }}>{t('oops_something_wrong')}</h2>
            <p className="soft-text mb-6" style={{ textAlign: align }}>{error}</p>
            <Button onClick={loadData} className="main-cta">
              <RefreshCw className="w-4 h-4 ml-2" />
              {t('try_again')}
            </Button>
          </CardContent>
        </Card>
      </div>);

  }

  return (
    <div className="p-4 md:p-8" style={{ direction: dir }}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2 text-xl font-semibold" style={{ color: 'var(--text-main)', textAlign: align }}>
            {t('welcome_to_nutribaby')}
          </h1>
          <p className="text-md font-light soft-text" style={{ textAlign: align }}>
            {t('complete_guide_nutrition')}
          </p>
        </div>

        <WelcomeCard
          babyName={baby?.name}
          babyAge={baby?.birth_date ? formatAge(baby.birth_date) : null}
          userLanguage={user?.preferred_language}
          babyImage={baby?.image_url} />


        {ageInMonths >= 6 && ageInMonths <= 9 &&
        <DailyTastingRecommendation baby={baby} allGuideDays={allGuideDays} />
        }
        
        <div className="card-base p-6">
          <h2 className="text-2xl font-medium mb-6 flex items-center gap-2" style={{ textAlign: align }}>
            <BookOpen className="w-6 h-6" style={{ color: "var(--primary-salmon)" }} />
            {baby ? t('personalized_articles') : t('articles_and_features')}
          </h2>
          
          {recommendedArticle && baby ? (
            <>
              <Link to={recommendedArticle.url}>
                <div className="card-base overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center group bg-white border border-[var(--border-light)]">
                  <div className="w-full sm:w-1/3 h-48 sm:h-auto sm:self-stretch">
                    <img 
                      src={recommendedArticle.imageUrl} 
                      alt={recommendedArticle.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                      }}
                    />
                  </div>
                  <div className="flex-1 p-6" style={{ textAlign: align }}>
                    <Badge className="mb-2 bg-[var(--primary-salmon)] text-white hover:bg-[var(--primary-salmon)]">{t('recommended_for_your_age')}</Badge>
                    <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text-main)' }}>
                      {recommendedArticle.title}
                    </h3>
                    <p className="font-light text-sm opacity-90 mb-4" style={{ color: 'var(--text-soft)' }}>{recommendedArticle.subtitle}</p>
                    <div className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--primary-salmon)' }}>
                      <span>{t('read_more')}</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
              {(() => {
                const currentAgeRange = ageInMonths < 6 ? '0-6months' :
                                       ageInMonths < 9 ? '6-9months' :
                                       ageInMonths < 12 ? '9-12months' : '12-24months';
                
                return (
                  <div className="mt-6 text-center">
                    <Link to={createPageUrl("AgeSpecificArticles") + `?age_range=${currentAgeRange}`}>
                      <Button variant="outline" className="secondary-cta gap-2">
                        <span>{t('more_articles_for_age')}</span>
                        <ArrowLeft className="w-4 h-4"/>
                      </Button>
                    </Link>
                  </div>
                );
              })()}
            </>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {ageGuides.map((guide) => (
                <Link to={guide.url} key={guide.title}>
                  <div className="card-base overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center group">
                      <div className="w-full sm:w-1/3 h-48 sm:h-auto sm:self-stretch">
                          <img src={guide.imageUrl} alt={guide.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div className="flex-1 p-6" style={{ textAlign: align }}>
                          <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text-main)' }}>
                              {guide.title}
                          </h3>
                          <p className="font-light text-sm opacity-90 mb-4" style={{ color: 'var(--text-soft)' }}>{guide.subtitle}</p>
                          <div className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--primary-salmon)' }}>
                              <span>{t('read_more')}</span>
                              <ArrowLeft className="w-4 h-4" />
                          </div>
                      </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <DailyRecipe userLanguage={user?.preferred_language} />
          <DailyInsights 
            userLanguage={user?.preferred_language} 
            babyAgeInMonths={ageInMonths}
          />
        </div>
      </div>
    </div>
  );
}
