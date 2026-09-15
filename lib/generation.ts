export const outputFormats = [
  "linkedin_post",
  "x_thread",
  "newsletter",
  "short_video_script",
] as const;

export type OutputFormat = (typeof outputFormats)[number];

export const outputFormatLabels: Record<OutputFormat, string> = {
  linkedin_post: "LinkedIn post",
  x_thread: "X thread",
  newsletter: "Email newsletter",
  short_video_script: "Short video script",
};