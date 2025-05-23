import React from "react";
import { useNavigation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "#/store";
import { addFile, removeFile } from "#/state/initial-query-slice";
import { SuggestionBubble } from "#/components/features/suggestions/suggestion-bubble";
import { SUGGESTIONS } from "#/utils/suggestions";
import { convertImageToBase64 } from "#/utils/convert-image-to-base-64";
import { ChatInput } from "#/components/features/chat/chat-input";
import { getRandomKey } from "#/utils/get-random-key";
import { cn } from "#/utils/utils";
import {
  DatasetInfo,
  generateMLPipelineInstructions
} from "#/utils/upload-dataset";
import { uploadFileToRuntime } from "#/utils/upload-to-runtime";
import { AttachImageLabel } from "../features/images/attach-image-label";
import { AttachDatasetLabel } from "../features/files/attach-dataset-label";
import { ImageCarousel } from "../features/images/image-carousel";
import { UploadImageInput } from "../features/images/upload-image-input";
import { UploadFileInput } from "../features/files/upload-file-input";
import { useCreateConversation } from "#/hooks/mutation/use-create-conversation";
import { LoadingSpinner } from "./loading-spinner";

interface TaskFormProps {
  ref: React.RefObject<HTMLFormElement | null>;
}

export function TaskForm({ ref }: TaskFormProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { files } = useSelector((state: RootState) => state.initialQuery);

  const [text, setText] = React.useState("");
  const [suggestion, setSuggestion] = React.useState(() => {
    const key = getRandomKey(SUGGESTIONS["non-repo"]);
    return { key, value: SUGGESTIONS["non-repo"][key] };
  });
  const [inputIsFocused, setInputIsFocused] = React.useState(false);
  const { mutate: createConversation, isPending } = useCreateConversation();

  const onRefreshSuggestion = () => {
    const suggestions = SUGGESTIONS["non-repo"];
    // remove current suggestion to avoid refreshing to the same suggestion
    const suggestionCopy = { ...suggestions };
    delete suggestionCopy[suggestion.key];

    const key = getRandomKey(suggestionCopy);
    setSuggestion({ key, value: suggestions[key] });
  };

  const onClickSuggestion = () => {
    setText(suggestion.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const q = formData.get("q")?.toString();
    createConversation({ q, conversation_trigger: "gui" });
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2"
      >
        <SuggestionBubble
          suggestion={suggestion}
          onClick={onClickSuggestion}
          onRefresh={onRefreshSuggestion}
        />
        <div
          className={cn(
            "border border-neutral-600 px-4 rounded-lg text-[17px] leading-5 w-full transition-colors duration-200",
            inputIsFocused ? "bg-neutral-600" : "bg-tertiary",
            "hover:border-neutral-500 focus-within:border-neutral-500",
          )}
        >
          {isPending ? (
            <div className="flex justify-center py-[17px]">
              <LoadingSpinner size="small" />
            </div>
          ) : (
            <ChatInput
              name="q"
              onSubmit={() => {
                if (typeof ref !== "function") ref?.current?.requestSubmit();
              }}
              onChange={(message) => setText(message)}
              onFocus={() => setInputIsFocused(true)}
              onBlur={() => setInputIsFocused(false)}
              onImagePaste={async (imageFiles) => {
                const promises = imageFiles.map(convertImageToBase64);
                const base64Images = await Promise.all(promises);
                base64Images.forEach((base64) => {
                  dispatch(addFile(base64));
                });
              }}
              value={text}
              maxRows={15}
              showButton={!!text}
              className="text-[17px] leading-5 py-[17px]"
              buttonClassName="pb-[17px]"
              disabled={navigation.state === "submitting"}
            />
          )}
        </div>
      </form>
      <div className="flex gap-4">
        <UploadImageInput
          onUpload={async (uploadedFiles) => {
            const promises = uploadedFiles.map(convertImageToBase64);
            const base64Images = await Promise.all(promises);
            base64Images.forEach((base64) => {
              dispatch(addFile(base64));
            });
          }}
          label={<AttachImageLabel />}
        />
        <UploadFileInput
          onUpload={async (uploadedFiles) => {
            // Filter for dataset files (non-image files)
            const datasetFiles = uploadedFiles.filter(file => !file.type.startsWith("image/"));

            // Process image files
            const imageFiles = uploadedFiles.filter(file => file.type.startsWith("image/"));
            const promises = imageFiles.map(convertImageToBase64);
            const base64Images = await Promise.all(promises);
            base64Images.forEach((base64) => {
              dispatch(addFile(base64));
            });

            // Upload dataset files to the runtime container
            if (datasetFiles.length > 0) {
              // Show loading message
              setText((prevText) => prevText ?
                `${prevText}\n\nUploading dataset files...` :
                "Uploading dataset files...");

              // Store dataset files for later upload after conversation is created
              // We'll store the files in sessionStorage and upload them after the conversation is created
              const datasetInfo = datasetFiles.map(file => ({
                name: file.name,
                type: file.type,
                extension: file.name.split('.').pop()?.toLowerCase() || '',
                size: file.size,
              }));

              // Convert files to array buffer for storage
              const filePromises = datasetFiles.map(file =>
                new Promise<{file: File, buffer: ArrayBuffer}>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    resolve({
                      file,
                      buffer: reader.result as ArrayBuffer
                    });
                  };
                  reader.onerror = reject;
                  reader.readAsArrayBuffer(file);
                })
              );

              Promise.all(filePromises).then(results => {
                // Store file info and data in sessionStorage
                sessionStorage.setItem('pendingDatasetInfo', JSON.stringify(datasetInfo));
                sessionStorage.setItem('pendingDatasetFiles', JSON.stringify(
                  results.map(r => ({
                    name: r.file.name,
                    type: r.file.type,
                    data: Array.from(new Uint8Array(r.buffer))
                  }))
                ));

                // Add ML pipeline instructions to the text input
                const mlPipelineText = `I want to analyze my dataset and build an ML pipeline following the CRISP-DM methodology.`;
                setText((prevText) => prevText ? `${prevText}\n\n${mlPipelineText}` : mlPipelineText);
              }).catch(error => {
                console.error("Error processing dataset files:", error);
                setText((prevText) => prevText + "\n\nI tried to prepare dataset files but encountered errors. Please try again.");
              });


            }
          }}
          acceptedFileTypes="text/csv,application/json,.csv,.json,.txt,.xlsx,.parquet"
          label={<AttachDatasetLabel />}
          dataTestId="upload-dataset-input"
        />
      </div>

      {files.length > 0 && (
        <ImageCarousel
          size="large"
          images={files}
          onRemove={(index) => dispatch(removeFile(index))}
        />
      )}
    </div>
  );
}
