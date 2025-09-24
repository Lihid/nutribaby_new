import React, { useState, useEffect } from 'react';
import { Article } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Plus, Edit, Trash2 } from 'lucide-react';

const categoryOptions = ["preparation", "first_tasting", "water", "steaming", "textures", "finger_foods", "picky_eating", "family_meals", "kitchen_involvement", "choke_prevention", "baby_safety", "breastfeeding", "formula_feeding", "baby_development", "straw_drinking"];
const ageRangeOptions = ["0-6months", "6-9months", "9-12months", "12-24months"];

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const allArticles = await Article.list('order_index', 100);
      setArticles(allArticles);
    } catch (error) {
      console.error("Error loading articles:", error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(articles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setArticles(items);

    // Update order_index in the database
    const updatePromises = items.map((article, index) => {
      if (article.order_index !== index) {
        return Article.update(article.id, { order_index: index });
      }
      return null;
    }).filter(Boolean);

    try {
      await Promise.all(updatePromises);
      console.log("Article order updated successfully.");
    } catch (error) {
      console.error("Error updating article order:", error);
      // Optionally, revert state or show an error message
      loadArticles(); // Re-fetch to show the correct state
    }
  };

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedArticle(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (articleId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await Article.delete(articleId);
        loadArticles();
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ניהול מאמרים</h1>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 ml-2" />
            הוסף מאמר חדש
          </Button>
        </div>

        {isFormOpen ? (
          <ArticleForm
            article={selectedArticle}
            onClose={() => setIsFormOpen(false)}
            onSave={() => {
              setIsFormOpen(false);
              loadArticles();
            }}
          />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="articles">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {articles.map((article, index) => (
                    <Draggable key={article.id} draggableId={article.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center p-3 bg-white"
                        >
                          <div {...provided.dragHandleProps} className="p-2 cursor-grab">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-grow mx-4">
                            <p className="font-semibold">{article.title}</p>
                            <p className="text-sm text-gray-500">קטגוריה: {article.category} | סדר: {article.order_index}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={article.published ? "default" : "secondary"}>
                              {article.published ? "מפורסם" : "טיוטה"}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => handleSelectArticle(article)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}

function ArticleForm({ article, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '', slug: '', content: '', excerpt: '', image_url: '', category: '',
    age_ranges: [], tags: [], published: true, reading_time: 0
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        image_url: article.image_url || '',
        category: article.category || '',
        age_ranges: article.age_ranges || [],
        tags: article.tags || [],
        published: article.published !== false,
        reading_time: article.reading_time || 0
      });
    } else {
      setFormData({
        title: '', slug: '', content: '', excerpt: '', image_url: '', category: '',
        age_ranges: [], tags: [], published: true, reading_time: 0
      });
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
          ...formData,
          reading_time: Number(formData.reading_time)
      };

      if (article) {
        await Article.update(article.id, dataToSave);
      } else {
        await Article.create(dataToSave);
      }
      onSave();
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{article ? "עריכת מאמר" : "יצירת מאמר חדש"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>כותרת</Label>
              <Input name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Slug (מזהה ל-URL)</Label>
              <Input name="slug" value={formData.slug} onChange={handleChange} required />
            </div>
          </div>
          
           <div className="space-y-2">
              <Label>תקציר</Label>
              <Textarea name="excerpt" value={formData.excerpt} onChange={handleChange} />
            </div>

          <div className="space-y-2">
            <Label>תוכן (HTML)</Label>
            <Textarea name="content" value={formData.content} onChange={handleChange} rows={15} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label>קטגוריה</Label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-md">
                    <option value="">בחר קטגוריה</option>
                    {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <Label>זמן קריאה (דקות)</Label>
                <Input type="number" name="reading_time" value={formData.reading_time} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>טווחי גילאים</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 border rounded-md">
              {ageRangeOptions.map(opt => (
                <div key={opt} className="flex items-center gap-2">
                  <Checkbox 
                    id={`age-${opt}`}
                    checked={formData.age_ranges.includes(opt)}
                    onCheckedChange={() => handleCheckboxChange('age_ranges', opt)}
                  />
                  <Label htmlFor={`age-${opt}`}>{opt}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>תגיות (מופרד בפסיק)</Label>
            <Input name="tags" value={formData.tags.join(', ')} onChange={handleTagChange} />
          </div>
          
           <div className="space-y-2">
              <Label>קישור לתמונה</Label>
              <Input name="image_url" value={formData.image_url} onChange={handleChange} />
            </div>

          <div className="flex items-center gap-4">
            <Checkbox id="published" name="published" checked={formData.published} onCheckedChange={(checked) => setFormData(prev => ({...prev, published: checked}))} />
            <Label htmlFor="published">פרסם מאמר</Label>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>ביטול</Button>
            <Button type="submit">שמור</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}