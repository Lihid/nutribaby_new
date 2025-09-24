import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BabyMilestone, User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Plus, Star, Calendar, Smile, Baby as BabyIcon, FileDown, RefreshCw, Image as ImageIcon, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "../utils/translations";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
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

export default function MilestoneTracker({ babyBirthDate, userLanguage }) {
  const [milestones, setMilestones] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    milestone_type: "",
    title: "",
    description: "",
    date_achieved: "",
    notes: "",
    image_url: ""
  });

  const { t, dir, align } = useTranslation(userLanguage);

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
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      const currentUser = await User.me();
      const data = await BabyMilestone.filter({ created_by: currentUser.email }, '-date_achieved');
      setMilestones(data);
    } catch (error) {
      console.error("Error loading milestones:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      milestone_type: "",
      title: "",
      description: "",
      date_achieved: "",
      notes: "",
      image_url: ""
    });
    setEditingMilestone(null);
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleEdit = (milestone) => {
    setFormData({
      milestone_type: milestone.milestone_type || "",
      title: milestone.title || "",
      description: milestone.description || "",
      date_achieved: milestone.date_achieved || "",
      notes: milestone.notes || "",
      image_url: milestone.image_url || ""
    });
    setEditingMilestone(milestone);
    setIsEditing(true);
    setIsAdding(true); // להציג את הטופס
  };

  const handleDelete = async (milestoneId) => {
    try {
      await BabyMilestone.delete(milestoneId);
      loadMilestones();
    } catch (error) {
      console.error("Error deleting milestone:", error);
      alert('אירעה שגיאה במחיקת אבן הדרך');
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let dataToSave = { ...formData };
      if (babyBirthDate) {
        const babyBirth = new Date(babyBirthDate);
        const milestoneDate = new Date(formData.date_achieved);
        
        let ageInMonths;
        if (milestoneDate < babyBirth) {
            ageInMonths = 0;
        } else {
            const diffTime = Math.abs(milestoneDate.getTime() - babyBirth.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            ageInMonths = Math.floor(diffDays / 30.4375);
        }
        dataToSave.age_months = ageInMonths;
      }
      
      if (isEditing && editingMilestone) {
        await BabyMilestone.update(editingMilestone.id, dataToSave);
      } else {
        await BabyMilestone.create(dataToSave);
      }
      
      resetForm();
      loadMilestones();
    } catch (error) {
      console.error("Error saving milestone:", error);
    }
  };

  return (
    <Card className="card-base" style={{backgroundColor: 'var(--card-background-mint)', direction: dir}}>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2" style={{color: "var(--primary-salmon)", textAlign: align}}>
            <Star className="w-5 h-5" />
            {t('milestones_title')} ✨
          </CardTitle>
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to={createPageUrl("MilestonesExport")}>
              <Button variant="outline" size="sm" className="secondary-cta hidden md:flex">
                <FileDown className="w-4 h-4 ml-1" />
                ייצוא
              </Button>
            </Link>
            <Button
              onClick={() => {
                resetForm();
                setIsAdding(!isAdding);
              }}
              size="sm"
              className="main-cta"
            >
              <Plus className="w-4 h-4 ml-1" />
              {t('add_milestone')}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isAdding && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-white rounded-xl border border-[var(--border-light)]" style={{direction: dir}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{color: "var(--primary-salmon)"}}>
                {isEditing ? 'עריכת אבן דרך' : t('add_milestone')}
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label style={{textAlign: align}}>{t('milestone_type')}</Label>
                <Select
                  value={formData.milestone_type}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    milestone_type: value,
                    title: value === 'other' ? formData.title : milestoneTypes[value]?.label || ''
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('choose_type')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(milestoneTypes).map(([key, data]) => (
                      <SelectItem key={key} value={key}>
                        {data.emoji} {data.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label style={{textAlign: align}}>{t('date')}</Label>
                <Input
                  type="date"
                  value={formData.date_achieved}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_achieved: e.target.value }))}
                  required
                />
              </div>
            </div>

            {formData.milestone_type === 'other' && (
              <div>
                <Label style={{textAlign: align}}>{t('title')}</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('example_first_word')}
                  required
                />
              </div>
            )}
            
            <div>
              <Label style={{textAlign: align}}>{t('image_link')}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={handleImageUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-yellow)] file:text-[var(--primary-salmon)] hover:file:bg-[var(--primary-salmon)] hover:file:text-white"
                  disabled={isUploading}
                  accept="image/*"
                />
                {isUploading && <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary-salmon)]" />}
              </div>
              {formData.image_url && (
                <div className="mt-2">
                  <img src={formData.image_url} alt="תצוגה מקדימה" className="w-24 h-24 object-cover rounded-lg border-2 border-[var(--border-light)]" />
                </div>
              )}
            </div>

            <div>
              <Label style={{textAlign: align}}>{t('description')} ({t('optional')})</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('milestone_details')}
                className="h-20"
              />
            </div>

            <div>
              <Label style={{textAlign: align}}>{t('notes')} ({t('optional')})</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={t('additional_notes')}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="main-cta" disabled={isUploading}>
                {isUploading ? t('loading') : `${isEditing ? 'עדכון' : t('save')} 💖`}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                {t('cancel')}
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {milestones.length === 0 ? (
            <div className="text-center py-8">
              <BabyIcon className="w-16 h-16 mx-auto mb-4" style={{color: "var(--primary-salmon)"}} />
              <p className="font-medium" style={{color: "var(--primary-salmon)", textAlign: align}}>{t('no_milestones_yet')}</p>
              <p className="text-sm" style={{color: "var(--text-soft)", textAlign: align}}>{t('start_documenting')} ✨</p>
            </div>
          ) : (
            milestones.map((milestone, index) => {
              const typeData = milestoneTypes[milestone.milestone_type] || milestoneTypes.other;
              return (
                <div key={milestone.id} className="bg-white rounded-xl p-4 border border-[var(--border-light)] shadow-sm" style={{direction: dir}}>
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{typeData.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold" style={{color: "var(--primary-salmon)", textAlign: align}}>{milestone.title}</h4>
                        <Badge style={{backgroundColor: 'var(--secondary-yellow)', color: 'var(--primary-salmon)'}}>
                          {milestone.age_months !== null ? `${milestone.age_months} ${t('months')}` : ''}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm mb-2" style={{color: "var(--text-soft)"}}>
                        <Calendar className="w-4 h-4" />
                        {format(new Date(milestone.date_achieved), 'dd/MM/yyyy')}
                      </div>
                      {milestone.image_url && (
                        <img src={milestone.image_url} alt={milestone.title} className="w-full h-auto max-h-60 object-cover rounded-lg my-2" />
                      )}
                      {milestone.description && (
                        <p className="text-sm mb-2" style={{color: "var(--text-soft)", textAlign: align}}>{milestone.description}</p>
                      )}
                      {milestone.notes && (
                        <p className="text-xs bg-[var(--card-background-mint)] rounded-md p-2" style={{color: "var(--text-soft)", textAlign: align}}>
                          💭 {milestone.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(milestone)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent style={{direction: dir}}>
                          <AlertDialogHeader>
                            <AlertDialogTitle style={{textAlign: align}}>מחיקת אבן דרך</AlertDialogTitle>
                            <AlertDialogDescription style={{textAlign: align}}>
                              האם אתם בטוחים שברצונכם למחוק את אבן הדרך "{milestone.title}"? פעולה זו לא ניתנת לביטול.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>ביטול</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(milestone.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              מחיקה
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}