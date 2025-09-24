
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const ageGuides = [
  { title: "0-6 חודשים", url: createPageUrl("AgeGuide0to6") },
  { title: "6-9 חודשים", url: createPageUrl("AgeGuide6to9") },
  { title: "9-12 חודשים", url: createPageUrl("AgeGuide9to12") },
  { title: "12-24 חודשים", url: createPageUrl("AgeGuide12to24") }
];

export default function AgeNavigation() {
    const location = useLocation();

    return (
        <Card className="card-base mt-12">
            <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
                    <BookOpen className="w-5 h-5" style={{color: "var(--primary-salmon)"}} />
                    עברו בין המאמרים
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ageGuides.map(guide => {
                        const isActive = location.pathname === guide.url;
                        return (
                            <Link to={guide.url} key={guide.title}>
                                <Button 
                                    className={`w-full ${isActive ? 'main-cta' : 'secondary-cta'}`}
                                >
                                    {guide.title}
                                </Button>
                            </Link>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
