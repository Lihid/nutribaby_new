import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FingerFoodsGuide() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dynamic article
    navigate(createPageUrl('DynamicArticle') + '?slug=finger-foods-guide', { replace: true });
  }, [navigate]);

  return null;
}