// Types mirroring the i14y-aid Swagger 2.0 spec.

export type HealthResponse = {
  status?: string;
  version?: string;
  namespace?: string;
  capabilities?: Record<string, boolean | string | number>;
  [k: string]: unknown;
};

export type Evidence = {
  type?: string;
  source?: string;
  component?: string;
  field?: string;
  value?: string;
  confidence?: Confidence;
  [k: string]: unknown;
};

export type ProductionRuntime = {
  requestedProduction?: string;
  currentProduction?: string;
  state?: number;
  stateLabel?: string;
  isCurrent?: number;
  isRunning?: number;
};

export type ProductionSummary = {
  name: string;
  namespace?: string;
  description?: string;
  className?: string;
  componentCount?: number;
  runtime?: ProductionRuntime;
  isRunning?: number;
  runtimeState?: string;
  evidence?: Evidence[];
  [k: string]: unknown;
};

export type ProductionListResponse = {
  namespace?: string;
  items: ProductionSummary[];
  count?: number;
  warnings?: string[];
};

export type ProductionDetailResponse = ProductionSummary & {
  itemCount?: number;
};


export type Confidence = "confirmed" | "observed" | "inferred" | "unknown";

export type Component = {
  name: string;
  className?: string;
  category?: "service" | "process" | "operation" | "unknown" | string;
  enabled?: boolean;
  adapter?: string;
  protocol?: string;
  targets?: string[];
  confidence?: Confidence;
  [k: string]: unknown;
};

export type ComponentListResponse = {
  production: string;
  components: Component[];
};
