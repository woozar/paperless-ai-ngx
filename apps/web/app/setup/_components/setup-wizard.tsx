'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Wand2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StepAiAccount } from './step-ai-account';
import { StepAiModel } from './step-ai-model';
import { StepAiBot } from './step-ai-bot';
import { StepPaperless } from './step-paperless';

const DEFAULT_SYSTEM_PROMPT = `You are a document analysis assistant for Paperless-ngx. Your task is to analyze documents and suggest metadata improvements.

When analyzing a document, provide:
- A clear, concise title
- Relevant tags that describe the document's content and purpose
- The correspondent (sender/receiver) if identifiable
- The document type (invoice, letter, contract, etc.)
- The document date if mentioned

Always respond in a structured format and be conservative with suggestions - only suggest changes when confident.`;

type WizardStep = 'ai-account' | 'ai-model' | 'ai-bot' | 'paperless';

type WizardData = {
  aiAccount: {
    id?: string;
    name: string;
    provider: string;
    apiKey: string;
    baseUrl?: string;
    tested: boolean;
  };
  aiModel: {
    id?: string;
    name: string;
    modelIdentifier: string;
    inputTokenPrice: string;
    outputTokenPrice: string;
  };
  aiBot: {
    id?: string;
    name: string;
    systemPrompt: string;
    responseLanguage: string;
    documentMode: string;
    pdfMaxSizeMb: string;
  };
  paperless: {
    name: string;
    apiUrl: string;
    apiToken: string;
    tested: boolean;
    autoProcessEnabled: boolean;
    scanCronExpression: string;
  };
};

type LoadResult = {
  data: Partial<WizardData>;
  step: WizardStep;
};

async function fetchWithAuth<T>(url: string, token: string | null): Promise<T | null> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  return response.json();
}

async function loadExistingEntitiesFromApi(token: string | null): Promise<LoadResult> {
  const result: LoadResult = { data: {}, step: 'ai-account' };

  // Load AI Accounts
  const accountsData = await fetchWithAuth<{
    items?: Array<{ id: string; name: string; provider: string; baseUrl?: string }>;
  }>('/api/ai-accounts', token);
  const account = accountsData?.items?.[0];
  if (!account) return result;

  result.data.aiAccount = {
    id: account.id,
    name: account.name,
    provider: account.provider,
    apiKey: '***',
    baseUrl: account.baseUrl || '',
    tested: true,
  };
  result.step = 'ai-model';

  // Load AI Models
  const modelsData = await fetchWithAuth<{
    items?: Array<{
      id: string;
      name: string;
      modelIdentifier: string;
      inputTokenPrice?: number;
      outputTokenPrice?: number;
      aiAccountId: string;
    }>;
  }>('/api/ai-models', token);
  const accountModel = modelsData?.items?.find((m) => m.aiAccountId === account.id);
  if (!accountModel) return result;

  result.data.aiModel = {
    id: accountModel.id,
    name: accountModel.name,
    modelIdentifier: accountModel.modelIdentifier,
    inputTokenPrice: String(accountModel.inputTokenPrice || 0),
    outputTokenPrice: String(accountModel.outputTokenPrice || 0),
  };
  result.step = 'ai-bot';

  // Load AI Bots
  const botsData = await fetchWithAuth<{
    items?: Array<{
      id: string;
      name: string;
      systemPrompt: string;
      responseLanguage: string;
      documentMode?: string;
      pdfMaxSizeMb?: number;
      aiModelId: string;
    }>;
  }>('/api/ai-bots', token);
  const modelBot = botsData?.items?.find((b) => b.aiModelId === accountModel.id);
  if (!modelBot) return result;

  result.data.aiBot = {
    id: modelBot.id,
    name: modelBot.name,
    systemPrompt: modelBot.systemPrompt,
    responseLanguage: modelBot.responseLanguage,
    documentMode: modelBot.documentMode || 'text',
    pdfMaxSizeMb: String(modelBot.pdfMaxSizeMb || ''),
  };
  result.step = 'paperless';

  return result;
}

export function SetupWizard() {
  const t = useTranslations('setup');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('ai-account');
  const [isLoading, setIsLoading] = useState(true);

  const [wizardData, setWizardData] = useState<WizardData>({
    aiAccount: {
      name: '',
      provider: 'openai',
      apiKey: '',
      baseUrl: '',
      tested: false,
    },
    aiModel: {
      name: '',
      modelIdentifier: '',
      inputTokenPrice: '0',
      outputTokenPrice: '0',
    },
    aiBot: {
      name: 'Document Analyzer',
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      responseLanguage: 'DOCUMENT',
      documentMode: 'text',
      pdfMaxSizeMb: '',
    },
    paperless: {
      name: '',
      apiUrl: '',
      apiToken: '',
      tested: false,
      autoProcessEnabled: true,
      scanCronExpression: '0 * * * *',
    },
  });

  // Resume logic: Load existing entities on mount
  useEffect(() => {
    async function loadExistingEntities() {
      try {
        const token = localStorage.getItem('auth_token');
        const { data, step } = await loadExistingEntitiesFromApi(token);

        if (Object.keys(data).length > 0) {
          setWizardData((prev) => ({
            ...prev,
            ...data,
            // v8 ignore next 3 -- @preserve
            aiAccount: data.aiAccount ? { ...prev.aiAccount, ...data.aiAccount } : prev.aiAccount,
            aiModel: data.aiModel ? { ...prev.aiModel, ...data.aiModel } : prev.aiModel,
            aiBot: data.aiBot ? { ...prev.aiBot, ...data.aiBot } : prev.aiBot,
          }));
          setCurrentStep(step);
        }
      } catch (error) {
        console.error('Failed to load existing entities:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadExistingEntities();
  }, []);

  const updateAiAccount = (data: Partial<WizardData['aiAccount']>) => {
    setWizardData((prev) => ({ ...prev, aiAccount: { ...prev.aiAccount, ...data } }));
  };

  const updateAiModel = (data: Partial<WizardData['aiModel']>) => {
    setWizardData((prev) => ({ ...prev, aiModel: { ...prev.aiModel, ...data } }));
  };

  const updateAiBot = (data: Partial<WizardData['aiBot']>) => {
    setWizardData((prev) => ({ ...prev, aiBot: { ...prev.aiBot, ...data } }));
  };

  const updatePaperless = (data: Partial<WizardData['paperless']>) => {
    setWizardData((prev) => ({ ...prev, paperless: { ...prev.paperless, ...data } }));
  };

  const handleComplete = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-6 flex items-center gap-3">
        <Wand2 className="text-primary h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      <Card className="border p-6">
        <CardHeader className="p-0 pb-6">
          <CardTitle>{t('wizardTitle')}</CardTitle>
          <CardDescription>{t('wizardDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={currentStep} onValueChange={(v) => setCurrentStep(v as WizardStep)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ai-account" data-testid="setup-tab-ai-account">
                {t('steps.aiAccount')}
              </TabsTrigger>
              <TabsTrigger
                value="ai-model"
                disabled={!wizardData.aiAccount.id}
                data-testid="setup-tab-ai-model"
              >
                {t('steps.aiModel')}
              </TabsTrigger>
              <TabsTrigger
                value="ai-bot"
                disabled={!wizardData.aiModel.id}
                data-testid="setup-tab-ai-bot"
              >
                {t('steps.aiBot')}
              </TabsTrigger>
              <TabsTrigger
                value="paperless"
                disabled={!wizardData.aiBot.id}
                data-testid="setup-tab-paperless"
              >
                {t('steps.paperless')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-account" className="mt-6">
              <StepAiAccount
                data={wizardData.aiAccount}
                onChange={updateAiAccount}
                onNext={(accountId) => {
                  updateAiAccount({ id: accountId });
                  setCurrentStep('ai-model');
                }}
              />
            </TabsContent>

            <TabsContent value="ai-model" className="mt-6">
              <StepAiModel
                data={wizardData.aiModel}
                aiAccountId={wizardData.aiAccount.id!}
                onChange={updateAiModel}
                onBack={() => setCurrentStep('ai-account')}
                onNext={
                  /* v8 ignore next 4 -- @preserve */
                  (modelId) => {
                    updateAiModel({ id: modelId });
                    setCurrentStep('ai-bot');
                  }
                }
              />
            </TabsContent>

            <TabsContent value="ai-bot" className="mt-6">
              <StepAiBot
                data={wizardData.aiBot}
                aiModelId={wizardData.aiModel.id!}
                onChange={updateAiBot}
                onBack={() => setCurrentStep('ai-model')}
                onNext={
                  /* v8 ignore next 4 -- @preserve */
                  (botId) => {
                    updateAiBot({ id: botId });
                    setCurrentStep('paperless');
                  }
                }
              />
            </TabsContent>

            <TabsContent value="paperless" className="mt-6">
              <StepPaperless
                data={wizardData.paperless}
                aiBotId={wizardData.aiBot.id!}
                onChange={updatePaperless}
                onBack={() => setCurrentStep('ai-bot')}
                onComplete={handleComplete}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
