// Types mirroring the i14y-aid Swagger 2.0 spec.

export type HealthResponse = {
  status?: string;
  version?: string;
  namespace?: string;
  capabilities?: Record<string, boolean | string | number>;
  [k: string]: unknown;
};

export type ProductionSummary = {
  name: string;
  description?: string;
  className?: string;
  [k: string]: unknown;
};

export type ProductionListResponse = {
  productions: ProductionSummary[];
  namespace?: string;
};

export type ProductionDetailResponse = ProductionSummary & {
  namespace?: string;
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
