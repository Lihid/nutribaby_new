
import React, { useState, useEffect } from "react";
import { Baby, User, FamilyMember } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Baby as BabyIcon, Heart, Scale, Calendar, AlertTriangle, Plus, X, CheckSquare, ChevronDown, RefreshCw, ImageIcon, Trash2, UserX } from "lucide-react";
import MilestoneTracker from "../components/profile/MilestoneTracker";
import { format, differenceInMonths } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import LanguageSelector from "../components/LanguageSelector";
import { useTranslation } from "../components/utils/translations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const foodsToTry = {
  ירקות: ["בטטה", "גזר", "דלעת", "קישוא", "תפוח אדמה", "ברוקולי", "כרובית", "אפונה"],
  פירות: ["תפוח", "בננה", "אגס", "אבוקדו", "שזיף", "אפרסק", "מנגו"],
  דגנים: ["שיבולת שועל", "אורז", "סולת", "קינואה"],
  חלבונים: ["עוף", "הודו", "עדשים אדומות", "שעועית שחורה", "טופו"],
  אלרגנים: ["ביצים", "מוצרי חלב", "חיטה", "שומשום", "בוטנים", "אגוזים", "סויה", "דגים", "פירות ים"]
};

const commonAllergens = [
  "פירות ים", "דגים", "סויה", "מוצרי חלב", "חיטה", "אגוזים", "ביצים", "שומשום", "בוטנים"
];

export default function BabyProfile() {
  const [baby, setBaby] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    birth_date: "",
    current_weight: "",
    feeding_method: "",
    allergies: [],
    tasted_foods: [],
    image_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [familyId, setFamilyId] = useState(null);

  // Add translation hook
  const { t, dir, align } = useTranslation(user?.preferred_language);

  useEffect(() => {
    loadBabyData();
  }, []);

  const loadBabyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const babies = await Baby.list();
      if (babies.length > 0) {
        const babyData = babies[0];
        setBaby(babyData);
        if (babyData.family_id) {
          setFamilyId(babyData.family_id);
        }
        setFormData({
          name: babyData.name || "",
          nickname: babyData.nickname || "",
          image_url: babyData.image_url || "",
          birth_date: babyData.birth_date || "",
          current_weight: babyData.current_weight || "",
          feeding_method: babyData.feeding_method || "",
          allergies: babyData.allergies || [],
          tasted_foods: babyData.tasted_foods || []
        });
      } else {
        setIsEditing(true);
      }
    } catch (err) {
      console.error("Error loading baby data:", err);
      setError(t('error_occurred'));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      const currentUser = await User.me();
      let currentFamilyId = familyId;

      // If user doesn't have a family_id, create one
      if (!currentFamilyId) {
        const familyMembers = await FamilyMember.filter({ user_email: currentUser.email });
        if (familyMembers.length > 0) {
          currentFamilyId = familyMembers[0].family_id;
        } else {
          // Create a new family ID and member record for the user
          currentFamilyId = `family_${currentUser.email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
          await FamilyMember.create({
            family_id: currentFamilyId,
            user_email: currentUser.email,
            user_name: currentUser.full_name || currentUser.email,
            relationship: 'primary',
            permissions: ['admin', 'view', 'edit', 'log', 'milestones'],
            joined_at: new Date().toISOString(),
            is_active: true
          });
        }
        setFamilyId(currentFamilyId);
      }
      
      const dataToSave = {
        ...formData,
        current_weight: formData.current_weight ? parseFloat(formData.current_weight) : null,
        family_id: currentFamilyId // Ensure family_id is saved with the baby
      };

      if (baby) {
        await Baby.update(baby.id, dataToSave);
      } else {
        await Baby.create({ ...dataToSave, created_by: currentUser.email });
      }

      setIsEditing(false);
      loadBabyData();
    } catch (error) {
      console.error("Error saving baby data:", error);
    }
  };

  const handleAllergyToggle = (allergen) => {
    setFormData((prev) => {
      const currentAllergies = prev.allergies || [];
      const newAllergies = currentAllergies.includes(allergen)
        ? currentAllergies.filter((a) => a !== allergen)
        : [...currentAllergies, allergen];
      return { ...prev, allergies: newAllergies };
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData((prev) => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTastedFoodToggle = async (food) => {
    const currentTasted = formData.tasted_foods || [];
    const newTasted = currentTasted.includes(food) ?
      currentTasted.filter((f) => f !== food) :
      [...currentTasted, food];

    setFormData((prev) => ({ ...prev, tasted_foods: newTasted }));

    if (baby) {
      try {
        await Baby.update(baby.id, { tasted_foods: newTasted });
        setBaby((prevBaby) => ({ ...prevBaby, tasted_foods: newTasted }));
      } catch (error) {
        console.error("Error updating tasted foods:", error);
      }
    }
  };

  const getAgeString = (birthDate) => {
    if (!birthDate) return "";

    try {
      const today = new Date();
      const birth = new Date(birthDate);
      const ageInMonths = differenceInMonths(today, birth);

      if (ageInMonths < 0) return t('newborn');
      if (ageInMonths < 1) return t('newborn');
      if (ageInMonths === 1) return user?.preferred_language === 'en' ? '1 month' : 'חודש אחד';
      if (ageInMonths < 12) return `${ageInMonths} ${t('months')}`;

      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      if (months === 0) return `${years} ${years > 1 ? t('years') : t('year')}`;
      return `${years} ${years > 1 ? t('years') : t('year')} ${t('and_connector')}${months} ${t('months')}`;
    } catch (error) {
      console.error("Error calculating age in profile:", error);
      return t('newborn');
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    try {
      await User.updateMyUserData({ preferred_language: newLanguage });
      setUser((prev) => ({ ...prev, preferred_language: newLanguage }));
      window.location.reload();
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      
      if (baby) {
        await Baby.delete(baby.id);
      }
      
      await User.logout();
      // Redirect to home or login after successful deletion and logout
      window.location.href = '/'; 
      
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(t('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-[var(--secondary-yellow)] rounded-xl"></div>
            <div className="h-96 bg-[var(--secondary-yellow)] rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
        <Card className="card-base text-center p-8">
          <CardContent>
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--primary-salmon)' }} />
            <h2 className="text-2xl font-semibold mb-2">{t('error_occurred')}</h2>
            <p className="soft-text mb-6">{error}</p>
            <Button onClick={loadBabyData} className="main-cta">
              <RefreshCw className="w-4 h-4 ml-2" />
              {t('try_again')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Define userLanguage for MilestoneTracker
  const userLanguage = user?.preferred_language;

  return (
    <div className="p-4 md:p-8" style={{ direction: dir }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('baby_profile')}
          </h1>
          <p className="text-md soft-text">
            {t('follow_growth')}
          </p>
        </div>

        {/* Language Selector */}
        <Card className="card-base">
          <CardContent className="p-4">
            <LanguageSelector
              value={userLanguage || 'he'}
              onChange={handleLanguageChange}
              label={t('language_setting')}
            />
          </CardContent>
        </Card>

        {/* Rest of profile content */}
        <Card className="card-base overflow-hidden mt-8">
          <CardHeader className="text-white p-6" style={{ background: '#fef2f2' }}>
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="bg-white/20 text-slate-950 px-4 py-2 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-10 border-white/30 hover:bg-white/30 rounded-xl"
                style={{color: 'var(--text-main)', borderColor: 'var(--border-light)'}}
              >
                {isEditing ? t('cancel') : t('edit_profile')}
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full overflow-hidden flex items-center justify-center border-2 border-white/50">
                  {baby?.image_url ? (
                    <img src={baby.image_url} alt={t('baby_image_alt')} className="w-full h-full object-cover" />
                  ) : (
                    <BabyIcon className="w-8 h-8 text-white" />
                  )}
                </div>
                <div style={{ textAlign: align }}>
                  <CardTitle className="text-2xl" style={{color: 'var(--text-main)'}}>
                    {baby?.name || t('setup_baby_profile_title')}
                    {baby?.nickname && <span className="text-lg font-light ml-2">({baby.nickname})</span>}
                  </CardTitle>
                  <p className="soft-text">
                    {baby?.birth_date ? getAgeString(baby.birth_date) : t('add_birth_date_prompt')}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isEditing ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="image_upload">{t('profile_picture')}</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border">
                      {formData.image_url ? (
                        <img src={formData.image_url} alt={t('baby_image_alt')} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id="image_upload"
                        type="file"
                        onChange={handleImageUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-yellow)] file:text-[var(--primary-salmon)] hover:file:bg-[var(--primary-salmon)] hover:file:text-white"
                        disabled={isUploading}
                        accept="image/*"
                      />
                      {isUploading && (
                        <div className="flex items-center gap-2 mt-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-[var(--primary-salmon)]" />
                          <span>{t('loading')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('baby_name')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder={t('enter_baby_name_placeholder')}
                      style={{ textAlign: align }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nickname">{t('baby_nickname')}</Label>
                    <Input
                      id="nickname"
                      value={formData.nickname}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
                      placeholder={t('baby_nickname_placeholder')}
                      style={{ textAlign: align }}
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">{t('birth_date')}</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, birth_date: e.target.value }))}
                      style={{ textAlign: align }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_weight">{t('current_weight_kg')}</Label>
                    <Input
                      id="current_weight"
                      type="number"
                      step="0.1"
                      value={formData.current_weight}
                      onChange={(e) => setFormData((prev) => ({ ...prev, current_weight: e.target.value }))}
                      placeholder={t('enter_weight')}
                      style={{ textAlign: align }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feeding_method">{t('main_feeding_method')}</Label>
                  <Select
                    value={formData.feeding_method}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, feeding_method: value }))}
                  >
                    <SelectTrigger style={{ textAlign: align }}>
                      <SelectValue placeholder={t('select_feeding_method')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breastfeeding" style={{ textAlign: align }}>{t('breastfeeding')}</SelectItem>
                      <SelectItem value="formula" style={{ textAlign: align }}>{t('formula')}</SelectItem>
                      <SelectItem value="mixed" style={{ textAlign: align }}>{t('mixed_feeding')}</SelectItem>
                      <SelectItem value="solid_foods" style={{ textAlign: align }}>{t('solid_foods')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('allergies_intolerances')}</Label>
                  <p className="text-sm soft-text">{t('mark_known_allergens')}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg" style={{ borderColor: 'var(--border-light)' }}>
                    {commonAllergens.map((allergen) => (
                      <div key={allergen} className="flex items-center gap-2">
                        <Checkbox
                          id={`allergy-${allergen}`}
                          checked={(formData.allergies || []).includes(allergen)}
                          onCheckedChange={() => handleAllergyToggle(allergen)}
                          className="border-[var(--primary-salmon)] data-[state=checked]:bg-[var(--primary-salmon)]"
                        />
                        <Label htmlFor={`allergy-${allergen}`} className="text-sm cursor-pointer">
                          {allergen}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full main-cta" disabled={isUploading}>
                  <span className="mr-2 text-white">{isUploading ? t('loading') : t('save_profile')}</span>
                  <Heart className="w-4 h-4 text-white" />
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card style={{ backgroundColor: 'var(--tertiary-green)', borderColor: 'var(--border-light)' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div style={{ textAlign: align }}>
                          <p className="text-sm" style={{ color: "var(--primary-green)" }}>{t('birth_date')}</p>
                          <p className="font-semibold" style={{ color: "var(--text-main)" }}>
                            {baby?.birth_date ? format(new Date(baby.birth_date), "d/M/yyyy") : t('not_defined')}
                          </p>
                        </div>
                        <Calendar className="w-6 h-6" style={{ color: "var(--primary-green)" }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card style={{ backgroundColor: 'var(--tertiary-green)', borderColor: 'var(--border-light)' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div style={{ textAlign: align }}>
                          <p className="text-sm" style={{ color: "var(--primary-green)" }}>{t('current_weight')}</p>
                          <p className="font-semibold" style={{ color: "var(--text-main)" }}>
                            {baby?.current_weight ? `${baby.current_weight} ${t('kg_unit')}` : t('not_defined')}
                          </p>
                        </div>
                        <Scale className="w-6 h-6" style={{ color: "var(--primary-green)" }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card style={{ backgroundColor: 'var(--tertiary-green)', borderColor: 'var(--border-light)' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div style={{ textAlign: align }}>
                          <p className="text-sm" style={{ color: "var(--primary-green)" }}>{t('feeding_method')}</p>
                          <p className="font-semibold" style={{ color: "var(--text-main)" }}>
                            {baby?.feeding_method === "breastfeeding" ? t('breastfeeding') :
                            baby?.feeding_method === "formula" ? t('formula') :
                            baby?.feeding_method === "mixed" ? t('mixed') :
                            baby?.feeding_method === "solid_foods" ? t('solid_foods') : t('not_defined')}
                          </p>
                        </div>
                        <Heart className="w-6 h-6" style={{ color: "var(--primary-green)" }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card style={{ backgroundColor: 'var(--tertiary-green)', borderColor: 'var(--border-light)' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div style={{ textAlign: align }}>
                          <p className="text-sm" style={{ color: "var(--primary-green)" }}>{t('allergies')}</p>
                          <p className="font-semibold" style={{ color: "var(--text-main)" }}>
                            {baby?.allergies?.length || 0} {t('known')}
                          </p>
                        </div>
                        <AlertTriangle className="w-6 h-6" style={{ color: "var(--primary-green)" }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {baby?.allergies && baby.allergies.length > 0 && (
                  <Card style={{ backgroundColor: 'var(--tertiary-green)', borderColor: 'var(--border-light)' }}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2" style={{ color: "var(--text-main)", textAlign: align }}>
                        <AlertTriangle className="w-5 h-5" style={{ color: "var(--primary-green)" }} />
                        {t('known_allergies_intolerances')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {baby.allergies.map((allergy, index) => (
                          <Badge key={index} variant="secondary" className="bg-white text-[var(--primary-salmon)] border border-[var(--border-light)]">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <Card className="card-base">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ color: "var(--text-main)", textAlign: align }}>
                      <CheckSquare className="w-5 h-5" style={{ color: "var(--primary-salmon)" }} />
                      {t('tasting_tracker')}
                    </CardTitle>
                    <p className="text-sm" style={{ color: "var(--primary-salmon)", textAlign: align }}>{t('tasting_tracker_description')}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(foodsToTry).map(([category, foods]) => (
                        <Collapsible key={category} defaultOpen={false}>
                          <CollapsibleTrigger className="w-full">
                            <div className="flex justify-between items-center p-3 rounded-lg w-full hover:opacity-80 transition-opacity" style={{ backgroundColor: 'var(--secondary-yellow)', borderColor: 'var(--border-light)' }}>
                              <h4 className="font-semibold" style={{ color: "var(--text-main)" }}>{t(category)}</h4>
                              <ChevronDown className="w-5 h-5" style={{ color: "var(--primary-salmon)" }} />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                              {foods.map((food) => {
                                const isAllergen = (formData.allergies || []).includes(food);
                                const isAllergenCategory = category === 'אלרגנים';
                                return (
                                  <div key={food} className="flex items-center gap-2 p-2 bg-white rounded-md border border-[var(--border-light)]">
                                    <Checkbox
                                      id={`food-${food}`}
                                      checked={(baby?.tasted_foods || []).includes(food)}
                                      onCheckedChange={() => handleTastedFoodToggle(food)}
                                      className="border-[var(--primary-salmon)] data-[state=checked]:bg-[var(--primary-salmon)]"
                                    />
                                    <Label htmlFor={`food-${food}`} className="text-sm flex items-center gap-1" style={{ textAlign: align }}>
                                      {food}
                                      {isAllergenCategory && (
                                        <AlertTriangle
                                          className="w-3 h-3 text-orange-500 ml-1"
                                          title={`${food} allergen warning`}
                                        />
                                      )}
                                      {isAllergen && !isAllergenCategory && (
                                        <AlertTriangle
                                          className="w-4 h-4 text-red-500 ml-1"
                                          title={`Known allergy warning: ${food}`}
                                        />
                                      )}
                                    </Label>
                                  </div>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {!baby && (
                  <Card style={{ backgroundColor: 'var(--secondary-yellow)', borderColor: 'var(--border-light)' }}>
                    <CardContent className="p-6 text-center">
                      <BabyIcon className="w-16 h-16 text-[var(--primary-salmon)] mx-auto mb-4" />
                      <h3 className="text-xl font-semibold" style={{ color: "var(--text-main)" }}>
                        {t('create_baby_profile')}
                      </h3>
                      <p className="mb-4" style={{ color: "var(--primary-salmon)" }}>
                        {t('profile_setup_prompt')}
                      </p>
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="main-cta rounded-xl"
                      >
                        <span className="text-white">{t('start_here')}</span>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <MilestoneTracker babyBirthDate={baby?.birth_date} userLanguage={userLanguage} />

        {/* Account Management Section - moved to bottom */}
        <div className="text-center pt-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              >
                <UserX className="w-4 h-4 ml-1" />
                {t('delete_account')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent style={{ direction: dir }}>
              <AlertDialogHeader>
                <AlertDialogTitle style={{ textAlign: align }}>
                  {t('confirm_delete_account')}
                </AlertDialogTitle>
                <AlertDialogDescription style={{ textAlign: align }}>
                  {t('delete_account_warning')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex gap-2" style={{ justifyContent: dir === 'rtl' ? 'flex-start' : 'flex-end' }}>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {t('confirm_delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
