import React, { useState, useEffect } from 'react';
import { DailyTip } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Lightbulb } from 'lucide-react';

const categoryOptions = [
  { value: 'nutrition', label: 'תזונה' },
  { value: 'development', label: 'התפתחות' },
  { value: 'safety', label: 'בטיחות' },
  { value: 'feeding', label: 'האכלה' },
  { value: 'sleep', label: 'שינה' },
  { value: 'general', label: 'כללי' }
];

const ageRangeOptions = [
  { value: '0-6months', label: '0-6 חודשים' },
  { value: '6-9months', label: '6-9 חודשים' },
  { value: '9-12months', label: '9-12 חודשים' },
  { value: '12-24months', label: '12-24 חודשים' }
];

const iconOptions = [
  { value: 'Lightbulb', label: 'נורה' },
  { value: 'Utensils', label: 'כלי אכילה' },
  { value: 'Heart', label: 'לב' },
  { value: 'Shield', label: 'מגן' },
  { value: 'Baby', label: 'תינוק' },
  { value: 'Star', label: 'כוכב' }
];

export default function AdminTips() {
  const [tips, setTips] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTip, setEditingTip] = useState(null);
  const [formData, setFormData] = useState({
    tip_text_he: '',
    tip_text_en: '',
    category: '',
    age_ranges: [],
    icon: 'Lightbulb',
    published: true,
    order_index: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      if (currentUser.role !== 'admin') {
        return;
      }

      const tipsData = await DailyTip.list('-updated_date');
      setTips(tipsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tipData = {
        ...formData,
        order_index: parseInt(formData.order_index) || 0
      };

      if (editingTip) {
        await DailyTip.update(editingTip.id, tipData);
      } else {
        await DailyTip.create(tipData);
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving tip:', error);
    }
  };

  const handleEdit = (tip) => {
    setEditingTip(tip);
    setFormData({
      tip_text_he: tip.tip_text_he || '',
      tip_text_en: tip.tip_text_en || '',
      category: tip.category || '',
      age_ranges: tip.age_ranges || [],
      icon: tip.icon || 'Lightbulb',
      published: tip.published !== false,
      order_index: tip.order_index || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (tipId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הטיפ?')) {
      try {
        await DailyTip.delete(tipId);
        loadData();
      } catch (error) {
        console.error('Error deleting tip:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tip_text_he: '',
      tip_text_en: '',
      category: '',
      age_ranges: [],
      icon: 'Lightbulb',
      published: true,
      order_index: 0
    });
    setEditingTip(null);
    setShowForm(false);
  };

  const handleAgeRangeToggle = (ageRange) => {
    setFormData(prev => ({
      ...prev,
      age_ranges: prev.age_ranges.includes(ageRange)
        ? prev.age_ranges.filter(range => range !== ageRange)
        : [...prev.age_ranges, ageRange]
    }));
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">טוען...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">אין הרשאה</h1>
        <p className="text-gray-600">עמוד זה זמין רק למנהלים</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{backgroundColor: 'var(--background-cream)'}}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{color: 'var(--text-main)'}}>
            ניהול טיפים יומיים
          </h1>
          <Button onClick={() => setShowForm(true)} className="main-cta">
            <Plus className="w-4 h-4 ml-2" />
            טיפ חדש
          </Button>
        </div>

        {showForm && (
          <Card className="card-base mb-8">
            <CardHeader>
              <CardTitle>
                {editingTip ? 'עריכת טיפ' : 'טיפ חדש'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">טקסט הטיפ בעברית</label>
                  <Textarea
                    value={formData.tip_text_he}
                    onChange={(e) => setFormData(prev => ({...prev, tip_text_he: e.target.value}))}
                    required
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">טקסט הטיפ באנגלית</label>
                  <Textarea
                    value={formData.tip_text_en}
                    onChange={(e) => setFormData(prev => ({...prev, tip_text_en: e.target.value}))}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">קטגוריה</label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">אייקון</label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) => setFormData(prev => ({...prev, icon: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">טווחי גילאים</label>
                  <div className="flex flex-wrap gap-2">
                    {ageRangeOptions.map(option => (
                      <Badge
                        key={option.value}
                        variant={formData.age_ranges.includes(option.value) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleAgeRangeToggle(option.value)}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">סדר הצגה</label>
                    <Input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData(prev => ({...prev, order_index: e.target.value}))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData(prev => ({...prev, published: e.target.checked}))}
                    />
                    <label htmlFor="published" className="text-sm font-medium">מפורסם</label>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="w-4 h-4 ml-2" />
                    ביטול
                  </Button>
                  <Button type="submit" className="main-cta">
                    <Save className="w-4 h-4 ml-2" />
                    שמירה
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {tips.map(tip => (
            <Card key={tip.id} className="card-base">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" style={{color: 'var(--primary-salmon)'}} />
                      {tip.tip_text_he?.substring(0, 100)}...
                      {!tip.published && (
                        <Badge variant="secondary">טיוטה</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm soft-text mt-1">{tip.tip_text_en?.substring(0, 100)}...</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">
                        {categoryOptions.find(c => c.value === tip.category)?.label}
                      </Badge>
                      {tip.age_ranges?.map(range => (
                        <Badge key={range} variant="secondary">
                          {ageRangeOptions.find(a => a.value === range)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(tip)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tip.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}