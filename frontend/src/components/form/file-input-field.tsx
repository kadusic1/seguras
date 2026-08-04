"use client";

import { File as FileIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Spinner } from "@/components/spinner";
import { schemes } from "@/lib/colours";
import { CloseButton } from "../close-button";
import { ColorSchemeCtx, useFormBusy } from "./context";
import { FieldChrome } from "./field-chrome";

/**
 * Props for the {@link FileInputField} component.
 *
 * @typeParam T - Shape of the form data.
 */
export interface FileInputFieldProps {
  /** Field path registered with react-hook-form. */
  name: string;
  /** Visible label text. */
  label: string;
  /** `accept` attribute forwarded to the native file input (e.g. `"image/*"`). */
  accept?: string;
  /** Allow selecting/accumulating more than one file. Defaults to `false`. */
  multiple?: boolean;
  /** Called with the newly picked files. May be async; submission is blocked until it resolves. */
  onFilesAdded?: (files: File[]) => void | Promise<void>;
  /** Called when the files are removed. May be async; submission is blocked until it resolves. */
  onFileRemoved?: (index: number) => void | Promise<void>;
}

/**
 * Thumbnail for a single selected file, with an object-URL image preview when
 * the file is an image and a generic icon/name fallback otherwise. Clicking
 * the thumbnail opens the file in a new tab. Renders a {@link CloseButton} in
 * the top-right corner to remove the file.
 *
 * @internal
 */
function FilePreview({
  file,
  busy,
  onRemove,
  bgScheme,
}: {
  file: File;
  busy: boolean;
  onRemove: () => void;
  bgScheme: "black" | "white";
}) {
  const [fileUrl, setFileUrl] = useState<string>();
  const s = schemes[bgScheme];
  const isImage = file.type.startsWith("image/");

  // Object URLs must be created/revoked per file to avoid leaking memory.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative h-20 w-20 shrink-0">
      <button
        type="button"
        className={`relative h-full w-full cursor-pointer overflow-hidden rounded-md border ${s.card}`}
        onClick={() =>
          fileUrl && window.open(fileUrl, "_blank", "noopener,noreferrer")
        }
      >
        {isImage && fileUrl ? (
          <Image
            src={fileUrl}
            alt={file.name}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col items-center justify-center gap-1 p-1 ${s.text.muted}`}
          >
            <FileIcon size={20} />
            <span className="w-full truncate text-center text-[10px]">
              {file.name}
            </span>
          </div>
        )}
      </button>
      {busy && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white/60">
          <Spinner size={16} label="Processing" />
        </div>
      )}
      <CloseButton
        onClick={onRemove}
        disabled={busy}
        className="absolute -top-2 -right-2 rounded-full bg-white shadow"
      />
    </div>
  );
}

/**
 * File / image upload field that registers with react-hook-form and renders
 * thumbnail previews of the current selection, each removable via the shared
 * {@link CloseButton}.
 *
 * Reads the colour scheme from {@link ColorSchemeCtx} (set by a parent {@link Form}).
 * Because native file inputs can't be set programmatically, the field is
 * controlled through `useController` instead of `register`: the value is a
 * single `File` (default) or `File[]` (when `multiple`), collapsing back to
 * `undefined` once every file is removed.
 *
 * @example
 * ```tsx
 * <FileInputField
 *   name="attachments"
 *   label="Attachments"
 *   accept="image/*,.pdf"
 *   multiple
 * />
 * ```
 */
export function FileInputField({
  name,
  label,
  accept,
  multiple = false,
  onFilesAdded,
  onFileRemoved,
}: FileInputFieldProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const bgScheme = useContext(ColorSchemeCtx);
  const { runTask } = useFormBusy();
  const s = schemes[bgScheme];

  const addFiles = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const picked = multiple ? Array.from(list) : [list[0]];
    const next = multiple ? [...files, ...picked] : picked;
    setFiles(next);
    setBusy(true);
    try {
      await runTask(() => onFilesAdded?.(picked));
    } finally {
      setBusy(false);
    }
  };

  const removeFile = async (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setBusy(true);
    try {
      await runTask(() => onFileRemoved?.(index));
    } finally {
      setBusy(false);
    }
  };

  return (
    <FieldChrome name={name} label={label} required={false} bgScheme={bgScheme}>
      <label
        htmlFor={name}
        aria-busy={busy}
        className={`flex cursor-pointer items-center justify-center rounded-md border border-dashed px-3 py-6 text-sm transition-colors hover:opacity-80 aria-invalid:border-red-500 ${s.input}${busy ? " pointer-events-none opacity-60" : ""}`}
      >
        {busy ? (
          <span className="flex items-center gap-2">
            <Spinner size={16} label="Processing" />
            Processing...
          </span>
        ) : (
          <>Click to upload {multiple ? "files" : "a file"}</>
        )}
        <input
          id={name}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
          className="sr-only"
        />
      </label>
      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {files.map((file, i) => (
            <FilePreview
              key={`${file.name}-${file.size}-${file.lastModified}`}
              file={file}
              busy={busy}
              bgScheme={bgScheme}
              onRemove={() => removeFile(i)}
            />
          ))}
        </div>
      )}
    </FieldChrome>
  );
}
