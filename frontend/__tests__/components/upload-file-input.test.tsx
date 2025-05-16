import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UploadFileInput } from "#/components/features/files/upload-file-input";

describe("UploadFileInput", () => {
  const user = userEvent.setup();
  const onUploadMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render an input", () => {
    render(<UploadFileInput onUpload={onUploadMock} />);
    expect(screen.getByTestId("upload-file-input")).toBeInTheDocument();
  });

  it("should call onUpload when a file is selected", async () => {
    render(<UploadFileInput onUpload={onUploadMock} />);

    const file = new File(["(⌐□_□)"], "data.csv", { type: "text/csv" });
    const input = screen.getByTestId("upload-file-input");

    await user.upload(input, file);

    expect(onUploadMock).toHaveBeenNthCalledWith(1, [file]);
  });

  it("should call onUpload when multiple files are selected", async () => {
    render(<UploadFileInput onUpload={onUploadMock} />);

    const files = [
      new File(["(⌐□_□)"], "data.csv", { type: "text/csv" }),
      new File(["(⌐□_□)"], "data.json", { type: "application/json" }),
    ];
    const input = screen.getByTestId("upload-file-input");

    await user.upload(input, files);

    expect(onUploadMock).toHaveBeenNthCalledWith(1, files);
  });

  it("should accept image files", async () => {
    render(<UploadFileInput onUpload={onUploadMock} />);

    const file = new File(["(⌐□_□)"], "image.png", { type: "image/png" });
    const input = screen.getByTestId("upload-file-input");

    await user.upload(input, file);

    expect(onUploadMock).toHaveBeenNthCalledWith(1, [file]);
  });

  it("should accept dataset files", async () => {
    render(<UploadFileInput onUpload={onUploadMock} />);

    const file = new File(["(⌐□_□)"], "data.csv", { type: "text/csv" });
    const input = screen.getByTestId("upload-file-input");

    await user.upload(input, file);

    expect(onUploadMock).toHaveBeenNthCalledWith(1, [file]);
  });

  it("should use custom data-testid when provided", () => {
    render(<UploadFileInput onUpload={onUploadMock} dataTestId="custom-test-id" />);
    expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
    expect(screen.queryByTestId("upload-file-input")).not.toBeInTheDocument();
  });

  it("should render custom labels", () => {
    const { rerender } = render(<UploadFileInput onUpload={onUploadMock} />);
    expect(screen.getByTestId("default-label")).toBeInTheDocument();

    function CustomLabel() {
      return <span>Custom label</span>;
    }
    rerender(
      <UploadFileInput onUpload={onUploadMock} label={<CustomLabel />} />,
    );

    expect(screen.getByText("Custom label")).toBeInTheDocument();
    expect(screen.queryByTestId("default-label")).not.toBeInTheDocument();
  });
});
