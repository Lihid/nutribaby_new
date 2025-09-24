import React, { useState, useEffect } from 'react';
import { BabyMilestone, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { useTranslation } from '../components/utils/translations';

export default function MilestonesExport() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { t } = useTranslation(user?.preferred_language);

  const milestoneTypes = {
    first_smile: { emoji: "😊", label: t('first_smile') },
    first_tooth: { emoji: "🦷", label: t('first_tooth') },
    first_step: { emoji: "👶", label: t('first_step') },
    first_word: { emoji: "🗣️", label: t('first_word') },
    sitting_up: { emoji: "🪑", label: t('sitting_up') },
    crawling: { emoji: "🐛", label: t('crawling') },
    first_food: { emoji: "🥄", label: t('first_food') },
    first_birthday: { emoji: "🎂", label: t('first_birthday') },
    potty_trained: { emoji: "🚽", label: t('potty_trained') },
    other: { emoji: "⭐", label: t('other') }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        const data = await BabyMilestone.filter({ created_by: currentUser.email }, '-date_achieved');
        setMilestones(data);
      } catch (error) {
        console.error("Error loading milestones for export:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">טוען את הרגעים שלכם...</div>;
  }

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-area, .printable-area * {
              visibility: visible;
            }
            .printable-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none;
            }
            .milestone-card-print {
              page-break-inside: avoid;
              border: 1px solid #eee;
            }
          }
        `}
      </style>
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="no-print flex justify-between items-center mb-8">
            <Link to={createPageUrl("BabyProfile")}>
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 ml-2" />
                חזרה לפרופיל
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">ייצוא אבני דרך</h1>
            <Button onClick={() => window.print()} className="main-cta">
              <Printer className="w-4 h-4 ml-2" />
              הדפסה או שמירה כ-PDF
            </Button>
          </div>

          <div className="printable-area space-y-6">
            <div className="text-center mb-8 p-4 border-b-2 border-dashed">
                <Star className="w-12 h-12 mx-auto" style={{color: 'var(--primary-salmon)'}} />
                <h2 className="text-4xl font-bold mt-2" style={{fontFamily: "'Assistant', sans-serif"}}>אבני הדרך שלנו</h2>
                <p className="text-lg text-gray-600">כל הרגעים המיוחדים שתועדו</p>
            </div>

            {milestones.map(milestone => {
              const typeData = milestoneTypes[milestone.milestone_type] || milestoneTypes.other;
              return (
                <div key={milestone.id} className="bg-white rounded-xl p-6 shadow-md milestone-card-print">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{typeData.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-semibold" style={{color: 'var(--primary-salmon)'}}>{milestone.title}</h3>
                      <p className="text-gray-500">
                        {format(new Date(milestone.date_achieved), 'd MMMM yyyy')}
                        {milestone.age_months !== null && ` • גיל ${milestone.age_months} חודשים`}
                      </p>
                    </div>
                  </div>
                  
                  {milestone.image_url && (
                    <div className="mb-4">
                      <img src={milestone.image_url} alt={milestone.title} className="w-full h-auto max-h-96 object-contain rounded-lg" />
                    </div>
                  )}

                  {milestone.description && (
                    <p className="text-gray-700 text-lg leading-relaxed mb-2">{milestone.description}</p>
                  )}
                  {milestone.notes && (
                    <p className="text-gray-500 bg-gray-50 p-3 rounded-md">
                      <strong>הערות:</strong> {milestone.notes}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  );
}