import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Check, AlertCircle, Loader } from 'lucide-react';
import { FamilyInvite, User } from '@/api/entities';
import { acceptFamilyInvite } from '@/api/functions';
import { createPageUrl } from '@/utils';

const relationshipLabels = {
  partner: 'בן/בת זוג',
  parent: 'הורה', 
  grandparent: 'סבא/סבתא',
  caregiver: 'מטפל/ת',
  other: 'אחר'
};

const permissionLabels = {
  view: 'צפייה',
  log: 'רישום',
  edit: 'עריכה',
  milestones: 'אבני דרך'
};

export default function JoinFamily() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const inviteCode = searchParams.get('code');

  useEffect(() => {
    loadInviteData();
  }, [inviteCode]);

  const loadInviteData = async () => {
    if (!inviteCode) {
      setError('קוד הזמנה חסר');
      setLoading(false);
      return;
    }

    try {
      // First check if user is authenticated
      const currentUser = await User.me();
      setUser(currentUser);

      // Load invite details
      const invites = await FamilyInvite.filter({
        invite_code: inviteCode,
        status: 'pending'
      });

      if (invites.length === 0) {
        setError('הזמנה לא תקינה או שפגה');
        setLoading(false);
        return;
      }

      const inviteData = invites[0];
      
      // Check if invite has expired
      if (new Date(inviteData.expires_at) < new Date()) {
        setError('ההזמנה פגה');
        setLoading(false);
        return;
      }

      // Check if user email matches invited email
      if (currentUser.email !== inviteData.invited_email) {
        setError('ההזמנה נשלחה לכתובת מייל אחרת');
        setLoading(false);
        return;
      }

      setInvite(inviteData);
    } catch (error) {
      console.error('Error loading invite:', error);
      if (error.message && error.message.includes('not authenticated')) {
        // Redirect to login with return URL
        const loginUrl = `/login?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        window.location.href = loginUrl;
        return;
      }
      setError('אירעה שגיאה בטעינת ההזמנה');
    }
    setLoading(false);
  };

  const handleAcceptInvite = async () => {
    setAccepting(true);
    setError(null);

    try {
      const response = await acceptFamilyInvite({ invite_code: inviteCode });
      
      if (response.status === 200) {
        setSuccess(true);
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          navigate(createPageUrl('BabyProfile'));
        }, 2000);
      } else {
        throw new Error(response.data?.error || 'שגיאה בקבלת ההזמנה');
      }
    } catch (error) {
      console.error('Error accepting invite:', error);
      setError(error.message || 'אירעה שגיאה בקבלת ההזמנה');
    }
    setAccepting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: 'var(--background-cream)'}}>
        <Card className="card-base max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4" style={{color: 'var(--primary-salmon)'}} />
            <p>טוען הזמנה...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: 'var(--background-cream)'}}>
        <Card className="card-base max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">שגיאה</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={() => navigate(createPageUrl('Dashboard'))}
              variant="outline"
            >
              חזרה לעמוד הראשי
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: 'var(--background-cream)'}}>
        <Card className="card-base max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Check className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-xl font-semibold mb-2">ברוכים הבאים למשפחה!</h2>
            <p className="text-gray-600 mb-4">הצטרפתם בהצלחה. מועברים אתכם לפרופיל התינוק...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: 'var(--background-cream)'}}>
      <Card className="card-base max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'var(--secondary-yellow)'}}>
            <Users className="w-10 h-10" style={{color: 'var(--primary-salmon)'}} />
          </div>
          <CardTitle className="text-2xl">הזמנה למשפחה</CardTitle>
          <p className="text-gray-600">הוזמנתם להצטרף למעקב אחר התינוק</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {invite && (
            <>
              <div className="text-center space-y-2">
                <p className="text-lg">
                  <span className="font-medium">{invite.invited_name}</span>
                </p>
                <p className="text-sm text-gray-600">{invite.invited_email}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">תפקיד במשפחה:</p>
                  <Badge variant="outline">
                    {relationshipLabels[invite.relationship] || invite.relationship}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">הרשאות שתקבלו:</p>
                  <div className="flex flex-wrap gap-1">
                    {invite.permissions?.map(permission => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permissionLabels[permission] || permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Heart className="w-4 h-4" style={{color: 'var(--primary-salmon)'}} />
                  <span>תוכלו לראות ולעקוב אחר התקדמות התינוק, לתעד פעילויות ועוד</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleAcceptInvite}
                  disabled={accepting}
                  className="w-full main-cta"
                >
                  {accepting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin ml-2" />
                      מצטרף למשפחה...
                    </>
                  ) : (
                    'הצטרפות למשפחה'
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl('Dashboard'))}
                  className="w-full"
                  disabled={accepting}
                >
                  ביטול
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}