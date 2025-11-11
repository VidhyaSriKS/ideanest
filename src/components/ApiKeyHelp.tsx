import { AlertCircle, ExternalLink } from "lucide-react";
import { Alert } from "./ui/alert";

export function ApiKeyHelp() {
  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50">
      <Alert className="glass-card border-amber-500/50 bg-amber-500/10">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <div className="ml-3">
          <h3 className="font-semibold text-amber-300 mb-1">Need help with API setup?</h3>
          <p className="text-sm text-slate-300 mb-2">
            If you're seeing errors, make sure you've added your OpenAI API key to the environment variables.
          </p>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#38bdf8] hover:underline flex items-center gap-1"
          >
            Get your OpenAI API key
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </Alert>
    </div>
  );
}
