
import React, { useState, useEffect, useCallback } from "react";
import { DailyLog, User, Baby } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Coffee, Utensils, Moon, Baby as BabyIcon, Droplets, Clock, Calendar, Trash2, AlertCircle, RefreshCw, Bell } from "lucide-react";
import { format, isToday, parseISO, differenceInMonths, differenceInMinutes, addDays } from "date-fns";
import { he, enUS } from "date-fns/locale";
import { useTranslation } from "../components/utils/translations";

export default function FeedingLog() {
  const [logs, setLogs] = useState([]);
  const [baby, setBaby] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [formData, setFormData] = useState({
    log_date: format(new Date(), 'yyyy-MM-dd'),
    log_time: format(new Date(), 'HH:mm'),
    end_time: "", // Added end_time to formData
    log_type: "",
    duration_minutes: "",
    amount_ml: "",
    food_items: [],
    diaper_type: "",
    sleep_quality: "",
    notes: "",
    family_id: "" // Added family_id to form data
  });
  const [newFoodItem, setNewFoodItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { t, dir, align, language } = useTranslation(user?.preferred_language);

  // Calculate baby's age in months for reminders
  const getBabyAgeInMonths = () => {
    if (!baby?.birth_date) return null;
    try {
      return differenceInMonths(new Date(), new Date(baby.birth_date));
    } catch (error) {
      console.error("Error calculating baby age:", error);
      return null;
    }
  };

  const babyAgeInMonths = getBabyAgeInMonths();

  // Get age-appropriate reminders
  const getReminders = () => {
    const reminders = [];

    // All babies need these
    reminders.push({
      icon: "🤱",
      text: t('log_feeding_reminder'),
      type: "feeding"
    });
    reminders.push({
      icon: "😴",
      text: t('log_sleep_reminder'),
      type: "sleep"
    });
    reminders.push({
      icon: "👶",
      text: t('log_diaper_reminder'),
      type: "diaper"
    });

    // Add meals reminder for babies 6+ months
    if (babyAgeInMonths !== null && babyAgeInMonths >= 6) {
      reminders.push({
        icon: "🍽️",
        text: t('log_meals_reminder'),
        type: "meals"
      });
    }

    return reminders;
  };

  const logTypeConfig = {
    breakfast: { label: t('breakfast'), icon: Coffee, color: "bg-orange-100 text-orange-800", emoji: "🌅" },
    lunch: { label: t('lunch'), icon: Utensils, color: "bg-green-100 text-green-800", emoji: "🍽️" },
    dinner: { label: t('dinner'), icon: Utensils, color: "bg-orange-200 text-orange-900", emoji: "🌙" },
    snack: { label: t('snack'), icon: Coffee, color: "bg-green-100 text-green-800", emoji: "🍎" },
    drink: { label: t('drink'), icon: Droplets, color: "bg-green-50 text-green-700", emoji: "💧" },
    breastfeeding: { label: t('breastfeeding'), icon: BabyIcon, color: "bg-orange-100 text-orange-800", emoji: "🤱" },
    bottle: { label: t('bottle'), icon: BabyIcon, color: "bg-orange-100 text-orange-800", emoji: "🍼" },
    sleep: { label: t('sleep'), icon: Moon, color: "bg-green-200 text-green-900", emoji: "😴" },
    diaper: { label: t('diaper_change'), icon: BabyIcon, color: "bg-orange-50 text-orange-700", emoji: "👶" }
  };

  const formatLogDisplay = (log) => {
    const config = logTypeConfig[log.log_type];
    let displayText = '';
    let subText = '';

    if (log.log_type === 'sleep') {
      const duration = log.duration_minutes || 0;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      const durationString = [];
      if (hours > 0) durationString.push(`${hours}${language === 'he' ? 'ש' : 'h'}`);
      if (minutes > 0) durationString.push(`${minutes}${language === 'he' ? 'ד' : 'm'}`);

      if (log.end_time) {
        displayText = `${log.log_time} → ${log.end_time}`;
        if (duration > 0) {
          subText = `${t('sleep_duration_label')}: ${durationString.join(' ')}`;
        }
      } else {
        // Fallback for older sleep logs without end_time or if duration was manually entered
        displayText = t('duration', { duration: log.duration_minutes });
      }
    } else if (log.food_items && log.food_items.length > 0) {
      // For meals, show only the food items without repeating the meal type
      displayText = log.food_items.join(', ');
      if (log.notes && log.notes.includes(' - ')) {
        // Extract the amount from notes if it exists
        const noteParts = log.notes.split(' - ');
        if (noteParts.length > 1) {
          subText = noteParts[0]; // The amount part
        }
      }
    } else if (log.duration_minutes) {
      displayText = t('duration', { duration: log.duration_minutes });
    } else if (log.amount_ml) {
      displayText = t('amount', { amount: log.amount_ml });
    } else if (log.diaper_type) {
      displayText = t('type', { type: t(log.diaper_type) });
    } else if (log.sleep_quality) {
      displayText = t('sleep_quality_label', { quality: t(log.sleep_quality) });
    }

    return { displayText, subText, config };
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Load data - RLS will handle the filtering
      const [logData, babyData] = await Promise.all([
        DailyLog.list('-log_date', 100),
        Baby.list()
      ]);

      const sortedLogs = logData.sort((a, b) => {
        const dateTimeA = new Date(`${a.log_date}T${a.log_time}`);
        const dateTimeB = new Date(`${b.log_date}T${b.log_time}`);
        return dateTimeB - dateTimeA;
      });

      setLogs(sortedLogs);
      if (babyData.length > 0) {
        setBaby(babyData[0]);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError(t('data_loading_error'));
    }
    setLoading(false);
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };

      // Set family_id from baby if available, otherwise leave it empty
      // RLS will allow creation if user is the creator
      if (baby && baby.family_id) {
        dataToSubmit.family_id = baby.family_id;
      }

      if (dataToSubmit.log_type === 'sleep') {
        if (dataToSubmit.log_time && dataToSubmit.end_time) {
          const startDate = new Date(`${dataToSubmit.log_date}T${dataToSubmit.log_time}`);
          const endDate = new Date(`${dataToSubmit.log_date}T${dataToSubmit.end_time}`);

          if (endDate <= startDate) {
            endDate.setDate(endDate.getDate() + 1);
          }

          const durationMs = endDate.getTime() - startDate.getTime();
          const durationMinutes = Math.round(durationMs / (1000 * 60));
          dataToSubmit.duration_minutes = durationMinutes;
        }
      }

      // Clean up empty fields
      Object.keys(dataToSubmit).forEach((key) => {
        if (dataToSubmit[key] === "" || (Array.isArray(dataToSubmit[key]) && dataToSubmit[key].length === 0)) {
          delete dataToSubmit[key];
        }
      });

      await DailyLog.create(dataToSubmit);

      setFormData({
        log_date: format(new Date(), 'yyyy-MM-dd'),
        log_time: format(new Date(), 'HH:mm'),
        end_time: "", // Reset end_time
        log_type: "",
        duration_minutes: "",
        amount_ml: "",
        food_items: [],
        diaper_type: "",
        sleep_quality: "",
        notes: "",
        family_id: ""
      });
      setIsAdding(false);
      loadData();
    } catch (error) {
      console.error("Error creating log:", error);
    }
  };

  const addFoodItem = () => {
    if (newFoodItem.trim() && !formData.food_items.includes(newFoodItem.trim())) {
      setFormData((prev) => ({
        ...prev,
        food_items: [...prev.food_items, newFoodItem.trim()]
      }));
      setNewFoodItem("");
    }
  };

  const removeFoodItem = (itemToRemove) => {
    setFormData((prev) => ({
      ...prev,
      food_items: prev.food_items.filter((item) => item !== itemToRemove)
    }));
  };

  const deleteLog = async (logId) => {
    if (window.confirm(t('confirm_delete_log'))) {
      try {
        await DailyLog.delete(logId);
        loadData();
      } catch (error) {
        console.error("Error deleting log:", error);
      }
    }
  };

  const todayLogs = logs.filter((log) => {
    const logDateTimeString = `${log.log_date}T${log.log_time}`;
    try {
      return isToday(parseISO(logDateTimeString));
    } catch {
      return false;
    }
  });
  const displayLogs = activeTab === "today" ? todayLogs : logs;

  const getTodaySummary = () => {
    const summary = {
      meals: todayLogs.filter((log) => ['breakfast', 'lunch', 'dinner', 'snack'].includes(log.log_type)).length,
      feedings: todayLogs.filter((log) => ['breastfeeding', 'bottle'].includes(log.log_type)).length,
      sleep: todayLogs.filter((log) => log.log_type === 'sleep').reduce((total, log) => total + (log.duration_minutes || 0), 0),
      diapers: todayLogs.filter((log) => log.log_type === 'diaper').length
    };
    return summary;
  };

  const getActiveSummaryItems = () => {
    const summary = getTodaySummary();
    const items = [];

    if (summary.meals > 0) {
      items.push({
        value: summary.meals,
        label: t('meals'),
        color: 'var(--primary-salmon)'
      });
    }

    if (summary.feedings > 0) {
      items.push({
        value: summary.feedings,
        label: t('feedings'),
        color: 'var(--primary-salmon)'
      });
    }

    if (summary.sleep > 0) {
      items.push({
        value: `${Math.floor(summary.sleep / 60)}:${(summary.sleep % 60).toString().padStart(2, '0')}`,
        label: t('sleep_hours'),
        color: 'var(--primary-salmon)'
      });
    }

    if (summary.diapers > 0) {
      items.push({
        value: summary.diapers,
        label: t('diapers'),
        color: 'var(--primary-salmon)'
      });
    }

    return items;
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8" style={{ direction: dir }}>
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
          <div className="h-10 w-1/2 mx-auto bg-[var(--secondary-yellow)] rounded-md"></div>
          <div className="h-40 bg-[var(--card-background-mint)] rounded-xl"></div>
          <div className="h-12 bg-white rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-24 bg-white rounded-xl"></div>
            <div className="h-24 bg-white rounded-xl"></div>
            <div className="h-24 bg-white rounded-xl"></div>
          </div>
        </div>
      </div>);

  }

  if (error) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
        <Card className="card-base text-center p-8">
          <CardContent>
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--primary-salmon)' }} />
            <h2 className="text-2xl font-semibold mb-2">{t('oops_something_wrong')}</h2>
            <p className="soft-text mb-6">{error}</p>
            <Button onClick={loadData} className="main-cta">
              <RefreshCw className="w-4 h-4 ml-2" />
              {t('try_again')}
            </Button>
          </CardContent>
        </Card>
      </div>);

  }

  const activeSummaryItems = getActiveSummaryItems();
  const reminders = getReminders();

  return (
    <div className="p-4 md:p-8" style={{ direction: dir }}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('daily_log')}
          </h1>
          <p className="text-lg soft-text">
            {t('track_complete')}
          </p>
        </div>

        {baby &&
          <div className="grid md:grid-cols-2 gap-6">
            {/* Compact Today's Summary */}
            <Card style={{ background: 'linear-gradient(to right, var(--secondary-yellow), var(--card-background-mint))', borderColor: 'var(--border-light)' }} className="rounded-lg border bg-card text-card-foreground ">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{t('today_summary', { name: baby.name })}</h3>
                    <p className="text-sm soft-text">{format(new Date(), 'dd MMMM yyyy', { locale: language === 'he' ? he : enUS })}</p>
                  </div>
                  <Button
                    onClick={() => setIsAdding(!isAdding)}
                    className="main-cta"
                    size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    <span>{t('new_log')}</span>
                  </Button>
                </div>

                {activeSummaryItems.length > 0 ?
                  <div className="grid grid-cols-2 gap-2">
                    {activeSummaryItems.slice(0, 4).map((item, index) =>
                      <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-2 text-center">
                        <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
                        <div className="text-xs soft-text">{item.label}</div>
                      </div>
                    )}
                  </div> :

                  <div className="text-center py-4">
                    <p className="text-sm soft-text">{t('no_logs_today')}</p>
                  </div>
                }
              </CardContent>
            </Card>

            {/* Age-Appropriate Reminders */}
            <Card className="card-base" style={{ backgroundColor: 'var(--card-background-mint)' }}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5" style={{ color: 'var(--primary-salmon)' }} />
                  {t('daily_reminders')}
                </CardTitle>
                {baby &&
                  <p className="text-xs soft-text">{t('age_appropriate_reminder', { name: baby.name })}</p>
                }
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm font-medium mb-3 soft-text">{t('remember_to_log')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {reminders.map((reminder, index) =>
                    <div key={index} className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                      <span className="text-lg">{reminder.icon}</span>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-main)' }}>{reminder.text}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        }

        {isAdding &&
          <Card className="card-base">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" style={{ color: 'var(--primary-salmon)' }} />
                {t('new_log')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>{t('date')}</Label>
                    <Input
                      type="date"
                      value={formData.log_date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, log_date: e.target.value }))}
                      required />

                  </div>
                  {formData.log_type !== 'sleep' && // Conditionally render time input for non-sleep types
                    <div>
                      <Label>{t('time')}</Label>
                      <Input
                        type="time"
                        value={formData.log_time}
                        onChange={(e) => setFormData((prev) => ({ ...prev, log_time: e.target.value }))}
                        required />
                    </div>
                  }
                  <div className={formData.log_type === 'sleep' ? 'col-span-2' : ''}> {/* Adjust col-span for sleep type */}
                    <Label>{t('log_type')}</Label>
                    <Select
                      value={formData.log_type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, log_type: value }))}>

                      <SelectTrigger>
                        <SelectValue placeholder={t('select_log_type')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">🌅 {t('breakfast')}</SelectItem>
                        <SelectItem value="lunch">🍽️ {t('lunch')}</SelectItem>
                        <SelectItem value="dinner">🌙 {t('dinner')}</SelectItem>
                        <SelectItem value="snack">🍎 {t('snack')}</SelectItem>
                        <SelectItem value="drink">💧 {t('drink')}</SelectItem>
                        <SelectItem value="breastfeeding">🤱 {t('breastfeeding')}</SelectItem>
                        <SelectItem value="bottle">🍼 {t('bottle')}</SelectItem>
                        <SelectItem value="sleep">😴 {t('sleep')}</SelectItem>
                        <SelectItem value="diaper">👶 {t('diaper_change')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.log_type === 'breastfeeding' && // Only breastfeeding uses duration_minutes input
                  <div>
                    <Label>{t('duration_minutes')}</Label>
                    <Input
                      type="number"
                      placeholder={t('how_many_minutes')}
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, duration_minutes: e.target.value }))} />

                  </div>
                }

                {formData.log_type === 'sleep' &&
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t('sleep_start_time')}</Label>
                      <Input
                        type="time"
                        value={formData.log_time}
                        onChange={(e) => setFormData((prev) => ({ ...prev, log_time: e.target.value }))}
                        required />
                    </div>
                    <div>
                      <Label>{t('sleep_end_time')}</Label>
                      <Input
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
                        required />
                    </div>
                  </div>
                }

                {(formData.log_type === 'bottle' || formData.log_type === 'drink') &&
                  <div>
                    <Label>{t('amount_ml')}</Label>
                    <Input
                      type="number"
                      placeholder={t('how_many_ml')}
                      value={formData.amount_ml}
                      onChange={(e) => setFormData((prev) => ({ ...prev, amount_ml: e.target.value }))} />

                  </div>
                }

                {['breakfast', 'lunch', 'dinner', 'snack'].includes(formData.log_type) &&
                  <div>
                    <Label>{t('foods_consumed')}</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder={t('add_food')}
                        value={newFoodItem}
                        onChange={(e) => setNewFoodItem(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFoodItem())} />

                      <Button type="button" onClick={addFoodItem} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.food_items.map((item, index) =>
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => removeFoodItem(item)}
                            className="hover:text-red-500">

                            ×
                          </button>
                          {item}
                        </Badge>
                      )}
                    </div>
                  </div>
                }

                {formData.log_type === 'diaper' &&
                  <div>
                    <Label>{t('diaper_type')}</Label>
                    <Select
                      value={formData.diaper_type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, diaper_type: value }))}>

                      <SelectTrigger>
                        <SelectValue placeholder={t('select_type')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wet">{t('wet')}</SelectItem>
                        <SelectItem value="dirty">{t('dirty')}</SelectItem>
                        <SelectItem value="both">{t('both')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                }

                {formData.log_type === 'sleep' &&
                  <div>
                    <Label>{t('sleep_quality')}</Label>
                    <Select
                      value={formData.sleep_quality}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, sleep_quality: value }))}>

                      <SelectTrigger>
                        <SelectValue placeholder={t('how_was_sleep')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">{t('good')}</SelectItem>
                        <SelectItem value="fair">{t('fair')}</SelectItem>
                        <SelectItem value="restless">{t('restless')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                }

                <div>
                  <Label>{t('notes')}</Label>
                  <Textarea
                    placeholder={t('additional_notes')}
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    className="h-20" />

                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="main-cta">
                    <span>{t('save_log')}</span>
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="rounded-xl" style={{ borderColor: 'var(--border-light)' }}>
                    {t('cancel')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        }

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-2xl p-2">
            <TabsTrigger value="today" className="rounded-xl data-[state=active]:bg-[color:var(--secondary-yellow)] data-[state=active]:text-[color:var(--primary-salmon)]">{t('today')}</TabsTrigger>
            <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-[color:var(--secondary-yellow)] data-[state=active]:text-[color:var(--primary-salmon)]">{t('all_logs')}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            <div className="space-y-4">
              {displayLogs.map((log, index) => {
                const { displayText, subText, config } = formatLogDisplay(log);
                return (
                  <Card key={log.id || index} className="card-base hover:shadow-xl transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{config?.emoji}</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-orange-200 text-orange-900 px-2.5 py-0.5 text-sm font-semibold rounded-full border-transparent">
                                {config?.label || log.log_type}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm soft-text">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(log.log_date), 'dd/MM')}
                                <Clock className="w-3 h-3 mr-1" />
                                {log.log_time}
                              </div>
                            </div>

                            <div className="text-sm space-y-1">
                              {displayText &&
                                <p className="soft-text">{displayText}</p>
                              }
                              {subText &&
                                <p className="text-xs soft-text">{subText}</p>
                              }
                              {log.notes && !log.notes.includes(' - ') &&
                                <p className="soft-text bg-gray-50 p-2 rounded">{log.notes}</p>
                              }
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLog(log.id)}
                          className="text-gray-400 hover:text-red-500">

                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>);

              })}
            </div>
          </TabsContent>
        </Tabs>

        {displayLogs.length === 0 && !loading && !error &&
          <Card className="card-base">
            <CardContent className="text-center py-12">
              <BabyIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--primary-salmon)' }} />
              <h3 className="text-xl font-semibold mb-2">
                {t('no_logs_yet')}
              </h3>
              <p className="soft-text">
                {t('start_tracking')}
              </p>
            </CardContent>
          </Card>
        }
      </div>
    </div>);

}
