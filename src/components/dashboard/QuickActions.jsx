
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Baby, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActions() {
  const actions = [
    {
      title: "רישום יומי",
      icon: Plus,
      color: "bg-pink-400 hover:bg-pink-500",
      href: createPageUrl("FeedingLog")
    },
    {
      title: "עיון במתכונים",
      icon: BookOpen,
      color: "bg-pink-400 hover:bg-pink-500",
      href: createPageUrl("MealPlanner")
    },
    {
      title: "מדריך תזונה",
      icon: Baby,
      color: "bg-pink-400 hover:bg-pink-500",
      href: createPageUrl("NutritionGuide")
    }
  ];

  return (
    <Card className="shadow-lg border-0 bg-pink-50 border border-pink-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{color: "var(--text-main)"}}>
          <Calendar className="w-5 h-5 text-pink-400" />
          פעולות מהירות
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Button className={`w-full justify-start ${action.color} text-white shadow-md`}>
                <span className="mr-2">{action.title}</span>
                <action.icon className="w-4 h-4" />
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
