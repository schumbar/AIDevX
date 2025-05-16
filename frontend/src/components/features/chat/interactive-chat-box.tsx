import React from "react";
import { ChatInput } from "./chat-input";
import { cn } from "#/utils/utils";
import { ImageCarousel } from "../images/image-carousel";
import { UploadFileInput } from "../files/upload-file-input";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { useParams } from "react-router";
import {
  DatasetInfo,
  generateDatasetAnalysisInstructions
} from "#/utils/upload-dataset";
import { uploadFileToRuntime, copyFileToWorkspace } from "#/utils/upload-to-runtime";

interface InteractiveChatBoxProps {
  isDisabled?: boolean;
  mode?: "stop" | "submit";
  onSubmit: (message: string, files: File[]) => void;
  onStop: () => void;
  value?: string;
  onChange?: (message: string) => void;
  enableDatasetUpload?: boolean;
}

export function InteractiveChatBox({
  isDisabled,
  mode = "submit",
  onSubmit,
  onStop,
  value,
  onChange,
  enableDatasetUpload = true,
}: InteractiveChatBoxProps) {
  const { t } = useTranslation();
  const [files, setFiles] = React.useState<File[]>([]);

  const { conversationId } = useParams<{ conversationId: string }>();

  const handleUpload = (uploadedFiles: File[]) => {
    // Filter files into image files and dataset files
    const imageFiles = uploadedFiles.filter(file => file.type.startsWith("image/"));
    const datasetFiles = uploadedFiles.filter(file => !file.type.startsWith("image/"));

    // Add image files to the state
    setFiles((prevFiles) => [...prevFiles, ...imageFiles]);

    // Upload dataset files to the runtime container
    if (datasetFiles.length > 0) {
      // Show loading message
      if (onChange) {
        const currentValue = value || "";
        onChange(currentValue + "\n\nUploading dataset files...");
      }

      console.log(`Uploading ${datasetFiles.length} dataset files`);

      // Check if we have a conversation ID
      if (!conversationId) {
        console.error("No conversation ID available for file upload");
        if (onChange) {
          const currentValue = (value || "").replace("\n\nUploading dataset files...", "");
          onChange(currentValue + "\n\nCannot upload dataset files: No conversation ID available.");
        }
        return;
      }

      console.log(`Processing ${datasetFiles.length} dataset files for conversation ${conversationId}`);

      // Clear the workspace and copy dataset files directly to the workspace folder
      // Only clear the workspace for the first file to avoid multiple clear operations
      const uploadPromises = datasetFiles.map((file, index) =>
        copyFileToWorkspace(file, 'uploads', index === 0));

      // Wait for all uploads to complete
      Promise.all(uploadPromises).then(results => {
        // Filter out failed uploads
        const successfulUploads = results.filter(result => result.success);

        console.log(`Successfully uploaded ${successfulUploads.length} of ${datasetFiles.length} files`);

        if (successfulUploads.length > 0) {
          // Create dataset info objects for successful uploads
          const datasetsInfo: DatasetInfo[] = successfulUploads.map(result => ({
            name: result.path.split('/').pop() || '',
            extension: (result.path.split('/').pop() || '').split('.').pop()?.toLowerCase() || '',
            size: 0, // We don't have the size here, but it's not critical
            path: result.path,
          }));

          // Generate dataset analysis instructions
          const instructions = generateDatasetAnalysisInstructions(datasetsInfo);

          // Set the text in the input field (replace the loading message)
          if (onChange) {
            const currentValue = (value || "").replace("\n\nUploading dataset files...", "");
            onChange(currentValue + "\n\n" + instructions);
          }
        } else {
          // If all uploads failed, show an error message
          if (onChange) {
            const currentValue = (value || "").replace("\n\nUploading dataset files...", "");
            onChange(currentValue + "\n\nI tried to upload dataset files but encountered errors. Please try again.");
          }
        }
      }).catch(error => {
        console.error("Error uploading dataset files:", error);
        if (onChange) {
          const currentValue = (value || "").replace("\n\nUploading dataset files...", "");
          onChange(currentValue + "\n\nI tried to upload dataset files but encountered errors. Please try again.");
        }
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = (message: string) => {
    onSubmit(message, files);
    setFiles([]);
    if (message) {
      onChange?.("");
    }
  };

  // We only store image files in the state now
  // Dataset files are converted to text and added to the input

  return (
    <div
      data-testid="interactive-chat-box"
      className="flex flex-col gap-[10px]"
    >
      {files.length > 0 && (
        <ImageCarousel
          size="small"
          images={files.map((image) => URL.createObjectURL(image))}
          onRemove={handleRemoveFile}
        />
      )}

      <div
        className={cn(
          "flex items-end gap-1",
          "bg-tertiary border border-neutral-600 rounded-lg px-2",
          "transition-colors duration-200",
          "hover:border-neutral-500 focus-within:border-neutral-500",
        )}
      >
        {enableDatasetUpload && (
          <UploadFileInput
            onUpload={handleUpload}
            acceptedFileTypes="text/csv,application/json,.csv,.json,.txt,.xlsx,.parquet,image/*"
            dataTestId="upload-dataset-input"
          />
        )}
        <ChatInput
          disabled={isDisabled}
          button={mode}
          onChange={onChange}
          onSubmit={handleSubmit}
          onStop={onStop}
          value={value}
          onImagePaste={handleUpload}
          className="py-[10px]"
          buttonClassName="py-[10px]"
        />
      </div>
    </div>
  );
}
