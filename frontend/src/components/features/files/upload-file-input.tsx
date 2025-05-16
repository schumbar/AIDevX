import Clip from "#/icons/clip.svg?react";

interface UploadFileInputProps {
  onUpload: (files: File[]) => void;
  label?: React.ReactNode;
  acceptedFileTypes?: string;
  dataTestId?: string;
}

/**
 * A component that allows users to upload files.
 * 
 * @param onUpload - A callback function that is called when files are uploaded
 * @param label - A custom label to display instead of the default clip icon
 * @param acceptedFileTypes - A string of accepted file types (e.g., "image/*,text/csv,application/json")
 * @param dataTestId - A test ID for the input element
 */
export function UploadFileInput({ 
  onUpload, 
  label, 
  acceptedFileTypes = "image/*,text/csv,application/json,.csv,.json,.txt,.xlsx,.parquet",
  dataTestId = "upload-file-input"
}: UploadFileInputProps) {
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      onUpload(files);
    }
  };

  return (
    <label className="cursor-pointer py-[10px]">
      {label || <Clip data-testid="default-label" width={24} height={24} />}
      <input
        data-testid={dataTestId}
        type="file"
        accept={acceptedFileTypes}
        multiple
        hidden
        onChange={handleUpload}
      />
    </label>
  );
}
