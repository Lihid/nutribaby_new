import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Baby, ArrowRight } from 'lucide-react';
import { differenceInMonths } from 'date-fns';
import { useTranslation } from '../utils/translations';

export default function WelcomeCard({ babyName, babyAge, userLanguage, babyImage }) {
    const { t, dir, align } = useTranslation(userLanguage);
    
    return (
        <Card className="shadow-md border" style={{borderColor: 'var(--border-light)', backgroundColor: '#fef2f2', direction: dir}}>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 overflow-hidden" style={{borderColor: 'var(--primary-salmon)'}}>
                           {babyImage ? (
                               <img src={babyImage} alt={t('baby_image_alt')} className="w-full h-full object-cover" />
                           ) : (
                               <Baby className="w-8 h-8" style={{color: 'var(--primary-salmon)'}}/>
                           )}
                        </div>
                        <div style={{ textAlign: align }}>
                            {babyName ? (
                                <>
                                    <h2 className="text-2xl font-semibold" style={{color: 'var(--text-main)'}}>
                                        {t('hi_baby', { name: babyName })}
                                    </h2>
                                    <p className="font-light soft-text">{babyAge}</p>
                                </>
                            ) : (
                                <h2 className="text-2xl font-semibold" style={{color: 'var(--text-main)'}}>
                                    {t('welcome')}
                                </h2>
                            )}
                        </div>
                    </div>
                    
                    {!babyName && (
                        <Link to={createPageUrl("BabyProfile")}>
                            <Button className="main-cta flex items-center gap-2">
                                <span>{t('add_baby_details')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}