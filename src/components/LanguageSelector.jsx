import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

const languages = [
  { code: 'he', name: 'עברית' },
  { code: 'en', name: 'English'}
];

export default function LanguageSelector({ value, onChange, label }) {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="flex items-center gap-2">
          <Globe className="w-4 h-4" style={{color: 'var(--primary-salmon)'}} />
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="בחרו שפה / Choose Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}