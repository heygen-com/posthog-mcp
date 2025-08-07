import type { z } from "zod";
import type { Context, Tool } from "@/tools/types";
import { FeatureFlagGetActivitySchema } from "@/schema/tool-inputs";

const schema = FeatureFlagGetActivitySchema;

type Params = z.infer<typeof schema>;

export const getActivityHandler = async (context: Context, params: Params) => {
	const { limit, offset } = params;
	const projectId = await context.getProjectId();

	const activityResult = await context.api
		.featureFlags({ projectId })
		.activity({ params: { limit, offset } });

	if (!activityResult.success) {
		throw new Error(`Failed to get feature flag activity: ${activityResult.error.message}`);
	}

	return {
		content: [{ type: "text", text: JSON.stringify(activityResult.data, null, 2) }],
	};
};

const tool = (): Tool<typeof schema> => ({
	name: "feature-flag-get-activity",
	description: `
        - Use this tool to get activity/audit logs for all feature flags in the current project.
        - This shows recent changes, updates, and usage statistics for feature flags.
        - Supports pagination with optional limit and offset parameters.
    `,
	schema,
	handler: getActivityHandler,
});

export default tool;