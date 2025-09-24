import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FamilyMealsGuide() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dynamic article
    navigate(createPageUrl('DynamicArticle') + '?slug=family-meals-guide', { replace: true });
  }, [navigate]);

  return null;
}