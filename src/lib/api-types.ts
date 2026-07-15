// Types mirroring the i14y-aid Swagger 2.0 spec.

// ---- Metrics (spec v6) ----
export type EvidenceMetrics = {
  evidenceCount?: number;
  confirmedEvidenceCount?: number;
  observedEvidenceCount?: number;
  inferredEvidenceCount?: number;
  unknownEvidenceCount?: number;
  warningCount?: number;
};

export type ProductionListMetrics = EvidenceMetrics & {
  productionCount?: number;
  runningProductionCount?: number;
  componentCount?: number;
  serviceCount?: number;
  processCount?: number;
  operationCount?: number;
  disabledComponentCount?: number;
};

export type ProductionMetrics = EvidenceMetrics & {
  componentCount?: number;
  serviceCount?: number;
  processCount?: number;
  operationCount?: number;
  disabledComponentCount?: number;
  connectionCount?: number;
  targetConfigConnectionCount?: number;
  routingRuleConnectionCount?: number;
  bplCallConnectionCount?: number;
  externalSystemCount?: number;
  artifactCount?: number;
  ruleCount?: number;
  messageTypeCount?: number;
  transformationCount?: number;
  businessProcessCount?: number;
};

export type GraphMetrics = EvidenceMetrics & {
  nodeCount?: number;
  edgeCount?: number;
  serviceCount?: number;
  processCount?: number;
  operationCount?: number;
  disabledNodeCount?: number;
  targetConfigEdgeCount?: number;
  routingRuleEdgeCount?: number;
  bplCallEdgeCount?: number;
};

export type ComponentMetrics = EvidenceMetrics & {
  connectionCount?: number;
  externalSystemCount?: number;
  artifactCount?: number;
  ruleCount?: number;
  messageTypeCount?: number;
  transformationCount?: number;
  businessProcessCount?: number;
  explanationCount?: number;
};

export type TraceMetrics = EvidenceMetrics & {
  stepCount?: number;
};

export type AnalysisCoverage = EvidenceMetrics & {
  componentCount?: number;
  connectionCount?: number;
  messageTypeCount?: number;
  externalSystemCount?: number;
  artifactCount?: number;
  ruleCount?: number;
  transformationCount?: number;
  businessProcessCount?: number;
  componentAnalysisAvailable?: boolean;
  targetAnalysisAvailable?: boolean;
  messageSignatureAnalysisAvailable?: boolean;
  ruleAnalysisAvailable?: boolean;
  transformationAnalysisAvailable?: boolean;
  businessProcessAnalysisAvailable?: boolean;
  [k: string]: unknown;
};

// ---- Per-entity explanations (spec v6) ----
export type RuleExplanation = {
  name?: string;
  component?: string;
  conditionCount?: number;
  targets?: string[];
  transforms?: string[];
  targetCount?: number;
  transformCount?: number;
  text?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};
export type TransformationExplanation = {
  name?: string;
  component?: string;
  sourceKind?: string;
  sourceClass?: string;
  targetClass?: string;
  assignmentCount?: number;
  text?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};
export type BusinessProcessExplanation = {
  name?: string;
  component?: string;
  requestClass?: string;
  responseClass?: string;
  contextClass?: string;
  callTargets?: string[];
  callCount?: number;
  assignCount?: number;
  text?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};
export type ExternalSystemExplanation = {
  component?: string;
  componentType?: string;
  kind?: string;
  value?: string;
  text?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};
export type ArtifactExplanation = {
  kind?: string;
  name?: string;
  component?: string;
  label?: string;
  text?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};
export type MessageTypeExplanation = {
  component?: string;
  componentType?: string;
  className?: string;
  method?: string;
  parameter?: string;
  direction?: string;
  messageClass?: string;
  text?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};
export type ConnectionExplanation = {
  from?: string;
  to?: string;
  kind?: string;
  ruleName?: string;
  processClass?: string;
  messageClasses?: string[];
  text?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};


export type Confidence = "confirmed" | "observed" | "inferred" | "unknown";

export type Evidence = {
  type?: string;
  source?: string;
  component?: string;
  field?: string;
  value?: string;
  confidence?: Confidence;
};

export type Warning = { code?: string; message?: string };

export type HealthResponse = {
  status?: string;
  module?: string;
  version?: string;
  namespace?: string;
  capabilities?: Record<string, boolean | string | number>;
  [k: string]: unknown;
};

export type AnalysisSettings = {
  runtimeMessageAnalysisEnabled?: boolean;
  payloadInspectionEnabled?: boolean;
  maxMessagesReturned?: number;
  maxTraceDepth?: number;
  defaultMessageLookbackDays?: number;
  fieldRedactionPatterns?: string;
  classExclusions?: string;
  productionExclusions?: string;
  sourceCodeInferenceEnabled?: boolean;
  explanationVerbosity?: string;
  aiProviderEnabled?: boolean;
};

export type SettingsResponse = {
  namespace?: string;
  settings?: AnalysisSettings;
  evidence?: Evidence[];
};

export type ProductionRuntime = {
  requestedProduction?: string;
  currentProduction?: string;
  state?: number;
  stateLabel?: string;
  isCurrent?: boolean | number;
  isRunning?: boolean | number;
  statusText?: string;
};

export type ProductionSummary = {
  name: string;
  namespace?: string;
  description?: string;
  className?: string;
  componentCount?: number;
  runtime?: ProductionRuntime;
  isRunning?: boolean | number;
  runtimeState?: string;
  evidence?: Evidence[];
};

export type ProductionListResponse = {
  namespace?: string;
  items: ProductionSummary[];
  count?: number;
  warnings?: Warning[];
};

export type Component = {
  name: string;
  className?: string;
  type?: string;
  enabled?: boolean;
  category?: string;
  poolSize?: number;
  comment?: string;
  adapterClass?: string;
  adapter?: string; // legacy alias
  protocol?: string;
  settings?: Record<string, unknown>;
  targets?: string[];
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type ProductionDetailResponse = {
  namespace?: string;
  name: string;
  description?: string;
  componentCount?: number;
  runtime?: ProductionRuntime;
  isRunning?: boolean | number;
  runtimeState?: string;
  components?: Component[];
  evidence?: Evidence[];
};

export type ComponentListResponse = {
  namespace?: string;
  productionName: string;
  items?: Component[];
  components?: Component[]; // legacy
  count?: number;
  warnings?: Warning[];
};

export type Connection = {
  from?: string;
  to?: string;
  kind?: string;
  ruleName?: string;
  processClass?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type ExternalSystem = {
  component?: string;
  componentType?: string;
  kind?: string;
  value?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type AnalysisArtifact = {
  kind?: string;
  name?: string;
  component?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type RuleSend = {
  target?: string;
  transform?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type RuleCondition = {
  condition?: string;
  comment?: string;
  sends?: RuleSend[];
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type RuleDetail = {
  name?: string;
  component?: string;
  conditions?: RuleCondition[];
  sends?: RuleSend[];
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type MessageType = {
  component?: string;
  componentType?: string;
  className?: string;
  method?: string;
  parameter?: string;
  direction?: string;
  messageClass?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type TransformationAssignment = {
  property?: string;
  value?: string;
  action?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type TransformationDetail = {
  name?: string;
  component?: string;
  sourceKind?: string;
  sourceClass?: string;
  targetClass?: string;
  create?: string;
  language?: string;
  actions?: Record<string, unknown>;
  assignments?: TransformationAssignment[];
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type BusinessProcessCall = {
  name?: string;
  target?: string;
  async?: boolean;
  timeout?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type BusinessProcessDetail = {
  name?: string;
  component?: string;
  requestClass?: string;
  responseClass?: string;
  contextClass?: string;
  actions?: Record<string, unknown>;
  calls?: BusinessProcessCall[];
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type ComponentExplanation = {
  component?: string;
  componentType?: string;
  text?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type ProductionAnalysisResponse = {
  namespace?: string;
  productionName?: string;
  production?: ProductionDetailResponse;
  summary?: string;
  components?: Component[];
  connections?: Connection[];
  externalSystems?: ExternalSystem[];
  artifacts?: AnalysisArtifact[];
  rules?: RuleDetail[];
  messageTypes?: MessageType[];
  transformations?: TransformationDetail[];
  businessProcesses?: BusinessProcessDetail[];
  componentExplanations?: ComponentExplanation[];
  warnings?: Warning[];
  evidence?: Evidence[];
  confidence?: Confidence;
};

export type ProductionSummaryResponse = {
  namespace?: string;
  productionName?: string;
  summary?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
  warnings?: Warning[];
};

export type ProductionRuntimeResponse = {
  namespace?: string;
  name?: string;
  runtime?: ProductionRuntime;
  isRunning?: boolean;
  runtimeState?: string;
};

export type ProductionActionResponse = {
  namespace?: string;
  productionName?: string;
  action?: string;
  changed?: boolean;
  runtime?: ProductionRuntime;
};

export type MessageHeader = {
  messageId?: number;
  sessionId?: number;
  timeCreated?: string;
  timeProcessed?: string;
  sourceConfigName?: string;
  targetConfigName?: string;
  messageBodyClassName?: string;
  messageBodyId?: string;
  status?: string;
  isError?: boolean;
  errorStatus?: string;
  type?: string;
  invocation?: string;
  correspondingMessageId?: number;
  payloadReturned?: boolean;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type MessageHeaderListResponse = {
  namespace?: string;
  productionName?: string;
  items: MessageHeader[];
  count?: number;
  limit?: number;
  offset?: number;
  sourceConfigName?: string;
  targetConfigName?: string;
  messageBodyClassName?: string;
  sessionId?: string;
  errorsOnly?: boolean;
  hasMore?: boolean;
  payloadReturned?: boolean;
  runtimeMessageAnalysisEnabled?: boolean;
  maxMessagesReturned?: number;
  warnings?: Warning[];
};

export type MessageFacetResponse = {
  namespace?: string;
  productionName?: string;
  limit?: number;
  totalCount?: number;
  errorCount?: number;
  hasMore?: boolean;
  sourceConfigNames?: string[];
  targetConfigNames?: string[];
  messageBodyClassNames?: string[];
  sessionIds?: string[];
  componentNames?: string[];
  runtimeMessageAnalysisEnabled?: boolean;
  warnings?: Warning[];
};

export type MessageDetailResponse = {
  namespace?: string;
  messageId?: number;
  message?: MessageHeader;
  payloadReturned?: boolean;
  runtimeMessageAnalysisEnabled?: boolean;
  warnings?: Warning[];
};

export type TraceStep = {
  sequence?: number;
  messageId?: number;
  sessionId?: number;
  timeCreated?: string;
  timeProcessed?: string;
  source?: string;
  target?: string;
  messageBodyClassName?: string;
  status?: string;
  isError?: boolean;
  invocation?: string;
  correspondingMessageId?: number;
  payloadReturned?: boolean;
  explanation?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type TraceOverview = {
  messageId?: number;
  sessionId?: number;
  stepCount?: number;
  errorCount?: number;
  firstSeen?: string;
  lastSeen?: string;
  origin?: string;
  finalTarget?: string;
  path?: string;
  participants?: string[];
};

export type TraceExplanation = {
  messageId?: number;
  sessionId?: number;
  text?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type MessageTraceResponse = {
  namespace?: string;
  messageId?: number;
  sessionId?: number;
  productionName?: string;
  productionScoped?: boolean;
  productionStepCount?: number;
  selectedMessage?: MessageHeader;
  summary?: string;
  traceOverview?: TraceOverview;
  traceExplanation?: TraceExplanation;
  steps?: TraceStep[];
  stepCount?: number;
  maxTraceDepth?: number;
  payloadReturned?: boolean;
  runtimeMessageAnalysisEnabled?: boolean;
  warnings?: Warning[];
  evidence?: Evidence[];
  confidence?: Confidence;
};

export type CapabilitiesResponse = {
  namespace?: string;
  interoperabilityAvailable?: boolean;
  currentNamespaceOnly?: boolean;
  productionDiscovery?: boolean;
  productionXDataAnalysis?: boolean;
  productionControl?: boolean;
  runtimeTraceAnalysis?: boolean;
  payloadInspection?: boolean;
  openapiVersion?: string;
};

export type SettingsUpdateResponse = {
  namespace?: string;
  changed?: boolean;
  settings?: AnalysisSettings;
  warnings?: Warning[];
  evidence?: Evidence[];
};

export type GraphNode = {
  id?: string;
  label?: string;
  type?: string;
  className?: string;
  enabled?: boolean;
  protocol?: string;
  adapterClass?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type GraphEdge = {
  id?: string;
  source?: string;
  target?: string;
  relationship?: string;
  kind?: string;
  messageTypes?: string[];
  ruleName?: string;
  processClass?: string;
  confidence?: Confidence;
  evidence?: Evidence[];
};

export type ProductionGraphResponse = {
  namespace?: string;
  productionName?: string;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  warnings?: Warning[];
  evidence?: Evidence[];
  confidence?: Confidence;
};

export type PayloadMetadata = {
  messageId?: number;
  messageBodyClassName?: string;
  messageBodyId?: string;
  payloadReturned?: boolean;
  payloadInspectionEnabled?: boolean;
  payloadInspectionSupported?: boolean;
  bodyReferenceAvailable?: boolean;
  bodyClassExists?: boolean;
  restricted?: boolean;
  restrictionReason?: string;
  fields?: Record<string, unknown>[];
  warnings?: Warning[];
  evidence?: Evidence[];
};

export type MessagePayloadMetadataResponse = {
  namespace?: string;
  messageId?: number;
  message?: MessageHeader;
  metadata?: PayloadMetadata;
  messageBodyClassName?: string;
  messageBodyId?: string;
  bodyReferenceAvailable?: boolean;
  restricted?: boolean;
  restrictionReason?: string;
  payloadReturned?: boolean;
  runtimeMessageAnalysisEnabled?: boolean;
  payloadInspectionEnabled?: boolean;
  payloadInspectionSupported?: boolean;
  warnings?: Warning[];
  evidence?: Evidence[];
};

export type MessageExplanationResponse = {
  namespace?: string;
  messageId?: number;
  sessionId?: number;
  explanation?: TraceExplanation;
  summary?: string;
  stepCount?: number;
  payloadReturned?: boolean;
  runtimeMessageAnalysisEnabled?: boolean;
  warnings?: Warning[];
  evidence?: Evidence[];
  confidence?: Confidence;
};

export type PayloadPreviewField = {
  name?: string;
  type?: string;
  value?: string;
  redacted?: boolean;
};

export type MessagePayloadPreviewResponse = {
  namespace?: string;
  messageId?: number;
  productionName?: string;
  message?: MessageHeader;
  metadata?: PayloadMetadata;
  messageBodyClassName?: string;
  messageBodyId?: string;
  bodyReferenceAvailable?: boolean;
  bodyContentReturned?: boolean;
  payloadReturned?: boolean;
  runtimeMessageAnalysisEnabled?: boolean;
  payloadInspectionEnabled?: boolean;
  payloadInspectionSupported?: boolean;
  restricted?: boolean;
  restrictionReason?: string;
  fields?: PayloadPreviewField[];
  warnings?: Warning[];
  evidence?: Evidence[];
};

export type MessageSessionSummaryResponse = {
  namespace?: string;
  productionName?: string;
  messageId?: number;
  sessionId?: number;
  selectedMessage?: MessageHeader;
  stepCount?: number;
  productionStepCount?: number;
  outsideProductionStepCount?: number;
  errorCount?: number;
  firstSeen?: string;
  lastSeen?: string;
  origin?: string;
  finalTarget?: string;
  path?: string;
  participants?: string[];
  text?: string;
  confidence?: Confidence;
  warnings?: Warning[];
};

export type MessageResendResponse = {
  namespace?: string;
  productionName?: string;
  messageId?: number;
  sessionId?: number;
  action?: string;
  requested?: boolean;
  allowed?: boolean;
  executed?: boolean;
  dryRun?: boolean;
  supported?: boolean;
  changed?: boolean;
  reason?: string;
  statusText?: string;
  messageResendEnabled?: boolean;
  warnings?: Warning[];
};

export type ComponentDetailResponse = {
  namespace?: string;
  productionName?: string;
  componentName?: string;
  component?: Component;
  explanation?: ComponentExplanation;
  connections?: Connection[];
  externalSystems?: ExternalSystem[];
  artifacts?: AnalysisArtifact[];
  rules?: RuleDetail[];
  messageTypes?: MessageType[];
  transformations?: TransformationDetail[];
  businessProcesses?: BusinessProcessDetail[];
  warnings?: Warning[];
  evidence?: Evidence[];
  confidence?: Confidence;
};
