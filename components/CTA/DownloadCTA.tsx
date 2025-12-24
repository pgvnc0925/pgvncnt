"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import Link from "next/link";

interface DownloadCTAProps {
  title: string;
  description: string;
  downloadUrl: string;
  buttonText?: string;
}

export function DownloadCTA({
  title,
  description,
  downloadUrl,
  buttonText = "Scarica Gratis"
}: DownloadCTAProps) {
  return (
    <Card className="my-8 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <FileText className="h-6 w-6 text-cyan-600" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
          <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
            <Link href={downloadUrl}>
              <Download className="mr-2 h-4 w-4" />
              {buttonText}
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
