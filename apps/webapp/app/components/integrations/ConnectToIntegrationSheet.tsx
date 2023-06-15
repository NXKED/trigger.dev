import React, { useState } from "react";
import {
  ApiAuthenticationMethodApiKey,
  Integration,
} from "~/services/externalApis/types";
import { Header1, Header2 } from "../primitives/Headers";
import { NamedIconInBox } from "../primitives/NamedIcon";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../primitives/Sheet";
import { RadioGroup, RadioGroupItem } from "../primitives/RadioButton";
import { ApiKeyHelp } from "./ApiKeyHelp";

type IntegrationMethod = "apikey" | "oauth2" | "custom";

export function ConnectToIntegrationSheet({
  integration,
  organizationId,
  button,
  className,
}: {
  integration: Integration;
  organizationId: string;
  button: React.ReactNode;
  className?: string;
}) {
  const [integrationMethod, setIntegrationMethod] = useState<
    IntegrationMethod | undefined
  >(undefined);

  const authMethods = Object.values(integration.authenticationMethods);
  const hasApiKeyOption = authMethods.some((s) => s.type === "apikey");
  const hasOAuth2Option = authMethods.some((s) => s.type === "oauth2");

  return (
    <Sheet>
      <SheetTrigger className={className}>{button}</SheetTrigger>
      <SheetContent size="lg">
        <SheetHeader>
          <NamedIconInBox name={integration.identifier} className="h-9 w-9" />
          <Header1>{integration.name}</Header1>
        </SheetHeader>
        <SheetBody className="overflow-auto-y">
          <Header2 className="mb-2">Choose an integration method</Header2>
          <RadioGroup
            name="method"
            className="flex gap-2"
            value={integrationMethod}
            onValueChange={(v) => setIntegrationMethod(v as IntegrationMethod)}
          >
            {hasApiKeyOption && (
              <RadioGroupItem
                id="apikey"
                value="apikey"
                label="API Key"
                description="Use API keys in your code. They never leave your server."
                variant="description"
              />
            )}
            {hasOAuth2Option && (
              <RadioGroupItem
                id="oauth2"
                value="oauth2"
                label="OAuth"
                description="We handle OAuth for you or your users."
                variant="description"
              />
            )}
            <RadioGroupItem
              id="custom"
              value="custom"
              label="Fetch/Existing SDK"
              description={`Alternatively, use ${integration.name} without our integration.`}
              variant="description"
            />
          </RadioGroup>

          {integrationMethod && (
            <SelectedIntegrationMethod
              integration={integration}
              organizationId={organizationId}
              method={integrationMethod}
            />
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

function SelectedIntegrationMethod({
  integration,
  organizationId,
  method,
}: {
  integration: Integration;
  organizationId: string;
  method: IntegrationMethod;
}) {
  const authMethods = Object.values(integration.authenticationMethods);

  switch (method) {
    case "apikey":
      const apiAuth = authMethods.find((a) => a.type === "apikey");
      if (!apiAuth) return null;
      return (
        <ApiKeyHelp
          integration={integration}
          apiAuth={apiAuth as ApiAuthenticationMethodApiKey}
        />
      );
    case "oauth2":
      return null;
    case "custom":
      return null;
  }
}
