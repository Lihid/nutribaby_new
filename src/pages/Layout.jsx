

import React, { useState, useEffect } from 'react';
import { Baby, Home, MessageCircle, Clock, User as UserIcon } from 'lucide-react';
import { User } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/utils/translations';

function BottomNavBar({ userLanguage }) {
  const { t } = useTranslation(userLanguage);
  
  const navigationItems = [
    { name: t('home'), icon: Home, page: 'Dashboard' },
    { name: t('recipes'), icon: Baby, page: 'MealPlanner' },
    { name: t('daily_log'), icon: Clock, page: 'FeedingLog' },
    { name: t('profile'), icon: UserIcon, page: 'BabyProfile' },
    { name: t('questions'), icon: MessageCircle, page: 'Chat' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border-light)] z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {navigationItems.map((item) => (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className="flex flex-col items-center p-2 text-xs"
            >
              <item.icon 
                className="w-6 h-6 mb-1" 
                style={{color: 'var(--primary-salmon)'}} 
              />
              <span className="text-[var(--text-soft)]">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function Layout({ children, currentPageName }) {
  const [userLanguage, setUserLanguage] = useState('he');
  
  useEffect(() => {
    const loadUserLanguage = async () => {
      try {
        const user = await User.me();
        if (user?.preferred_language) {
          setUserLanguage(user.preferred_language);
        }
      } catch (error) {
        console.log('User not logged in, using default Hebrew');
      }
    };
    loadUserLanguage();
  }, []);

  const isRTL = userLanguage === 'he';

  return (
    <>
      <style>
        {`
          :root {
            --primary-salmon: #fda4af;
            --secondary-yellow: #FFF2D6;
            --background-cream: #FEFCF7;
            --card-background-mint: #F0F8F1;
            --tertiary-green: #F0F8F1;
            --primary-green: #8BC34A;
            --primary-orange: #FF9800;
            --primary-mint: #4CAF50;
            --text-main: #2E2E2E;
            --text-soft: #6B6B6B;
            --border-light: #E8E8E8;
          }
          @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          body {
            direction: ${isRTL ? 'rtl' : 'ltr'};
            font-family: ${isRTL ? "'Assistant', system-ui, -apple-system, sans-serif" : "'Inter', system-ui, -apple-system, sans-serif"};
            font-weight: 400;
            background: var(--background-cream);
            color: var(--text-main);
            min-height: 100vh;
            padding-bottom: 80px; /* Add padding to prevent content from hiding behind nav */
          }
          * {
            text-align: ${isRTL ? 'right' : 'left'};
            color: var(--text-main);
          }
          .soft-text {
            color: var(--text-soft);
          }
          .ltr {
            direction: ltr;
            text-align: left;
          }
          .rtl {
            direction: rtl;  
            text-align: right;
          }
          .card-base {
            background-color: white;
            border-width: 1px;
            border-color: var(--border-light);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.03), 0 2px 4px -2px rgb(0 0 0 / 0.03);
            border-radius: 1rem;
          }
          input, textarea, select {
            text-align: ${isRTL ? 'right' : 'left'};
            border-color: var(--border-light) !important;
          }
          input:focus, textarea:focus, select:focus, button:focus-visible {
             outline: 2px solid var(--primary-salmon) !important;
             outline-offset: 2px;
             border-color: var(--primary-salmon) !important;
          }
          input::placeholder, textarea::placeholder {
            text-align: ${isRTL ? 'right' : 'left'};
            opacity: 1;
            color: var(--text-soft);
          }
          h1, h2, h3, h4, h5, h6 {
            font-weight: 600;
          }
          .font-light {
            font-weight: 300;
          }
          .font-medium {
            font-weight: 500;
          }
          .main-cta {
            background: linear-gradient(135deg, var(--primary-salmon) 0%, #F2A1B1 100%) !important;
            color: white !important;
            border: none !important;
            box-shadow: 0 2px 8px rgba(244, 165, 165, 0.3);
            transition: all 0.2s ease;
          }
          .main-cta span, .main-cta svg {
             color: white !important;
          }
          .main-cta:hover {
            transform: translateY(-1px);
            box-shadow: 0 44px 12px rgba(244, 165, 165, 0.4);
          }
          .secondary-cta {
             background: linear-gradient(135deg, var(--secondary-yellow) 0%, #FFF8E1 100%) !important;
             color: var(--text-main) !important;
             border: 1px solid var(--border-light) !important;
             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
           .secondary-cta:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
           .secondary-cta span, .secondary-cta svg {
             color: var(--text-main) !important;
          }
          
          /* Bottom navigation styles */
          .bottom-nav {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 1000 !important;
            background: white !important;
            border-top: 1px solid var(--border-light) !important;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1) !important;
          }
        `}
      </style>
      <div className="min-h-screen w-full" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <main className="w-full">
          {children}
        </main>
        <div className="bottom-nav">
          <BottomNavBar userLanguage={userLanguage} />
        </div>
      </div>
    </>
  );
}

