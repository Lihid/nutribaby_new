import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AllergenExposure, User } from "@/api/entities"; 
import { AlertTriangle, Plus, CheckCircle, Clock, X } from "lucide-react";
import { format } from "date-fns";

const allergens = [
  { name: "פירות ים", emoji: "🦐", color: "bg-blue-100 text-blue-800" },
  { name: "דגים", emoji: "🐟", color: "bg-cyan-100 text-cyan-800" },
  { name: "סויה", emoji: "🫘", color: "bg-green-100 text-green-800" },
  { name: "מוצרי חלב", emoji: "🥛", color: "bg-yellow-100 text-yellow-800" },
  { name: "חיטה", emoji: "🌾", color: "bg-amber-100 text-amber-800" },
  { name: "אגוזים", emoji: "🥜", color: "bg-orange-100 text-orange-800" },
  { name: "ביצים", emoji: "🥚", color: "bg-pink-100 text-pink-800" },
  { name: "שומשום", emoji: "🌰", color: "bg-purple-100 text-purple-800" },
  { name: "בוטנים", emoji: "🥜", color: "bg-red-100 text-red-800" }
];

const exposureAmounts = ["1/4 כפית", "1/2 כפית", "1 כפית"];

export default function AllergenTracker() {
  const [exposures, setExposures] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    allergen_name: "",
    exposure_stage: 1,
    amount: "1/4 כפית",
    exposure_date: "",
    reaction: "אין תגובה",
    notes: "",
    completed: false
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        if (user && user.email) {
          const data = await AllergenExposure.filter({ created_by: user.email },'-exposure_date');
          setExposures(data);
        }
      } catch (error) {
        console.error("Error loading user or exposures:", error);
      }
    };
    loadUserData();
  }, []);

  const loadExposures = async () => {
    if (!currentUser || !currentUser.email) return;
    try {
      const data = await AllergenExposure.filter({ created_by: currentUser.email },'-exposure_date');
      setExposures(data);
    } catch (error) {
      console.error("Error loading exposures:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.email) {
      console.error("Cannot create exposure: Current user not identified.");
      return;
    }
    try {
      await AllergenExposure.create({
        ...formData,
        created_by: currentUser.email,
        completed: formData.reaction === "אין תגובה" && formData.exposure_stage === 3
      });
      
      setFormData({
        allergen_name: "",
        exposure_stage: 1,
        amount: "1/4 כפית",
        exposure_date: "",
        reaction: "אין תגובה",
        notes: "",
        completed: false
      });
      setIsAdding(false);
      loadExposures();
    } catch (error) {
      console.error("Error creating exposure:", error);
    }
  };

  const getAllergenProgress = (allergenName) => {
    const allergenExposures = exposures.filter(exp => exp.allergen_name === allergenName);
    const completedStages = allergenExposures.filter(exp => exp.reaction === "אין תגובה").length;
    return Math.min(completedStages, 3);
  };

  const getNextStage = (allergenName) => {
    const progress = getAllergenProgress(allergenName);
    return Math.min(progress + 1, 3);
  };

  const handleStageChange = (stage) => {
    setFormData(prev => ({
      ...prev,
      exposure_stage: stage,
      amount: exposureAmounts[stage - 1]
    }));
  };

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-orange-800">רישום חשיפה חדשה:</h3>
            <Button
                onClick={() => setIsAdding(!isAdding)}
                size="sm"
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-100"
            >
                <Plus className="w-4 h-4 mr-1" />
                {isAdding ? 'ביטול' : 'הוסף רישום'}
            </Button>
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-white rounded-xl border border-orange-200">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-orange-700">אלרגן</Label>
                <Select
                  value={formData.allergen_name}
                  onValueChange={(value) => {
                    const nextStage = getNextStage(value);
                    setFormData(prev => ({
                      ...prev,
                      allergen_name: value,
                      exposure_stage: nextStage,
                      amount: exposureAmounts[nextStage - 1]
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחרי אלרגן" />
                  </SelectTrigger>
                  <SelectContent>
                    {allergens.map((allergen) => (
                      <SelectItem key={allergen.name} value={allergen.name}>
                        {allergen.emoji} {allergen.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-orange-700">תאריך החשיפה</Label>
                <Input
                  type="date"
                  value={formData.exposure_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, exposure_date: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-orange-700">שלב החשיפה</Label>
                <Select
                  value={formData.exposure_stage.toString()}
                  onValueChange={(value) => handleStageChange(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">שלב 1 - 1/4 כפית</SelectItem>
                    <SelectItem value="2">שלב 2 - 1/2 כפית</SelectItem>
                    <SelectItem value="3">שלב 3 - 1 כפית</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-orange-700">תגובה שנצפתה</Label>
                <Select
                  value={formData.reaction}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, reaction: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="אין תגובה">✅ אין תגובה</SelectItem>
                    <SelectItem value="תגובה קלה">⚠️ תגובה קלה</SelectItem>
                    <SelectItem value="תגובה בינונית">🚨 תגובה בינונית</SelectItem>
                    <SelectItem value="תגובה קשה">🆘 תגובה קשה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-orange-700">הערות (אופציונלי)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="פרטים על התגובה, תסמינים שהתגלו..."
                className="h-20"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                שמירת חשיפה 📝
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>
                סגור
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold text-orange-800 mb-4">מצב החשיפה לאלרגנים:</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allergens.map((allergen) => {
              const progress = getAllergenProgress(allergen.name);
              const percentage = (progress / 3) * 100;
              const allergenExposures = exposures.filter(exp => exp.allergen_name === allergen.name);
              const hasReaction = allergenExposures.some(exp => exp.reaction !== "אין תגובה");
              
              return (
                <div key={allergen.name} className="bg-white rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{allergen.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-800">{allergen.name}</h4>
                      <div className="flex items-center gap-2">
                        {progress === 3 && !hasReaction ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            הושלם
                          </Badge>
                        ) : hasReaction ? (
                          <Badge className="bg-red-100 text-red-800">
                            <X className="w-3 h-3 mr-1" />
                            תגובה
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            בתהליך
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-orange-700">
                      <span>התקדמות:</span>
                      <span>{progress}/3 שלבים</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>

          {exposures.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-orange-800 mb-3">חשיפות אחרונות:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {exposures.slice(0, 10).map((exposure, index) => {
                  const allergen = allergens.find(a => a.name === exposure.allergen_name);
                  return (
                    <div key={index} className="bg-white rounded-lg p-3 border border-orange-100 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{allergen?.emoji}</span>
                          <span className="font-medium text-orange-800">{exposure.allergen_name}</span>
                          <Badge variant="outline" className="text-xs">
                            שלב {exposure.exposure_stage} - {exposure.amount}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            exposure.reaction === "אין תגובה" ? "bg-green-100 text-green-800" :
                            exposure.reaction === "תגובה קלה" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }>
                            {exposure.reaction}
                          </Badge>
                          <span className="text-xs text-orange-600">
                            {format(new Date(exposure.exposure_date), 'dd/MM')}
                          </span>
                        </div>
                      </div>
                      {exposure.notes && (
                        <p className="text-xs text-gray-600 mt-1 mr-6">💭 {exposure.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
    </div>
  );
}