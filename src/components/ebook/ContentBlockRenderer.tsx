"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentBlock } from "@/contracts/base";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  FileText,
  Info,
  Package,
  Shield,
} from "lucide-react";
import Image from "next/image";

// Type-safe content access helper
type ContentData = Record<string, any>;

const getContentProperty = (content: ContentData, key: string): any => {
  return content?.[key];
};

interface ContentBlockRendererProps {
  block: ContentBlock;
  onImageClick?: (src: string, alt: string) => void;
  onInteraction?: (
    blockId: string,
    interactionType: string,
    data?: any,
  ) => void;
}

// Icon mapping for dynamic icon rendering
const iconMap = {
  BookOpen,
  Package,
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
};

export function ContentBlockRenderer({
  block,
  onImageClick,
  onInteraction,
}: ContentBlockRendererProps) {
  const handleInteraction = (type: string, data?: any) => {
    onInteraction?.(block.id, type, data);
  };

  // Type-safe content access
  const content = block.content as Record<string, any>;

  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  switch (block.blockType) {
    case "hero":
      return (
        <div
          className={`text-center py-8 sm:py-12 rounded-xl ${content.backgroundClass || "bg-gray-50"}`}
          onClick={() => handleInteraction("view")}
        >
          {content.icon && (
            <div className="flex justify-center mb-4">
              {renderIcon(
                content.icon as string,
                `h-12 w-12 sm:h-16 sm:w-16 ${content.iconColor || "text-gray-600"}`,
              )}
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 px-4">
            {content.title as string}
          </h1>
          {content.subtitle && (
            <p className="text-lg sm:text-xl text-gray-600 mb-6 px-4">
              {content.subtitle as string}
            </p>
          )}
          {content.badge && (
            <Badge
              variant="outline"
              className={`text-base sm:text-lg px-4 py-2 ${content.badgeClass || ""}`}
            >
              {content.badge as string}
            </Badge>
          )}
        </div>
      );

    case "text":
      return (
        <div className="space-y-4" onClick={() => handleInteraction("view")}>
          {content.heading && (
            <h3 className="text-xl font-semibold text-gray-900">
              {content.heading}
            </h3>
          )}
          {content.text && (
            <p className="text-gray-700 leading-relaxed">{content.text}</p>
          )}
          {content.note && (
            <p className="text-sm text-gray-500 mt-2">{content.note}</p>
          )}
          {content.folders && (
            <div className="grid md:grid-cols-3 gap-3">
              {content.folders.map((folder: string, index: number) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded p-2 text-center"
                >
                  <p className="font-medium text-gray-800">{folder}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case "card":
      return (
        <Card
          className={`${content.borderClass || ""} ${content.className || ""}`}
          onClick={() => handleInteraction("view")}
        >
          {content.title && (
            <CardHeader className={content.headerClass}>
              <CardTitle
                className={`flex items-center gap-2 ${content.titleClass || ""}`}
              >
                {content.icon &&
                  renderIcon(
                    content.icon,
                    `h-6 w-6 ${content.iconColor || ""}`,
                  )}
                {content.title}
              </CardTitle>
            </CardHeader>
          )}
          <CardContent className={content.contentClass || "pt-6"}>
            {content.text && (
              <p className="text-gray-700 leading-relaxed">{content.text}</p>
            )}
            {content.note && (
              <p className="text-sm text-gray-600 mt-2">{content.note}</p>
            )}
          </CardContent>
        </Card>
      );

    case "callout": {
      const calloutVariants = {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        warning: "bg-amber-50 border-amber-200 text-amber-800",
        critical: "bg-red-50 border-red-200 text-red-800",
        success: "bg-green-50 border-green-200 text-green-800",
        gray: "bg-gray-50 border-gray-200 text-gray-800",
      };

      const variant = content.variant || "info";
      const variantClass =
        calloutVariants[variant as keyof typeof calloutVariants] ||
        calloutVariants.info;

      return (
        <div
          className={`border rounded-lg p-6 ${variantClass}`}
          onClick={() => handleInteraction("view")}
        >
          {content.title && (
            <h3 className="text-lg font-semibold mb-3">{content.title}</h3>
          )}
          <p className="leading-relaxed">{content.text}</p>
          {content.note && (
            <p className="text-sm mt-2 opacity-80">{content.note}</p>
          )}
        </div>
      );
    }

    case "list":
      return (
        <div onClick={() => handleInteraction("view")}>
          {content.title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {content.title}
            </h3>
          )}
          <div className="space-y-2">
            {content.items?.map((item: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                {content.type === "checklist" && (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                )}
                {content.type === "numbered" && (
                  <span className="font-bold text-gray-600 text-sm">
                    {index + 1}.
                  </span>
                )}
                {(!content.type || content.type === "bullet") && (
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                )}
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "grid":
      return (
        <div
          className={`grid gap-${content.gap || 4} ${
            content.columns === 2
              ? "md:grid-cols-2"
              : content.columns === 3
                ? "md:grid-cols-3"
                : content.columns === 4
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  : "md:grid-cols-2"
          }`}
          onClick={() => handleInteraction("view")}
        >
          {content.items?.map((item: any, index: number) => (
            <div
              key={index}
              className={`bg-white border border-gray-200 rounded-lg p-4 ${
                content.itemClass || ""
              } ${item.className || ""}`}
            >
              {item.emoji && (
                <div className="text-2xl mb-2 text-center">{item.emoji}</div>
              )}
              {item.icon && (
                <div className="flex justify-center mb-3">
                  {renderIcon(item.icon, "h-8 w-8 text-gray-600")}
                </div>
              )}
              {item.letter && (
                <div className="text-2xl font-bold text-blue-600 mb-2 text-center">
                  {item.letter}
                </div>
              )}
              {item.step && (
                <div className="text-center mb-3">
                  <Badge variant="outline" className="text-blue-800">
                    {item.step}
                  </Badge>
                </div>
              )}
              {item.title && (
                <h4 className="font-semibold text-gray-900 mb-2">
                  {typeof item.index === "number" ? `${item.index}. ` : ""}
                  {item.title}
                </h4>
              )}
              {item.description && (
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              )}
              {item.value && (
                <p className="text-2xl font-bold text-gray-700">{item.value}</p>
              )}
              {item.spec && (
                <p className="text-sm text-gray-600">{item.spec}</p>
              )}
              {item.note && (
                <p className="text-xs text-gray-500 mt-2">{item.note}</p>
              )}
              {item.features && (
                <div className="space-y-2 mt-3">
                  {item.features.map((feature: any, fIndex: number) => (
                    <div key={fIndex} className="text-sm">
                      <span className="font-medium text-gray-900">
                        {feature.title || feature}
                      </span>
                      {feature.spec && (
                        <p className="text-gray-600">{feature.spec}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {item.guidelines && (
                <ul className="space-y-1 text-sm text-gray-700 mt-2">
                  {item.guidelines.map((guideline: string, gIndex: number) => (
                    <li key={gIndex}>• {guideline}</li>
                  ))}
                </ul>
              )}
              {item.image && (
                <div className="mt-3">
                  <ClickableImage
                    src={item.image.src}
                    alt={item.image.alt}
                    caption={item.image.caption}
                    className={item.image.className}
                    onImageClick={onImageClick}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      );

    case "image":
      return (
        <div className="my-6">
          <ClickableImage
            src={content.src}
            alt={content.alt}
            caption={content.caption}
            className={content.className}
            onImageClick={onImageClick}
          />
        </div>
      );

    case "table":
      return (
        <div
          className="overflow-x-auto"
          onClick={() => handleInteraction("view")}
        >
          <table className="w-full border border-gray-300 rounded-lg">
            {content.headers && (
              <thead className="bg-gray-100">
                <tr>
                  {content.headers.map((header: string, index: number) => (
                    <th
                      key={index}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {content.rows?.map((row: string[], rowIndex: number) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 1 ? "bg-gray-50" : ""}
                >
                  {row.map((cell: string, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "divider":
      return (
        <hr className={`border-gray-200 my-8 ${content.className || ""}`} />
      );

    case "quote":
      return (
        <blockquote
          className={`border-l-4 border-gray-300 pl-6 py-4 italic text-gray-700 ${content.className || ""}`}
          onClick={() => handleInteraction("view")}
        >
          {content.text}
          {content.author && (
            <footer className="text-sm text-gray-500 mt-2">
              — {content.author}
            </footer>
          )}
        </blockquote>
      );

    default:
      return (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">
            Unsupported content block type: {block.blockType}
          </p>
        </div>
      );
  }
}

// Helper component for clickable images
interface ClickableImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  onImageClick?: (src: string, alt: string) => void;
}

function ClickableImage({
  src,
  alt,
  caption,
  className = "",
  onImageClick,
}: ClickableImageProps) {
  return (
    <div className="relative group">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-blue-300 w-full max-w-full h-auto ${className}`}
        onClick={() => onImageClick?.(src, alt)}
      />
      <div
        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center cursor-pointer"
        onClick={() => onImageClick?.(src, alt)}
      >
        <div className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Click to enlarge
        </div>
      </div>
      {caption && (
        <p className="text-xs sm:text-sm text-gray-600 text-center mt-2">
          {caption}
        </p>
      )}
    </div>
  );
}
