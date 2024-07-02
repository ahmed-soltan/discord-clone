"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@/lib/uploadthing";
import { UploadDropzone } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
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
