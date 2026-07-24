"use client";

import { File as FileIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  useController,
  useFormContext,
} from "react-hook-form";
import { schemes } from "@/lib/colours";
import { CloseButton } from "../close-button";
import { FormCtx } from "./context";
import { FieldChrome } from "./field-chrome";

/**
 * Props for the {@link FileInputField} component.
 *
 * @typeParam T - Shape of the form data.
 */
export interface FileInputFieldProps<T extends FieldValues> {
  /** Field path registered with react-hook-form. */
  name: FieldPath<T>;
  /** Visible label text. */
  label: string;
  /** `accept` attribute forwarded to the native file input (e.g. `"image/*"`). */
  accept?: string;
  /** Allow selecting/accumulating more than one file. Defaults to `false`. */
  multiple?: boolean;
  /**
   * Validation rules passed to `useController`.
   *
   * The field value is `undefined` when no files are selected (never an empty
   * array), so `rules={{ required: "..." }}` works the same as on any other
   * field.
   */
  rules?: RegisterOptions<T>;
}

/** Normalizes a controller value into a plain array for rendering. */
function toFileArray(value: unknown): File[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value as File];
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
  onRemove,
  bgScheme,
}: {
  file: File;
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
      <CloseButton
        onClick={onRemove}
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
 * Reads the colour scheme from {@link FormCtx} (set by a parent {@link Form}).
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
 *   rules={{ required: "Attach at least one file" }}
 * />
 * ```
 */
export function FileInputField<T extends FieldValues>({
  name,
  label,
  accept,
  multiple = false,
  rules,
}: FileInputFieldProps<T>) {
  const bgScheme = useContext(FormCtx);
  const { control } = useFormContext<T>();
  const s = schemes[bgScheme];
  const {
    field: { value, onChange },
  } = useController({ name, control, rules });

  const files = useMemo(() => toFileArray(value), [value]);

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const next = multiple ? [...files, ...Array.from(list)] : [list[0]];
    onChange(multiple ? next : next[0]);
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    onChange(multiple ? (next.length ? next : undefined) : undefined);
  };

  return (
    <FieldChrome
      name={name}
      label={label}
      required={!!rules?.required}
      bgScheme={bgScheme}
    >
      <label
        htmlFor={name}
        className={`flex cursor-pointer items-center justify-center rounded-md border border-dashed px-3 py-6 text-sm transition-colors hover:opacity-80 aria-invalid:border-red-500 ${s.input}`}
      >
        Click to upload {multiple ? "files" : "a file"}
        <input
          id={name}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            addFiles(e.target.files);
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
              bgScheme={bgScheme}
              onRemove={() => removeFile(i)}
            />
          ))}
        </div>
      )}
    </FieldChrome>
  );
}
