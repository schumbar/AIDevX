import React, { useState } from 'react';
import { copyFileToWorkspace } from '../../../utils/copy-to-workspace';
import Clip from "#/icons/clip.svg?react";

interface CopyToWorkspaceButtonProps {
  onCopy?: (result: { success: boolean; path: string; error?: string }) => void;
  label?: React.ReactNode;
  acceptedFileTypes?: string;
  dataTestId?: string;
  subdirectory?: string;
}

/**
 * A button component that allows users to copy files to the workspace directory
 * 
 * @param onCopy - A callback function that is called when files are copied
 * @param label - A custom label to display instead of the default clip icon
 * @param acceptedFileTypes - A string of accepted file types (e.g., "image/*,text/csv,application/json")
 * @param dataTestId - A test ID for the input element
 * @param subdirectory - Optional subdirectory within workspace to copy to
 */
export function CopyToWorkspaceButton({ 
  onCopy, 
  label, 
  acceptedFileTypes = "image/*,text/csv,application/json,.csv,.json,.txt,.xlsx,.parquet",
  dataTestId = "copy-to-workspace-button",
  subdirectory = ''
}: CopyToWorkspaceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setIsLoading(true);
      
      try {
        const results = await Promise.all(
          files.map(file => copyFileToWorkspace(file, subdirectory))
        );
        
        // Call onCopy with the results
        if (onCopy) {
          results.forEach(result => onCopy(result));
        }
        
        // Log results
        results.forEach(result => {
          if (result.success) {
            console.log(`Successfully copied file to: ${result.path}`);
          } else {
            console.error(`Failed to copy file: ${result.error}`);
          }
        });
      } catch (error) {
        console.error("Error copying files:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <label className="cursor-pointer py-[10px] flex items-center">
      {isLoading ? (
        <span className="animate-pulse">Copying...</span>
      ) : (
        <>
          {label || <Clip data-testid="default-label" width={24} height={24} />}
          <input
            data-testid={dataTestId}
            type="file"
            accept={acceptedFileTypes}
            multiple
            hidden
            onChange={handleCopy}
          />
        </>
      )}
    </label>
  );
}
