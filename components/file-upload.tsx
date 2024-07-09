"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@/lib/uploadthing";
import { UploadDropzone } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { File, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: "serverImage" | "messageFile";
  value: string;
}

const FileUpload = ({ onChange, endpoint, value }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20  flex items-center justify-center">
        <Image src={value} alt="server image" fill className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white rounded-full p-1 absolute top-0 right-0 shadow-sm "
          type="button"
        >
          <X className="w-4 h-4 " />
        </button>
      </div>
    );
  }
  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center justify-center p-2 mt-2 rounded-md bg-background/10">
        <File className="w-10 h-10 fill-indigo-500 stroke-indigo-500" />
        <a
          href={value}
          target="_blank"
          rel={"noopener noreferrer"}
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white rounded-full p-1 absolute top-0 right-0 shadow-sm "
          type="button"
        >
          <X className="w-4 h-4 " />
        </button>
      </div>
    );
  }

  return (
    //@ts-ignore
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res: any) => {
        onChange(res?.[0]?.url);
        console.log(res?.[0]?.url);
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        console.log(error);
      }}
    />
  );
};

export default FileUpload;
