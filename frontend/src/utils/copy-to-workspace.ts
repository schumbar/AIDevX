/**
 * Utility functions for copying files to the workspace directory
 */

/**
 * Copies a file to the workspace directory
 * 
 * This is an alternative to uploading files to the runtime container
 * It directly copies the file to the local workspace directory which is mounted to the container
 * 
 * @param file The file to copy
 * @param subdirectory Optional subdirectory within workspace to copy to
 * @returns A promise that resolves to the copy result
 */
export const copyFileToWorkspace = async (
  file: File,
  subdirectory: string = ''
): Promise<{ success: boolean; path: string; error?: string }> => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('destination', subdirectory);

    // Send the file to a custom endpoint that will handle the copy operation
    const response = await fetch(`/api/copy-to-workspace`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to copy file: ${response.status} ${response.statusText}`, errorText);
      return {
        success: false,
        path: '',
        error: `Failed to copy file: ${response.statusText} (${response.status})`,
      };
    }

    const data = await response.json();
    console.log("File copy successful:", data);

    return {
      success: true,
      path: data.path || `/workspace/${subdirectory}/${file.name}`.replace(/\/+/g, '/'),
    };
  } catch (error) {
    console.error("Error copying file to workspace:", error);
    return {
      success: false,
      path: '',
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
