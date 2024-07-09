"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import FileUpload from "../file-upload";
import axios from 'axios'
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import qs from 'query-string'

const formSchema = z.object({
  fileUrl: z.string().url(),
});

const MessageFileModel = () => {
  const {isOpen , onClose, type, data} = useModal()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  
  const isLoading = form.formState.isSubmitting;
  const isModalOpen = isOpen && type === "messageFile";
  if (!isModalOpen) {
    return null;
  }
  
  const {apiUrl , query} = data
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const url = qs.stringifyUrl({
      url: apiUrl || "",
      query
    })
    try {
        await axios.post(url,{
          ...data,
          content:data.fileUrl
        })
        router.refresh()
        handleClose()
    } catch (error) {
        console.log(error)
    }
  };

  const handleClose = ()=>{
    onClose()
    form.reset()
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an Attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 ">
            Send a File as a Message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-center text-center flex-col gap-2" >
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        File Url
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="px-6 py-4 bg-gray-100">
              <Button type="submit" variant={"primary"} disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModel;
