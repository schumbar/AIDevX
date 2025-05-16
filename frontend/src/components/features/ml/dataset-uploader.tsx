import { useEffect, useState } from "react";
import { uploadFileToRuntime } from "#/utils/upload-to-runtime";
import { DatasetInfo, generateMLPipelineInstructions } from "#/utils/upload-dataset";

interface PendingDatasetFile {
  name: string;
  type: string;
  data: number[];
}

interface DatasetUploaderProps {
  conversationId: string;
  onUploadComplete: (instructions: string) => void;
}

/**
 * A component that automatically uploads pending dataset files when a conversation is created.
 * This component is invisible and doesn't render anything.
 */
export function DatasetUploader({ conversationId, onUploadComplete }: DatasetUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Check if there are pending dataset files to upload
    const pendingDatasetInfoStr = sessionStorage.getItem('pendingDatasetInfo');
    const pendingDatasetFilesStr = sessionStorage.getItem('pendingDatasetFiles');

    if (!pendingDatasetInfoStr || !pendingDatasetFilesStr || isUploading) {
      return;
    }

    const uploadPendingFiles = async () => {
      try {
        setIsUploading(true);

        // Parse the stored data
        const pendingDatasetInfo = JSON.parse(pendingDatasetInfoStr) as DatasetInfo[];
        const pendingDatasetFiles = JSON.parse(pendingDatasetFilesStr) as PendingDatasetFile[];

        console.log(`Uploading ${pendingDatasetFiles.length} pending dataset files to conversation ${conversationId}`);

        const results: DatasetInfo[] = [];

        for (const fileData of pendingDatasetFiles) {
          // Convert the array back to a Uint8Array
          const uint8Array = new Uint8Array(fileData.data);

          // Create a new File object
          const file = new File([uint8Array], fileData.name, { type: fileData.type });

          // Upload the file
          const result = await uploadFileToRuntime(file, conversationId, '/tmp');

          if (result.success) {
            results.push({
              name: fileData.name,
              extension: fileData.name.split('.').pop()?.toLowerCase() || '',
              size: uint8Array.length,
              path: result.path,
            });
            console.log(`Successfully uploaded file: ${file.name}`);
          } else {
            console.error(`Failed to upload file: ${file.name}`);
          }
        }

        // Clear the pending files from sessionStorage
        sessionStorage.removeItem('pendingDatasetInfo');
        sessionStorage.removeItem('pendingDatasetFiles');

        // Generate ML pipeline instructions
        if (results.length > 0) {
          const instructions = generateMLPipelineInstructions(results);
          onUploadComplete(instructions);
        }
      } catch (error) {
        console.error("Error uploading pending dataset files:", error);
      } finally {
        setIsUploading(false);
      }
    };

    uploadPendingFiles();
  }, [conversationId, onUploadComplete, isUploading]);

  // This component doesn't render anything
  return null;
}
