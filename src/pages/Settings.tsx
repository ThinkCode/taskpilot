import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useUIStore } from '@/stores/uiStore';
import { Moon, Sun, Monitor } from 'lucide-react';

export function Settings() {
  const { theme, setTheme } = useUIStore();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure TaskPilot</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Theme</Label>
            <div className="flex gap-2 mt-2">
              {[
                { value: 'dark' as const, icon: Moon, label: 'Dark' },
                { value: 'light' as const, icon: Sun, label: 'Light' },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${
                    theme === value
                      ? 'border-primary bg-secondary'
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            TaskPilot uses Ollama for local AI. Make sure Ollama is running on localhost:11434.
          </p>
          <div className="mt-3 p-3 rounded-lg bg-secondary text-sm font-mono">
            ollama serve
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
