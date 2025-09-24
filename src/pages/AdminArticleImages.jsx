import React, { useState, useEffect } from "react";
import { Article, User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Upload, Save, AlertCircle } from "lucide-react";
import { useTranslation } from "../components/utils/translations";

export default function AdminArticleImages() {
    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savingId, setSavingId] = useState(null);
    const [uploadingId, setUploadingId] = useState(null);

    const { t, dir, align } = useTranslation(user?.preferred_language);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const currentUser = await User.me();
            setUser(currentUser);

            if (currentUser.role !== 'admin') {
                setError('אין לך הרשאות גישה לעמוד זה');
                setLoading(false);
                return;
            }

            // Load all articles from the database
            const articlesData = await Article.list('-updated_date');
            setArticles(articlesData);
        } catch (err) {
            console.error("Error loading data:", err);
            setError(err.message || 'שגיאה בטעינת הנתונים');
        }
        setLoading(false);
    };

    const handleImageUpload = async (articleId, file) => {
        setUploadingId(articleId);
        try {
            const { file_url } = await UploadFile({ file });
            setArticles(prev =>
                prev.map(art =>
                    art.id === articleId
                        ? { ...art, image_url: file_url, hasChanges: true }
                        : art
                )
            );
        } catch (error) {
            console.error("Error uploading image:", error);
            alert('שגיאה בהעלאת התמונה');
        } finally {
            setUploadingId(null);
        }
    };

    const handleSave = async (articleId) => {
        setSavingId(articleId);
        try {
            const articleToSave = articles.find(art => art.id === articleId);
            if (!articleToSave) return;

            await Article.update(articleId, { image_url: articleToSave.image_url });

            setArticles(prev =>
                prev.map(art =>
                    art.id === articleId ? { ...art, hasChanges: false } : art
                )
            );
            alert('התמונה עודכנה בהצלחה!');
        } catch (error) {
            console.error("Error saving article image:", error);
            alert('שגיאה בשמירת התמונה');
        } finally {
            setSavingId(null);
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8" style={{ direction: dir }}>
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-24 bg-gray-200 rounded-xl"></div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="h-64 bg-gray-200 rounded-xl"></div>
                            <div className="h-64 bg-gray-200 rounded-xl"></div>
                            <div className="h-64 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)', direction: dir }}>
                <Card className="card-base text-center p-8">
                    <CardContent>
                        <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--primary-salmon)' }} />
                        <h2 className="text-2xl font-semibold mb-2" style={{ textAlign: align }}>שגיאה</h2>
                        <p className="soft-text mb-6" style={{ textAlign: align }}>{error}</p>
                        <Button onClick={loadData} className="main-cta">
                            <RefreshCw className="w-4 h-4 ml-2" />
                            נסה שוב
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 pb-24" style={{ direction: dir }}>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-main)', textAlign: align }}>
                        ניהול תמונות מאמרים ומדריכים
                    </h1>
                    <p className="text-md font-light soft-text" style={{ textAlign: align }}>
                        עדכון התמונות הראשיות עבור כלל התכנים באפליקציה
                    </p>
                    <Badge className="mt-2" style={{ backgroundColor: 'var(--primary-salmon)', color: 'white' }}>
                        אדמין בלבד
                    </Badge>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <Card key={article.id} className="card-base flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg" style={{ color: 'var(--text-main)', textAlign: align }}>
                                    {article.title}
                                </CardTitle>
                                <p className="text-sm soft-text">{article.excerpt?.substring(0, 100)}...</p>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                                <div>
                                    {article.image_url ? (
                                        <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-4">
                                            <img
                                                src={article.image_url}
                                                alt={article.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                            <p className="soft-text">אין תמונה</p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Input
                                            id={`image-${article.id}`}
                                            type="file"
                                            onChange={(e) => {
                                                if (e.target.files[0]) handleImageUpload(article.id, e.target.files[0]);
                                            }}
                                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-yellow)] file:text-[var(--primary-salmon)] hover:file:bg-[var(--primary-salmon)] hover:file:text-white"
                                            disabled={uploadingId === article.id}
                                            accept="image/*"
                                        />
                                        {uploadingId === article.id && (
                                            <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary-salmon)]" />
                                        )}
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleSave(article.id)}
                                    disabled={!article.hasChanges || savingId === article.id}
                                    className="w-full main-cta mt-4"
                                >
                                    {savingId === article.id ? (
                                        <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 ml-2" />
                                    )}
                                    <span className="text-white">
                                        {savingId === article.id ? 'שומר...' : 'שמור שינוי תמונה'}
                                    </span>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}