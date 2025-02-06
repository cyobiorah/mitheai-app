import React, { useState } from "react";
import { generateContent } from "../api/content";
import {
  AIAssistantRequest,
  ContentTone,
  ContentPurpose,
  SocialPlatform,
} from "../api/types";
import { toast } from "react-hot-toast";

const ContentCreation: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<{
    platform: SocialPlatform;
    tone: ContentTone;
    purpose: ContentPurpose;
    targetAudience: string;
    keywords: string;
    content?: string;
    contentLengthType?: "short" | "medium" | "long";
    ctaType?: string;
    contentStyle?: string;
    toneIntensity?: string;
    hashtagStrategy?: string;
  }>({
    platform: "linkedin",
    tone: "professional",
    purpose: "engagement",
    targetAudience: "",
    keywords: "",
    content: "",
    contentLengthType: "medium",
    ctaType: "",
    contentStyle: "",
    toneIntensity: "",
    hashtagStrategy: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);

      const request: AIAssistantRequest = {
        type: "caption",
        content: formData.content,
        context: {
          platform: formData.platform,
          tone: formData.tone,
          purpose: formData.purpose,
          targetAudience: formData.targetAudience,
          keywords: formData.keywords.split(",").map((k) => k.trim()),
          ctaType: formData.ctaType,
          contentStyle: formData.contentStyle,
          length: {
            ...(formData.contentLengthType === "short"
              ? { min: 50, max: 100 }
              : formData.contentLengthType === "medium"
              ? { min: 100, max: 250 }
              : { min: 250, max: 500 }),
            unit: "characters",
          },
        },
        constraints: {
          hashtagCount:
            formData.hashtagStrategy === "minimal"
              ? 3
              : formData.hashtagStrategy === "moderate"
              ? 5
              : 10,
          emojiUsage:
            formData.toneIntensity === "light"
              ? "minimal"
              : formData.toneIntensity === "moderate"
              ? "moderate"
              : "heavy",
        },
      };

      const response = await generateContent(request);

      if (response.suggestions.length > 0) {
        setFormData((prev) => ({
          ...prev,
          content: response.suggestions[0].content,
        }));

        // Show improvements if available
        response.improvements?.forEach((improvement) => {
          toast.success(improvement.suggestion);
        });
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
        Create Content
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Selection */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl text-neutral-900 dark:text-white mb-4">
              Platform Selection
            </h2>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
              className="w-full bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          {/* Content Details */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl text-neutral-900 dark:text-white mb-4">
              Content Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-900 dark:text-white mb-2">
                  Content Length
                </label>
                <select
                  name="contentLengthType"
                  value={formData.contentLengthType}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                >
                  <option value="short">Short (50-100 characters)</option>
                  <option value="medium">Medium (100-250 characters)</option>
                  <option value="long">Long (250-500 characters)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-900 dark:text-white mb-2">
                  Tone
                </label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="humorous">Humorous</option>
                  <option value="informative">Informative</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-900 dark:text-white mb-2">
                  Purpose
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                >
                  <option value="engagement">Engagement</option>
                  <option value="awareness">Awareness</option>
                  <option value="lead_generation">Lead Generation</option>
                  <option value="sales">Sales</option>
                  <option value="education">Education</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-900 dark:text-white mb-2">
                  Call-To-Action (CTA)
                </label>
                <select
                  name="ctaType"
                  value={formData.ctaType}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                >
                  <option value="question">Ask a Question</option>
                  <option value="engagement">Encourage Likes & Comments</option>
                  <option value="purchase">
                    Drive Sales (Buy Now, Shop Here)
                  </option>
                  <option value="visit">Visit Link (Website/Blog)</option>
                  <option value="tag">Tag Friends</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-900 dark:text-white mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  placeholder="e.g., B2B Technology Decision Makers"
                />
              </div>

              <div>
                <label className="block text-neutral-900 dark:text-white mb-2">
                  Content Style
                </label>
                <select
                  name="contentStyle"
                  value={formData.contentStyle}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                >
                  <option value="storytelling">
                    Storytelling (Narrative-based)
                  </option>
                  <option value="listicle">
                    Listicle (Bullet Points, Lists)
                  </option>
                  <option value="informative">
                    Informative (Facts, Data, Insights)
                  </option>
                  <option value="direct">Direct & Persuasive</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-900 dark:text-white mb-2">
                  Tone Intensity
                </label>
                <select
                  name="toneIntensity"
                  value={formData.toneIntensity}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                >
                  <option value="light">Lightly Expressive</option>
                  <option value="moderate">
                    Moderate (Balanced Personality)
                  </option>
                  <option value="strong">Strong & Expressive</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-900 dark:text-white mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  placeholder="Enter keywords separated by commas"
                />
              </div>

              <div>
                <label className="block text-neutral-900 dark:text-white mb-2">
                  Hashtag Strategy
                </label>
                <select
                  name="hashtagStrategy"
                  value={formData.hashtagStrategy}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                >
                  <option value="minimal">Minimal (1-3 Hashtags)</option>
                  <option value="moderate">Moderate (3-5 Hashtags)</option>
                  <option value="maximized">
                    Maximized (8+ Hashtags for Reach)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl text-neutral-900 dark:text-white mb-4">
              Content Editor
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? "Generating..." : "Generate Content"}
                </button>
              </div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                rows={10}
                placeholder="Start writing your content here or generate it using AI..."
              />
            </div>
          </div>
        </div>

        {/* Right Column - AI Suggestions */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl text-neutral-900 dark:text-white mb-4">
            AI Assistant
          </h2>
          <p className="text-neutral-600 dark:text-gray-400">
            Our AI assistant will help you create engaging content based on your
            preferences. Just fill in the details on the left and click
            "Generate Content".
          </p>
          <div className="mt-4 space-y-2">
            <h3 className="font-medium text-neutral-900 dark:text-white">
              Tips:
            </h3>
            <ul className="list-disc list-inside text-neutral-600 dark:text-gray-400">
              <li>Be specific with your target audience</li>
              <li>Use relevant keywords</li>
              <li>Choose the appropriate tone for your platform</li>
              <li>Review and customize the generated content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCreation;
