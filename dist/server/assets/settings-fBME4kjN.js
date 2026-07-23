import { a as Skeleton, i as setApiConfig, n as apiFetch, o as cn, r as getApiConfig, t as DEFAULT_BASE_URL } from "./api-config-BqoIDxBb.js";
import { t as Button } from "./button-BwAtE8PJ.js";
import { t as Input } from "./input-DI6UcbvY.js";
import { t as PageHeader } from "./page-header-BF0qj5eV.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cva } from "class-variance-authority";
import { toast } from "sonner";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SwitchPrimitives from "@radix-ui/react-switch";
//#region src/components/ui/label.tsx
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = LabelPrimitive.Root.displayName;
//#endregion
//#region src/components/ui/switch.tsx
var Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SwitchPrimitives.Root, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ jsx(SwitchPrimitives.Thumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = SwitchPrimitives.Root.displayName;
//#endregion
//#region src/routes/settings.tsx?tsr-split=component
function SettingsPage() {
	const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [testing, setTesting] = useState(false);
	const [result, setResult] = useState(null);
	useEffect(() => {
		const cfg = getApiConfig();
		setBaseUrl(cfg.baseUrl);
		setUsername(cfg.username);
		setPassword(cfg.password);
	}, []);
	const save = () => {
		setApiConfig({
			baseUrl,
			username,
			password
		});
		toast.success("Connection settings saved");
	};
	const test = async () => {
		setApiConfig({
			baseUrl,
			username,
			password
		});
		setTesting(true);
		setResult(null);
		try {
			await apiFetch("/health");
			setResult({
				ok: true,
				message: "Reached /health successfully."
			});
		} catch (e) {
			setResult({
				ok: false,
				message: e.message
			});
		} finally {
			setTesting(false);
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		crumbs: [{ label: "Preferences" }],
		title: "Settings"
	}), /* @__PURE__ */ jsxs("div", {
		className: "p-8 max-w-2xl space-y-8",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "bg-card ring-1 ring-black/5 rounded-lg p-6 space-y-5",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-sm font-semibold",
						children: "IRIS Explainer API"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: [
							"Point the UI at your",
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "font-mono",
								children: "i14y-aid"
							}),
							" CSP application. The base URL should end at",
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "font-mono",
								children: "/i14y-aid/api"
							}),
							"."
						]
					})] }),
					/* @__PURE__ */ jsx(Field, {
						label: "Base URL",
						children: /* @__PURE__ */ jsx(Input, {
							value: baseUrl,
							onChange: (e) => setBaseUrl(e.target.value),
							placeholder: DEFAULT_BASE_URL,
							className: "font-mono text-sm"
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsx(Field, {
							label: "Username (optional)",
							children: /* @__PURE__ */ jsx(Input, {
								value: username,
								onChange: (e) => setUsername(e.target.value),
								placeholder: "_SYSTEM",
								className: "font-mono text-sm",
								autoComplete: "off"
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: "Password (optional)",
							children: /* @__PURE__ */ jsx(Input, {
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: "font-mono text-sm",
								autoComplete: "new-password"
							})
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-muted-foreground",
						children: "Credentials are stored in your browser's local storage and sent as HTTP Basic auth on every request."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx(Button, {
							onClick: save,
							className: "bg-iris-brand hover:bg-iris-brand/90",
							children: "Save"
						}), /* @__PURE__ */ jsx(Button, {
							variant: "outline",
							onClick: test,
							disabled: testing,
							children: testing ? "Testing…" : "Test connection"
						})]
					}),
					result ? /* @__PURE__ */ jsx("div", {
						className: `text-xs font-mono rounded-md p-3 border ${result.ok ? "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed" : "border-destructive/30 bg-destructive/5 text-destructive"}`,
						children: result.message
					}) : null
				]
			}),
			/* @__PURE__ */ jsx(ModuleSettingsSection, {}),
			/* @__PURE__ */ jsxs("section", {
				className: "text-[11px] text-muted-foreground font-mono",
				children: [/* @__PURE__ */ jsx("p", { children: "Endpoints exercised by this UI:" }), /* @__PURE__ */ jsxs("ul", {
					className: "mt-2 space-y-1",
					children: [
						/* @__PURE__ */ jsx("li", { children: "GET /_spec" }),
						/* @__PURE__ */ jsx("li", { children: "GET /health" }),
						/* @__PURE__ */ jsx("li", { children: "GET /capabilities" }),
						/* @__PURE__ */ jsx("li", { children: "GET /settings · PUT /settings" }),
						/* @__PURE__ */ jsx("li", { children: "GET /productions" }),
						/* @__PURE__ */ jsxs("li", { children: [
							"GET /productions/",
							"{productionName}",
							"/graph"
						] }),
						/* @__PURE__ */ jsxs("li", { children: [
							"GET /messages/",
							"{id}",
							"/payload"
						] })
					]
				})]
			})
		]
	})] });
}
function ModuleSettingsSection() {
	const qc = useQueryClient();
	const { data, isLoading, error } = useQuery({
		queryKey: ["settings"],
		queryFn: () => apiFetch("/settings"),
		retry: 0
	});
	const [draft, setDraft] = useState({});
	useEffect(() => {
		if (data?.settings) setDraft(data.settings);
	}, [data]);
	const mutation = useMutation({
		mutationFn: (body) => apiFetch("/settings", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		}),
		onSuccess: (r) => {
			toast.success(r.changed ? "Module settings updated" : "No changes to save");
			if (r.settings) setDraft(r.settings);
			qc.invalidateQueries({ queryKey: ["settings"] });
			qc.invalidateQueries({ queryKey: ["capabilities"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const set = (k, v) => setDraft((d) => ({
		...d,
		[k]: v
	}));
	return /* @__PURE__ */ jsxs("section", {
		className: "bg-card ring-1 ring-black/5 rounded-lg p-6 space-y-5",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
			className: "text-sm font-semibold",
			children: "Module analysis settings"
		}), /* @__PURE__ */ jsxs("p", {
			className: "text-xs text-muted-foreground mt-1",
			children: [
				"Runtime toggles read from ",
				/* @__PURE__ */ jsx("span", {
					className: "font-mono",
					children: "GET /settings"
				}),
				" ",
				"and saved via ",
				/* @__PURE__ */ jsx("span", {
					className: "font-mono",
					children: "PUT /settings"
				}),
				"."
			]
		})] }), isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-40 rounded-md" }) : error ? /* @__PURE__ */ jsx("div", {
			className: "text-xs font-mono text-destructive break-all",
			children: error.message
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-4",
				children: [
					/* @__PURE__ */ jsx(ToggleRow, {
						label: "Runtime message analysis",
						checked: !!draft.runtimeMessageAnalysisEnabled,
						onChange: (v) => set("runtimeMessageAnalysisEnabled", v)
					}),
					/* @__PURE__ */ jsx(ToggleRow, {
						label: "Payload inspection",
						checked: !!draft.payloadInspectionEnabled,
						onChange: (v) => set("payloadInspectionEnabled", v)
					}),
					/* @__PURE__ */ jsx(ToggleRow, {
						label: "Payload metadata",
						checked: !!draft.payloadMetadataEnabled,
						onChange: (v) => set("payloadMetadataEnabled", v)
					}),
					/* @__PURE__ */ jsx(ToggleRow, {
						label: "Source-code inference",
						checked: !!draft.sourceCodeInferenceEnabled,
						onChange: (v) => set("sourceCodeInferenceEnabled", v)
					}),
					/* @__PURE__ */ jsx(ToggleRow, {
						label: "Message resend",
						checked: !!draft.messageResendEnabled,
						onChange: (v) => set("messageResendEnabled", v)
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ jsx(NumberField, {
						label: "Max messages",
						value: draft.maxMessagesReturned,
						onChange: (v) => set("maxMessagesReturned", v)
					}),
					/* @__PURE__ */ jsx(NumberField, {
						label: "Max trace depth",
						value: draft.maxTraceDepth,
						onChange: (v) => set("maxTraceDepth", v)
					}),
					/* @__PURE__ */ jsx(NumberField, {
						label: "Lookback days",
						value: draft.defaultMessageLookbackDays,
						onChange: (v) => set("defaultMessageLookbackDays", v)
					})
				]
			}),
			/* @__PURE__ */ jsx(Field, {
				label: "Explanation verbosity",
				children: /* @__PURE__ */ jsx(Input, {
					value: draft.explanationVerbosity ?? "",
					onChange: (e) => set("explanationVerbosity", e.target.value),
					placeholder: "brief | standard | verbose",
					className: "font-mono text-sm"
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ jsx(Field, {
						label: "Field redaction patterns",
						children: /* @__PURE__ */ jsx(Input, {
							value: draft.fieldRedactionPatterns ?? "",
							onChange: (e) => set("fieldRedactionPatterns", e.target.value),
							className: "font-mono text-xs"
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Class exclusions",
						children: /* @__PURE__ */ jsx(Input, {
							value: draft.classExclusions ?? "",
							onChange: (e) => set("classExclusions", e.target.value),
							className: "font-mono text-xs"
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Production exclusions",
						children: /* @__PURE__ */ jsx(Input, {
							value: draft.productionExclusions ?? "",
							onChange: (e) => set("productionExclusions", e.target.value),
							className: "font-mono text-xs"
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-3 rounded-md ring-1 ring-black/5 p-4 bg-muted/30",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-xs font-semibold",
							children: "AI assistant"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-muted-foreground mt-0.5",
							children: "Optional OpenAI-assisted production summaries. Deterministic analysis always runs regardless of this section."
						})] }), /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2 text-[10px] font-mono",
							children: /* @__PURE__ */ jsxs("span", {
								className: `inline-flex items-center gap-1 rounded px-2 py-0.5 ring-1 ${draft.aiApiKeyConfigured ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10" : "text-muted-foreground ring-black/10 bg-background"}`,
								children: [draft.aiApiKeyConfigured ? "KEY CONFIGURED" : "NO KEY", draft.aiApiKeySource ? ` · ${draft.aiApiKeySource}` : ""]
							})
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsx(ToggleRow, {
							label: "AI provider enabled",
							checked: !!draft.aiProviderEnabled,
							onChange: (v) => set("aiProviderEnabled", v)
						}), /* @__PURE__ */ jsx(ToggleRow, {
							label: "AI production summary",
							checked: !!draft.aiSummaryEnabled,
							onChange: (v) => set("aiSummaryEnabled", v)
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Provider",
								children: /* @__PURE__ */ jsx(Input, {
									value: draft.aiProvider ?? "",
									onChange: (e) => set("aiProvider", e.target.value),
									placeholder: "openai",
									className: "font-mono text-sm"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Model",
								children: /* @__PURE__ */ jsx(Input, {
									value: draft.aiModel ?? "",
									onChange: (e) => set("aiModel", e.target.value),
									placeholder: "gpt-4o-mini",
									className: "font-mono text-sm"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Endpoint (optional)",
								children: /* @__PURE__ */ jsx(Input, {
									value: draft.aiEndpoint ?? "",
									onChange: (e) => set("aiEndpoint", e.target.value),
									placeholder: "https://api.openai.com/v1/chat/completions",
									className: "font-mono text-xs"
								})
							})
						]
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "OpenAI API key (write-only)",
						children: /* @__PURE__ */ jsx(Input, {
							type: "password",
							value: draft.openAIApiKey ?? "",
							onChange: (e) => set("openAIApiKey", e.target.value),
							placeholder: draft.aiApiKeyConfigured ? "•••• leave blank to keep existing key ••••" : "sk-...",
							className: "font-mono text-sm",
							autoComplete: "new-password"
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 text-[11px]",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: !!draft.clearOpenAIApiKey,
								onChange: (e) => set("clearOpenAIApiKey", e.target.checked)
							}), "Clear stored API key on save"]
						})
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-[10px] text-muted-foreground font-mono",
						children: [
							"The key is write-only: the server never returns it. It can also be supplied via the ",
							/* @__PURE__ */ jsx("span", { children: "OPENAI_API_KEY" }),
							" environment variable on the IRIS host."
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-3 rounded-md ring-1 ring-black/5 p-4 bg-muted/30",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "text-xs font-semibold",
						children: "RAG runtime indexing"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-muted-foreground mt-0.5",
						children: "Controls whether the persisted index also incorporates recent messages, logs, and payload metadata for grounded AI answers."
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsx(ToggleRow, {
							label: "Include runtime data (messages + logs)",
							checked: !!draft.ragRuntimeDataEnabled,
							onChange: (v) => set("ragRuntimeDataEnabled", v)
						}), /* @__PURE__ */ jsx(ToggleRow, {
							label: "Include payload metadata",
							checked: !!draft.ragPayloadIndexingEnabled,
							onChange: (v) => set("ragPayloadIndexingEnabled", v)
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-4 gap-4",
						children: [
							/* @__PURE__ */ jsx(NumberField, {
								label: "Lookback hours",
								value: draft.ragRuntimeLookbackHours,
								onChange: (v) => set("ragRuntimeLookbackHours", v)
							}),
							/* @__PURE__ */ jsx(NumberField, {
								label: "Max messages",
								value: draft.ragRuntimeMaxMessages,
								onChange: (v) => set("ragRuntimeMaxMessages", v)
							}),
							/* @__PURE__ */ jsx(NumberField, {
								label: "Max logs",
								value: draft.ragRuntimeMaxLogs,
								onChange: (v) => set("ragRuntimeMaxLogs", v)
							}),
							/* @__PURE__ */ jsx(NumberField, {
								label: "Max payload fields",
								value: draft.ragPayloadMaxFields,
								onChange: (v) => set("ragPayloadMaxFields", v)
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx(Button, {
					onClick: () => mutation.mutate(draft),
					disabled: mutation.isPending,
					className: "bg-iris-brand hover:bg-iris-brand/90",
					children: mutation.isPending ? "Saving…" : "Save module settings"
				}), data?.settings ? /* @__PURE__ */ jsx(Button, {
					variant: "outline",
					onClick: () => setDraft(data.settings),
					disabled: mutation.isPending,
					children: "Revert"
				}) : null]
			})
		] })]
	});
}
function ToggleRow({ label, checked, onChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between rounded-md ring-1 ring-black/5 px-3 py-2",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs",
			children: label
		}), /* @__PURE__ */ jsx(Switch, {
			checked,
			onCheckedChange: onChange
		})]
	});
}
function NumberField({ label, value, onChange }) {
	return /* @__PURE__ */ jsx(Field, {
		label,
		children: /* @__PURE__ */ jsx(Input, {
			type: "number",
			value: value ?? "",
			onChange: (e) => onChange(e.target.value === "" ? void 0 : Number(e.target.value)),
			className: "font-mono text-sm"
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ jsx(Label, {
			className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
			children: label
		}), children]
	});
}
//#endregion
export { SettingsPage as component };
