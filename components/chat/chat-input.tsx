"use client";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  type: "channel" | "conversation";
  name: string;
}
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import EmojiPicker from "../emoji-picker";

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ apiUrl, query, type, name }: ChatInputProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" },
  });
  const router = useRouter();
  const isLoading = form.formState.isSubmitting;
  const { onOpen } = useModal();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      form.reset();
      await axios.post(url, data);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Form {...form}>
      <form action="" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500
                     dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 
                     transition p-1 flex items-center justify-center rounded-full"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    {...field}
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none 
                    border-0 focus-visible:ring-0 focus-visible:ring-offset-0
                     text-zinc-600 dark:text-zinc-200"
                    placeholder={`Messages ${
                      type === "conversation" ? name : "#" + name
                    }`}
                  />
                  <div className="absolute top-7 right-8 ">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
