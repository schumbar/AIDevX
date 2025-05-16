/**
 * Utility functions for uploading files to the runtime container
 */

/**
 * Clears the workspace directory, keeping only the uploads folder
 *
 * @returns A promise that resolves to the clear result
 */
export const clearWorkspace = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Call the clear-workspace endpoint
    const response = await fetch(`/api/clear-workspace`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to clear workspace: ${response.status} ${response.statusText}`, errorText);
      return {
        success: false,
        error: `Failed to clear workspace: ${response.statusText} (${response.status})`,
      };
    }

    const data = await response.json();
    console.log("Workspace cleared successfully:", data);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error clearing workspace:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Copies a file directly to the local workspace folder
 *
 * @param file The file to copy
 * @param subdirectory Optional subdirectory within workspace to copy to
 * @param clearFirst Whether to clear the workspace before copying
 * @returns A promise that resolves to the copy result
 */
export const copyFileToWorkspace = async (
  file: File,
  subdirectory: string = 'uploads',
  clearFirst: boolean = false
): Promise<{ success: boolean; path: string; error?: string }> => {
  try {
    // Clear the workspace if requested
    if (clearFirst) {
      const clearResult = await clearWorkspace();
      if (!clearResult.success) {
        console.error("Failed to clear workspace before copying file:", clearResult.error);
        // Continue with the copy operation even if clearing fails
      }
    }

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
      path: `/workspace/${subdirectory}/${file.name}`.replace(/\/+/g, '/'),
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

/**
 * Uploads a file to the runtime container
 *
 * @param file The file to upload
 * @param conversationId The ID of the conversation
 * @param destination The destination directory in the runtime container
 * @returns A promise that resolves to the upload result
 */
export const uploadFileToRuntime = async (
  file: File,
  conversationId: string,
  destination: string = '/tmp'
): Promise<{ success: boolean; path: string; error?: string }> => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    // Upload the file to the specified directory in the runtime container
    const response = await fetch(`/api/conversations/${conversationId}/upload-dataset?destination=${destination}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to upload file: ${response.status} ${response.statusText}`, errorText);
      return {
        success: false,
        path: '',
        error: `Failed to upload file: ${response.statusText} (${response.status})`,
      };
    }

    const data = await response.json();
    console.log("File upload successful:", data);

    return {
      success: true,
      path: `${destination}/${file.name}`,
    };
  } catch (error) {
    console.error("Error uploading file to runtime:", error);
    return {
      success: false,
      path: '',
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
