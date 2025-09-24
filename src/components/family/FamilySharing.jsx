
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Share2, Copy, Check, UserPlus, Mail, Calendar, Trash2, X } from 'lucide-react';
import { FamilyInvite, FamilyMember, User } from '@/api/entities';
import { generateFamilyInvite } from '@/api/functions';
import { useTranslation } from '../utils/translations';
import { format } from 'date-fns';

const relationshipOptions = [
  { value: 'partner', label: 'בן/בת זוג', labelEn: 'Partner' },
  { value: 'parent', label: 'הורה', labelEn: 'Parent' },
  { value: 'grandparent', label: 'סבא/סבתא', labelEn: 'Grandparent' },
  { value: 'caregiver', label: 'מטפל/ת', labelEn: 'Caregiver' },
  { value: 'professional', label: 'איש מקצוע', labelEn: 'Professional' },
  { value: 'other', label: 'אחר', labelEn: 'Other' }
];

const permissionOptions = [
  { value: 'view', label: 'צפייה', labelEn: 'View', description: 'צפייה במידע התינוק' },
  { value: 'log', label: 'רישום', labelEn: 'Log', description: 'רישום פעילויות יומיות' },
  { value: 'edit', label: 'עריכה', labelEn: 'Edit', description: 'עריכת פרטי התינוק' },
  { value: 'milestones', label: 'אבני דרך', labelEn: 'Milestones', description: 'הוספת אבני דרך' }
];

export default function FamilySharing({ userLanguage, familyId }) {
  const { t, dir, align } = useTranslation(userLanguage);
  const [user, setUser] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  
  const [inviteForm, setInviteForm] = useState({
    invited_email: '',
    invited_name: '',
    relationship: 'partner',
    permissions: ['view', 'log'],
    family_id: familyId // Add family_id to invite form
  });

  useEffect(() => {
    if (familyId) {
        loadData();
    }
  }, [familyId]);

  useEffect(() => {
    setInviteForm(prev => ({...prev, family_id: familyId}));
  }, [familyId])

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Load family members
      if (familyId) {
        const allMembers = await FamilyMember.filter({ family_id: familyId });
        setFamilyMembers(allMembers.filter(m => m.user_email !== currentUser.email));
      } else {
        setFamilyMembers([]); // Clear if no familyId
      }

      // Load pending invites sent by current user for this family
      const invites = await FamilyInvite.filter({ 
        inviter_email: currentUser.email,
        status: 'pending',
        family_id: familyId
      });
      setPendingInvites(invites);

    } catch (error) {
      console.error('Error loading family data:', error);
    }
    setLoading(false);
  };

  const handleSubmitInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);

    try {
      const response = await generateFamilyInvite(inviteForm);
      
      if (response.status === 200) {
        const data = response.data;
        
        // Show success message with invite URL
        alert(`הזמנה נשלחה בהצלחה!\nקישור ההזמנה: ${data.invite_url}\n\nההזמנה תפוג בתאריך: ${format(new Date(data.expires_at), 'dd/MM/yyyy')}`);
        
        // Copy URL to clipboard
        navigator.clipboard.writeText(data.invite_url);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 3000);

        // Reset form
        setInviteForm({
          invited_email: '',
          invited_name: '',
          relationship: 'partner',
          permissions: ['view', 'log'],
          family_id: familyId // Ensure family_id is preserved after reset
        });
        setShowInviteForm(false);
        
        // Reload data
        loadData();
      } else {
        throw new Error(response.data?.error || 'שגיאה ביצירת ההזמנה');
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      alert('אירעה שגיאה בשליחת ההזמנה. נסו שוב.');
    }
    setInviteLoading(false);
  };

  const handlePermissionToggle = (permission) => {
    setInviteForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const copyInviteUrl = async (inviteCode) => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/join-family?code=${inviteCode}`;
    
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedUrl(inviteCode);
      setTimeout(() => setCopiedUrl(false), 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const deleteInvite = async (inviteId) => {
    try {
      await FamilyInvite.delete(inviteId);
      loadData();
    } catch (error) {
      console.error('Error deleting invite:', error);
    }
  };

  if (loading) {
    return (
      <Card className="card-base" style={{ direction: dir }}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" style={{ direction: dir }}>
      {/* Header */}
      <Card className="card-base">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ textAlign: align }}>
            <Users className="w-5 h-5" style={{ color: 'var(--primary-salmon)' }} />
            שיתוף עם המשפחה ואנשי מקצוע
          </CardTitle>
          <p className="text-sm soft-text" style={{ textAlign: align }}>
            שתפו את המידע של התינוק עם בני משפחה, מטפלים ואנשי מקצוע
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setShowInviteForm(true)}
            className="main-cta w-full sm:w-auto"
          >
            <UserPlus className="w-4 h-4 ml-2" />
            הזמנת איש קשר
          </Button>
        </CardContent>
      </Card>

      {/* Current Family Members */}
      {familyMembers.length > 0 && (
        <Card className="card-base">
          <CardHeader>
            <CardTitle style={{ textAlign: align }}>בני משפחה פעילים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div style={{ textAlign: align }}>
                    <p className="font-medium">{member.user_name}</p>
                    <p className="text-sm soft-text">{member.user_email}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {relationshipOptions.find(r => r.value === member.relationship)?.label || member.relationship}
                      </Badge>
                      {member.permissions.map(perm => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {permissionOptions.find(p => p.value === perm)?.label || perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs soft-text">
                    הצטרף ב-{format(new Date(member.joined_at), 'dd/MM/yyyy')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <Card className="card-base">
          <CardHeader>
            <CardTitle style={{ textAlign: align }}>הזמנות ממתינות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div style={{ textAlign: align }}>
                    <p className="font-medium">{invite.invited_name}</p>
                    <p className="text-sm soft-text">{invite.invited_email}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {relationshipOptions.find(r => r.value === invite.relationship)?.label}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                        <Calendar className="w-3 h-3 ml-1" />
                        יפוג ב-{format(new Date(invite.expires_at), 'dd/MM')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyInviteUrl(invite.invite_code)}
                      className="secondary-cta"
                    >
                      {copiedUrl === invite.invite_code ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent style={{ direction: dir }}>
                        <AlertDialogHeader>
                          <AlertDialogTitle style={{ textAlign: align }}>מחיקת הזמנה</AlertDialogTitle>
                          <AlertDialogDescription style={{ textAlign: align }}>
                            האם אתם בטוחים שברצונכם למחוק את ההזמנה? פעולה זו לא ניתנת לביטול.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ביטול</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteInvite(invite.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            מחיקה
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Form Dialog */}
      {showInviteForm && (
        <Card className="card-base">
          <CardHeader>
            <CardTitle className="flex items-center justify-between" style={{ textAlign: align }}>
              הזמנת איש קשר חדש
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInviteForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitInvite} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label style={{ textAlign: align }}>שם מלא</Label>
                  <Input
                    value={inviteForm.invited_name}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, invited_name: e.target.value }))}
                    placeholder="הכניסו את השם המלא"
                    required
                    style={{ textAlign: align }}
                  />
                </div>
                <div>
                  <Label style={{ textAlign: align }}>כתובת מייל</Label>
                  <Input
                    type="email"
                    value={inviteForm.invited_email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, invited_email: e.target.value }))}
                    placeholder="example@email.com"
                    required
                    style={{ textAlign: align }}
                  />
                </div>
              </div>

              <div>
                <Label style={{ textAlign: align }}>קשר משפחתי</Label>
                <Select
                  value={inviteForm.relationship}
                  onValueChange={(value) => setInviteForm(prev => ({ ...prev, relationship: value }))}
                >
                  <SelectTrigger style={{ textAlign: align }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} style={{ textAlign: align }}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label style={{ textAlign: align }}>הרשאות</Label>
                <div className="space-y-2 mt-2">
                  {permissionOptions.map(permission => (
                    <div key={permission.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`perm-${permission.value}`}
                        checked={inviteForm.permissions.includes(permission.value)}
                        onCheckedChange={() => handlePermissionToggle(permission.value)}
                      />
                      <Label htmlFor={`perm-${permission.value}`} className="text-sm">
                        <span className="font-medium">{permission.label}</span>
                        <span className="text-gray-500 mr-2">- {permission.description}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={inviteLoading}
                  className="main-cta flex-1"
                >
                  {inviteLoading ? 'שולח הזמנה...' : 'שליחת הזמנה'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteForm(false)}
                  className="secondary-cta"
                >
                  ביטול
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
